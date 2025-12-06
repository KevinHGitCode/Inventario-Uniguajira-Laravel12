document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main-content");
    const links = document.querySelectorAll("a[data-nav]");

    const initializeScripts = () => {
        // Aquí puedes agregar la lógica para inicializar eventos o scripts necesarios
        console.log("Scripts inicializados");
    };

    const loadContent = async (url) => {
        try {
            // Agrega una clase de carga
            main.classList.add("loading");

            // Realiza la solicitud AJAX
            const response = await fetch(url, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (!response.ok) throw new Error("Error al cargar la vista");
            const html = await response.text();

            // Reemplaza el contenido del main
            main.innerHTML = html;

            // Inicializa los scripts después de reemplazar el contenido
            initializeScripts();

            // Quita la clase de carga
            main.classList.remove("loading");
        } catch (error) {
            console.error(error);
            alert("No se pudo cargar la página");
        }
    };

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const url = link.getAttribute("href");

            // Carga el contenido al hacer clic en un enlace
            loadContent(url);

            // Actualiza la URL sin recargar
            window.history.pushState({ url }, "", url);
        });
    });

    // Soporte para botones "Atrás" y "Adelante"
    window.addEventListener("popstate", (e) => {
        if (e.state?.url) {
            // Carga el contenido al navegar con los botones
            loadContent(e.state.url);

            // Obtener la parte principal del path actual (por ejemplo, "goods" de "/goods/openmodal")
            const path = window.location.pathname.split('/')[1];

            // Quitar selección previa
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('selected'));

            // Marcar la opción actual
            const current = document.getElementById(path==="inventory" ? "inventories": path);
            current.classList.add('selected');
        }
    });

    // Inicializa los scripts al cargar la página
    initializeScripts();
});
