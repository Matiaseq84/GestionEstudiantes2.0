const Student = require('../models/Student')
const UserController = require('../controllers/UserController')
const SubjectController = require('../controllers/SubjectController')


exports.addStudent = async function(req,res) {
    try {
        
        const { name, lastname, dni, bornDate, email, parentName, parentDni} = req.body
        
        const exists = await Student.findOne({ dni })
        if(exists) return res.status(409).render('panel-administrador', {warning: 'Alumno existente'})
        
            const [day, month, year] = bornDate.split('-');
            const formattedDate = new Date(year, month - 1, day);    

        const newStudent = new Student({
            name,
            lastname,
            dni,
            bornDate: formattedDate, 
            email,
            parents: {
                parentName,
                parentDni
            },
        });

        const savedStudent = await newStudent.save()

        const userResult = await UserController.addUser(dni)

        if(!userResult.success) {
            await Student.findByIdAndDelete(savedStudent._id)
            return res.status(500).render('panel-administrador', {error: 'Error al crear el usuario asociado: ' + userResult.message})
        }

        res.status(201).render('panel-administrador', {success: `Alumno registrado exitosamente. Usuario creado con contraseña: ${userResult.password}`, data: savedStudent})

    } catch (err) {
        console.error('Error al guardar el estudiante: ', err)
        res.status(500).render('panel-administrador', {error: 'Error al registrar el Alumno'})
    }
}

exports.findStudentByDni = async function (req, res) {
    try {
        const {dni} = req.query
        
        const student = await Student.findOne({dni})
        
        if(!student) return res.send(`<p> Alumno no encontrado`)
        
            const subjects = await SubjectController.getSubjects(); // Asegúrate de que getSubjects devuelva un array de strings

            const enrolledSubjects = student.subjects.map(subject => subject.subjectName);
            
            const unenrolledSubjects = subjects.filter(subject => !enrolledSubjects.includes(subject));
            
            // Renderiza la respuesta correctamente
            res.send(`
                <p> Nombre: ${student.name}</p>
                <p> Apellido: ${student.lastname} </p>
                <p> DNI: ${student.dni} </p>
                <ul>
                    ${unenrolledSubjects
                        .map(subjectName => `
                            <li>
                                <span>${subjectName}</span>
                                <input type="checkbox" name="selectedSubjects[]" value="${subjectName}">
                            </li>
                        `).join('')}
                </ul>
            `);
        
    } catch(err) {
        res.status(500).json({success: false, message: 'Error al obtener el alumno'})
    }
}

exports.enrolSubjects = async function(req,res) {
    try {
        const { dni, selectedSubjects } = req.body

        console.log(req.body)

        if(!selectedSubjects || selectedSubjects.length === 0) return res.status(400).render('panel-administrador', {warning: 'Debe seleccionar al menos una materia'})

        const student = await Student.findOne({dni})                

        if(!student) return res.status(404).render('panel-administrador', 'Alumno no encontrado')
    
        selectedSubjects.forEach(subjectName => {
            student.subjects.push({subjectName, score: 0})
            
        })

        await student.save()

        res.status(200).render('panel-administrador', {success: 'Alumno inscripto'})
    } catch(err) {
        console.error('Error al registrar materias', err)
        res.status(500).render('panel-administrador', {error: 'Error al registrar'})
    }
    
}

exports.registerStudentScores = async function (req, res) {
    try {
        const { dni, subjectScores } = req.body;

        // Verificar que se envíen las notas
        if (!subjectScores || Object.keys(subjectScores).length === 0) {
            return res.status(400).render('panel-profesor', {
                warning: 'Debe ingresar al menos una nota para registrar',
            });
        }

        const student = await Student.findOne({ dni });
        if (!student) return res.status(404).render('panel-profesor', {error: 'Alumno no encontrado'})
         

        // Actualizar las notas en las materias inscritas
        Object.entries(subjectScores).forEach(([subjectName, score]) => {
            const subject = student.subjects.find(subj => subj.subjectName === subjectName);
            if (subject) {
                subject.score = parseFloat(score); // Convertir la nota a número
            }
        });

        // Guardar los cambios en la base de datos
        await student.save();

        res.status(200).render('panel-profesor', {
            success: 'Notas registradas correctamente',
        });
    } catch (err) {
        console.error('Error al registrar notas:', err);
        res.status(500).render('panel-profesor', {
            error: 'Error al registrar las notas',
        });
    }
};

exports.showInfoStudent = async function(req, res) {
    try {
        const dni = req.params.dni
        
        console.log(dni)
        
        const student = await Student.findOne({ dni });
        if (!student) return res.status(404).render('panel-profesor', {error: 'Alumno no encontrado'})

        console.log(student)

        res.status(201).render('panel-alumno', {student} )
        
    } catch (err) {

    }
    

}