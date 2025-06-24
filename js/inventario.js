// URL base del backend
document.addEventListener("DOMContentLoaded", () => {
  actualizarLista();
});

const API_URL = "http://localhost:3000/productos";

// Función para actualizar y mostrar la lista de productos
async function actualizarLista() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    const productos = await res.json();

    const tbody = document.getElementById("tbody-productos");
    tbody.innerHTML = ""; // limpiar tabla

    productos.forEach((prod) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.nombre}</td>
        <td>${prod.codigo}</td>
        <td>${prod.cantidad}</td>
        <td>${prod.precio}</td>
        <td>${prod.categoria}</td>
        <th>
          <button onclick="eliminarProducto()">❌</button>
          <button onclick="abrirForm()">✏️</button>
        </th>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    mostrarNotificacion("No se pudo cargar la lista de productos");
  }
}

// Capturar el submit del formulario para agregar producto
document
  .getElementById("form-inventario")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre-producto").value.trim();
    const cantidad = parseInt(
      document.getElementById("cantidad-producto").value
    );
    const precio = parseFloat(document.getElementById("precio-producto").value);
    const categoria = document
      .getElementById("categoria-producto")
      .value.trim();

    //VALIDACIONES
    if (!nombre || isNaN(cantidad) || isNaN(precio) || !categoria) {
      mostrarNotificacion("Por favor complete todos los campos correctamente");
      return;
    }

    //validar que el nombre del producto no exista
    const productos = await fetch(API_URL).then((res) => res.json());

    // Verificar si el nombre del producto ya existe (ignorando mayúsculas/minúsculas)
    if (
      productos.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())
    ) {
      mostrarNotificacion("El producto ya existe");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cantidad, precio, categoria }),
      });

      if (!res.ok) throw new Error("Error al agregar producto");

      const data = await res.json();
      mostrarNotificacion(data.message || "Producto agregado correctamente");
      e.target.reset();
      actualizarLista();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      mostrarNotificacion("No se pudo agregar el producto");
    }
  });

// Función para eliminar todos los productos
document
  .getElementById("eliminar-tabla")
  .addEventListener("click", async () => {
    if (!confirm("¿Seguro que quieres eliminar todos los productos?")) return;

    try {
      const res = await fetch(API_URL, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar productos");
      mostrarNotificacion("Productos eliminados");
      actualizarLista();
    } catch (error) {
      console.error("Error al eliminar productos:", error);
      mostrarNotificacion("No se pudo eliminar los productos");
    }
  });

//codigo para rellenar campos al darle click a una fila de la tabla
document.getElementById("tbody-productos").addEventListener("dblclick", (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;

  const nombre = tr.children[0].textContent;
  const cantidad = tr.children[2].textContent;
  const precio = tr.children[3].textContent;
  const categoria = tr.children[4].textContent;

  document.getElementById("nombre-producto").value = nombre;
  document.getElementById("cantidad-producto").value = cantidad;
  document.getElementById("precio-producto").value = precio;
  document.getElementById("categoria-producto").value = categoria;
});

//boton para eliminar un producto
function eliminarProducto() {
  const tr = event.target.closest("tr");
  if (!tr) return;

  const nombre = tr.children[0].textContent;
  if (!confirm(`¿Seguro que quieres eliminar el producto ${nombre}?`)) return;

  const codigo = tr.children[1].textContent;

  fetch(`${API_URL}/${codigo}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar producto");
      mostrarNotificacion("Producto eliminado correctamente");
      actualizarLista();
    })
    .catch((error) => {
      console.error("Error al eliminar producto:", error);
      mostrarNotificacion("No se pudo eliminar el producto");
    });
}

function mostrarNotificacion(mensaje, duracion = 3000) {
  const noti = document.getElementById("notificacion");
  noti.innerText = mensaje;
  noti.style.display = "block";
  noti.style.opacity = "1";

  setTimeout(() => {
    noti.style.opacity = "0";
    setTimeout(() => (noti.style.display = "none"), 500);
  }, duracion);
}

function abrirForm() {
  document.getElementById("miModal").style.display = "flex";

  document
    .getElementById("tbody-productos")
    .addEventListener("click", function (event) {

      const productoEditar = [];

      const tr = event.target.closest("tr");
      if (!tr) return;
      const codigoED = tr.children[1].textContent;
      const nombre = tr.children[0].textContent;
      const cantidad = tr.children[2].textContent;
      const precio = tr.children[3].textContent;
      const categoria = tr.children[4].textContent;
      


      
      document.getElementById("codigo-productoED").textContent = codigoED;
      document.getElementById("nombre-productoED").value = nombre;
      document.getElementById("cantidad-productoED").value = cantidad;
      document.getElementById("precio-productoED").value = precio;
      document.getElementById("categoria-productoED").value = categoria;

      productoEditar.push({
        nombre: nombre,
        cantidad: cantidad,
        precio: precio,
        categoria: categoria,
        codigo: codigoED
      });
      console.log("Producto a editar:", productoEditar);
    });
}

function cerrarForm() {
  document.getElementById("miModal").style.display = "none";
}



document.getElementById("editar-producto").addEventListener("click", async (e) => {
  const productoEditar = {};

  const nombre = document.getElementById("nombre-productoED").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad-productoED").value);
  const precio = parseFloat(document.getElementById("precio-productoED").value);
  const categoria = document.getElementById("categoria-productoED").value.trim();
  const codigo = document.getElementById("codigo-productoED").textContent;


  //VALIDACIONES 
  //*******************************************************************************************
  if (!nombre || isNaN(cantidad) || isNaN(precio) || !categoria ) {
      mostrarNotificacion("Por favor complete todos los campos correctamente");
      return;
    }

  if (cantidad < 0 || precio < 0.01) {
    mostrarNotificacion("La cantidad debe ser mayor o igual a 0 y el precio mayor o igual a 0.01");
    return; }
  
  // validar que cantidad sea entero
  if (!Number.isInteger(cantidad)) {
    mostrarNotificacion("La cantidad debe ser un número entero");
    return;
  }
  //*******************************************************************************************

  productoEditar.nombre = nombre;
  productoEditar.cantidad = cantidad;
  productoEditar.precio = precio;
  productoEditar.categoria = categoria;
  productoEditar.codigo = codigo;

  editarProducto(productoEditar);
  console.log("Producto a editar:", productoEditar);

});

async function editarProducto(objeto) {
  //HACER EL PUT
  try {
      const response = await fetch(`${API_URL}/${objeto.codigo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objeto),
      });
      mostrarNotificacion("Producto Editado correctamente");
      cerrarForm();
      actualizarLista();
      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      mostrarNotificacion("No se pudo actualizar el producto en el inventario");
    }
    cerrarForm();
}
