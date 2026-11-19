$(document).ready(function () {
  var idioma = "es";

  $("#boton-menu").click(function () {
    
    $("#menu").toggleClass("mostrar");
    var abierto = $("#menu").hasClass("mostrar");
    $("#boton-menu").attr("aria-expanded", abierto);
    $("#boton-menu").attr("aria-label", abierto
      ? (idioma === "es" ? "Cerrar menú" : "Close menu")
      : (idioma === "es" ? "Abrir menú" : "Open menu"));
  });

  $("#menu a").click(function () {

    var destino = $(this).attr("href");
    $("#menu").removeClass("mostrar");
    $("#boton-menu").attr("aria-expanded", "false");
    if (destino && destino.charAt(0) === "#") {
      $(destino).attr("tabindex", "-1").trigger("focus");
    }
  });

  $("#idioma").click(function () {

    idioma = idioma === "es" ? "en" : "es";
    $("html").attr("lang", idioma);
    $("[data-es][data-en]").each(function () {
      $(this).text($(this).attr("data-" + idioma));
    });

    $("[data-es-alt][data-en-alt]").each(function () {
      $(this).attr("alt", $(this).attr("data-" + idioma + "-alt"));
    });

    $("[data-es-title][data-en-title]").each(function () {
      $(this).attr("title", $(this).attr("data-" + idioma + "-title"));
    });

    $("#idioma").text(idioma === "es" ? "EN" : "ES");
    $("#idioma").attr("aria-label", idioma === "es" ? "Cambiar a inglés" : "Switch to Spanish");
    $("#arriba").attr("aria-label", idioma === "es" ? "Volver arriba" : "Back to top");
    $("#boton-menu").attr("aria-label", $("#menu").hasClass("mostrar")
      ? (idioma === "es" ? "Cerrar menú" : "Close menu")
      : (idioma === "es" ? "Abrir menú" : "Open menu"));
    mostrarFoto();
    if (jugando && !terminado) mostrarPregunta();
    if (terminado) mostrarResultado();
  });

  var fotos = [
    {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
      es: "Persona trabajando con una computadora portátil.",
      en: "Person working at a laptop.",
      pieEs: "Usa tus dispositivos con atención.",
      pieEn: "Use your devices thoughtfully."
    },
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
      es: "Placa electrónica con circuitos digitales.",
      en: "Electronic board with digital circuits.",
      pieEs: "La tecnología conecta muchos dispositivos.",
      pieEn: "Technology connects many devices."
    },
    {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
      es: "Persona usando una computadora.",
      en: "Person using a computer.",
      pieEs: "Verifica los mensajes antes de responder.",
      pieEn: "Check messages before responding."
    }
  ];

  var fotoActual = 0;

  function mostrarFoto() {
    $("#foto").attr("src", fotos[fotoActual].src);
    $("#foto").attr("alt", idioma === "es" ? fotos[fotoActual].es : fotos[fotoActual].en);
    $("#pie-foto").text(idioma === "es" ? fotos[fotoActual].pieEs : fotos[fotoActual].pieEn);
    $("#numero-foto").text((fotoActual + 1) + " / " + fotos.length);
  }

  $("#anterior").click(function () {
    fotoActual = (fotoActual - 1 + fotos.length) % fotos.length;
    mostrarFoto();
  });

  $("#siguiente").click(function () {
    fotoActual = (fotoActual + 1) % fotos.length;
    mostrarFoto();
  });

  setInterval(function () {
    fotoActual = (fotoActual + 1) % fotos.length;
    mostrarFoto();
  }, 6000);

  var preguntas = [
    {
      es: "Un mensaje dice que tu cuenta se cerrará pronto y pide tu contraseña.",
      en: "A message says your account will close soon and asks for your password.",
      opcionesEs: ["Abrir el enlace", "Entrar desde la aplicación oficial"],
      opcionesEn: ["Open the link", "Sign in through the official app"],
      correcta: 1,
      explicacionEs: "Bien. Es mejor entrar por la aplicación o sitio oficial.",
      explicacionEn: "Good choice. Use the official app or website."
    },
    {
      es: "Te ofrecen un premio y piden los datos de tu tarjeta para reclamarlo.",
      en: "You are offered a prize and asked for your card details to claim it.",
      opcionesEs: ["Compartir los datos", "Verificar si existe en el sitio oficial"],
      opcionesEn: ["Share the details", "Check the official website first"],
      correcta: 1,
      explicacionEs: "Correcto. Las ofertas inesperadas pueden ser engaños.",
      explicacionEn: "Correct. Unexpected offers can be scams."
    },
    {
      es: "Un amigo te escribe para pedir el código que llegó a tu teléfono.",
      en: "A friend asks you to send them a code that arrived on your phone.",
      opcionesEs: ["Enviar el código", "No compartirlo y confirmar por otro medio"],
      opcionesEn: ["Send the code", "Do not share it; confirm another way"],
      correcta: 1,
      explicacionEs: "Muy bien. Los códigos de acceso son privados.",
      explicacionEn: "Good job. Sign-in codes are private."
    }
  ];

  var preguntaActual = 0;
  var puntaje = 0;
  var jugando = false;
  var terminado = false;
  var contestada = false;
  var seleccionada = -1;

  function empezarJuego() {
    preguntaActual = 0;
    puntaje = 0;
    jugando = true;
    terminado = false;
    contestada = false;
    seleccionada = -1;
    mostrarPregunta();
  }

  function mostrarPregunta() {
    var pregunta = preguntas[preguntaActual];
    var opciones = idioma === "es" ? pregunta.opcionesEs : pregunta.opcionesEn;
    var mensaje = idioma === "es" ? pregunta.es : pregunta.en;
    var html = "<p><strong>" + (preguntaActual + 1) + " / " + preguntas.length + "</strong></p>";
    html += "<p>" + mensaje + "</p>";
    html += '<button class="opcion" data-opcion="0">' + opciones[0] + "</button>";
    html += '<button class="opcion" data-opcion="1">' + opciones[1] + "</button>";
    html += '<div id="respuesta" aria-live="polite"></div>';
    $("#contenido-juego").html(html);
    if (contestada) mostrarRespuesta();
  }

  function responder(opcion) {
    if (contestada) return;
    contestada = true;
    seleccionada = opcion;
    if (opcion === preguntas[preguntaActual].correcta) puntaje++;
    mostrarRespuesta();
  }

  function mostrarRespuesta() {
    var pregunta = preguntas[preguntaActual];
    var acierto = seleccionada === pregunta.correcta;
    var texto = idioma === "es" ? pregunta.explicacionEs : pregunta.explicacionEn;
    var resultado = idioma === "es"
      ? (acierto ? "¡Correcto! " : "No es la opción más segura. ")
      : (acierto ? "Correct! " : "That is not the safest choice. ");
    $(".opcion").prop("disabled", true);
    $("#respuesta").html("<p><strong>" + resultado + "</strong>" + texto + "</p><button id='continuar'>" +
      (idioma === "es" ? "Continuar" : "Continue") + "</button>");
  }

  function mostrarResultado() {
    var mensaje = idioma === "es" ? "Puntaje: " : "Score: ";
    $("#contenido-juego").html("<h3>" + (idioma === "es" ? "Juego terminado" : "Game complete") +
      "</h3><p>" + mensaje + puntaje + " / " + preguntas.length +
      "</p><button id='empezar'>" + (idioma === "es" ? "Jugar otra vez" : "Play again") + "</button>");
  }

  $("#contenido-juego").on("click", "#empezar", empezarJuego);
  $("#contenido-juego").on("click", ".opcion", function () {
    responder(Number($(this).attr("data-opcion")));
  });

  $("#contenido-juego").on("click", "#continuar", function () {
    preguntaActual++;
    if (preguntaActual === preguntas.length) {
      jugando = false;
      terminado = true;
      mostrarResultado();
    } else {
      contestada = false;
      seleccionada = -1;
      mostrarPregunta();
    }
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) $("#arriba").fadeIn();
    else $("#arriba").fadeOut();
  });

  $("#arriba").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 400);
  });

});
