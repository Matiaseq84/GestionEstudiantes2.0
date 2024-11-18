const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    res.clearCookie('authToken'); // Borra el token de autenticación
    res.redirect('/login'); // Redirige al usuario al login
});

module.exports = router;