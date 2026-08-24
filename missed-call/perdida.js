// NITRO WASH - text-back de llamadas perdidas
// Se monta como TWILIO FUNCTION en la cuenta de Twilio.
// Cuando una llamada entra y nadie contesta, el cliente recibe un SMS en segundos.
//
// SETUP (15 minutos, en la consola de Twilio):
//   1. Functions > Services > crear servicio "nitro-textback"
//   2. Add > Function > nombrarla "perdida" y pegar ESTE archivo
//   3. Deploy All
//   4. Phone Numbers > (el numero del negocio) > Voice Configuration:
//      - "A call comes in" -> Function -> el servicio/funcion "voz" (ver abajo)
//      - "Call status changes" -> Function -> "perdida" (ESTA funcion)
//   5. La funcion "voz" es minima: solo TwiML que deja sonar y toma el mensaje:
//      exports.handler = function(context, event, callback) {
//        const twiml = new Twilio.twiml.VoiceResponse();
//        twiml.say({ language: 'es-MX', voice: 'Polly.Mia' },
//          'Gracias por llamar a Nitro Wash. Deja tu mensaje y te devolvemos la llamada.');
//        twiml.record({ maxLength: 30, action: '/perdida' });
//        callback(null, twiml);
//      };
//
// NOTA TCPA: este SMS es RESPUESTA a una llamada ENTRANTE del cliente.
// No es mensaje saliente en frio: esta dentro de las reglas del proyecto.

exports.handler = function (context, event, callback) {
  // Solo reacciona cuando la llamada quedo sin contestar
  if (event.CallStatus !== "no-answer") {
    return callback(null, "no fue perdida, no se manda nada");
  }

  const client = context.getTwilioClient();

  const mensaje =
    "Saludos!! Perdiste nuestra atencion por unos minutos: estamos puliendo un carro 🏁\n\n" +
    "Soy NITRO WASH, mobile detailing a domicilio en el area metro.\n\n" +
    "Mandame un mensaje aqui con el modelo del carro y tu pueblo y te cotizo sin compromiso.";

  client.messages
    .create({ to: event.From, from: event.To, body: mensaje })
    .then(function () {
      callback(null, "text-back enviado a " + event.From);
    })
    .catch(function (err) {
      callback(err);
    });
};
