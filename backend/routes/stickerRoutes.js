const express = require('express');
const router = express.Router();
const stickerController = require('../controllers/stickerController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Todas las rutas de stickers requieren usuario autenticado (admin o user)
router.post('/create', verifyToken, stickerController.createSticker);        // RF-09
router.get('/', verifyToken, stickerController.getAllStickers);              // RF-10
router.get('/:id', verifyToken, stickerController.getStickerById);           // RF-11
router.put('/:id', verifyToken, stickerController.updateSticker);            // RF-12 (y RF-15 al grabar nfc_uid)
router.delete('/delete/:id', verifyToken, stickerController.deleteSticker);  // RF-13
router.get('/nfc/:uid', verifyToken, stickerController.readStickerByNfcUid); // RF-14 Leer sticker NFC

module.exports = router;
