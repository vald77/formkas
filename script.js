let dataIuran = [];

const form = document.getElementById("iuranForm");
const tabel = document.querySelector("#tabelIuran tbody");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Ambil data dari form
  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("nama").value;
  const bulan = document.getElementById("bulan").value;
  const status = document.getElementById("status").value;

  // Simpan ke array
  dataIuran.push({ tanggal, nama, bulan, status });

  // Update tabel
  renderTable();

  // Reset form
  form.reset();
});

function renderTable() {
  tabel.innerHTML = "";
  dataIuran.forEach((item, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${item.tanggal}</td>
        <td>${item.nama}</td>
        <td>${item.bulan}</td>
        <td class="${item.status === 'Sudah Bayar' ? 'status-sudah' : 'status-belum'}">
          ${item.status}
        </td>
      </tr>
    `;
    tabel.innerHTML += row;
  });
}
