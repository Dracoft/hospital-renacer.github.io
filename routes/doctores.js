var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM doctores', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('doctores', { title: 'doctores', doctores: results, opcion: 'disabled', estado: true  })
        }
    });
});

router.get('/agregar-doctores', function (req, res, next) {
    connection.query('SELECT especialidad FROM doctores', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {

            let especialidades = ['Medicina general', 'Cardiología', 'Medicina interna', 'Dermatología', 'Rehabilitación física', 'Psicología', 'Odontología', 'Radiología']
            let resultsEspecialidades = results.map(objeto => objeto.especialidad);//separar packete 
            let resultsSinRepetidos = especialidades.filter((elemento) => {//filtrar repetidos
                return !resultsEspecialidades.includes(elemento);
            });
            res.render('registro-doctores', { layout: 'registro', especialidades: resultsSinRepetidos })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM doctores', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('doctores', { title: 'doctores', claveSeleccionada: clave, doctores: results, opcion: 'disabled', estado: false })
        }
    });
});

//Agregar medicos
router.post('/agregar', (req, res) => {
    const cedula_d = req.body.cedula_doctor;
    const nombre_d = req.body.nombre_doctor;
    const apellido_d = req.body.apellido_doctor;
    const correo_d = req.body.correo_doctor;
    const consultorio_d = req.body.consultorio;
    const especialidad_d = req.body.especialidad;
    connection.query(`INSERT INTO doctores (cedula, nombre, apellido, especialidad, consultorio, correo) VALUES (${cedula_d},'${nombre_d}', '${apellido_d}', '${especialidad_d}', '${consultorio_d}', '${correo_d}')`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/doctores');
        }
    });
})

//eliminar medicos
router.get('/eliminar/:cedula_doctor', function (req, res, next) {
    const cedula_do = req.params.cedula_doctor
    connection.query(`DELETE FROM citas_medicas WHERE id_doctor=${cedula_do}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM doctores WHERE cedula=${cedula_do}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/doctores')
                }
            });
        }
    });
});

router.post('/actualizar/:cedula', (req, res) => {
    const nombre_d = req.body.nombre_doctor;
    const apellido_d = req.body.apellido_doctor;
    const correo_d = req.body.correo_doctor;
    const consultorio_d = req.body.consultorio;
    const especialidad_d = req.body.especialidad;
    const cedula = req.params.cedula;
    connection.query(`UPDATE doctores SET nombre='${nombre_d}', apellido='${apellido_d}', correo='${correo_d}', especialidad='${especialidad_d}', consultorio='${consultorio_d}' WHERE cedula=${cedula}`, (error, result) => {
        if (error) {
            console.log("Ocurrió un error en la ejecución", error)
            res.status(500).send("Error en la consultaa");
        } else {
            res.redirect('/doctores');
        }
    });
})



module.exports = router;