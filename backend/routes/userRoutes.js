const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas publicas
router.post('/create', userController.register);   // RF-03 Autorregistro
router.post('/login', userController.login);        // RF-01 Iniciar sesion

// Rutas protegidas (solo administrador gestiona otros usuarios)
router.get('/dashboard/stats', verifyToken, authorizeRoles(['admin']), userController.getDashboard); // Dashboard admin
router.get('/', verifyToken, authorizeRoles(['admin']), userController.getAllUsers);        // RF-05
router.get('/:id', verifyToken, authorizeRoles(['admin']), userController.getUserById);     // RF-06
router.put('/:id', verifyToken, userController.getUserUpdate);                              // RF-07 (admin o el propio usuario)
router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete); // RF-08

module.exports = router;
