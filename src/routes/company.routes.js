const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

// Todas estas rutas ya vienen protegidas desde src/routes/index.js
router.get('/', companyController.listCompanies);
router.get('/brand', companyController.getBrand);
router.patch('/brand', companyController.updateBrandConfig);

// Se conservan por compatibilidad, pero el ERP actual solo trabaja con rol contador.
router.get('/all', isAdmin, companyController.listAllCompanies);
router.post('/', isAdmin, companyController.createCompany);
router.patch('/:id', isAdmin, companyController.updateCompany);
router.get('/:companyId/users', companyController.getCompanyUsers);

module.exports = router;
