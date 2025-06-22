document.addEventListener('DOMContentLoaded', () => {
    actualizarElementos();

});

const API_URL = 'http://localhost:3000/productos';
const BtnAgregarAFactura = document.getElementById("buscar-precio");
const precioUnitario = document.getElementById("precio-unitario");
const datalist = document.getElementById("lista-nombres");

let miProducto = null
let Subtotal = null


async function actualizarElementos() {
    //ACTUALIZAR EL NOMBRE
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error al obtener nombres');
        const productos = await res.json();
        console.log(productos);
        const nombres = productos.map(obj => Object.values(obj)[0]);
        nombres.forEach(nombre => {
            const option = document.createElement('option');
            option.value = nombre;
            datalist.append(option);

        });

        //ACTUALIZAR EL PRECIO UNITARIO
        const inputs = [
            document.getElementById("nombre-factura"),
            document.getElementById("cantidad-factura")
        ];

        const inputNombre = document.getElementById("nombre-factura")


        inputs.forEach(input => {
            input.addEventListener("input", function () {

                const nombreFactura = inputNombre.value.trim().toLowerCase();
                miProducto = productos.find(p => p.nombre.toLowerCase() === nombreFactura);

                if (miProducto) {
                    console.log("producto encontrado", miProducto);
                    document.getElementById("precio-unitario").textContent = `Precio Unitario: $${miProducto.precio}`;
                }
                else {
                    console.log("producto no encontrado");
                    document.getElementById("precio-unitario").textContent = `Precio Unitario: $00.00 `;
                }
                const precioSubtotal = document.getElementById("precio-subtotal");
                const inputCantidad = document.getElementById("cantidad-factura").value
                Subtotal = miProducto.precio * inputCantidad;
                precioSubtotal.textContent = `Precio Subtotal: $${Subtotal}`;

            });
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        alert('No se pudo cargar la lista de productos');
    }
};






document.getElementById('form-factura').addEventListener('submit', async (e) => {
    e.preventDefault();


    console.log(miProducto)

    const nombreProducto = document.getElementById('nombre-factura').value.trim();
    const cantidadProducto = parseInt(document.getElementById('cantidad-factura').value);
    const clienteFactura = document.getElementById("cliente-factura").value.trim();

    if (!nombreProducto || isNaN(cantidadProducto) || !clienteFactura) {
        alert('Por favor complete todos los campos correctamente');
        return;
    }



    try {
        document.getElementById("cliente-factura").readOnly = true;
        const tbody = document.getElementById("tbody-factura");
        const cantidad = document.getElementById("cantidad-factura").value;

        const tr = document.createElement('tr');
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
    }
    catch (error) {
        console.error('Error al cargar productos:', error);
        alert('El producto no existe en el inventario. Ingrese el nombre de un producto existente');
    }
});


function actualizarTotalFactura() {
    let total = 0;
    const filas = document.querySelectorAll("#tbody-factura tr");

    filas.forEach(fila => {
        const celdaSubtotal = fila.querySelector("td:last-child"); // última celda = subtotal
        const texto = celdaSubtotal.textContent.replace("$", "").trim();
        const valor = parseFloat(texto);
        if (!isNaN(valor)) {
            total += valor;
        }
    });


    document.getElementById("subtotal").textContent = `$${total.toFixed(2)}`;
    document.getElementById("isv").textContent = `$${(total.toFixed(2) * 0.15).toFixed(2)}`;
    document.getElementById("total-pagar").textContent = `$${(total.toFixed(2) * 1.15).toFixed(2)}`;
};


document.getElementById("generar-factura").addEventListener("click", () => {

    const valor = document.getElementById("cliente-factura").value.trim();

    if (!valor) {
      alert("El cliente es obligatorio.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    doc.setFontSize(19);

    cliente = document.getElementById("cliente-factura").value;
    doc.text("Factura", 25, 25)
    doc.text("Cliente: " + cliente, 25, 35)


    doc.autoTable({
        html: '#tabla-factura', // O usa "head" y "body" manualmente
        startY: 40,
        theme: 'grid', // Otros: 'striped', 'plain'

        styles: {
            font: 'helvetica',
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
            fontStyle: 'bold',
            halign: 'center',
        },

        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            halign: 'left',
        },

        alternateRowStyles: {
            fillColor: [255, 255, 255],
        },

        columnStyles: {
            0: { cellWidth: 50 },   // Producto
            1: { halign: 'center' }, // Cantidad
            2: { halign: 'right' },  // Precio
            3: { halign: 'right' },  // Total
        },

        

        margin: { top: 25 },
    });

   
    doc.save("Factura.pdf");
});






