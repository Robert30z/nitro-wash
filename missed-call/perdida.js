// NITRO WASH - text-back de llamadas perdidas (Twilio Function)
//
// ============================================================
// ESTADO AL 26-AGO-2026: BLOQUEADO, Y NO POR EL CODIGO.
//
// Esto necesita un NUMERO DE TWILIO. El numero del negocio quedo siendo el
// personal de Roberto, (787) 547-9549, que es una linea de su compania de
// telefono. Twilio no puede ver las llamadas de una linea que no es suya, asi
// que este archivo NO se puede montar todavia.
//
// Para encenderlo hacen falta dos cosas, en este orden:
//   1. Un numero de Twilio aparte (~$1.15/mes) como linea del negocio, y ese
//      numero, no el personal, es el que va en la pagina y en los QR.
//   2. Registro A2P 10DLC en Twilio (marca + campana). SIN ESO Twilio bloquea
//      los SMS a numeros de EEUU. Tarda dias, no minutos.
//
// El codigo de abajo ya esta corregido y listo para cuando eso pase.
// ============================================================
//
// SETUP (cuando ya exista el numero de Twilio):
//   1. Functions > Services > crear servicio "nitro-textback"
//   2. Add > Function > nombrarla "perdida" y pegar ESTE archivo
//   3. Deploy All
//   4. Phone Numbers > (el numero del negocio) > Voice Configuration:
//      - "Call status changes" -> Function -> "perdida" (ESTA funcion)
//      SOLO ESO. No hay que cablear tambien "A call comes in" a /perdida:
//      antes estaban los dos apuntando aqui y se pisaban.
//
// NOTA TCPA: este SMS es RESPUESTA a una llamada ENTRANTE del cliente.
// No es mensaje saliente en frio, asi que esta dentro de las reglas.

// Todos los finales que significan "el cliente llamo y no hablo con nadie".
// Antes solo se miraba "no-answer", y con eso:
//   - si dejaba mensaje de voz el estado era "completed" y NO salia nada,
//     que era justo el caso para el que se construyo esto;
//   - "busy", "failed" y "canceled" tampoco disparaban.
var PERDIDAS = ["no-answer", "busy", "failed", "canceled"];

// Si la llamada duro lo suficiente, alguien hablo: no es perdida.
var SEGUNDOS_MINIMOS_PARA_CONTAR_COMO_ATENDIDA = 20;

// Ventana anti-duplicado. Twilio reintenta los webhooks, y un reintento
// mandaba OTRO SMS. Un duplicado a un cliente cuesta el cliente.
var MINUTOS_ANTI_DUPLICADO = 30;

exports.handler = function (context, event, callback) {
  var estado = event.CallStatus;
  var duracion = parseInt(event.CallDuration || "0", 10);

  if (PERDIDAS.indexOf(estado) === -1) {
    // "completed" con voicemail cuenta como perdida; "completed" con
    // conversacion de verdad, no. La duracion es lo que los separa.
    if (!(estado === "completed" && duracion > 0 && duracion < SEGUNDOS_MINIMOS_PARA_CONTAR_COMO_ATENDIDA)) {
      return callback(null, "estado " + estado + " (" + duracion + "s): no se manda nada");
    }
  }

  var para = event.From;
  var desde = event.To;

  // Numero restringido o privado: no hay a donde escribir.
  if (!para || para.indexOf("+") !== 0) {
    return callback(null, "llamada sin numero visible (" + para + "): no se manda nada");
  }

  var client = context.getTwilioClient();
  var desdeCuando = new Date(Date.now() - MINUTOS_ANTI_DUPLICADO * 60 * 1000);

  // EL PORTON: se pregunta a Twilio si ya se le escribio a este numero hace
  // poco. Se pregunta ANTES de mandar, no despues.
  client.messages
    .list({ to: para, dateSentAfter: desdeCuando, limit: 1 })
    .then(function (yaMandados) {
      if (yaMandados.length > 0) {
        return callback(null, "ya se le escribio a " + para + " hace menos de " + MINUTOS_ANTI_DUPLICADO + " min: no se repite");
      }

      var mensaje =
        "Saludos!! Le llamamos de NITRO WASH. Perdon que no pudimos contestar, " +
        "estamos en medio de un trabajo 🏁\n\n" +
        "Mobile detailing a domicilio: lavado, interior, sellado y ceramico, " +
        "donde este su carro.\n\n" +
        "Mandeme por aqui el modelo del carro y su pueblo y le cotizo sin compromiso. " +
        "Quedo al pendiente.";

      return client.messages
        .create({ to: para, from: desde, body: mensaje })
        .then(function () {
          callback(null, "text-back enviado a " + para + " (estado " + estado + ")");
        });
    })
    .catch(function (err) {
      callback(err);
    });
};
