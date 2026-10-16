const Sticker = require('../models/sticker');

module.exports = {
  // RF-09: Registrar sticker
  createSticker(req, res) {
    const sticker = req.body;

    // Un usuario normal siempre crea stickers para si mismo. Un Admin puede
    // opcionalmente asignarlo/regalarlo a otro usuario enviando 'user_id'.
    if (req.user.role !== 'admin' || !sticker.user_id) {
      sticker.user_id = req.user.id;
    }

    Sticker.create(sticker, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al crear el sticker',
          error: err
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Sticker registrado correctamente',
        data: data
      });
    });
  },

  // RF-10: Consultar todos los stickers (admin ve todos, usuario solo los propios)
  getAllStickers(req, res) {
    Sticker.findAll(req.user, (err, stickers) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al listar stickers',
          error: err
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Lista de stickers',
        data: stickers
      });
    });
  },

  // RF-11: Consultar sticker por ID
  getStickerById(req, res) {
    const id = req.params.id;
    Sticker.findById(id, (err, sticker) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al consultar el sticker',
          error: err
        });
      }
      if (!sticker) {
        return res.status(404).json({
          success: false,
          message: 'Sticker no encontrado'
        });
      }
      // Un usuario normal solo puede ver sus propios stickers
      if (req.user.role !== 'admin' && sticker.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver este sticker'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Sticker encontrado',
        data: sticker
      });
    });
  },

  // RF-12: Actualizar sticker (tambien usado por RF-15, escribir NFC, para guardar el nfc_uid)
  updateSticker(req, res) {
    const sticker = req.body;
    sticker.id = req.params.id;

    Sticker.findById(sticker.id, (err, existing) => {
      if (err || !existing) {
        return res.status(404).json({
          success: false,
          message: 'Sticker no encontrado'
        });
      }
      if (req.user.role !== 'admin' && existing.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para editar este sticker'
        });
      }

      Sticker.update(sticker, (err2, data) => {
        if (err2) {
          return res.status(501).json({
            success: false,
            message: 'Error al actualizar el sticker',
            error: err2
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Sticker actualizado',
          data: data
        });
      });
    });
  },

  // RF-13: Eliminar sticker
  deleteSticker(req, res) {
    const id = req.params.id;

    Sticker.findById(id, (err, existing) => {
      if (err || !existing) {
        return res.status(404).json({
          success: false,
          message: 'Sticker no encontrado'
        });
      }
      if (req.user.role !== 'admin' && existing.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este sticker'
        });
      }

      Sticker.delete(id, (err2, data) => {
        if (err2) {
          return res.status(501).json({
            success: false,
            message: 'Error al eliminar el sticker',
            error: err2
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Sticker eliminado',
          data: data
        });
      });
    });
  },

  // RF-14: Leer sticker NFC -> busca el sticker por el uid fisico leido por el telefono
  readStickerByNfcUid(req, res) {
    const nfcUid = req.params.uid;
    Sticker.findAll({ role: 'admin' }, (err, stickers) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al leer el sticker',
          error: err
        });
      }
      const found = stickers.find((s) => s.nfc_uid === nfcUid);
      if (!found) {
        return res.status(404).json({
          success: false,
          message: 'Este tag NFC no esta registrado en Drayko'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Sticker encontrado',
        data: found
      });
    });
  }
};
