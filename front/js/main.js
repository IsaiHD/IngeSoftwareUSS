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

    //botones de carrusel main
    $(document).ready(function(){
        // Inicializar OwlCarousel
        $('#carouselContent').owlCarousel({
            items: 4, // Número de elementos visibles al mismo tiempo
            loop: true, // Hacer que el carrusel se repita en un bucle
            margin: 30,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000, // Cambia cada 5 segundos
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                }
            }
        });
    
        // Funcionalidad para los botones de navegación
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
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
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
    
        // document.addEventListener('DOMContentLoaded', function() {
        //     var isRegistered = true; // Cambia esto según el estado real del usuario
        
        //     var registerButton = document.getElementById('registrarbtn');
        //     var profileIcon = document.getElementById('profileIcon');
        
        //     if (isRegistered) {
        //         registerButton.style.display = 'none';
        //         profileIcon.style.display = 'block';
        //     } else {
        //         registerButton.style.display = 'block';
        //         profileIcon.style.display = 'none';
        //     }
        // });
        
})(jQuery);

