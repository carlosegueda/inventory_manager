// URL base del backend
document.addEventListener('DOMContentLoaded', () => {
  actualizarLista();
});

const API_URL = 'http://localhost:3000/productos';

// Función para actualizar y mostrar la lista de productos
async function actualizarLista() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener productos');
    const productos = await res.json();

    const tbody = document.getElementById('tbody-productos');
    tbody.innerHTML = ''; // limpiar tabla

    productos.forEach(prod => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prod.nombre}</td>
        <td>${prod.codigo}</td>
        <td>${prod.cantidad}</td>
        <td>${prod.precio}</td>
        <td>${prod.categoria}</td>
        <td>
          <button onclick="eliminarProducto()">🚮</button>
          <button onclick="editarProducto()">✏️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    alert('No se pudo cargar la lista de productos');
  }
}



// Capturar el submit del formulario para agregar producto
document.getElementById('form-inventario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre-producto').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad-producto').value);
  const precio = parseFloat(document.getElementById('precio-producto').value);
  const categoria = document.getElementById('categoria-producto').value.trim();

  if (!nombre || isNaN(cantidad) || isNaN(precio) || !categoria) {
    alert('Por favor complete todos los campos correctamente');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, cantidad, precio, categoria }),
    });

    if (!res.ok) throw new Error('Error al agregar producto');

    const data = await res.json();
    alert(data.message || 'Producto agregado correctamente');
    e.target.reset();
    actualizarLista();
  } catch (error) {
    console.error('Error al agregar producto:', error);
    alert('No se pudo agregar el producto');
  }
});



// Función para eliminar todos los productos
document.getElementById('eliminar-tabla').addEventListener('click', async () => {
  if (!confirm('¿Seguro que quieres eliminar todos los productos?')) return;

  try {
    const res = await fetch(API_URL, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar productos');
    alert('Productos eliminados');
    actualizarLista();
  } catch (error) {
    console.error('Error al eliminar productos:', error);
    alert('No se pudo eliminar los productos');
  }
});



//codigo para rellenar campos al darle click a una fila de la tabla
document.getElementById('tbody-productos').addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  if (!tr) return;

  const nombre = tr.children[0].textContent;
  const cantidad = tr.children[2].textContent;
  const precio = tr.children[3].textContent;
  const categoria = tr.children[4].textContent;

  document.getElementById('nombre-producto').value = nombre;
  document.getElementById('cantidad-producto').value = cantidad;
  document.getElementById('precio-producto').value = precio;
  document.getElementById('categoria-producto').value = categoria;
});


