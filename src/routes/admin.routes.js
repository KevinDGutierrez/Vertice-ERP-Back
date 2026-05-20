const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

// Rutas conservadas por compatibilidad. El ERP actual solo permite rol contador.
router.use(isAdmin);

router.get('/users', adminController.getUsers);
router.patch('/users/:uid/approve', adminController.approveUser);
router.post('/users/:uid/reject', adminController.rejectUser);

module.exports = router;
