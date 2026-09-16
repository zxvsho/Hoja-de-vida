$(function () {
  // Selector de temas de color (estilo Omarchy)
  var TEMA_KEY = "temaPreferido";
  var $selectorTema = $("#temaSelect");
  var temaActual = localStorage.getItem(TEMA_KEY) || "violeta";
  $selectorTema.val(temaActual);

  $selectorTema.on("change", function () {
    var tema = $(this).val();
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(TEMA_KEY, tema);
  });

  // Aparición escalonada de las tarjetas al cargar la página
  $(".tarjeta").each(function (i) {
    var $tarjeta = $(this);
    $tarjeta.css({ opacity: 0, transform: "translateY(18px)" });
    setTimeout(function () {
      $tarjeta.css({
        transition: "opacity 0.5s ease, transform 0.5s ease",
        opacity: 1,
        transform: "translateY(0)"
      });
    }, i * 130);
  });

  // Pequeño efecto al pasar el mouse sobre las etiquetas de habilidades
  $(".etiqueta").hover(
    function () { $(this).addClass("etiqueta-hover"); },
    function () { $(this).removeClass("etiqueta-hover"); }
  );

  // Botón flotante "volver arriba"
  var $btnArriba = $("<button>", {
    id: "btnArriba",
    text: "↑",
    type: "button",
    "aria-label": "Volver arriba"
  }).appendTo("body");

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      $btnArriba.fadeIn(200);
    } else {
      $btnArriba.fadeOut(200);
    }
  });

  $btnArriba.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
});
