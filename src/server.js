const app = require('./app');
const seedAccounts = require('./utils/seed');
const { ensureContadorUser, COMPANY_ID } = require('./utils/adminInit');

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    console.log(`🚀 Servidor ERP corriendo en el puerto ${PORT}`);
    console.log(`📡 URL Base: http://localhost:${PORT}`);

    // Asegurar empresa única y usuario contador
    await ensureContadorUser();

    // Ejecutar seed inicial para VÉRTICE FASHION
    await seedAccounts(COMPANY_ID);
});
