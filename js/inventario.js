document.addEventListener("DOMContentLoaded", function () {

    // Carga productos guardados o inicia con arreglo vacío
    let productos = [];

    const datosGuardados = localStorage.getItem('inventario');
    if (datosGuardados) {
        productos = JSON.parse(datosGuardados);
    }

    const formulario = document.getElementById("form-inventario");
    const BtnEliminarTodo = document.getElementById("eliminar-tabla");

    // Mostrar lista cargada de localStorage al inicio
    actualizarLista();

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre-producto").value;
        const codigo = document.getElementById("codigo-producto").value;
        const precio = parseFloat(document.getElementById("precio-producto").value);
        const cantidad = parseInt(document.getElementById("cantidad-producto").value);
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

        // Guardar productos actualizados en localStorage
        localStorage.setItem('inventario', JSON.stringify(productos));

        actualizarLista();

        formulario.reset();

        console.log(producto);
    });

    BtnEliminarTodo.addEventListener("click", function () {

        event.preventDefault();
        productos.length = 0;
        // Actualizar localStorage al borrar todo
        localStorage.setItem('inventario', JSON.stringify(productos));

        document.getElementById("nombre-producto").value = "";
        document.getElementById("codigo-producto").value = "";
        document.getElementById("precio-producto").value = "";
        document.getElementById("cantidad-producto").value = "";
        document.getElementById("categoria-producto").value = "";

        actualizarLista();
    });

    function actualizarLista() {
        const tbody = document.getElementById("tbody-productos");
        tbody.innerHTML = ""; // Vaciar filas anteriores

        productos.forEach(function (producto) {
            const fila = document.createElement("tr");

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
