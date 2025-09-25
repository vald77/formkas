let dataIuran = [];
let totalKas = 0;
let rekapPerBulan = {};

const form = document.getElementById("iuranForm");
const tabel = document.querySelector("#tabelIuran tbody");
const totalKasEl = document.getElementById("totalKas");
const rekapBulanEl = document.getElementById("rekapBulan");
const searchInput = document.getElementById("searchInput");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEdit = document.getElementById("cancelEdit");
let editIndex = null;

// Submit Form
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("nama").value;
  const bulan = document.getElementById("bulan").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const status = document.getElementById("status").value;

  if (editIndex !== null) {
    // Mode edit
    dataIuran[editIndex] = { tanggal, nama, bulan, jumlah, status };
    resetForm();
  } else {
    // Mode tambah
    dataIuran.push({ tanggal, nama, bulan, jumlah, status });
  }

  updateData();
  form.reset();
});

// Render tabel
function renderTable(filteredData = null) {
  const dataToRender = filteredData || dataIuran;
  tabel.innerHTML = "";

  dataToRender.forEach((item, index) => {
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
        <td>
          <button class="table-btn btn-edit" onclick="editData(${index})">Edit</button>
          <button class="table-btn btn-delete" onclick="deleteData(${index})">Hapus</button>
        </td>
      </tr>
    `;
    tabel.innerHTML += row;
  });
}

// Update data (total kas + rekap)
function updateData() {
  totalKas = 0;
  rekapPerBulan = {};

  dataIuran.forEach(item => {
    if (item.status === "Sudah Bayar") {
      totalKas += item.jumlah;
      if (!rekapPerBulan[item.bulan]) rekapPerBulan[item.bulan] = 0;
      rekapPerBulan[item.bulan] += item.jumlah;
    }
  });

  renderTable();
  renderRekap();
  totalKasEl.textContent = totalKas.toLocaleString("id-ID");
}

// Render rekap per bulan
function renderRekap() {
  rekapBulanEl.innerHTML = "";
  for (const bulan in rekapPerBulan) {
    rekapBulanEl.innerHTML += `
      <li><b>${bulan}</b>: Rp ${rekapPerBulan[bulan].toLocaleString("id-ID")}</li>
    `;
  }
}

// Edit data
function editData(index) {
  const item = dataIuran[index];
  document.getElementById("tanggal").value = item.tanggal;
  document.getElementById("nama").value = item.nama;
  document.getElementById("bulan").value = item.bulan;
  document.getElementById("jumlah").value = item.jumlah;
  document.getElementById("status").value = item.status;

  editIndex = index;
  formTitle.textContent = "✏️ Edit Data Iuran";
  submitBtn.textContent = "Simpan Perubahan";
  cancelEdit.classList.remove("hidden");
}

// Cancel edit
cancelEdit.addEventListener("click", resetForm);

function resetForm() {
  editIndex = null;
  formTitle.textContent = "Tambah Data Iuran";
  submitBtn.textContent = "Tambah Data";
  cancelEdit.classList.add("hidden");
  form.reset();
}

// Hapus data
function deleteData(index) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    dataIuran.splice(index, 1);
    updateData();
  }
}

// Pencarian
searchInput.addEventListener("input", function() {
  const keyword = this.value.toLowerCase();
  const filtered = dataIuran.filter(item => 
    item.nama.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
});

// Export CSV
function exportCSV() {
  let csv = "Tanggal,Nama,Bulan,Jumlah,Status\n";
  dataIuran.forEach(item => {
    csv += `${item.tanggal},${item.nama},${item.bulan},${item.jumlah},${item.status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data_kas.csv";
  link.click();
}
