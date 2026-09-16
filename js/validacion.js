$(function () {
  var $form = $("#formContacto");
  if (!$form.length) return;

  var $nombre = $("#nombre");
  var $correo = $("#correo");
  var $mensaje = $("#mensaje");
  var $exito = $("#formExito");

  function mostrarError($campo, texto) {
    $campo.addClass("campo-invalido");
    $campo.next(".mensaje-error").text(texto);
  }

  function limpiarError($campo) {
    $campo.removeClass("campo-invalido");
    $campo.next(".mensaje-error").text("");
  }

  function correoValido(valor) {
    var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(valor);
  }

  $form.on("submit", function (e) {
    e.preventDefault();
    var valido = true;
    $exito.text("");

    var nombre = $nombre.val().trim();
    var correo = $correo.val().trim();
    var mensaje = $mensaje.val().trim();

    if (nombre.length < 3) {
      mostrarError($nombre, "Escribe tu nombre completo (mínimo 3 caracteres).");
      valido = false;
    } else {
      limpiarError($nombre);
    }

    if (!correoValido(correo)) {
      mostrarError($correo, "Ingresa un correo válido, ej: nombre@correo.com");
      valido = false;
    } else {
      limpiarError($correo);
    }

    if (mensaje.length < 10) {
      mostrarError($mensaje, "Tu mensaje debe tener al menos 10 caracteres.");
      valido = false;
    } else {
      limpiarError($mensaje);
    }

    if (valido) {
      $exito.text("¡Gracias, " + nombre + "! Tu mensaje fue validado correctamente.");
      $form[0].reset();
    }
  });

  // Quita el mensaje de error apenas el usuario empieza a corregir el campo
  $form.find("input, textarea").on("input", function () {
    limpiarError($(this));
  });
});
