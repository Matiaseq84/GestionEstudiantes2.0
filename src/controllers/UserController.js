const User = require('../models/User')
const {generarContrasenaAleatoria} = require('../utils/funciones')

exports.addUser = async function(dni) {
    try {
        const exists = await User.findOne({dni})
        if(exists) return { success: false, message: 'Usuario existente'}

        const randomPassword = generarContrasenaAleatoria()

        const newUser = new User({
            username: dni,
            password: randomPassword,
            role: 'student'
        })

        const savedUser = await newUser.save()
        return {success: true, data: savedUser, password: randomPassword}
        //res.status(201).render('panel-administrador', {success: `Usuario creado exitosamente. Contraseña: ${randomPassword}`, data: savedUser}
    } catch(err) {
        console.error('Error al generar el Usuario', err)
        return {success: false, message: 'Error al registrar el Usuario', error: err}
    }

}

exports.initializeUser = async function() {
    try {
        const adminExists = await User.findOne({ username: 'admin'})
        if(!adminExists) {
            await User.create({
                username: 'admin',
                password: 'admin',
                role: 'admin'
            })
        }

        const profesorExists = await User.findOne({username: 'profesor'})
        if(!profesorExists) {
            await User.create({
                username: 'profesor',
                password: 'profesor',
                role: 'profesor'
            })
        }
    } catch (err) {
        console.error('Error inicializando usuarios: ', err)
    }
}