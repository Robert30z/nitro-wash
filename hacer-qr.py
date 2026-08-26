# OJO: corre con 'python3' (3.14), NO con 'python' (3.11): qrcode solo esta
# instalado en el 3.14. Ya costo un rato averiguarlo.
import qrcode, os
from urllib.parse import quote

# Cada punto de contacto lleva un mensaje DIFERENTE: cuando llega el texto,
# el mensaje dice de donde viene el cliente. Atribucion sin adivinar.
#
# 26-ago-2026: se cambio de wa.me a SMS. Roberto usa su numero personal y no
# quiere que el cliente vea su foto de perfil de WhatsApp. El formato "?&body="
# es el que entienden iPhone y Android sin partirse.

TEL = "+17875479549"

PUNTOS = {
    "van":      "Hola NITRO WASH! Escanee el QR de tu van. Quiero informacion de los detalles",
    "volante":  "Hola NITRO WASH! Tengo su volante. Quiero cotizar un detalle",
    "tarjeta":  "Hola NITRO WASH! Me dieron su tarjeta. Quiero mas informacion",
    "sticker-local": "Hola NITRO WASH! Vi su negocio en Google. Quiero cotizar un detalle",
    "generico": "Hola NITRO WASH! Quiero informacion de los detalles",
}

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "qr")
os.makedirs(OUT, exist_ok=True)

for nombre, msg in PUNTOS.items():
    url = f"sms:{TEL}?&body={quote(msg)}"
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0D0F12", back_color="white")
    path = os.path.join(OUT, f"qr-{nombre}.png")
    img.save(path)
    print(f"{path}  <- {msg[:46]}...")

print("\nANTES DE MANDAR A IMPRENTA: escanea cada uno con TU telefono.")
print("Tiene que abrir la app de mensajes con el texto ya escrito.")
