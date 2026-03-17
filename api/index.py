from flask import Flask, render_template, request, send_file
from pypdf import PdfReader, PdfWriter
from dotenv import load_dotenv
import zipfile
import requests
import pandas as pd
import plotly.express as px
import plotly.utils
import base64
import json
import io
import os

load_dotenv()

base_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, "../templates"),
    static_folder=os.path.join(base_dir, "../static"),
)

# Export app untuk Vercel
app.debug = True


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


@app.route("/resep-index")
def resep_index():
    return render_template("resep-index.html")


@app.route("/resep-favorites")
def resep_favorites():
    return render_template("resep-favorites.html")


@app.route("/resep-detail")
def resep_detail():
    return render_template("resep-detail.html")


# Ai IMAGE HUNGGING FACE API  AI ENGINE
@app.route("/ai-image", methods=["GET", "POST"])
def ai_image():
    generated_image = None
    prompt = ""
    error = None

    if request.method == "POST":
        prompt = request.form.get("prompt")

        # URL Model Stable Diffusion
        API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"
        headers = {"Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"}

        try:
            # Kirim permintaan ke Hugging Face
            response = requests.post(
                API_URL, headers=headers, json={"inputs": prompt}, timeout=25
            )

            if response.status_code == 200:
                # Berhasil!
                encoded_image = base64.b64encode(response.content).decode("utf-8")
                generated_image = f"data:image/jpeg;base64,{encoded_image}"
            elif response.status_code == 503:
                # Model sedang tidur/loading
                error = "Model AI sedang 'pemanasan'. Silakan tunggu 10 detik dan coba lagi."
            elif response.status_code == 401:
                # Masalah Token
                error = "Token tidak valid. Cek kembali HF_API_TOKEN di Vercel."
            else:
                # Error lainnya
                error = f"Error dari AI ({response.status_code}). Coba kata-kata lain."

        except Exception as e:
            error = f"Timeout! Koneksi ke AI terlalu lama. Coba lagi."

    return render_template(
        "ai-image.html", generated_image=generated_image, prompt=prompt, error=error
    )


# Weather Api Key Opern Weather ini
# Ambil API Key dari Environment Variable
API_KEY = os.getenv("OWM_API_KEY")


# Weather Tracker
@app.route("/weather", methods=["GET", "POST"])
def weather():
    city = request.form.get("city", "Jakarta")
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url).json()

    if str(response.get("cod")) == "200":
        # 1. Ambil data untuk Grafik (Forecast)
        raw_list = response["list"][:8]
        data = {
            "Waktu": [item["dt_txt"].split(" ")[1][:5] for item in raw_list],
            "Suhu (°C)": [item["main"]["temp"] for item in raw_list],
        }
        df = pd.DataFrame(data)
        fig = px.line(
            df, x="Waktu", y="Suhu (°C)", title=f"Prediksi Suhu di {city}", markers=True
        )
        graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        # 2. TAMBAHKAN INI: Ambil data Cuaca Saat Ini (Current Weather)
        # Ambil data pertama untuk cuaca saat ini
        first_item = response["list"][0]
        icon_code = first_item["weather"][0]["icon"]

        # Mapping Ikon yang lebih lengkap
        if "01" in icon_code:  # Cerah
            icon_html = '<i class="fa-solid fa-sun text-warning"></i>'
        elif "02" in icon_code:  # Berawan sebagian
            icon_html = '<i class="fa-solid fa-cloud-sun text-light"></i>'
        elif icon_code in ["03", "04"]:  # Mendung/Berawan
            icon_html = '<i class="fa-solid fa-cloud text-light"></i>'
        elif icon_code in ["09", "10"]:  # Hujan
            icon_html = '<i class="fa-solid fa-cloud-showers-heavy text-info"></i>'
        elif "11" in icon_code:  # Petir
            icon_html = '<i class="fa-solid fa-cloud-bolt text-warning"></i>'
        elif "13" in icon_code:  # Salju
            icon_html = '<i class="fa-solid fa-snowflake text-info"></i>'
        elif "50" in icon_code:  # Kabut/Mist
            icon_html = '<i class="fa-solid fa-smog text-light"></i>'
        else:
            icon_html = '<i class="fa-solid fa-cloud text-light"></i>'

        current_weather = {
            "temp": round(first_item["main"]["temp"]),
            "description": first_item["weather"][0]["description"],
            "humidity": first_item["main"]["humidity"],
            "wind": first_item["wind"]["speed"],
            "icon": icon_html,  # Memasukkan variabel icon_html di sini
        }
    else:
        graph_json = None
        current_weather = None  # Pastikan ini None jika gagal

    # Kirim current_weather ke template
    return render_template(
        "weather.html",
        graph_json=graph_json,
        city=city,
        current_weather=current_weather,
    )


