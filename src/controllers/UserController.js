const User = require('../models/User')
const {generarContrasenaAleatoria} = require('../utils/funciones')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'tu_clave_secreta_super_segura'

const SALT_ROUNDS = 10;

exports.addUser = async function(dni) {
    try {

        

        const exists = await User.findOne({dni})
        if(exists) return { success: false, message: 'Usuario existente'}

        const randomPassword = generarContrasenaAleatoria()

        hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS)

        const newUser = new User({
            username: dni,
            password: hashedPassword,
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

        hashedPasswordAdmin = await bcrypt.hash('admin', SALT_ROUNDS)
        
        if(!adminExists) {
            await User.create({
                username: 'admin',
                password: hashedPasswordAdmin,
                role: 'admin'
            })
        }

        hashedPasswordTeacher = await bcrypt.hash('profesor', SALT_ROUNDS)

        const teacherExists = await User.findOne({username: 'profesor'})
        if(!teacherExists) {
            await User.create({
                username: 'profesor',
                password: hashedPasswordTeacher,
                role: 'teacher'
            })
        }
    } catch (err) {
        console.error('Error inicializando usuarios: ', err)
    }
}

exports.validateLogin = async function(req,res) {
    try {
        const {username, password} = req.body

        const user = await User.findOne({username})

        if(!user) res.status(401).render('login', {error: 'Usuario o contraseña incorrecta'})

        const isPasswordValid = await bcrypt.compare(password, user.password)    
        if(!isPasswordValid) return res.status(401).render('login', {error: 'Usuario o contraseña'})
        
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
                dni: user.dni
            },
            JWT_SECRET,
            {expiresIn: '1h'}
        )    

            res.cookie('authToken', token, {httpOnly: true})
            if(user.role === 'admin') res.status(200).redirect('admin/panel-administrador')
            if(user.role === 'teacher') res.status(200).redirect('profesor/panel-profesor')
            if(user.role === 'student') res.status(200).redirect(`alumno/panel-alumno/${user.username}`)
            
        
    } catch (err) {
        console.error('Error al iniciar sesión', err)
        res.status(500).render('login', { error: 'Error en el servidor'})
    }

    
}