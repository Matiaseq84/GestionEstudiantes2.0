const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
    subjectName: {type: String, required: true, unique: true}
})

const Subject = mongoose.model('Subject', SubjectSchema)

module.exports = Subject