const { admin } = require('../config/firebase');
const db = admin.firestore();

/**
 * Middleware para verificar el token de Firebase Auth y el estado del usuario en Firestore.
 * Este ERP trabaja con una sola empresa y un solo rol funcional: contador.
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No autorizado. Se requiere un token de autenticación.'
        });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(403).json({
                message: 'Usuario no autorizado para este ERP. Usa el usuario contador creado por el backend.',
                status: 'not_registered'
            });
        }

        const profile = userDoc.data();

        if (profile.status !== 'active') {
            return res.status(403).json({
                message: 'Cuenta no activa',
                status: profile.status || 'inactive'
            });
        }

        if (profile.role !== 'contador') {
            return res.status(403).json({
                message: 'Acceso denegado: este ERP solo permite rol contador'
            });
        }

        req.user = {
            uid,
            email,
            role: 'contador',
            status: 'active',
            companyId: profile.companyId || process.env.DEFAULT_COMPANY_ID || 'vertice_fashion'
        };

        next();
    } catch (error) {
        console.error('Error Auth:', error.message);
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

/**
 * Se conserva por compatibilidad de rutas antiguas, pero el ERP actual solo usa contador.
 */
const isAdmin = (req, res, next) => {
    return res.status(403).json({ message: 'Acceso denegado: este ERP solo permite rol contador' });
};

module.exports = { authenticate, isAdmin };
