const { db } = require('../config/firebase');

const ACCOUNTS_COLLECTION = 'accounts';

class AccountModel {
    /**
     * Genera IDs numéricos secuenciales para las cuentas: 1, 2, 3...
     * Se usan como ID del documento en Firestore para evitar IDs aleatorios.
     */
    static async getNextNumericId() {
        const snapshot = await db.collection(ACCOUNTS_COLLECTION).get();
        const numericIds = snapshot.docs
            .map(doc => Number.parseInt(doc.id, 10))
            .filter(Number.isFinite);

        if (numericIds.length === 0) return '1';
        return String(Math.max(...numericIds) + 1);
    }

    /**
     * Obtiene todas las cuentas del catálogo filtradas por empresa
     */
    static async getAll(companyId) {
        if (!companyId) throw new Error('Se requiere companyId');
        
        // Obtenemos las cuentas filtradas por empresa
        const snapshot = await db.collection(ACCOUNTS_COLLECTION)
            .where('companyId', '==', companyId)
            .get();
        
        // Mapeamos los datos
        const accounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Ordenamos en memoria para evitar el error de "index required" de Firestore temporalmente
        // Nota: Es recomendable crear el índice compuesto en la consola de Firebase para mejor rendimiento.
        return accounts.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    }

    /**
     * Busca una cuenta por su código dentro de una empresa específica
     */
    static async getByCode(code, companyId) {
        if (!companyId) throw new Error('Se requiere companyId');
        const snapshot = await db.collection(ACCOUNTS_COLLECTION)
            .where('companyId', '==', companyId)
            .where('code', '==', code)
            .limit(1)
            .get();
        
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    /**
     * Busca una cuenta por ID
     */
    static async getById(id) {
        const doc = await db.collection(ACCOUNTS_COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async generateNextCode(companyId, type, parentId = null) {
        const snapshot = await db.collection(ACCOUNTS_COLLECTION)
            .where('companyId', '==', companyId)
            .get();

        const codes = snapshot.docs
            .map(doc => parseInt(doc.data().code, 10))
            .filter(c => !isNaN(c));

        if (codes.length === 0) return '1';
        return (Math.max(...codes) + 1).toString();
    }

    /**
     * Crea una nueva cuenta asociada a una empresa
     */
    static async create(accountData) {
        const { companyId, type, parentId } = accountData;
        if (!companyId) throw new Error('Se requiere companyId para crear cuenta');
        
        let { code } = accountData;
        
        // Si no viene código, lo generamos automáticamente
        if (!code) {
            code = await this.generateNextCode(companyId, type, parentId);
        }

        const id = await this.getNextNumericId();
        await db.collection(ACCOUNTS_COLLECTION).doc(id).set({
            ...accountData,
            code,
            balance: accountData.balance || 0,
            createdAt: new Date().toISOString()
        });
        return id;
    }

    /**
     * Semilla de catálogo base para nuevas empresas
     */
    static async seed(companyId) {
        // Obsolete: use seedAccounts from utils/seed.js instead.
        return true;
    }
}

module.exports = AccountModel;
