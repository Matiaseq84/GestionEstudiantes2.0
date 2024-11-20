const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI
      /*  await mongoose.connect("mongodb://localhost:27017/gestion_estudiantes", {
         
        })*/
      await mongoose.connect(dbURI, {
        serverSelectionTimeoutMS: 10000, // Tiempo máximo de espera para encontrar un servidor (en milisegundos)
        socketTimeoutMS: 45000,  
      })

        console.log('Conectado a MongoDB Atlas')
    } catch (err) {
        console.error('Error de conexión a MongoDB: ', err)
        process.exit(1)
    }
}

module.exports = connectDB