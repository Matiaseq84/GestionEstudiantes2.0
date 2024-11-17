const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    dni: {type: String, required: true, unique: true},
    bornDate: {type: Date, required: true},
    email: {type: String, required: true, unique: true},
    parents: {
        parentName:  {type: String, required: true},
        parentDni: {type: String, required: true}

    }
})

const Student = mongoose.model('Student', StudentSchema)

module.exports = Student