const User = require('../models/user');
const Sticker = require('../models/sticker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {
  // RF-01: Iniciar sesion
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al consultar el usuario',
          error: err
        });
      }

      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: 'El email no existe en la base de datos'
        });
      }

      if (myUser.status === 'blocked') {
        return res.status(403).json({
          success: false,
          message: 'Tu cuenta esta bloqueada. Contacta a un administrador de Drayko.'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email, role: myUser.role },
          keys.secretOrKey,
          { expiresIn: '1h' }
        );

        const data = {
          id: myUser.id,
          email: myUser.email,
          name: myUser.name,
          lastname: myUser.lastname,
          image: myUser.image,
          phone: myUser.phone,
          role: myUser.role,
          session_token: `JWT ${token}`
        };

        return res.status(201).json({
          success: true,
          message: 'Usuario autenticado',
          data: data
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Contrasena o correo incorrecto'
        });
      }
    });
  },

  // RF-05: Consultar todos los usuarios
  getAllUsers(req, res) {
    User.findAll((err, users) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al listar usuarios',
          error: err
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Lista de usuarios',
        data: users
      });
    });
  },

  // RF-06: Consultar usuario por ID
  getUserById(req, res) {
    const id = req.params.id;
    User.findById(id, (err, user) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al consultar el usuario',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario encontrado',
        data: user
      });
    });
  },

  // RF-03 (autorregistro, publico) y RF-04 (admin crea usuarios)
  register(req, res) {
    const user = req.body;

    if (!user.role) {
      user.role = 'user';
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al crear el usuario',
          error: err
        });
      } else {
        return res.status(201).json({
          success: true,
          message: 'Usuario creado correctamente',
          data: data
        });
      }
    });
  },

  // RF-07: Actualizar usuario
  getUserUpdate(req, res) {
    const user = req.body;
    const targetId = parseInt(req.params.id, 10);
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.id === targetId;

    // Solo el propio usuario o un administrador pueden editar esta cuenta
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este usuario'
      });
    }

    // Un usuario normal no puede auto-asignarse un rol ni des/bloquearse a si mismo
    if (!isAdmin) {
      delete user.role;
      delete user.status;
    }

    user.id = targetId;
    User.update(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al actualizar el usuario',
          error: err
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado',
        data: data
      });
    });
  },

  // Dashboard del administrador: metricas generales + actividad reciente
  getDashboard(req, res) {
    User.countAll((err, userStats) => {
      if (err) {
        return res.status(501).json({ success: false, message: 'Error al calcular estadisticas de usuarios', error: err });
      }
      Sticker.countAll((err2, stickerStats) => {
        if (err2) {
          return res.status(501).json({ success: false, message: 'Error al calcular estadisticas de stickers', error: err2 });
        }
        Sticker.findRecent(5, (err3, recent) => {
          if (err3) {
            return res.status(501).json({ success: false, message: 'Error al obtener actividad reciente', error: err3 });
          }
          return res.status(200).json({
            success: true,
            message: 'Estadisticas del sistema',
            data: {
              users: userStats,
              stickers: stickerStats,
              recentActivity: recent
            }
          });
        });
      });
    });
  },

  // RF-08: Eliminar usuario
  getUserDelete(req, res) {
    const id = req.params.id;
    User.delete(id, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: 'Error al eliminar el usuario',
          error: err
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado',
        data: data
      });
    });
  }
};
