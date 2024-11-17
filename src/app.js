const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000
const connectDB = require('./db.js')
const Users = require('./utils/initializeUsers')

connectDB().then(async () => {
  await Users.initializeUser()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.text());

const loginRouter= require('./routes/login.js')
const adminRouter = require('./routes/admin.js')
const profesorRouter = require('./routes/profesor.js')
const alumnoRouter = require('./routes/alumno.js')

app.get('/', (req, res) => {
    res.render('login'); 
  });

app.use('/login', loginRouter)
app.use('/admin', adminRouter)
app.use('/profesor', profesorRouter)
app.use('/alumno', alumnoRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})