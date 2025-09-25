let dataIuran = [];
let totalKas = 0;

const form = document.getElementById("iuranForm");
const tabel = document.querySelector("#tabelIuran tbody");
const totalKasEl = document.getElementById("totalKas");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Ambil data dari form
  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("nama").value;
  const bulan = document.getElementById("bulan").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const status = document.getElementById("status").value;

  // Simpan ke array
  dataIuran.push({ tanggal, nama, bulan, jumlah, status });

  // Kalau status "Sudah Bayar", tambahkan ke total kas
  if (status === "Sudah Bayar") {
    totalKas += jumlah;
  }

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
        <td>${item.jumlah.toLocaleString("id-ID")}</td>
        <td class="${item.status === 'Sudah Bayar' ? 'status-sudah' : 'status-belum'}">
          ${item.status}
        </td>
      </tr>
    `;
    tabel.innerHTML += row;
  });

  totalKasEl.textContent = totalKas.toLocaleString("id-ID");
}
