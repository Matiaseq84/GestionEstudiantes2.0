const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI
      /*  await mongoose.connect("mongodb://localhost:27017/gestion_estudiantes", {
         
        })*/
      await mongoose.connect(dbURI, {
         
      })

        console.log('Conectado a MongoDB Atlas')
    } catch (err) {
        console.error('Error de conexión a MongoDB: ', err)
        process.exit(1)
    }
}

module.exports = connectDB