# Curency Converter
@app.route("/currencyconverter", methods=["GET", "POST"])
def currency_converter():
    result = None
    amount = ""
    from_curr = "USD"
    to_curr = "IDR"
    error = None

    if request.method == "POST":
        try:
            # Ambil data dan bersihkan karakter non-angka kecuali titik desimal
            raw_amount = (
                request.form.get("amount", "0").replace(".", "").replace(",", ".")
            )
            amount = float(raw_amount)
            from_curr = request.form.get("from_curr")
            to_curr = request.form.get("to_curr")

            url = f"https://api.exchangerate-api.com/v4/latest/{from_curr}"
            response = requests.get(url, timeout=10)
            data = response.json()

            if response.status_code == 200:
                rate = data["rates"][to_curr]
                converted = amount * rate
                # Format hasil: 1.234.567,89
                result = (
                    "{:,.2f}".format(converted)
                    .replace(",", "X")
                    .replace(".", ",")
                    .replace("X", ".")
                )
            else:
                error = "Gagal mengambil data dari server."
        except Exception as e:
            error = "Input tidak valid atau koneksi terputus."

    return render_template(
        "currency.html",
        result=result,
        amount=amount,
        from_curr=from_curr,
        to_curr=to_curr,
        error=error,
    )


# Unit Converter
@app.route("/unitconverter", methods=["GET", "POST"])
def unitconverter():
    result = None
    val = ""
    unit_type = ""

    if request.method == "POST":
        try:
            val = request.form.get("value")
            unit_type = request.form.get("unit_type")
            num = float(val)

            conversions = {
                "c_to_f": (num * 9 / 5) + 32,
                "f_to_c": (num - 32) * 5 / 9,
                "km_to_mil": num * 0.621371,
                "mil_to_km": num / 0.621371,
                "kg_to_lb": num * 2.20462,
                "lb_to_kg": num / 2.20462,
            }

            raw_result = conversions.get(unit_type, 0)
            result = f"{raw_result:.2f}"

        except (ValueError, TypeError):
            result = "Error"

    return render_template(
        "unitconverter.html", result=result, val=val, unit_type=unit_type
    )


# --- PDF ---


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
    mode = request.form.get("mode")  # 'single', 'range', atau 'multiple'

    if not file:
        return {"error": "File tidak ditemukan"}, 400

    try:
        input_data = io.BytesIO(file.read())
        reader = PdfReader(input_data)
        total_pages = len(reader.pages)

        # JIKA MODE SINGLE: Langsung kirim PDF (Tanpa ZIP)
        if mode == "single":
            page_num = int(request.form.get("page_num", 1)) - 1
            if 0 <= page_num < total_pages:
                writer = PdfWriter()
                writer.add_page(reader.pages[page_num])

                output = io.BytesIO()
                writer.write(output)
                output.seek(0)

                return send_file(
                    output,
                    as_attachment=True,
                    download_name=f"halaman_{page_num + 1}.pdf",
                    mimetype="application/pdf",
                )
            else:
                return {"error": "Halaman di luar jangkauan"}, 400

        # JIKA MODE LAIN (Range/Multiple): Tetap gunakan ZIP tapi dioptimasi
        pages_to_process = []
        if mode == "range":
            start = int(request.form.get("range_start", 1)) - 1
            end = int(request.form.get("range_end", total_pages))
            pages_to_process = list(range(max(0, start), min(total_pages, end)))
        elif mode == "multiple":
            raw_list = request.form.get("pages_list", "")
            for p in raw_list.replace("-", ",").split(","):
                if p.strip().isdigit():
                    idx = int(p.strip()) - 1
                    if 0 <= idx < total_pages:
                        pages_to_process.append(idx)

        # Proteksi untuk Vercel (Maksimal 20 halaman untuk ZIP)
        if len(pages_to_process) > 20:
            return {
                "error": "Batas Vercel: Maksimal 20 halaman untuk ZIP. Gunakan mode 'Single Page' untuk halaman lainnya."
            }, 400

        zip_io = io.BytesIO()
        with zipfile.ZipFile(zip_io, "w", zipfile.ZIP_STORED) as zf:
            for p_idx in pages_to_process:
                pw = PdfWriter()
                pw.add_page(reader.pages[p_idx])
                p_buffer = io.BytesIO()
                pw.write(p_buffer)
                zf.writestr(f"halaman_{p_idx + 1}.pdf", p_buffer.getvalue())

        zip_io.seek(0)
        return send_file(
            zip_io,
            as_attachment=True,
            download_name="split_pages.zip",
            mimetype="application/zip",
        )

    except Exception as e:
        return {"error": str(e)}, 500


# Untuk dijalankan lokal
if __name__ == "__main__":
    app.run(debug=True)
