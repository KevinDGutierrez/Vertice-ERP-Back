require('dotenv').config();
const { db } = require('./src/config/firebase');

async function clearAccounts() {
    console.log('Borrando cuentas de vertice_fashion...');
    const snapshot = await db.collection('accounts').where('companyId', '==', 'vertice_fashion').get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Cuentas borradas. Reinicia el servidor para que se ejecute el seed con los nuevos códigos simples.');
    process.exit(0);
}
clearAccounts();
