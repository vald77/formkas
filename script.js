// Data Iuran
let dataIuran = JSON.parse(localStorage.getItem("kasData")) || [];

// Elemen
const form = document.getElementById("iuranForm");
const tabelBody = document.querySelector("#tabelIuran tbody");
const totalKas = document.getElementById("totalKas");
const rekapChartCtx = document.getElementById("rekapChart").getContext("2d");
const searchInput = document.getElementById("searchInput");

let chart;

// Render Tabel
function renderTabel(filter = "") {
  tabelBody.innerHTML = "";
  dataIuran
    .filter(d => d.nama.toLowerCase().includes(filter.toLowerCase()))
    .forEach((item, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${item.tanggal}</td>
          <td>${item.nama}</td>
          <td>${item.bulan}</td>
          <td>${item.jumlah}</td>
          <td>${item.status}</td>
          <td>
            <button onclick="editData(${index})" class="btn secondary">✏️</button>
            <button onclick="hapusData(${index})" class="btn danger">🗑</button>
          </td>
        </tr>`;
      tabelBody.innerHTML += row;
    });
  simpanData();
  renderRekap();
}

// Render Rekap
function renderRekap() {
  let total = dataIuran
    .filter(d => d.status === "Sudah Bayar")
    .reduce((sum, d) => sum + parseInt(d.jumlah), 0);
  totalKas.textContent = total.toLocaleString();

  let bulanData = Array(12).fill(0);
  dataIuran.forEach(d => {
    if (d.status === "Sudah Bayar") {
      let idx = ["Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"].indexOf(d.bulan);
      bulanData[idx] += parseInt(d.jumlah);
    }
  });

  if (chart) chart.destroy();
  chart = new Chart(rekapChartCtx, {
    type: "bar",
    data: {
      labels: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
      datasets: [{
        label: "Total Kas per Bulan",
        data: bulanData,
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// Tambah/Edit Data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    tanggal: document.getElementById("tanggal").value,
    nama: document.getElementById("nama").value,
    bulan: document.getElementById("bulan").value,
    jumlah: document.getElementById("jumlah").value,
    status: document.getElementById("status").value,
  };

  const editIndex = document.getElementById("editIndex").value;
  if (editIndex === "") {
    dataIuran.push(data);
  } else {
    dataIuran[editIndex] = data;
    document.getElementById("formTitle").textContent = "Tambah Data Iuran";
    document.getElementById("submitBtn").textContent = "Tambah Data";
    document.getElementById("cancelEdit").classList.add("hidden");
  }

  form.reset();
  document.getElementById("editIndex").value = "";
  renderTabel();
});

// Edit Data
function editData(index) {
  const d = dataIuran[index];
  document.getElementById("tanggal").value = d.tanggal;
  document.getElementById("nama").value = d.nama;
  document.getElementById("bulan").value = d.bulan;
  document.getElementById("jumlah").value = d.jumlah;
  document.getElementById("status").value = d.status;
  document.getElementById("editIndex").value = index;

  document.getElementById("formTitle").textContent = "Edit Data Iuran";
  document.getElementById("submitBtn").textContent = "Simpan Perubahan";
  document.getElementById("cancelEdit").classList.remove("hidden");

  // pindah ke form
  showPage("form");
}

// Hapus Data
function hapusData(index) {
  if (confirm("Yakin hapus data ini?")) {
    dataIuran.splice(index, 1);
    renderTabel();
  }
}

// Simpan ke localStorage
function simpanData() {
  localStorage.setItem("kasData", JSON.stringify(dataIuran));
}

// Cancel Edit
document.getElementById("cancelEdit").addEventListener("click", () => {
  form.reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("formTitle").textContent = "Tambah Data Iuran";
  document.getElementById("submitBtn").textContent = "Tambah Data";
  document.getElementById("cancelEdit").classList.add("hidden");
});

// Pencarian
searchInput.addEventListener("input", (e) => {
  renderTabel(e.target.value);
});

// SPA Navigation
const navLinks = document.querySelectorAll(".sidebar nav a");
const pages = document.querySelectorAll(".page");

function showPage(target) {
  pages.forEach(page => page.classList.add("hidden"));
  navLinks.forEach(l => l.classList.remove("active"));
  document.getElementById(target).classList.remove("hidden");
  document.querySelector(`.sidebar nav a[data-target='${target}']`).classList.add("active");
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(link.getAttribute("data-target"));
  });
});

// Init
renderTabel();
showPage("form");
