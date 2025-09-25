let dataIuran = [];
let total = 0;

const form = document.getElementById("iuranForm");
const tabel = document.querySelector("#tabelIuran tbody");
const totalSpan = document.getElementById("total");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Ambil data input
  const nama = document.getElementById("nama").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const tanggal = new Date().toLocaleDateString("id-ID");

  // Tambahkan ke array
  dataIuran.push({ nama, jumlah, tanggal });

  // Update total
  total += jumlah;

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
        <td>${item.nama}</td>
        <td>${item.jumlah.toLocaleString("id-ID")}</td>
        <td>${item.tanggal}</td>
      </tr>
    `;
    tabel.innerHTML += row;
  });
  totalSpan.textContent = total.toLocaleString("id-ID");
}
