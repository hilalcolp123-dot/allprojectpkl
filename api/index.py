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


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/anifinder")
def anifinder():
    return render_template("anifinder.html")


@app.route("/anischedule")
def anischedule():
    return render_template("anischedule.html")


@app.route("/caseconverter")
def caseconverter():
    return render_template("caseconverter.html")


@app.route("/cipher")
def cipher():
    return render_template("cipher.html")


@app.route("/detailanifinder")
def detailanifinder():
    return render_template("detailanifinder.html")


@app.route("/detailranking")
def detailranking():
    return render_template("detailranking.html")


@app.route("/encode-decode")
def encode_decode():
    return render_template("encode-decode.html")


@app.route("/imagetobase64")
def imagetobase64():
    return render_template("imagetobase64.html")


@app.route("/merge")
def merge_page():
    return render_template("merge.html")


@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


@app.route("/split")
def split_page():
    return render_template("split.html")


@app.route("/todo")
def todo():
    return render_template("todo.html")


@app.route("/tts-stt")
def tts_stt():
    return render_template("TTS&STT.html")


@app.route("/utamapdf")
def utamapdf():
    return render_template("utamapdf.html")


@app.route("/utamaranking")
def utamaranking():
    return render_template("utamaranking.html")


@app.route("/jurnal")
def jurnal():
    return render_template("jurnal.html")


@app.route("/wedding")
def wedding():
    return render_template("wedding.html")


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
        # PENTING: Baca file ke memory agar tidak terputus di tengah jalan
        input_data = io.BytesIO(file.read())
        reader = PdfReader(input_data)
        total_pages = len(reader.pages)
        pages_to_process = []

        # --- Penentuan Halaman (Logika Anda) ---
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
            for part in raw_list.replace("-", ",").split(","):
                if part.strip().isdigit():
                    idx = int(part.strip()) - 1
                    if 0 <= idx < total_pages:
                        pages_to_process.append(idx)

        if not pages_to_process:
            return {"error": "Halaman tidak valid"}, 400

        # --- LOGIKA OUTPUT ---
        if combine:
            writer = PdfWriter()
            for p_idx in pages_to_process:
                writer.add_page(reader.pages[p_idx])

            final_buffer = io.BytesIO()
            writer.write(final_buffer)
            final_buffer.seek(0)
            return send_file(
                final_buffer,
                as_attachment=True,
                download_name="split_combined.pdf",
                mimetype="application/pdf",
            )

        else:
            # Gunakan buffer yang didefinisikan dengan jelas
            zip_io = io.BytesIO()

            # Gunakan ZIP_STORED (tanpa kompresi) agar proses lebih cepat di Vercel
            # Ini mengurangi beban CPU dan mencegah timeout
            with zipfile.ZipFile(zip_io, "w", compression=zipfile.ZIP_STORED) as zf:
                for p_idx in pages_to_process:
                    pw = PdfWriter()
                    pw.add_page(reader.pages[p_idx])

                    page_io = io.BytesIO()
                    pw.write(page_io)
                    # Ambil datanya dan langsung simpan ke ZIP
                    data = page_io.getvalue()
                    zf.writestr(f"halaman_{p_idx + 1}.pdf", data)
                    page_io.close()

            # PENTING: Ambil hasil akhir ZIP ke variabel baru sebelum dikirim
            zip_io.seek(0)
            final_zip_data = zip_io.getvalue()
            zip_io.close()

            return send_file(
                io.BytesIO(final_zip_data),
                mimetype="application/zip",
                as_attachment=True,
                download_name="split_pages.zip",
            )

    except Exception as e:
        print(f"Error Split: {e}")
        return {"error": "Gagal memproses file"}, 500
