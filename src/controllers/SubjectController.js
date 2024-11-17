const Subject = require('../models/Subject')

exports.initializeSubjects = async function() {
    
    const subjects = [
        "Matemática",
        "Física",
        "Química",
        "Lengua",
        "Historia",
        "Geografía"
    ]

    try {
        const existingSubjects = await Subject.find({subjectName: {$in: subjects}})
        const existingNames = existingSubjects.map(subject => subject.subjectName)

        const newSubjects = subjects
            .filter(name => !existingNames.includes(name))
            .map(name => ({subjectName: name}))

        if(newSubjects.length > 0) {
            await Subject.insertMany(newSubjects)
            console.log('Nuevas materias insertadas')
        } else {
            console.log('No hay nuevas materias para insertar')
        }
    } catch(err) {
        console.error('Error al insertar las materias', err)
    }
    
}

exports.getSubjects = async function() {
    try {
        const subjects = await Subject.find({}, 'subjectName')

        return subjects.map(subject => subject.subjectName)

      
    } catch(err) {
        console.error('Error al obtener las materias: ', err)
        throw new Error('Error al obtener las materias')
    }
}