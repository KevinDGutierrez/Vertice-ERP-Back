const { admin, db } = require('../config/firebase');

const COMPANY_ID = process.env.DEFAULT_COMPANY_ID || 'vertice_fashion';
const COMPANY_NAME = process.env.DEFAULT_COMPANY_NAME || 'VÉRTICE FASHION';
const CONTADOR_EMAIL = process.env.CONTADOR_EMAIL || 'contador@verticefashion.com';
const CONTADOR_PASSWORD = process.env.CONTADOR_PASSWORD || 'password123';

/**
 * Asegura la empresa única y el usuario contador del ERP.
 * Se ejecuta al arrancar el servidor.
 */
async function ensureContadorUser() {
  try {
    const auth = admin.auth();

    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(CONTADOR_EMAIL);
      console.log('✅ Usuario contador verificado en Firebase Auth.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email: CONTADOR_EMAIL,
          password: CONTADOR_PASSWORD,
          emailVerified: true,
          displayName: 'Contador'
        });
        console.log('🚀 Usuario contador creado exitosamente en Firebase Auth.');
      } else {
        throw error;
      }
    }

    const companyRef = db.collection('companies').doc(COMPANY_ID);
    const companyDoc = await companyRef.get();

    if (!companyDoc.exists) {
      await companyRef.set({
        name: COMPANY_NAME,
        type: 'erp',
        status: 'active',
        nit: process.env.DEFAULT_COMPANY_NIT || '0000000-0',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`🏢 Empresa "${COMPANY_NAME}" creada.`);
    } else {
      await companyRef.set({
        name: COMPANY_NAME,
        type: companyDoc.data().type || 'erp',
        status: 'active',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`🏢 Empresa "${COMPANY_NAME}" verificada.`);
    }

    const userRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userRef.get();

    await userRef.set({
      email: CONTADOR_EMAIL,
      role: 'contador',
      status: 'active',
      companyId: COMPANY_ID,
      displayName: 'Contador',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: userDoc.exists ? userDoc.data().createdAt : admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('📜 Perfil de contador asegurado y vinculado a VÉRTICE FASHION.');
  } catch (error) {
    console.error('❌ Error al asegurar el usuario contador:', error.message);
  }
}

module.exports = {
  ensureContadorUser,
  COMPANY_ID,
  COMPANY_NAME,
  CONTADOR_EMAIL
};
