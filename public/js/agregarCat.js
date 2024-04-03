// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtCode = document.querySelector('#txtCode');
const txtNombre = document.querySelector('#txtNombre');
const txtDescrip = document.querySelector('#txtDescrip');
const txtArchi = document.querySelector('#txtArchi');
const btnLoad  = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', function(){
    const archivo = txtArchi.files[0];
    const nomarch = archivo.name;
    if(archivo == null){
        alert('Debe seleccionar una imagen');
    }else{
        const metadata = {
            contentType : archivo.type
        }
        const subir = container.child('img/'+nomarch).put(archivo, metadata);
        subir
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then( url =>{
                db.collection("Categorias").add({
                    "Codigo" : txtCode.value,
                    "Nombre" : txtNombre.value,
                    "Descripcion" : txtDescrip.value,
                    "url"   : url
                }).then(function(docRef) {
                    alert("ID del registro: " + docRef.id);
                    limpiar();
                }).catch(function(FirebaseError) {
                    alert("Error al subir la imagen: " + FirebaseError);
                });
            });
    }
});


function limpiar(){
    txtNombre.value = ''
    txtCode.value = '';
    txtDescrip.value = '';
    txtArchi.value = '';
    txtCode.focus();
}