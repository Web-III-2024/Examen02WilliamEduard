var db = firebase.firestore();
const txtCSV = document.querySelector('#txtCSV');
const btnLoad = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', function () {
    lecturaCSV(txtCSV.files[0]).then(() => {
        txtCSV.value = '';
    });
});

async function lecturaCSV(archivo) {
    const nomarch = archivo.name.split('.')[0];
    const lector = new FileReader();

    return new Promise((resolve, reject) => {
        lector.onload = function (event) {
            const data = event.target.result.split('\n');
            const etiquetas = data[0].split(';');

            for (let index = 1; index < data.length; index++) {
                const valores = data[index].split(';');
                let salida = {};

                for (let index2 = 0; index2 < etiquetas.length; index2++) {
                    salida[etiquetas[index2]] = procesarDato(valores[index2]);
                }

                db.collection(nomarch).add(salida)
                    .then(function (docRef) {
                        console.log("ID del registro: " + docRef.id);
                    })
                    .catch(function (FirebaseError) {
                        console.error("Error al registrar el dato: " + FirebaseError);
                    });
            }

            resolve('Datos guardados correctamente.');
        };

        lector.onerror = function (event) {
            reject('Error al leer el archivo: ' + event.target.error);
        };

        lector.readAsText(archivo);
    });
}

function procesarDato(dato) {
    // Verificar si el dato es nulo, en blanco o indefinido
    if (!dato || typeof dato !== 'string' || !dato.trim()) {
        return 'na';
    }

    // Intentar convertir el dato a fecha utilizando funciones nativas de JavaScript
    const dateParts = dato.trim().split('-'); // Suponiendo un formato YYYY-MM-DD
    if (dateParts.length === 1 && !isNaN(parseInt(dateParts[0]))) {
        const year = parseInt(dateParts[0], 10);
        if (year >= 1000 && year <= 9999) {
            return new Date(year, 0, 1); // Si solo se proporciona el año, establecer la fecha al 1 de enero del año
        }
    }

    // Intentar convertir el dato a número (entero o flotante)
    const numero = parseFloat(dato.replace(',', '.')); // Reemplazar comas por puntos para permitir decimales
    if (!isNaN(numero)) {
        // Si es un número entero, devolverlo sin redondeo
        if (Number.isInteger(numero)) {
            return parseInt(dato, 10);
        }
        // Si es un número con decimales, redondearlo al número de decimales presentes en el dato original
        return Number(numero.toFixed(dato.split('.')[1].length));
    }

    // Si no es un número ni una fecha, devolver el dato como cadena
    return dato.trim();
}







