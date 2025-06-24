document.addEventListener("DOMContentLoaded", () => {
  actualizarElementos();
});

const API_URL = "http://localhost:3000/productos";
const BtnAgregarAFactura = document.getElementById("buscar-precio");
const precioUnitario = document.getElementById("precio-unitario");
const datalist = document.getElementById("lista-nombres");

//VARIABLES GLOBALES
let miProducto = null;
let Subtotal = null;
let codigosProductosFactura = [];
let productos = null;

//FUNCION ASYNC PARA ACTUALIZAR EL PRECIO UNITARIO, NOMBRES DEL DATALIST, PRECIO SUBTOTAL
//CON CADA INPUT DEL NOMBRE DEL PRODUCTO Y CANTIDAD
//Obtiene los nombres de los productos y los agrega al datalist
async function actualizarElementos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener nombres");
    productos = await res.json();

    const nombres = productos.map((obj) => Object.values(obj)[0]);
    nombres.forEach((nombre) => {
      const option = document.createElement("option");
      option.value = nombre;
      datalist.append(option);
    });

    //ACTUALIZAR EL PRECIO UNITARIO
    const inputs = [
      document.getElementById("nombre-factura"),
      document.getElementById("cantidad-factura"),
    ];

    const inputNombre = document.getElementById("nombre-factura");

    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        const nombreFactura = inputNombre.value.trim().toLowerCase();
        miProducto = productos.find(
          (p) => p.nombre.toLowerCase() === nombreFactura
        );

        if (miProducto) {
          console.log("producto encontrado", miProducto);
          document.getElementById(
            "precio-unitario"
          ).textContent = `Precio Unitario: $${miProducto.precio}`;
          document.getElementById("stock-disponible").textContent = `Stock Disponible: ${miProducto.cantidad}`;
          const precioSubtotal = document.getElementById("precio-subtotal");
          const inputCantidad =
            document.getElementById("cantidad-factura").value;
          Subtotal = miProducto.precio * inputCantidad;
          precioSubtotal.textContent = `Precio Subtotal: $${Subtotal}`;
        } else {
          console.log("producto no encontrado");
          document.getElementById("form-factura").disable = true;
          document.getElementById("stock-disponible").textContent = `Stock Disponible: 0`;
          document.getElementById("precio-subtotal").textContent = `Precio Subtotal: $00.00`;
          document.getElementById(
            "precio-unitario"
          ).textContent = `Precio Unitario: $00.00 `;
        }
      });
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    mostrarNotificacion("No se pudo cargar la lista de productos");
  }
}

//BOTON AGREGAR A FACTURA
document
  .getElementById("form-factura")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(miProducto);
    const nombreProducto = document
      .getElementById("nombre-factura")
      .value.trim();
    const cantidadProducto = parseInt(
      document.getElementById("cantidad-factura").value
    );
    const clienteFactura = document
      .getElementById("cliente-factura")
      .value.trim();

    if (!nombreProducto || isNaN(cantidadProducto) || !clienteFactura) {
      mostrarNotificacion("Por favor complete todos los campos correctamente");
      return;
    }

    const nombreFactura = document
      .getElementById("nombre-factura")
      .value.trim()
      .toLowerCase();
    miProducto = productos.find(
      (p) => p.nombre.toLowerCase() === nombreFactura
    );

    //Validar que el nombre exista en el inventario
    if (!miProducto) {
      mostrarNotificacion("El producto seleccionado no existe");
      return;
    }

    //validar que la cantidad del producto de la factura sea menor o igual a la cantidad del producto en el inventario
    if (miProducto.cantidad < cantidadProducto && miProducto.cantidad > 0) {
      mostrarNotificacion(
        `No hay suficiente stock disponible.`
      ); 
      return;
    } else if (miProducto.cantidad === 0) {
      mostrarNotificacion(
        `El producto ${miProducto.nombre} no está disponible en el inventario`
      );
      return;
    } else {
      cantidadRestada = miProducto.cantidad - cantidadProducto;
      codigosProductosFactura.push({
        nombre: miProducto.nombre,
        codigo: miProducto.codigo,
        precio: miProducto.precio,
        cantidad: cantidadRestada,
        categoria: miProducto.categoria,
      });
      console.log(
        "codigos de productos en la factura:",
        codigosProductosFactura
      );

      try {
        const response = await fetch(`${API_URL}/${miProducto.codigo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(miProducto),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el producto");
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        mostrarNotificacion(
          "No se pudo actualizar el producto en el inventario"
        );
        return;
      }
    }

    try {
      document.getElementById("cliente-factura").readOnly = true;
      const tbody = document.getElementById("tbody-factura");
      const cantidad = document.getElementById("cantidad-factura").value;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${miProducto.nombre}</td>
        <td>${cantidad}</td>
        <td>$${miProducto.precio}</td>
        <td>$${Subtotal}</td>
      `;
      tbody.appendChild(tr);
      actualizarTotalFactura();
      document.getElementById("nombre-factura").value = "";
      document.getElementById("cantidad-factura").value = "";
      document.getElementById("precio-unitario").textContent = "$00.00";
      document.getElementById("precio-subtotal").textContent = "$00.00";
    } catch (error) {
      console.error("Error al cargar productos:", error);
      mostrarNotificacion(
        "El producto no existe en el inventario. Ingrese el nombre de un producto existente"
      );
    }
  });

