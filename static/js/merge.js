// Konfigurasi Worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let mergeFiles = [];

// Fungsi Reusable Dropzone
const setupDropZone = (zoneId, inputId, onFile) => {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  zone.onclick = () => input.click();
  input.onchange = (e) => onFile(e.target.files);
  zone.ondragover = (e) => {
    e.preventDefault();
    zone.classList.add("active");
  };
  zone.ondragleave = () => zone.classList.remove("active");
  zone.ondrop = (e) => {
    e.preventDefault();
    zone.classList.remove("active");
    onFile(e.dataTransfer.files);
  };
};

// Logika Preview Halaman
setupDropZone("dropZoneMerge", "fileInputMerge", async (files) => {
  document.getElementById("previewHeader").classList.remove("d-none");
  for (let file of files) {
    if (file.type !== "application/pdf") continue;
    mergeFiles.push(file);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      }).promise;

      const col = document.createElement("div");
      col.className = "col-4 col-md-3 page-item";
      col.dataset.id = `${file.name}|${i}`;
      col.innerHTML = `
                <div class="page-thumb">
                    <button type="button" class="btn btn-danger remove-page">×</button>
                    <div class="canvas-container"></div>
                </div>
                <div class="text-center mt-2 fw-bold small text-muted">Hal. ${i}</div>
            `;
      col.querySelector(".canvas-container").appendChild(canvas);
      col.querySelector(".remove-page").onclick = () => col.remove();
      document.getElementById("pagePreview").appendChild(col);
    }
  }
});

// Inisialisasi Fitur Drag & Drop Reorder
if (document.getElementById("pagePreview")) {
  new Sortable(document.getElementById("pagePreview"), { animation: 150 });
}

// Submit Form Merge
document.getElementById("mergeForm").onsubmit = async (e) => {
  e.preventDefault();
  const items = document.querySelectorAll(".page-item");
  if (items.length === 0) return alert("Pilih PDF dulu!");

  const btn = document.getElementById("btnMerge");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const formData = new FormData();
  items.forEach((p) => formData.append("page_map[]", p.dataset.id));
  mergeFiles.forEach((f) => formData.append("pdf_files", f));

  try {
    const res = await fetch("/process-merge", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Gagal merge");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged_result.pdf";
    a.click();
  } catch (e) {
    alert("Terjadi kesalahan saat menggabungkan PDF");
  } finally {
    btn.disabled = false;
    btn.innerText = "Gabungkan & Download";
  }
};

function resetMerge() {
  document.getElementById("pagePreview").innerHTML = "";
  mergeFiles = [];
  document.getElementById("previewHeader").classList.add("d-none");
}
