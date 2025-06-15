document.addEventListener("DOMContentLoaded", function () {

    const productos = []

    const formulario = document.getElementById("form-inventario");
    const BtnEliminarTodo = document.getElementById("eliminar-tabla")

    formulario.addEventListener("submit", function (event) {
        event.preventDefault()

        const nombre = document.getElementById("nombre-producto").value;
        const codigo = document.getElementById("codigo-producto").value;
        const precio = parseFloat(document.getElementById("precio-producto").value);
        const cantidad = parseInt(document.getElementById("precio-producto").value);
        const categoria = document.getElementById("categoria-producto").value;

        const producto = {
            id: Date.now(),
            nombre: nombre,
            codigo: codigo,
            precio: precio,
            cantidad: cantidad,
            categoria: categoria
        };
        productos.push(producto);
        actualizarLista();

        formulario.reset();

        console.log(producto);
    });

    
    BtnEliminarTodo.addEventListener("click", function () {
        productos.length = 0;
        actualizarLista();
    });









    function actualizarLista() {

        const tbody = document.getElementById("tbody-productos");
        tbody.innerHTML = ""; // Vaciar filas anteriores

        productos.forEach(function (producto) {
            const fila = document.createElement("tr");

            // Crear y agregar cada celda (<td>)
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = producto.nombre;
            fila.appendChild(celdaNombre);

            const celdaCodigo = document.createElement("td");
            celdaCodigo.textContent = producto.codigo;
            fila.appendChild(celdaCodigo);

            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = producto.cantidad;
            fila.appendChild(celdaCantidad);

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = `$${producto.precio.toFixed(2)}`;
            fila.appendChild(celdaPrecio);

            const celdaCategoria = document.createElement("td");
            celdaCategoria.textContent = producto.categoria;
            fila.appendChild(celdaCategoria);

            tbody.appendChild(fila);
        });
    }


});

