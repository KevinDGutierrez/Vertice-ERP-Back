/**
 * Utils for Backend Validations
 */

const VALID_ACCOUNT_TYPES = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'CAPITAL', 'INGRESO', 'GASTO', 'COSTO'];
const VALID_NATURES = ['DEUDORA', 'ACREEDORA'];
const VALID_ENTRY_TYPES = ['DIARIO', 'APERTURA', 'AJUSTE', 'CIERRE'];

function validateAccount(data) {
    const errors = {};
    if (!data.name || data.name.trim().length < 3) {
        errors.name = 'El nombre de la cuenta debe tener al menos 3 caracteres.';
    }
    if (!data.type || !VALID_ACCOUNT_TYPES.includes(data.type)) {
        errors.type = 'Tipo de cuenta inválido.';
    }
    if (!data.nature || !VALID_NATURES.includes(data.nature)) {
        errors.nature = 'Naturaleza de la cuenta inválida.';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateEntry(data) {
    const errors = {};
    if (!data.date || isNaN(new Date(data.date).getTime())) {
        errors.date = 'Fecha de operación inválida.';
    }
    if (!data.description || data.description.trim().length < 5) {
        errors.description = 'La descripción debe tener al menos 5 caracteres.';
    }
    if (!data.type || !VALID_ENTRY_TYPES.includes(data.type)) {
        errors.type = 'Tipo de partida inválido.';
    }
    
    if (!data.details || !Array.isArray(data.details) || data.details.length < 2) {
        errors.details = 'La partida debe tener al menos dos movimientos.';
    } else {
        const rowErrors = [];
        data.details.forEach((row, index) => {
            const rErr = {};
            if (!row.accountId) rErr.accountId = 'Falta asignar cuenta contable.';
            
            const debit = Number(row.debit) || 0;
            const credit = Number(row.credit) || 0;
            
            if (debit <= 0 && credit <= 0) {
                rErr.amount = 'El monto debe ser mayor a cero.';
            }
            if (debit > 0 && credit > 0) {
                rErr.amount = 'No puede tener Debe y Haber simultáneamente.';
            }
            if (Object.keys(rErr).length > 0) {
                rowErrors[index] = rErr;
            }
        });
        if (rowErrors.length > 0) {
            errors.rows = rowErrors;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = {
    validateAccount,
    validateEntry
};
