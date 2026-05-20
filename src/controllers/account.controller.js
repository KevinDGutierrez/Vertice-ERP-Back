const AccountModel = require('../models/account.model');
const { validateAccount } = require('../utils/validators');

const getAllAccounts = async (req, res) => {
    try {
        const { companyId } = req.user;
        if (!companyId) {
            return res.status(403).json({ message: 'Usuario no tiene una empresa asignada' });
        }
        const accounts = await AccountModel.getAll(companyId);
        res.json(accounts);
    } catch (error) {
        console.error('Error getAllAccounts:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const createAccount = async (req, res) => {
    try {
        const { companyId } = req.user;
        if (!companyId) {
            return res.status(403).json({ message: 'No puedes crear cuentas sin una empresa asignada' });
        }

        const { code, name, type, nature, parentId } = req.body;
        
        const validation = validateAccount(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: 'Validación fallida', errors: validation.errors });
        }
        
        // Validar si el código ya existe (solo si el usuario lo envió, aunque ahora será automático)
        if (code) {
            const existing = await AccountModel.getByCode(code, companyId);
            if (existing) {
                return res.status(400).json({ message: 'El código de cuenta ya existe en tu catálogo' });
            }
        }

        const payload = { code, name, type, nature, companyId };
        if (parentId) payload.parentId = parentId;

        const id = await AccountModel.create(payload);
        res.status(201).json({ id, message: 'Cuenta creada exitosamente' });
    } catch (error) {
        console.error('Error createAccount:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAccounts,
    createAccount
};
