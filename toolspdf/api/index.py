from flask import Flask, render_template, request, send_file
from pypdf import PdfReader, PdfWriter
import zipfile
import io
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, "../templates"),
    static_folder=os.path.join(base_dir, "../static"),
)

# --- ROUTES HALAMAN ---


@app.route("/toolspdf")
def index():
    return render_template("index.html")


@app.route("/merge")
def merge_page():
    return render_template("merge.html")


@app.route("/split")
def split_page():
    return render_template("split.html")


# --- LOGIKA PROSES ---


@app.route("/process-merge", methods=["POST"])
def process_merge():
    files = request.files.getlist("pdf_files")
    page_map = request.form.getlist("page_map[]")

    if not files or not page_map:
        return {"error": "Data tidak valid"}, 400

    file_dict = {f.filename: PdfReader(f) for f in files}
    writer = PdfWriter()

    try:
        for item in page_map:
            filename, page_num = item.split("|")
            reader = file_dict.get(filename)
            if reader:
                writer.add_page(reader.pages[int(page_num) - 1])

        buffer = io.BytesIO()
        writer.write(buffer)
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name="merged.pdf",
            mimetype="application/pdf",
        )
    except Exception as e:
        return {"error": str(e)}, 500


@app.route("/process-split", methods=["POST"])
def process_split():
    file = request.files.get("pdf_file")
    mode = request.form.get("mode")
    combine = request.form.get("combine") == "true"

    if not file:
        return {"error": "File tidak ditemukan"}, 400

    try:
        reader = PdfReader(file)
        total_pages = len(reader.pages)
        pages_to_process = []

        if mode == "single":
            p = int(request.form.get("page_num", 1)) - 1
            if 0 <= p < total_pages:
                pages_to_process = [p]
        elif mode == "range":
            start = int(request.form.get("range_start", 1)) - 1
            end = int(request.form.get("range_end", total_pages))
            pages_to_process = list(range(max(0, start), min(total_pages, end)))
        elif mode == "multiple":
            raw_list = request.form.get("pages_list", "")
            for p in raw_list.replace("-", ",").split(
                ","
            ):  # Simple dash to comma conversion
                if p.strip().isdigit():
                    idx = int(p.strip()) - 1
                    if 0 <= idx < total_pages:
                        pages_to_process.append(idx)

        if not pages_to_process:
            return {"error": "Halaman tidak valid"}, 400

        if combine:
            writer = PdfWriter()
            for p_idx in pages_to_process:
                writer.add_page(reader.pages[p_idx])
            buffer = io.BytesIO()
            writer.write(buffer)
            buffer.seek(0)
            return send_file(
                buffer,
                as_attachment=True,
                download_name="split_combined.pdf",
                mimetype="application/pdf",
            )
        else:
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w") as zip_file:
                for p_idx in pages_to_process:
                    writer = PdfWriter()
                    writer.add_page(reader.pages[p_idx])
                    p_io = io.BytesIO()
                    writer.write(p_io)
                    zip_file.writestr(f"halaman_{p_idx + 1}.pdf", p_io.getvalue())
            zip_buffer.seek(0)
            return send_file(
                zip_buffer,
                as_attachment=True,
                download_name="split_pages.zip",
                mimetype="application/zip",
            )
    except Exception as e:
        return {"error": str(e)}, 500
