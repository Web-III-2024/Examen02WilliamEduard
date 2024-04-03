document.querySelector('#btnAbrirFactura').addEventListener('click', function() {
    // Lógica para cargar los datos de la factura
    cargarDatosFactura();

    // Mostrar la modal
    document.querySelector('#modalFactura').style.display = 'block';
});

function cargarDatosFactura() {
    // Obtener datos de la factura (este es solo un ejemplo, necesitarás adaptarlo)
    let datosFactura = obtenerDatosFactura(); // Esta función debería obtener los datos de la factura

    // Generar el HTML para la tabla
    let filasTabla = '';
    let total = 0;
    datosFactura.forEach(item => {
        let subtotal = item.cantidad * item.precioUnitario - item.descuento;
        total += subtotal;
        filasTabla += `<tr>
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precioUnitario.toFixed(2)}</td>
            <td>${item.descuento.toFixed(2)}</td>
            <td>${subtotal.toFixed(2)}</td>
        </tr>`;
    });

    // Insertar filas en la tabla
    document.querySelector('#tablaFactura tbody').innerHTML = filasTabla;
    // Mostrar total en el pie de la tabla
    document.querySelector('#sumaTotales').textContent = total.toFixed(2);
}
