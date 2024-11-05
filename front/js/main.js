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

    // Modal functionality
    const modal = $('#modal');
    const openModalLink = $('.package-item a');
    const closeButtons = $('#closeModal, #closeBtn');

    openModalLink.on('click', function (e) {
        e.preventDefault();
        modal.css({ display: 'block', opacity: 1 });
        $('body').addClass('overflow-hidden');
    });

    closeButtons.on('click', function (e) {
        e.preventDefault();
        modal.css({ display: 'none', opacity: 0 });
        $('body').removeClass('overflow-hidden');
    });

})(jQuery);


document.addEventListener("DOMContentLoaded", function() {
    const tipoField = document.getElementById("tipo");
    const formFields = document.getElementById("formFields");
    const submitButton = document.getElementById("submitButton");
    const errorMessage = document.getElementById("error-message");
    const fechaInicioField = document.getElementById("fechaInicioField");
    const fechaFinField = document.getElementById("fechaFinField");
    const horaInicioField = document.getElementById("horaInicioField");
    const horaFinField = document.getElementById("horaFinField");
    const tituloDatos = document.querySelector("h1.text-white.mb-4");
    const volverButton = document.querySelector('button[onclick="volverSeleccion()"]');
    const subirOtroButton = document.querySelector('button[onclick="subirOtroEvento()"]');

    // Oculta los botones y el submit al cargar la página
    submitButton.style.display = "none";
    volverButton.style.display = "none";
    subirOtroButton.style.display = "none";

    // Función para manejar el cambio de tipo y mostrar el formulario
    tipoField.addEventListener("change", function() {
        if (tipoField.value === "evento" || tipoField.value === "actividad") {
            formFields.style.display = "block";
            submitButton.style.display = "block";
            volverButton.style.display = "block";
            subirOtroButton.style.display = "block";
            submitButton.textContent = tipoField.value === "evento" ? "Subir Evento" : "Subir Actividad";
            tituloDatos.textContent = tipoField.value === "evento" ? "Datos del Evento" : "Datos de la Actividad";

            if (tipoField.value === "evento") {
                fechaInicioField.style.display = "block";
                fechaFinField.style.display = "block";
                horaInicioField.style.display = "block";
                horaFinField.style.display = "block";
            } else {
                fechaInicioField.style.display = "none";
                fechaFinField.style.display = "none";
                horaInicioField.style.display = "none";
                horaFinField.style.display = "none";
            }

            tipoField.parentElement.style.display = "none";
        }
    });

    // Validación antes de enviar el formulario
    submitButton.addEventListener("click", function(e) {
        e.preventDefault();
        let allFieldsFilled = true;
        const requiredFields = document.querySelectorAll("#formFields input, #formFields select, #formFields textarea");

        requiredFields.forEach(field => {
            if (field.value.trim() === "" && field.style.display !== "none") {
                allFieldsFilled = false;
            }
        });

        if (allFieldsFilled) {
            errorMessage.style.display = "none";
            alert("Actividad subida exitosamente.");
        } else {
            errorMessage.style.display = "block";
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const categoriaField = document.getElementById("categoria");
    const subcategoriaField = document.getElementById("subcategoria");

    const subcategorias = {
        comida: ["Restaurante de Sushi", "Restaurante de comida rápida", "Restaurante de comida coreana", "Carrito de comida", "Restaurante Mexicano"],
        entretenimiento: ["Cine", "Parque de diversiones", "Escape room", "Concierto", "Arcade", "Festival de música"],
        cultura: ["Teatro", "Museo", "Feria del Libro", "Arte", "Exposición de fotografía"]
    };

    categoriaField.addEventListener("change", function() {
        const categoriaSeleccionada = categoriaField.value;
        subcategoriaField.innerHTML = '<option selected>Selecciona subcategoría...</option>';

        if (subcategorias[categoriaSeleccionada]) {
            subcategorias[categoriaSeleccionada].forEach(subcategoria => {
                const option = document.createElement("option");
                option.value = subcategoria.toLowerCase().replace(/\s+/g, '-');
                option.textContent = subcategoria;
                subcategoriaField.appendChild(option);
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const archivoInput = document.getElementById("archivo");
    const dragDropArea = document.getElementById("dragDropArea");
    const fileErrorMessage = document.getElementById("fileErrorMessage");
    const previewContainer = document.createElement("div");
    previewContainer.id = "previewContainer";
    previewContainer.style.marginTop = "15px";
    dragDropArea.insertAdjacentElement("afterend", previewContainer);
    dragDropArea.style.height = "150px";
    dragDropArea.style.marginTop = "10px";
    dragDropArea.style.display = "flex";
    dragDropArea.style.alignItems = "center";
    dragDropArea.style.justifyContent = "center";

    archivoInput.addEventListener("change", function() {
        validarArchivo(archivoInput.files[0]);
    });

    dragDropArea.addEventListener("click", function() {
        archivoInput.click();
    });

    dragDropArea.addEventListener("dragover", function(e) {
        e.preventDefault();
        dragDropArea.classList.add("border-success");
    });

    dragDropArea.addEventListener("dragleave", function() {
        dragDropArea.classList.remove("border-success");
    });

    dragDropArea.addEventListener("drop", function(e) {
        e.preventDefault();
        dragdropArea.classList.remove("border-success");
        const archivo = e.dataTransfer.files[0];
        archivoInput.files = e.dataTransfer.files;
        validarArchivo(archivo);
    });

    // Función para validar el archivo
    function validarArchivo(archivo) {
        const tiposPermitidos = ["image/png", "image/jpeg"];
        if (archivo && tiposPermitidos.includes(archivo.type)) {
            fileErrorMessage.style.display = "none";
            mostrarPrevisualizacion(archivo);
        } else {
            fileErrorMessage.style.display = "block";
            archivoInput.value = "";
            previewContainer.innerHTML = "";
        }
    }

    // Función para mostrar la previsualización de la imagen
    function mostrarPrevisualizacion(archivo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = "";
            const imagen = document.createElement("img");
            imagen.src = e.target.result;
            imagen.alt = "Previsualización de la imagen";
            imagen.style.width = "100%";
            imagen.style.maxWidth = "200px";
            imagen.style.borderRadius = "5px";
            previewContainer.appendChild(imagen);
    
            dragDropArea.style.display = "none";
        };
        reader.readAsDataURL(archivo);
    }
});

document.getElementById("precio").addEventListener("input", function (e) {
    this.value = this.value.replace(/\D/g, '');
});

function volverSeleccion() {
    document.getElementById("tipo").parentElement.style.display = "block";
    document.getElementById("formFields").style.display = "none";
    document.getElementById("submitButton").style.display = "none";
    const volverButton = document.querySelector('button[onclick="volverSeleccion()"]');
    const subirOtroButton = document.querySelector('button[onclick="subirOtroEvento()"]');
    volverButton.style.display = "none";
    subirOtroButton.style.display = "none";
}

function subirOtroEvento() {
    document.getElementById("crearActividadForm").reset();
    volverSeleccion();
}

function validarArchivo(archivo) {
    const tiposPermitidos = ["image/png", "image/jpeg"];
    if (archivo && tiposPermitidos.includes(archivo.type)) {
        fileErrorMessage.style.display = "none";
        mostrarPrevisualizacion(archivo);
    } else if (archivo) {
        fileErrorMessage.style.display = "block";
        archivoInput.value = "";
        previewContainer.innerHTML = "";
    }
}

