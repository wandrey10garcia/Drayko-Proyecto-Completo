const db = require('../config/config');
const Sticker = {};

const validTypes = ['text', 'url', 'contact', 'wifi'];
const validCategories = ['hogar', 'personal', 'negocio', 'evento'];

// RF-10: Consultar todos los stickers (admin ve todos, usuario solo los propios)
Sticker.findAll = (user, result) => {
  let sql = `SELECT s.id, s.user_id, s.name, s.content_type, s.content, s.category, s.nfc_uid, s.status,
                    s.created_at, s.updated_at, u.name AS owner_name, u.lastname AS owner_lastname
             FROM stickers s
             JOIN users u ON u.id = s.user_id`;
  const params = [];

  if (user.role !== 'admin') {
    sql += ' WHERE s.user_id = ?';
    params.push(user.id);
  }
  sql += ' ORDER BY s.created_at DESC';

  db.query(sql, params, (err, stickers) => {
    if (err) {
      console.log('Error al listar stickers: ', err);
      result(err, null);
    } else {
      console.log('Stickers encontrados: ', stickers.length);
      result(null, stickers);
    }
  });
};

// RF-11: Consultar sticker por ID
Sticker.findById = (id, result) => {
  const sql = `SELECT id, user_id, name, content_type, content, category, nfc_uid, status, created_at, updated_at FROM stickers WHERE id = ?`;
  db.query(sql, [id], (err, sticker) => {
    if (err) {
      console.log('Error al consultar sticker: ', err);
      result(err, null);
    } else {
      console.log('Sticker consultado: ', sticker[0]);
      result(null, sticker[0]);
    }
  });
};

// RF-09: Registrar sticker
Sticker.create = (sticker, result) => {
  const contentType = validTypes.includes(sticker.content_type) ? sticker.content_type : 'text';
  const category = validCategories.includes(sticker.category) ? sticker.category : 'personal';

  const sql = `INSERT INTO stickers(
                user_id,
                name,
                content_type,
                content,
                category,
                nfc_uid,
                status,
                created_at,
                updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?)`;
  db.query(sql,
    [
      sticker.user_id,
      sticker.name,
      contentType,
      sticker.content,
      category,
      sticker.nfc_uid || null,
      'active',
      new Date(),
      new Date()
    ], (err, res) => {
      if (err) {
        console.log('Error al crear el sticker: ', err);
        result(err, null);
      } else {
        console.log('Sticker creado: ', { id: res.insertId, ...sticker });
        result(null, { id: res.insertId, ...sticker });
      }
    }
  );
};

// RF-12: Actualizar sticker (incluye grabar el nfc_uid cuando se escribe fisicamente - RF-15)
Sticker.update = (sticker, result) => {
  let fields = [];
  let values = [];

  if (sticker.name) {
    fields.push('name = ?');
    values.push(sticker.name);
  }
  if (sticker.content_type) {
    fields.push('content_type = ?');
    values.push(sticker.content_type);
  }
  if (sticker.content) {
    fields.push('content = ?');
    values.push(sticker.content);
  }
  if (sticker.category) {
    fields.push('category = ?');
    values.push(sticker.category);
  }
  if (sticker.nfc_uid) {
    fields.push('nfc_uid = ?');
    values.push(sticker.nfc_uid);
  }
  if (sticker.status) {
    fields.push('status = ?');
    values.push(sticker.status);
  }

  fields.push('updated_at = ?');
  values.push(new Date());

  const sql = `UPDATE stickers SET ${fields.join(', ')} WHERE id = ?`;
  values.push(sticker.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log('Error al actualizar sticker: ', err);
      result(err, null);
    } else {
      console.log('Sticker actualizado: ', { id: sticker.id, ...sticker });
      result(null, { id: sticker.id, ...sticker });
    }
  });
};

// RF-13: Eliminar sticker
Sticker.delete = (id, result) => {
  const sql = `DELETE FROM stickers WHERE id = ?`;
  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log('Error al eliminar sticker: ', err);
      result(err, null);
    } else {
      console.log('Sticker eliminado con id: ', id);
      result(null, res);
    }
  });
};

// Usado por el Dashboard de administrador
Sticker.countAll = (result) => {
  const sql = `SELECT
                COUNT(*) AS total,
                SUM(content_type = 'text') AS total_text,
                SUM(content_type = 'url') AS total_url,
                SUM(content_type = 'contact') AS total_contact,
                SUM(content_type = 'wifi') AS total_wifi,
                SUM(nfc_uid IS NOT NULL) AS total_written
               FROM stickers`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log('Error al contar stickers: ', err);
      result(err, null);
    } else {
      result(null, rows[0]);
    }
  });
};

// Actividad reciente para el Dashboard (ultimos stickers creados, con el nombre del dueno)
Sticker.findRecent = (limit, result) => {
  const sql = `SELECT s.id, s.name, s.content_type, s.category, s.created_at, u.name AS owner_name, u.lastname AS owner_lastname
               FROM stickers s
               JOIN users u ON u.id = s.user_id
               ORDER BY s.created_at DESC
               LIMIT ?`;
  db.query(sql, [limit], (err, rows) => {
    if (err) {
      console.log('Error al listar actividad reciente: ', err);
      result(err, null);
    } else {
      result(null, rows);
    }
  });
};

module.exports = Sticker;
