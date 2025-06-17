document.addEventListener("DOMContentLoaded", function () {
    llenarDatalist();
    const inputs = [
        document.getElementById("nombre-factura"),
        document.getElementById("cantidad-factura")
    ];

    inputs.forEach(input => {
        input.addEventListener("input", function () {

            const nombreBuscado = document.getElementById("nombre-factura").value.trim().toLowerCase();

            const productosGuardados = JSON.parse(localStorage.getItem("inventario")) || [];

            const producto = productosGuardados.find(p => p.nombre.toLowerCase() === nombreBuscado);

            const precioUnitarioLabel = document.getElementById("precio-unitario");
            const cantidadFactura = parseInt(document.getElementById("cantidad-factura").value) || 0;
            const precioSubtotalLabel = document.getElementById("precio-subtotal");

            if (producto) {
                precioUnitarioLabel.textContent = `${producto.precio.toFixed(2)}`;
                const subtotal = producto.precio * cantidadFactura;
                precioSubtotalLabel.textContent = `${subtotal.toFixed(2)}`;
            } else {
                precioUnitarioLabel.textContent = "";
                precioSubtotalLabel.textContent = "";
            }
        });
    });

    let productosFactura = [];

    const guardados = JSON.parse(localStorage.getItem("factura"));
    if (guardados && Array.isArray(guardados)) {
        productosFactura = guardados;
        actualizarLista(); // Mostrar la lista al cargar
    }

    const formulario = document.getElementById("form-factura");

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre-factura").value.trim().toLowerCase();
        const precioUnitario = parseFloat(document.getElementById("precio-unitario").textContent) || 0;
        const cantidad = parseInt(document.getElementById("cantidad-factura").value) || 0;
        const precioSubtotal = parseFloat(document.getElementById("precio-subtotal").textContent) || 0;

        const productoFactura = {
            nombre,
            precioUnitario,
            cantidad,
            precioSubtotal
        };

        productosFactura.push(productoFactura);
        localStorage.setItem('factura', JSON.stringify(productosFactura));

        actualizarLista();
        actualizarSubtotalTotal();
        formulario.reset();





    });
    const BtnEliminarTodo = document.getElementById("eliminar-factura");
    BtnEliminarTodo.addEventListener("click", function () {

        event.preventDefault();
        productosFactura.length = 0;
        // Actualizar localStorage al borrar todo
        localStorage.setItem('factura', JSON.stringify(productosFactura));

        formulario.reset();

        actualizarLista();
    });

    function actualizarSubtotalTotal() {
        const tbody = document.getElementById("tbody-productos");
        let suma = 0;

        // Recorremos todas las filas del tbody
        Array.from(tbody.rows).forEach(fila => {
            // Obtenemos el texto del td en la columna subtotal (índice 3)
            let texto = fila.cells[3].textContent;

            // Quitamos el símbolo $ y convertimos a número
            let valor = parseFloat(texto.replace("$", ""));

            if (!isNaN(valor)) {
                suma += valor;
            }
        });

        // Actualizamos la celda del total
        const celdaTotal = document.getElementById("subtotal");
        celdaTotal.textContent = `$${suma.toFixed(2)}`;
    }


    function actualizarLista() {
        const tbody = document.getElementById("tbody-productos");
        tbody.innerHTML = "";

        productosFactura.forEach(function (productoFactura) {
            const fila = document.createElement("tr");

            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = productoFactura.nombre;
            fila.appendChild(celdaNombre);

            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = productoFactura.cantidad;
            fila.appendChild(celdaCantidad);

            const celdaPrecioU = document.createElement("td");
            celdaPrecioU.textContent = `$${productoFactura.precioUnitario.toFixed(2)}`;
            fila.appendChild(celdaPrecioU);

            const celdaPrecioS = document.createElement("td");
            celdaPrecioS.textContent = `$${productoFactura.precioSubtotal.toFixed(2)}`;
            fila.appendChild(celdaPrecioS);

            tbody.appendChild(fila);
        });
    }

    function llenarDatalist() {
        const datalist = document.getElementById("lista-nombres");
        datalist.innerHTML = ""; // Limpia opciones anteriores

        const productos = JSON.parse(localStorage.getItem("inventario")) || [];

        productos.forEach(producto => {
            const option = document.createElement("option");
            option.value = producto.nombre;
            datalist.appendChild(option);
        });
    }

});
