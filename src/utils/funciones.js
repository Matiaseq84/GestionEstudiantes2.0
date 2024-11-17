const fs = require('fs').promises
const path = require('path')

function generarContrasenaAleatoria(longitud = 8) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let contrasena = '';
    
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(indiceAleatorio);
    }
    
    return contrasena;
}

async function busquedaAlumno(dni) {

    const filePathAlumnos = path.join(__dirname, '../jsons/alumnos.json')
    
    try{
        const dataAlumnos = await fs.readFile(filePathAlumnos, 'utf-8')
    const alumnos = JSON.parse(dataAlumnos)

    const alumno = alumnos.find(alumno => alumno.dni === dni)

    return alumno
    } catch(error) {
        console.error('Error', error)
        
    }
    
}



module.exports = {generarContrasenaAleatoria, busquedaAlumno} 