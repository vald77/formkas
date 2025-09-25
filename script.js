let dataIuran = JSON.parse(localStorage.getItem("dataIuran")) || [];

const form = document.getElementById("iuranForm");
const tabelBody = document.querySelector("#tabelIuran tbody");
const totalKasEl = document.getElementById("totalKas");
const rekapBulanEl = document.getElementById("rekapBulan");
const searchInput = document.getElementById("searchInput");
const cancelEditBtn = document.getElementById("cancelEdit");

function renderTabel() {
  tabelBody.innerHTML = "";
  let total = 0;
  let rekapBulan = {};

  dataIuran.forEach((item, index) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.tanggal}</td>
      <td>${item.nama}</td>
      <td>${item.bulan}</td>
      <td>Rp ${item.jumlah.toLocaleString()}</td>
      <td>${item.status}</td>
      <td>
        <button onclick="editData(${index})">✏️ Edit</button>
        <button onclick="hapusData(${index})">🗑️ Hapus</button>
      </td>
    `;

    tabelBody.appendChild(tr);

    if (item.status === "Sudah Bayar") {
      total += item.jumlah;
      rekapBulan[item.bulan] = (rekapBulan[item.bulan] || 0) + item.jumlah;
    }
  });

  totalKasEl.textContent = total.toLocaleString();

  rekapBulanEl.innerHTML = "";
  for (let bulan in rekapBulan) {
    let li = document.createElement("li");
    li.textContent = `${bulan}: Rp ${rekapBulan[bulan].toLocaleString()}`;
    rekapBulanEl.appendChild(li);
  }

  localStorage.setItem("dataIuran", JSON.stringify(dataIuran));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("nama").value;
  const bulan = document.getElementById("bulan").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const status = document.getElementById("status").value;
  const editIndex = document.getElementById("editIndex").value;

  if (editIndex === "") {
    dataIuran.push({ tanggal, nama, bulan, jumlah, status });
  } else {
    dataIuran[editIndex] = { tanggal, nama, bulan, jumlah, status };
    document.getElementById("formTitle").textContent = "Tambah Data Iuran";
    document.getElementById("submitBtn").textContent = "Tambah Data";
    cancelEditBtn.classList.add("hidden");
  }

  form.reset();
  document.getElementById("editIndex").value = "";
  renderTabel();
});

function editData(index) {
  const item = dataIuran[index];
  document.getElementById("tanggal").value = item.tanggal;
  document.getElementById("nama").value = item.nama;
  document.getElementById("bulan").value = item.bulan;
  document.getElementById("jumlah").value = item.jumlah;
  document.getElementById("status").value = item.status;
  document.getElementById("editIndex").value = index;

  document.getElementById("formTitle").textContent = "Edit Data Iuran";
  document.getElementById("submitBtn").textContent = "Update Data";
  cancelEditBtn.classList.remove("hidden");
}

cancelEditBtn.addEventListener("click", () => {
  form.reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("formTitle").textContent = "Tambah Data Iuran";
  document.getElementById("submitBtn").textContent = "Tambah Data";
  cancelEditBtn.classList.add("hidden");
});

function hapusData(index) {
  if (confirm("Yakin mau hapus data ini?")) {
    dataIuran.splice(index, 1);
    renderTabel();
  }
}

searchInput.addEventListener("keyup", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = tabelBody.querySelectorAll("tr");
  rows.forEach(row => {
    const nama = row.cells[2].textContent.toLowerCase();
    row.style.display = nama.includes(filter) ? "" : "none";
  });
});

renderTabel();

// Navigasi SPA
const navLinks = document.querySelectorAll(".sidebar nav a");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Hilangkan semua halaman
    pages.forEach(page => page.classList.add("hidden"));

    // Hapus active di semua link
    navLinks.forEach(l => l.classList.remove("active"));

    // Tampilkan halaman target
    const target = link.getAttribute("data-target");
    document.getElementById(target).classList.remove("hidden");

    // Tandai link aktif
    link.classList.add("active");
  });
});

// Default tampilkan form
document.querySelector(".sidebar nav a[data-target='form']").classList.add("active");
