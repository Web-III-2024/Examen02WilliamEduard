var db = firebase.firestore();
const cuerpoTabla = document.querySelector('#tablaFact tbody');

function convertirAnioAFecha(anio) {
  return anio && !isNaN(anio) ? new Date(anio, 0, 1).toLocaleDateString() : 'Fecha no disponible';
}

function calcularDescuento(precioUnitario) {
  let porcentajeDescuento = 0.10; // Ejemplo: un 10% de descuento
  return precioUnitario * porcentajeDescuento;
}

db.collection("Orders").get().then((query) => {
  let salida = "";

  query.forEach((doc) => {
    var datos = doc.data();
    let unitPrice = datos.UnitPrice ? datos.UnitPrice : 0; // Asumiendo que existe UnitPrice
    let descuento = calcularDescuento(unitPrice);
    let total = unitPrice - descuento;

    salida += `<tr>`;
    salida += `<td>${datos.CustomerID}</td>`;
    salida += `<td>${datos.EmployeeID}</td>`;
    salida += `<td>${datos.Freight}</td>`;
    salida += `<td>${convertirAnioAFecha(datos.OrderDate)}</td>`;
    salida += `<td>${datos.OrderID}</td>`;
    salida += `<td>${convertirAnioAFecha(datos.RequiredDate)}</td>`;
    salida += `<td>${datos.ShipAddress}</td>`;
    salida += `<td>${datos.ShipCity}</td>`;
    salida += `<td>${datos.ShipCountry}</td>`;
    salida += `<td>${datos.ShipName}</td>`;
    salida += `<td>${datos.ShipPostalCode || "N/A"}</td>`;
    salida += `<td>${datos.ShipRegion || "N/A"}</td>`;
    salida += `<td>${datos.ShipVia}</td>`;
    salida += `<td>${convertirAnioAFecha(datos.ShippedDate)}</td>`;        
    salida += `<td>${unitPrice.toFixed(2)}</td>`;
    salida += `<td>${descuento.toFixed(2)}</td>`;
    salida += `<td>${total.toFixed(2)}</td>`;
    salida += `<td><button class="btnVerFactura" data-order-id="${datos.OrderID}">Ver Factura</button></td>`;
    salida += `</tr>`;
  });

  cuerpoTabla.innerHTML = salida;
  asignarEventosVerFactura();
}).catch((error) => {
  console.error("Error al obtener los documentos: ", error);
});
function asignarEventosVerFactura() {
    document.querySelectorAll('.btnVerFactura').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Recuperamos el orderId como string del atributo data-order-id
        let orderIdString = e.target.getAttribute('data-order-id');
        
        // Convertimos el orderId a número
        let orderIdNumerico = parseInt(orderIdString, 10);
        
        // Verificamos que la conversión es válida
        if (!isNaN(orderIdNumerico)) {
          obtenerYMostrarDatosFactura(orderIdNumerico);
        } else {
          console.error('El ID de la orden no es un número válido.');
        }
      });
    });
  }
  
function obtenerYMostrarDatosFactura(orderId) {
    db.collection("Orders").where("OrderID", "==", orderId).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Suponiendo que solo hay un documento con este OrderID
        mostrarFactura(querySnapshot.docs[0].data());
      } else {
        console.log("No se encontró la orden con OrderID:", orderId);
      }
    }).catch((error) => {
      console.error("Error al obtener la factura: ", error);
    });
  }
  
  function mostrarFactura(datos) {
    let modalBody = document.querySelector('#modalFactura .modal-body');
    
    if (modalBody) {
      // Asegúrate de que todos estos campos existen en tus datos de Firebase
      let contenido = `
        <div>
          <h1>Factura #${datos.OrderID || ''}</h1>
          <div><strong>Cliente:</strong> ${datos.CustomerID || ''}</div>
          <div><strong>Contacto:</strong> ${datos.ContactName || 'No disponible'} - ${datos.ContactTitle || ''}</div>
          <div><strong>Destino:</strong> ${datos.ShipAddress || ''}, ${datos.ShipCity || ''}, ${datos.ShipPostalCode || ''}, ${datos.ShipCountry || ''}</div>
          <div><strong>Facturada:</strong> ${convertirAnioAFecha(datos.OrderDate) || ''}</div>
          <div><strong>Requerida:</strong> ${convertirAnioAFecha(datos.RequiredDate) || ''}</div>
          <div><strong>Despachada:</strong> ${convertirAnioAFecha(datos.ShippedDate) || ''}</div>
          <div><strong>Empleado:</strong> ${datos.EmployeeName || 'No disponible'}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio Uni</th>
              <th>Descuento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <!-- Aquí insertarías dinámicamente los artículos de la factura -->
          </tbody>
        </table>
        <div><strong>Total Suma totales:</strong> ${datos.Total || '0'}</div>
      `;
      
      modalBody.innerHTML = contenido;
      document.querySelector('#modalFactura').style.display = 'block';
    } else {
      console.error('No se encontraron los elementos de la modal en el documento.');
    }
  }
  
  
  

// Asegúrate de agregar la función para cerrar la modal
function cerrarModal() {
    let modal = document.querySelector('#modalFactura');
    if (modal) {
        modal.style.display = 'none';
    }
}


// Ejemplo simple para abrir la modal
function abrirModalFactura() {
  document.querySelector('#modalFactura').style.display = 'block';
}
