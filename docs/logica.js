
const apiUrl = 'http://localhost:3000/api/pagos';
let pagos = [];

async function cargarPagos() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      pagos = data;
      mostrarTabla(pagos);
      actualizarEstadisticas(pagos);
    } else {
      console.error('Error al obtener los pagos:', data);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}

async function cargarCartera() {
  try {
    const response = await fetch(`${apiUrl}/cartera`);
    const totalCartera = await response.json();
    if (response.ok) {
      document.getElementById('totalCartera').textContent = `$${totalCartera}`;
    } else {
      console.error('Error al obtener los pagos:', data);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}

async function obtenerCumplimiento() {
const response = await fetch(`${apiUrl}/cumplimiento`);
const datos = await response.json();
return datos;
}


function mostrarTabla(pagosFiltrados) {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  pagosFiltrados.forEach((pago) => {
    const tr = document.createElement('tr');
    tr.classList.add('border-b', 'hover:bg-gray-50');
    tr.innerHTML = `
      <td class="px-4 py-2">${pago.id}</td>
      <td class="px-4 py-2">${pago.nombre}</td>
      <td class="px-4 py-2">${pago.cuota}</td>
      <td class="px-4 py-2">${pago.estado}</td>
      <td class="px-4 py-2">${pago.fecha_pago}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function actualizarEstadisticas(pagos) {
  const totalPagos = pagos.length;
  const pagosATiempo = pagos.filter(pago => pago.estado.toLowerCase() === 'a tiempo').length;
  const pagosRetrasados = pagos.filter(pago => pago.estado.toLowerCase() === 'retrasado').length;
  const pagosAnticipados = pagos.filter(pago => pago.estado.toLowerCase() === 'anticipado').length;


  document.getElementById('totalPagos').textContent = totalPagos;
  document.getElementById('pagosATiempo').textContent = pagosATiempo;
  document.getElementById('pagosRetrasados').textContent = pagosRetrasados;
  document.getElementById('pagosAnticipados').textContent = pagosAnticipados;
}

document.getElementById('searchInput').addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase();
  const pagosFiltrados = pagos.filter(pago =>
    pago.nombre.toLowerCase().includes(query) ||
    pago.estado.toLowerCase().includes(query)
  );
  mostrarTabla(pagosFiltrados);
});


cargarCartera();
window.onload = cargarPagos;






const apiUrlCumplimiento = 'http://localhost:3000/api/pagos/cumplimiento';

// Fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(apiUrlCumplimiento);
    const data = await response.json();

    document.getElementById('clienteCumplidoNombre').textContent = data.clienteMasCumplido.nombre;
    document.getElementById('clienteIncumplidoNombre').textContent = data.clienteMasIncumplido.nombre;

    window.clientes = data; // Store data globally for modal use
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Open modal and populate data
function openModal(type) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  if (type === 'cumplido') {
    modalTitle.textContent = 'Cliente Más Cumplido';
    modalContent.innerHTML = `
      <p><strong>Nombre:</strong> ${window.clientes.clienteMasCumplido.nombre}</p>
      <p><strong>Cumplido:</strong> ${window.clientes.clienteMasCumplido.cumplido}</p>
      <p><strong>Incumplido:</strong> ${window.clientes.clienteMasCumplido.incumplido}</p>
    `;
  } else if (type === 'incumplido') {
    modalTitle.textContent = 'Cliente Más Incumplido';
    modalContent.innerHTML = `
      <p><strong>Nombre:</strong> ${window.clientes.clienteMasIncumplido.nombre}</p>
      <p><strong>Cumplido:</strong> ${window.clientes.clienteMasIncumplido.cumplido}</p>
      <p><strong>Incumplido:</strong> ${window.clientes.clienteMasIncumplido.incumplido}</p>
    `;
  }

  modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}

// Initialize
fetchData();