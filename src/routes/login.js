const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs').promises


router.get("/", (req, res) => {
    res.render('login')
})

router.post("/", async (req, res) => {
    const {username, password} = req.body
    const filePath = path.join(__dirname, '../jsons/users.json')

    try {
        const data = await fs.readFile(filePath, 'utf-8')         

        const users = JSON.parse(data)

        const user = users.find(user => user[username])

        console.log("Body received:", req.body);
        console.log("Username:", username);
        console.log("Password:", password);

        if(user && user[username].password === password) {
            if(user[username].role === "admin") res.redirect('admin/panel-administrador')
            else if (user[username].role === "profesor") res.redirect('profesor/panel-profesor') 
            else if (user[username].role === "alumno") res.redirect(`alumno/panel-alumno/${username}`)
        } else {
            res.status(401).render('login', {error: 'Usuario y/o contraseña incorrecta'})
        }     
    } catch(error) {
        console.error('Error al leer el archivo', error)
        res.status(500).send('Error en el servidor')
    }
    
    
    
} )

module.exports = router