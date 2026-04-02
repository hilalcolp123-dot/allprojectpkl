let totalMasuk = 0;
let totalKeluar = 0;

// Inisialisasi DataTable
let table = $("#transaksiTable").DataTable({
  language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/id.json" },
  order: [[0, "desc"]],
});

async function getAdvice() {
  const inVal = document.getElementById("pemasukan").value || 0;
  const outVal = document.getElementById("pengeluaran").value || 0;
  const note = document.getElementById("catatan").value || "-";

  if (inVal == 0 && outVal == 0) {
    return Swal.fire("Error", "Isi data pemasukan/pengeluaran!", "error");
  }

  document.getElementById("ai-response").style.display = "block";
  document.getElementById("advice-text").innerText = "Sedang menganalisis...";

  try {
    const res = await fetch("/get_ai_advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pemasukan: inVal,
        pengeluaran: outVal,
        catatan: note,
      }),
    });
    const data = await res.json();
    document.getElementById("advice-text").innerText = data.advice;

    // Update UI Stats
    totalMasuk += parseInt(inVal);
    totalKeluar += parseInt(outVal);
    updateStats();

    // Update Table
    const tgl = new Date().toLocaleDateString("id-ID");
    table.row
      .add([
        tgl,
        note,
        `Rp ${parseInt(inVal).toLocaleString()}`,
        `Rp ${parseInt(outVal).toLocaleString()}`,
      ])
      .draw();
  } catch (e) {
    document.getElementById("advice-text").innerText = "Gagal memuat saran AI.";
  }
}

function updateStats() {
  document.getElementById("total-masuk").innerText =
    `Rp ${totalMasuk.toLocaleString()}`;
  document.getElementById("total-keluar").innerText =
    `Rp ${totalKeluar.toLocaleString()}`;
  document.getElementById("total-saldo").innerText =
    `Rp ${(totalMasuk - totalKeluar).toLocaleString()}`;
}
