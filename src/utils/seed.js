const AccountModel = require('../models/account.model');

const INITIAL_ACCOUNTS = [
    { code: '1', name: 'Caja', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '2', name: 'Bancos', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '3', name: 'Clientes', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '4', name: 'Inventario de Mercaderías', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '5', name: 'IVA por Cobrar', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '6', name: 'Mobiliario y Equipo', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '7', name: 'Vehículos', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '8', name: 'Equipo de Cómputo', type: 'ACTIVO', nature: 'DEUDORA' },
    { code: '9', name: 'Depreciación Acumulada Mobiliario', type: 'ACTIVO', nature: 'ACREEDORA' },
    { code: '10', name: 'Depreciación Acumulada Vehículos', type: 'ACTIVO', nature: 'ACREEDORA' },
    { code: '11', name: 'Depreciación Acumulada Cómputo', type: 'ACTIVO', nature: 'ACREEDORA' },
    { code: '12', name: 'Proveedores', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: '13', name: 'IVA por Pagar', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: '14', name: 'IGSS por Pagar', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: '15', name: 'Provisiones por Pagar', type: 'PASIVO', nature: 'ACREEDORA' },
    { code: '16', name: 'Capital Social', type: 'PATRIMONIO', nature: 'ACREEDORA' },
    { code: '17', name: 'Resultado del Ejercicio', type: 'CAPITAL', nature: 'ACREEDORA' },
    { code: '18', name: 'Ventas', type: 'INGRESO', nature: 'ACREEDORA' },
    { code: '19', name: 'Costo de Ventas', type: 'COSTO', nature: 'DEUDORA' },
    { code: '20', name: 'Sueldos y Salarios', type: 'GASTO', nature: 'DEUDORA' },
    { code: '21', name: 'Cuota Patronal IGSS', type: 'GASTO', nature: 'DEUDORA' },
    { code: '22', name: 'Depreciaciones', type: 'GASTO', nature: 'DEUDORA' },
    { code: '23', name: 'Prestaciones Laborales', type: 'GASTO', nature: 'DEUDORA' }
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
