const db = require('../config/config');
const bcrypt = require('bcryptjs');
const User = {};

// RF-05: Consultar todos los usuarios
User.findAll = (result) => {
  const sql = `SELECT id, email, name, lastname, phone, image, role, status, created_at, updated_at FROM users ORDER BY created_at DESC`;
  db.query(sql, (err, users) => {
    if (err) {
      console.log('Error al listar usuarios: ', err);
      result(err, null);
    } else {
      console.log('Usuarios encontrados: ', users.length);
      result(null, users);
    }
  });
};

// RF-06: Consultar usuario por ID
User.findById = (id, result) => {
  const sql = `SELECT id, email, name, lastname, image, phone, role, status, password FROM users WHERE id = ?`;
  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    } else {
      console.log('Usuario consultado: ', user[0]);
      result(null, user[0]);
    }
  });
};

// Utilizado por el login (RF-01)
User.findByEmail = (email, result) => {
  const sql = `SELECT id, email, name, lastname, image, phone, role, status, password FROM users WHERE email = ?`;
  db.query(sql, [email], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    } else {
      console.log('Usuario consultado: ', user[0]);
      result(null, user[0]);
    }
  });
};

// RF-03 (autorregistro) y RF-04 (el admin registra usuarios)
User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);
  const validRoles = ['admin', 'user'];
  const role = validRoles.includes(user.role) ? user.role : 'user';

  const sql = `INSERT INTO users(
                name,
                lastname,
                email,
                password,
                phone,
                image,
                role,
                status,
                created_at,
                updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  db.query(sql,
    [
      user.name,
      user.lastname,
      user.email,
      hash,
      user.phone,
      user.image,
      role,
      'active',
      new Date(),
      new Date()
    ], (err, res) => {
      if (err) {
        console.log('Error al crear el Usuario: ', err);
        result(err, null);
      } else {
        console.log('Usuario creado: ', { id: res.insertId, ...user });
        result(null, { id: res.insertId, ...user });
      }
    }
  );
};

// RF-07: Actualizar usuario
User.update = async (user, result) => {
  let fields = [];
  let values = [];

  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);
    fields.push('password = ?');
    values.push(hash);
  }
  if (user.email) {
    fields.push('email = ?');
    values.push(user.email);
  }
  if (user.name) {
    fields.push('name = ?');
    values.push(user.name);
  }
  if (user.lastname) {
    fields.push('lastname = ?');
    values.push(user.lastname);
  }
  if (user.phone) {
    fields.push('phone = ?');
    values.push(user.phone);
  }
  if (user.image) {
    fields.push('image = ?');
    values.push(user.image);
  }
  if (user.role) {
    fields.push('role = ?');
    values.push(user.role);
  }
  if (user.status) {
    fields.push('status = ?');
    values.push(user.status);
  }

  fields.push('updated_at = ?');
  values.push(new Date());

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(user.id);

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log('Error al actualizar usuario: ', err);
      result(err, null);
    } else {
      console.log('Usuario actualizado: ', { id: user.id, ...user });
      result(null, { id: user.id, ...user });
    }
  });
};

// RF-08: Eliminar usuario
User.delete = (id, result) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log('Error al eliminar usuario: ', err);
      result(err, null);
    } else {
      console.log('Usuario eliminado con id: ', id);
      result(null, res);
    }
  });
};

// Usado por el Dashboard de administrador
User.countAll = (result) => {
  const sql = `SELECT
                COUNT(*) AS total,
                SUM(role = 'admin') AS admins,
                SUM(status = 'blocked') AS blocked
               FROM users`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log('Error al contar usuarios: ', err);
      result(err, null);
    } else {
      result(null, rows[0]);
    }
  });
};

module.exports = User;
