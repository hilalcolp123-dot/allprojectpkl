// Konfigurasi Worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let splitFile = null;
let currentSplitPdf = null;
const splitMode = document.getElementById("splitMode");
const livePreviewContainer = document.getElementById("splitLivePreview");
const areas = {
  single: document.getElementById("areaSingle"),
  range: document.getElementById("areaRange"),
  multiple: document.getElementById("areaMultiple"),
};

// Fungsi Reusable Dropzone
const setupDropZoneSplit = (zoneId, inputId, onFile) => {
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

// Toggle Mode Input
splitMode.onchange = () => {
  Object.values(areas).forEach((el) => el.classList.add("d-none"));
  areas[splitMode.value].classList.remove("d-none");

  if (splitMode.value === "single") {
    livePreviewContainer.classList.add("d-none");
  } else {
    livePreviewContainer.classList.remove("d-none");
    updateSplitLivePreview();
  }
};

// Inisialisasi File Split
setupDropZoneSplit("dropZoneSplit", "fileInputSplit", async (files) => {
  if (files.length === 0) return;
  splitFile = files[0];
  currentSplitPdf = await pdfjsLib.getDocument(await splitFile.arrayBuffer())
    .promise;

  document.getElementById("splitPreviewContainer").classList.remove("d-none");
  document.getElementById("btnSplit").disabled = false;
  document.getElementById("totalPageText").innerText = currentSplitPdf.numPages;
  document.getElementById("rangeStart").value = 1;
  document.getElementById("rangeEnd").value = currentSplitPdf.numPages;

  renderSplitPreview(1);
  updateSplitLivePreview();
});

// Render Canvas untuk Mode Single
async function renderSplitPreview(num) {
  const page = await currentSplitPdf.getPage(num);
  const canvas = document.getElementById("splitCanvas");
  const viewport = page.getViewport({ scale: 0.8 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: canvas.getContext("2d"), viewport })
    .promise;
  document.getElementById("curPageText").innerText = num;
  document.getElementById("splitPageNum").value = num;
}

// Update Thumbnail untuk Mode Range/Multiple
async function updateSplitLivePreview() {
  if (!currentSplitPdf || splitMode.value === "single") return;
  livePreviewContainer.innerHTML =
    '<div class="col-12 text-center small text-muted">Memproses...</div>';

  let pages = [];
  const total = currentSplitPdf.numPages;

  if (splitMode.value === "range") {
    const start = Math.max(
      1,
      parseInt(document.getElementById("rangeStart").value) || 1,
    );
    const end = Math.min(
      total,
      parseInt(document.getElementById("rangeEnd").value) || total,
    );
    for (let i = start; i <= end; i++) pages.push(i);
  } else if (splitMode.value === "multiple") {
    const val = document.getElementById("multiplePages").value;
    val.split(",").forEach((p) => {
      const n = parseInt(p.trim());
      if (n > 0 && n <= total) pages.push(n);
    });
  }

  livePreviewContainer.innerHTML = "";
  // Maksimal 12 halaman agar browser tidak hang
  for (const pNum of pages.slice(0, 12)) {
    const page = await currentSplitPdf.getPage(pNum);
    const viewport = page.getViewport({ scale: 0.2 });
    const canvas = document.createElement("canvas");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport })
      .promise;

    const div = document.createElement("div");
    div.className = "col-3 mb-2";
    div.innerHTML = `
            <div class="mini-thumb p-1 border bg-white">
                <small class="d-block text-center bg-light mb-1">${pNum}</small>
                <div class="canvas-target"></div>
            </div>`;
    div.querySelector(".canvas-target").appendChild(canvas);
    canvas.style.width = "100%";
    livePreviewContainer.appendChild(div);
  }
}

// Event Navigasi Single
document.getElementById("prevPage").onclick = () => {
  let cur = parseInt(document.getElementById("splitPageNum").value);
  if (cur > 1) renderSplitPreview(cur - 1);
};
document.getElementById("nextPage").onclick = () => {
  let cur = parseInt(document.getElementById("splitPageNum").value);
  if (cur < currentSplitPdf.numPages) renderSplitPreview(cur + 1);
};

// Event Listeners Live Update
document.getElementById("rangeStart").oninput = updateSplitLivePreview;
document.getElementById("rangeEnd").oninput = updateSplitLivePreview;
document.getElementById("multiplePages").oninput = updateSplitLivePreview;

// Submit Form Split
document.getElementById("splitForm").onsubmit = async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btnSplit");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const formData = new FormData();
  formData.append("pdf_file", splitFile);
  formData.append("mode", splitMode.value);
  formData.append("combine", document.getElementById("combinePdf").checked);

  if (splitMode.value === "single")
    formData.append("page_num", document.getElementById("splitPageNum").value);
  else if (splitMode.value === "range") {
    formData.append("range_start", document.getElementById("rangeStart").value);
    formData.append("range_end", document.getElementById("rangeEnd").value);
  } else if (splitMode.value === "multiple") {
    formData.append(
      "pages_list",
      document.getElementById("multiplePages").value,
    );
  }

  try {
    const res = await fetch("/process-split", {
      method: "POST",
      body: formData,
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const isCombined = document.getElementById("combinePdf").checked;
    a.download = isCombined ? "split_combined.pdf" : "split_pages.zip";
    a.click();
  } catch (err) {
    alert("Gagal memproses Split");
  } finally {
    btn.disabled = false;
    btn.innerText = "Proses & Download";
  }
};
