// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtCategoryID = document.querySelector('#txtCategoryID');
const txtCategoryName = document.querySelector('#txtCategoryName');
const txtDescription = document.querySelector('#txtDescription');
const txtUrlImage = document.querySelector('#txtUrlImage');
const btnLoad  = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', function(){
    const archivo = txtUrlImage.files[0];
    const nomarch = archivo.name;
    if(archivo == null){
        alert('Debe seleccionar una imagen');
    }else{
        const metadata = {
            contentType : archivo.type
        }
        const subir = container.child('categories/'+nomarch).put(archivo, metadata);
        subir
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then( url =>{
                db.collection("Categories").add({
                    "CategoryID" : parseInt(txtCategoryID.value),
                    "CategoryName" : txtCategoryName.value,
                    "Description" : txtDescription.value,
                    "urlImage"   : url
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
    txtCategoryID.value = '';
    txtCategoryName.value = '';
    txtDescription.value = '';
    txtUrlImage.value = '';
    txtCategoryID.focus();
}