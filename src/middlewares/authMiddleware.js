const jwt = require('jsonwebtoken')
const JWT_SECRET = 'tu_clave_secreta_super_segura'

function authenticateToken(req,res,next) {
    const token = req.cookies.authToken
    
    if(!token) return res.status(401).render('login', {error: 'Debes iniciar sesión para acceder a esta página'})

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.status(403).render('login', {error: 'Sesión expirada, por favor, vuelve a iniciar sesión'})
        
        req.user = user
        next()
    })
}

module.exports = authenticateToken