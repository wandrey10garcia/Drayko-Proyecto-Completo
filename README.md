# Drayko - Aplicacion movil de stickers NFC

Proyecto de Computacion Movil - Corporacion Universitaria Minuto de Dios (UNIMINUTO)
Autor: Wilson Andrey Piragua Garcia | Docente: Edwin Albeiro Ramos Villamil

Arquitectura: Backend en Node.js + Express + MySQL (JWT), Frontend movil en React
Native + Expo con Arquitectura Limpia (domain / data / presentation).

## 0. Si ya tenias la base de datos importada antes

Se agrego la columna `status` a la tabla `users` (para poder bloquear/desbloquear
cuentas). Si ya habias importado `db_drayko.sql` previamente (por ejemplo, ya
tienes tu usuario `wilson` creado) **no lo vuelvas a importar** porque
borraria tus datos. En vez de eso, entra a phpMyAdmin -> pestaña SQL -> pega y
ejecuta:

```sql
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active' AFTER role;
```

Si vas a instalar el proyecto desde cero, ignora este paso: el `.sql` ya
incluye la columna.

## 1. Base de datos

1. Abre XAMPP/MySQL y crea la base importando `database/db_drayko.sql`
   (con phpMyAdmin: Importar -> seleccionar el archivo -> Continuar).
2. Esto crea las tablas `users` y `stickers`, con 2 usuarios y 3 stickers de ejemplo:
   - Admin:   admin@drayko.app / Admin1234
   - Usuario: alex@drayko.app  / Admin1234

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `.env` y coloca la IPv4 de tu computador en `HOST` (la que te da `ipconfig`
en Windows o `ifconfig` en Mac/Linux), y la contrasena de tu MySQL local en
`DB_PASSWORD` si aplica.

```bash
npm run dev
```

El servidor queda en `http://TU_IP:3000`. La documentacion Swagger de la API
queda disponible en `http://TU_IP:3000/api-docs`.

## 3. Frontend (app movil)

```bash
cd frontend
npm install
```

Abre `src/data/sources/remote/api/ApiDrayko.tsx` y reemplaza la IP de
`BASE_URL` por la misma IPv4 que usaste en el backend (debe ser la misma red
Wi-Fi que tu celular).

```bash
npm run start:local
```

Escanea el QR con la app Expo Go en tu celular (Android recomendado, ya que
NFC en iOS tiene restricciones). Para leer/escribir stickers se necesita un
dispositivo fisico con NFC; no funciona en el emulador.

## 4. Mapa de funcionalidades -> codigo

| RF | Funcionalidad | Backend | Frontend |
|----|----------------|---------|----------|
| RF-01 | Iniciar sesion | `userController.login` | `views/login` |
| RF-02 | Cerrar sesion | (borra el token en el cliente) | `views/profile/info` |
| RF-03 | Autorregistro | `userController.register` | `views/register` |
| RF-04 | Registrar usuarios | `userController.register` | `views/admin/users` |
| RF-05 | Consultar todos los usuarios | `userController.getAllUsers` | `views/admin/users` |
| RF-06 | Consultar usuario por ID | `userController.getUserById` | `useCases/user/GetUserById` |
| RF-07 | Actualizar usuario | `userController.getUserUpdate` | `views/profile/info` |
| RF-08 | Eliminar usuario | `userController.getUserDelete` | `views/admin/users` |
| RF-09 | Registrar sticker | `stickerController.createSticker` | `views/stickerForm` |
| RF-10 | Consultar todos los stickers | `stickerController.getAllStickers` | `views/home` |
| RF-11 | Consultar sticker por ID | `stickerController.getStickerById` | `views/stickerDetail` |
| RF-12 | Actualizar sticker | `stickerController.updateSticker` | `views/stickerForm` |
| RF-13 | Eliminar sticker | `stickerController.deleteSticker` | `views/stickerDetail` |
| RF-14 | Leer sticker NFC | `stickerController.readStickerByNfcUid` | `views/nfcRead` |
| RF-15 | Escribir sticker NFC | `stickerController.updateSticker` (guarda `nfc_uid`) | `views/nfcWrite` |

## 5. Funciones de administrador (actualizacion)

- **Dashboard** (`Perfil -> Dashboard`, solo Admin): total de usuarios, total de
  stickers, stickers ya grabados en NFC, usuarios bloqueados, desglose por tipo
  de contenido y actividad reciente (ultimos 5 stickers creados, con su dueno).
- **Editar rol y bloquear usuarios**: en el Panel de administrador, toca
  cualquier usuario de la lista (no solo el boton de Eliminar) para abrir un
  modal donde puedes cambiar su rol (Usuario/Administrador) o bloquear su
  cuenta. Un usuario bloqueado no puede iniciar sesion hasta que lo
  desbloquees. Un admin no puede quitarse su propio rol ni eliminarse a si
  mismo desde el panel (medida de seguridad).
- **Asignar/regalar stickers**: cuando un Admin crea un sticker nuevo
  (no al editar uno existente), aparece un selector horizontal para elegir a
  que usuario se le asigna. Si no selecciona a nadie mas, queda a nombre del
  propio admin.
- **Todos los stickers visibles para el Admin**: la pantalla Home le muestra a
  un Admin "Todos los stickers" (de todos los usuarios, con el nombre del
  dueno en cada tarjeta) en vez de solo los suyos.
- **Navegacion**: todas las pantallas secundarias (detalle y formulario de
  sticker, leer/escribir NFC, perfil, panel admin, dashboard) tienen ahora una
  flecha de regreso visible en la parte superior.

## 6. Pendiente / siguientes pasos sugeridos

- Probar en un dispositivo Android fisico con NFC activado.
- Agregar validaciones de formulario mas estrictas (regex de email, longitud de contrasena).
- Subir el backend a un servicio como Render/Railway para no depender de la IP local.
- Agregar foto de perfil real (subida de imagen) en vez de solo la inicial del nombre.
- Agregar graficas (barras/torta) al Dashboard en vez de solo numeros.
