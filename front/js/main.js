(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function() {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function() {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Carousel functionality
    $(document).ready(function(){
        $('#carouselContent').owlCarousel({
            items: 4,
            loop: true,
            margin: 30,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 }
            }
        });

        $('#nextBtn').click(function() {
            $('#carouselContent').trigger('next.owl.carousel');
        });

        $('#prevBtn').click(function() {
            $('#carouselContent').trigger('prev.owl.carousel');
        });
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    function confirmarYEliminar() {
        const input = document.getElementById('eliminaractividad');
        if (!input.value) {
            alert('Por favor, sube una imagen antes de eliminar.');
            return false;
        }
        return confirm('¿Estás seguro de que quieres eliminar esto?');
    }

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });

        // Seleccionamos los elementos necesarios
        const modal = $('#modal'); // El modal
        const openModalLink = $('.package-item a'); // El enlace en el contenedor
        const closeButtons = $('#closeModal, #closeBtn'); // Botones de cierre
    
        // Abrir el modal
        openModalLink.on('click', function (e) {
            e.preventDefault(); // Prevenir navegación al hash
            modal.css({ display: 'block', opacity: 1 }); // Mostrar el modal
            $('body').addClass('overflow-hidden'); // Desactivar el scroll del body
        });
    
        // Cerrar el modal
        closeButtons.on('click', function (e) {
            e.preventDefault(); // Prevenir navegación al hash
            modal.css({ display: 'none', opacity: 0 }); // Ocultar el modal
            $('body').removeClass('overflow-hidden'); // Reactivar el scroll del body
        });

=======
        document.addEventListener('DOMContentLoaded', function() {
            // Función para obtener el valor de una clave de localStorage
            function getLocalStorageItem(key) {
                return localStorage.getItem(key);
            }
        
            // Obtener el valor de la clave 'auth_token' de localStorage
            var authToken = getLocalStorageItem('authToken');
            if (authToken) {
                // Si hay un token, el usuario está logueado
                console.log('Usuario logueado');
            }else{
                console.log('Usuario no logueado');
            }
        
            // Obtener los elementos del DOM
            var registerButton = document.getElementById('registrarbtn');
            var profileIcon = document.getElementById('profileIcon');

        
            // Si hay un token en localStorage, el usuario está logueado
            if (authToken) {
                // Mostrar el icono de perfil y ocultar el botón de registro
                registerButton.style.display = 'none';
                profileIcon.style.display = 'block';
            } else {
                // Mostrar el botón de registro y ocultar el icono de perfil
                registerButton.style.display = 'block';
                profileIcon.style.display = 'none';
            }
        });
})(jQuery);


