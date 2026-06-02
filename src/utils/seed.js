const AccountModel = require('../models/account.model');

const INITIAL_ACCOUNTS = [
    { code: 'ACT-CAJ-001', name: 'Caja', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-BAN-001', name: 'Bancos', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-CLI-001', name: 'Clientes', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-INV-001', name: 'Inventario de Mercaderías', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-IVA-001', name: 'IVA por Cobrar', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-MOB-001', name: 'Mobiliario y Equipo', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-VEH-001', name: 'Vehículos', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-COM-001', name: 'Equipo de Cómputo', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: 'ACT-DA-MOB', name: 'Depreciación Acumulada Mobiliario', type: 'ACTIVO', nature: 'ACREEDORA' },
    { code: 'ACT-DA-VEH', name: 'Depreciación Acumulada Vehículos', type: 'ACTIVO', nature: 'ACREEDORA' },
    { code: 'ACT-DA-COM', name: 'Depreciación Acumulada Cómputo', type: 'ACTIVO', nature: 'ACREEDORA' },

    { code: 'PAS-PRO-001', name: 'Proveedores', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: 'PAS-IVA-001', name: 'IVA por Pagar', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: 'PAS-IGSS-001', name: 'IGSS por Pagar', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: 'PAS-PROV-001', name: 'Provisiones por Pagar', type: 'PASIVO', nature: 'ACREEDORA' },

    { code: 'PAT-CAP-001', name: 'Capital Social', type: 'PATRIMONIO', nature: 'ACREEDORA' },
    { code: 'PAT-RES-001', name: 'Resultado del Ejercicio', type: 'CAPITAL', nature: 'ACREEDORA' },

    { code: 'ING-VEN-001', name: 'Ventas', type: 'INGRESO', nature: 'ACREEDORA' },

    { code: 'COS-VEN-001', name: 'Costo de Ventas', type: 'COSTO', nature: 'DEUDORA' },

    { code: 'GAS-SUE-001', name: 'Sueldos y Salarios', type: 'GASTO', nature: 'DEUDORA' },
    { code: 'GAS-IGSS-001', name: 'Cuota Patronal IGSS', type: 'GASTO', nature: 'DEUDORA' },
    { code: 'GAS-DEP-001', name: 'Depreciaciones', type: 'GASTO', nature: 'DEUDORA' },
    { code: 'GAS-PRES-001', name: 'Prestaciones Laborales', type: 'GASTO', nature: 'DEUDORA' }
];

const seedAccounts = async (companyId = process.env.DEFAULT_COMPANY_ID || 'vertice_fashion') => {
    console.log(`🌱 Iniciando seed de cuentas para empresa: ${companyId}...`);
    
    try {
        const existingAccounts = await AccountModel.getAll(companyId);
        
        if (existingAccounts.length > 0) {
            console.log('⚠️ El catálogo de cuentas para esta empresa ya tiene datos. Omitiendo seed.');
            return;
        }

        for (const account of INITIAL_ACCOUNTS) {
            await AccountModel.create({ ...account, companyId });
            console.log(`✅ Cuenta creada: ${account.code} - ${account.name}`);
        }

        console.log('🏁 Seed completado exitosamente.');
    } catch (error) {
        console.error('❌ Error en el seed:', error.message);
    }
};

module.exports = seedAccounts;
