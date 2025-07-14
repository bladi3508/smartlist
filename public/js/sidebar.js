(function(){
    document.addEventListener('DOMContentLoaded', function() {
        const sidebar = document.getElementById('sidebar');
        const toggleSidebar = document.getElementById('toggleSidebar');
        const closeSidebar = document.getElementById('closeSidebar');

        // Mostrar sidebar en móviles
        if(toggleSidebar) {
            toggleSidebar.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
        }

        // Ocultar sidebar en móviles
        if(closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                sidebar.classList.remove('show');
            });
        }

        // Ocultar sidebar al hacer clic fuera en móviles
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 992 &&
                !sidebar.contains(e.target) &&
                e.target !== toggleSidebar &&
                !toggleSidebar.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    });



})();

