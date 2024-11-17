const User = require('../models/User')

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