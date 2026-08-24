import qrcode, os
from urllib.parse import quote

# Cada punto de contacto lleva un mensaje DIFERENTE: cuando llega el WhatsApp,
# el mensaje dice de donde viene el cliente. Atribucion sin adivinar.
# El numero es placeholder 1787XXXXXXX: cuando llegue el real, correr de nuevo.

PUNTOS = {
    "van":      "Hola NITRO WASH! Escaneé el QR de tu van. Quiero información de los detalles",
    "volante":  "Hola NITRO WASH! Tengo su volante. Quiero cotizar un detalle",
    "tarjeta":  "Hola NITRO WASH! Me dieron su tarjeta. Quiero más información",
    "sticker-local": "Hola NITRO WASH! Vi su negocio en Google. Quiero cotizar un detalle",
    "generico": "Hola NITRO WASH! Quiero información de los detalles",
}

OUT = os.path.join(os.environ["USERPROFILE"], "Desktop", "HQ", "Nitro-Wash", "qr")
os.makedirs(OUT, exist_ok=True)

for nombre, msg in PUNTOS.items():
    url = f"https://wa.me/1787XXXXXXX?text={quote(msg)}"
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0D0F12", back_color="white")
    path = os.path.join(OUT, f"qr-{nombre}.png")
    img.save(path)
    print(f"{path}  <- mensaje: {msg[:50]}...")

print("\nRECUERDA: cuando llegue el numero real, cambiar 1787XXXXXXX y correr de nuevo.")
