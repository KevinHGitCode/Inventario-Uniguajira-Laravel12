<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StabilizeAuthCookies
{
    /**
     * Prevent cached auth forms and remove stale auth cookies that can break CSRF validation.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        if (! $this->isAuthRequest($request)) {
            return $response;
        }

        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', 'Fri, 01 Jan 1990 00:00:00 GMT');
        $this->appendVaryCookieHeader($response);
        $this->clearStaleCookies($request, $response);

        return $response;
    }

    private function isAuthRequest(Request $request): bool
    {
        return $request->is(
            'login',
            'two-factor-challenge',
            'forgot-password',
            'reset-password',
            'reset-password/*',
            'confirm-password',
        );
    }

    private function appendVaryCookieHeader(Response $response): void
    {
        $vary = collect(explode(',', (string) $response->headers->get('Vary')))
            ->map(fn (string $header) => trim($header))
            ->filter()
            ->push('Cookie')
            ->unique(fn (string $header) => strtolower($header))
            ->implode(', ');

        $response->headers->set('Vary', $vary);
    }

    private function clearStaleCookies(Request $request, Response $response): void
    {
        $cookieNames = array_unique([
            (string) config('session.cookie'),
            'XSRF-TOKEN',
        ]);

        $secure = (bool) (config('session.secure') ?? $request->isSecure());
        $sameSite = config('session.same_site');

        foreach ($cookieNames as $cookieName) {
            if ($cookieName === '') {
                continue;
            }

            foreach ($this->staleCookieTargets($request) as [$path, $domain]) {
                $response->headers->clearCookie(
                    $cookieName,
                    $path,
                    $domain,
                    $secure,
                    $cookieName !== 'XSRF-TOKEN',
                    $sameSite,
                );
            }
        }
    }

    /**
     * @return array<int, array{0: string, 1: string|null}>
     */
    private function staleCookieTargets(Request $request): array
    {
        $targets = [];

        foreach ($this->legacyDomains($request) as $domain) {
            $targets[] = ['/', $domain];
        }

        foreach ($this->authCookiePaths($request) as $path) {
            $targets[] = [$path, null];

            foreach ($this->legacyDomains($request) as $domain) {
                $targets[] = [$path, $domain];
            }
        }

        return collect($targets)
            ->unique(fn (array $target) => $target[0].'|'.($target[1] ?? ''))
            ->values()
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function authCookiePaths(Request $request): array
    {
        $currentPath = '/'.trim($request->path(), '/');

        return collect(['/login', '/two-factor-challenge', $currentPath])
            ->map(fn (string $path) => $path === '/' ? '/' : rtrim($path, '/'))
            ->filter(fn (string $path) => $path !== '/')
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function legacyDomains(Request $request): array
    {
        $configuredDomains = collect(config('session.legacy_domains', []))
            ->filter(fn (mixed $domain) => is_string($domain) && trim($domain) !== '')
            ->flatMap(fn (string $domain) => $this->domainVariants($domain));

        $host = $request->getHost();
        $derivedDomains = collect();

        if (! filter_var($host, FILTER_VALIDATE_IP) && substr_count($host, '.') >= 2) {
            $parentDomain = preg_replace('/^[^.]+\./', '', $host);
            $derivedDomains = collect($this->domainVariants((string) $parentDomain));
        }

        $currentDomain = $this->normalizeDomain(config('session.domain'));

        return $configuredDomains
            ->merge($derivedDomains)
            ->map(fn (string $domain) => trim($domain))
            ->filter()
            ->reject(fn (string $domain) => $this->normalizeDomain($domain) === $currentDomain)
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function domainVariants(string $domain): array
    {
        $domain = $this->normalizeDomain($domain);

        if ($domain === '') {
            return [];
        }

        return [$domain, '.'.$domain];
    }

    private function normalizeDomain(mixed $domain): string
    {
        if (! is_string($domain)) {
            return '';
        }

        return ltrim(trim($domain), '.');
    }
}
