document.addEventListener("DOMContentLoaded", function() {
    const tipoField = document.getElementById("tipo");
    const fechaInicioField = document.getElementById("fechaInicioField");
    const fechaFinField = document.getElementById("fechaFinField");
    const tituloDatos = document.querySelector("h1.text-white.mb-4");
    const volverButton = document.querySelector('button[onclick="volverSeleccion()"]');
    const subirOtroButton = document.querySelector('button[onclick="subirOtroEvento()"]');

    // Función para limpiar campos y la previsualización de imagen
    function limpiarCampos() {
        document.getElementById("crearActividadForm").reset();
        previewContainer.innerHTML = "";
        archivoInput.value = "";
        dragDropArea.style.display = "flex"; // Volver a mostrar el área de arrastre
    }

    // Asignar la función limpiarCampos a todos los botones, incluyendo el de "Subir"
    // document.querySelectorAll("button").forEach(button => {
    //     button.addEventListener("click", limpiarCampos);
    // }); 

    // Oculta los botones y el submit al cargar la página
    volverButton.style.display = "none";
    subirOtroButton.style.display = "none";

    // Función para manejar el cambio de tipo y mostrar el formulario
    tipoField.addEventListener("change", function() {
        if (tipoField.value === "actividad") {
            formFields.style.display = "block";
            submitButton.style.display = "block";
            volverButton.style.display = "block";
            subirOtroButton.style.display = "block";
            submitButton.textContent = "Subir Actividad";
            subirOtroButton.textContent = "Subir otra actividad"; // Actualiza el texto
            tituloDatos.textContent = "Datos de la Actividad";

            // Mostrar horarios
            fechaInicioField.style.display = "block";
            fechaFinField.style.display = "block";
            horaInicioField.style.display = "block";
            horaFinField.style.display = "block";

            tipoField.parentElement.style.display = "none";
        }
    });

    if (submitButton) {
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
    } else {
        console.log("No se encontró el botón de submit");
    }

    // Validación en tiempo real al rellenar los campos
    formFields.addEventListener("input", function() {
        // let allFieldsFilled = true;
        const requiredFields = document.querySelectorAll("#formFields input, #formFields select, #formFields textarea");

        requiredFields.forEach(field => {
            if (field.value.trim() === "" && field.style.display !== "none") {
                allFieldsFilled = false;
            }
        });

        // Mostrar/ocultar el mensaje de error durante la entrada de datos
        if (!allFieldsFilled) {
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
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
        if (archivoInput.files.length > 1) {
            alert("Solo puedes subir una imagen.");
            archivoInput.value = ""; // Limpiar la selección
            previewContainer.innerHTML = ""; // Limpiar previsualización
        } else {
            validarArchivo(archivoInput.files[0]);
        }
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
        dragDropArea.classList.remove("border-success");
        if (e.dataTransfer.files.length > 1) {
            alert("Solo puedes subir una imagen.");
            archivoInput.value = ""; // Limpiar la selección
            previewContainer.innerHTML = ""; // Limpiar previsualización
        } else {
            const archivo = e.dataTransfer.files[0];
            archivoInput.files = e.dataTransfer.files; // Asignar archivo al input
            validarArchivo(archivo);
        }

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

            // Ocultar el área de arrastre cuando se sube la imagen
            dragDropArea.style.display = "none";
        };
        reader.readAsDataURL(archivo);
    }
});

document.getElementById("precio").addEventListener("input", function (e) {
    this.value = this.value.replace(/\D/g, '');
});

function volverSeleccion() {
    const tipoField = document.getElementById("tipo");
    const formFields = document.getElementById("formFields");
    const submitButton = document.getElementById("submitButton");
    const volverButton = document.querySelector('button[onclick="volverSeleccion()"]');
    const subirOtroButton = document.querySelector('button[onclick="subirOtroEvento()"]');
    const tituloDatos = document.querySelector("h1.text-white.mb-4");
    const errorMessage = document.getElementById("error-message");

    // Mostrar el campo de selección de tipo
    tipoField.parentElement.style.display = "block";

    // Ocultar y limpiar los campos del formulario
    formFields.style.display = "none";
    submitButton.style.display = "none";
    volverButton.style.display = "none";
    subirOtroButton.style.display = "none";

    // Restablecer el valor del campo de tipo y el título
    tipoField.value = "";
    tituloDatos.textContent = "Datos";

    // Ocultar el mensaje de error si está visible
    errorMessage.style.display = "none";
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
