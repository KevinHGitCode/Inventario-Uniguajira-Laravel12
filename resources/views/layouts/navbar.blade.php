<header>
    <div class="left">
        <div class="menu-container">
            <div class="menu" id="menu">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="brand">
            <img src="{{ asset('assets/images/logo-uniguajira-blanco.webp') }}" alt="logo" class="logo">
        </div>
    </div>

    <div class="right">
        <img
            src="{{ asset(Auth::user()->profile_photo_path ?? 'assets/uploads/img/users/defaultProfile.jpg') }}"
            alt="img-user"
            class="user"
            onclick="toggleUserMenu()"
        />
    </div>
</header>

<div class="user-menu" style="min-width: 200px;">
    <div id="userMenu" class="user-menu-content hidden">
        <button class="user-menu-item"
            onclick="btnEditarUser(this)"
            data-id="{{ auth()->user()->id }}"
            data-nombre="{{ auth()->user()->name }}"
            data-nombre-usuario="{{ auth()->user()->username }}"
            data-email="{{ auth()->user()->email }}"
            data-role="{{ auth()->user()->role }}"
        >
            <img class="user-menu-icon" src="{{ asset('assets/icons/editarPerfil.svg') }}" alt="edit">
            <span>Editar Usuario</span>
        </button>

        <form action="{{ route('logout') }}" method="POST" onclick="logout()">
            @csrf
            <button type="submit" class="user-menu-item">
                <img class="user-menu-icon" src="{{ asset('assets/icons/cerrarSesion.svg') }}" alt="logout">
                <span>Cerrar Sesión</span>
            </button>
        </form>
    </div>
</div>