//FUNCION ACTUALIZAR TOTAL DE FACTURA
// Esta función se encarga de calcular el Subtotal, ISV y Total a pagar de los productos en la factura
function actualizarTotalFactura() {
  let total = 0;
  const filas = document.querySelectorAll("#tbody-factura tr");
  filas.forEach((fila) => {
    const celdaSubtotal = fila.querySelector("td:last-child"); // última celda = subtotal
    const texto = celdaSubtotal.textContent.replace("$", "").trim();
    const valor = parseFloat(texto);
    if (!isNaN(valor)) {
      total += valor;
    }
  });
  document.getElementById("subtotal").textContent = `$${total.toFixed(2)}`;
  document.getElementById("isv").textContent = `$${(
    total.toFixed(2) * 0.15
  ).toFixed(2)}`;
  document.getElementById("total-pagar").textContent = `$${(
    total.toFixed(2) * 1.15
  ).toFixed(2)}`;
}

//BOTON GENERAR FACTURA
//Valida que los campos esten completos. Actualiza el inventario.
document.getElementById("generar-factura").addEventListener("click", () => {
  const valor = document.getElementById("cliente-factura").value.trim();
  if (!valor) {
    mostrarNotificacion("El cliente es obligatorio.");
    return;
  }
  //Ciclo para enviar cada producto de la factura en PUT
  codigosProductosFactura.forEach(async (producto) => {
    try {
      const response = await fetch(`${API_URL}/${producto.codigo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });
      mostrarNotificacion("Factura generada, gracias por comprar");
      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      mostrarNotificacion("No se pudo actualizar el producto en el inventario");
    }
  });

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(19);
  cliente = document.getElementById("cliente-factura").value;
  doc.text("Factura", 25, 25);
  doc.text("Cliente: " + cliente, 25, 35);
  doc.autoTable({
    html: "#tabla-factura", // O usa "head" y "body" manualmente
    startY: 40,
    theme: "grid", // Otros: 'striped', 'plain'
    styles: {
      font: "helvetica",
      fontSize: 12,
      textColor: [0, 0, 0],
      lineColor: [100, 100, 100],
      fillColor: [255, 255, 255],
      lineWidth: 0.2,
      cellPadding: 2,
    },

    headStyles: {
      fillColor: [220, 220, 220], // azul
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
    },

    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      halign: "left",
    },

    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },

    columnStyles: {
      0: { cellWidth: 50 }, // Producto
      1: { halign: "center" }, // Cantidad
      2: { halign: "right" }, // Precio
      3: { halign: "right" }, // Total
    },

    margin: { top: 25 },
  });
  //Guarda la factura como PDF
  doc.save("Factura.pdf");
});

//Funcion generica para mostrar notificaciones
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
}


function cerrarForm() {
  document.getElementById("miModal").style.display = "none";
}

