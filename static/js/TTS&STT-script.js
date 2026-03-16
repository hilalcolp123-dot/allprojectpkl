let recognition;
let audioPlayer = null;


// ============================
// TAB SWITCH
// ============================

function showTTS(){

document.getElementById("ttsSection").classList.remove("hidden");
document.getElementById("sttSection").classList.add("hidden");

}

function showSTT(){

document.getElementById("sttSection").classList.remove("hidden");
document.getElementById("ttsSection").classList.add("hidden");

}


// ============================
// TEXT TO SPEECH
// ============================

async function speak(){

let text = document.getElementById("ttsText").value;
let voice = document.getElementById("voice").value;

if(!text){
alert("Teks kosong");
return;
}

document.getElementById("status").innerText = "Status: Membuat suara...";

try{

let res = await fetch("/api/tts",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text,voice})
});


// cek kalau API error
if(!res.ok){

let err;

try{
err = await res.json();
}catch{
err = {error:"Server error"};
}

alert("TTS Error: " + (err.detail || err.error));

document.getElementById("status").innerText="Status: Error";

return;
}


let blob = await res.blob();


// hentikan audio lama
if(audioPlayer){
audioPlayer.pause();
audioPlayer.currentTime = 0;
}


let audioURL = URL.createObjectURL(blob);

audioPlayer = new Audio(audioURL);


// play audio
await audioPlayer.play();

document.getElementById("status").innerText="Status: Memutar suara";


// progress bar
audioPlayer.ontimeupdate = function(){

if(!audioPlayer.duration) return;

let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;

document.getElementById("progress").style.width = progress + "%";

let seconds = Math.floor(audioPlayer.currentTime);
let minutes = Math.floor(seconds / 60);

seconds = seconds % 60;

document.getElementById("time").innerText =
minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

};


// selesai
audioPlayer.onended = function(){

document.getElementById("progress").style.width = "0%";
document.getElementById("time").innerText = "0:00";

document.getElementById("status").innerText="Status: Selesai";

};


}catch(error){

console.error(error);

document.getElementById("status").innerText="Status: Error memutar audio";

alert("Gagal memutar audio");

}

}

// ============================
// STOP AUDIO
// ============================

function stopAudio(){

if(audioPlayer){

audioPlayer.pause();
audioPlayer.currentTime = 0;

document.getElementById("progress").style.width="0%";
document.getElementById("time").innerText="0:00";

document.getElementById("status").innerText="Status: Audio dihentikan";

}

}


// ============================
// DOWNLOAD MP3
// ============================

async function downloadAudio(){

let text = document.getElementById("ttsText").value;
let voice = document.getElementById("voice").value;

if(!text){
alert("Teks kosong");
return;
}

document.getElementById("status").innerText="Status: Mengunduh audio...";

let res = await fetch("/api/tts",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text,voice})
});

let blob = await res.blob();

let link = document.createElement("a");

link.href = URL.createObjectURL(blob);
link.download = "tts_audio.mp3";

link.click();

document.getElementById("status").innerText="Status: Download selesai";

}


// ============================
// SPEECH TO TEXT
// ============================

function startListening(){

recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang = "id-ID";

recognition.start();

document.getElementById("status").innerText="Status: Mendengarkan";

document.getElementById("micBtn").classList.add("mic-active");

// reset text
document.getElementById("sttResult").value="";

recognition.onresult=function(e){

document.getElementById("sttResult").value =
e.results[0][0].transcript;

};

recognition.onend=function(){

document.getElementById("micBtn").classList.remove("mic-active");

document.getElementById("status").innerText="Status: Rekaman berhenti";

};

}


// ============================
// STOP STT
// ============================

function stopSTT(){

if(recognition){
recognition.stop();
}

document.getElementById("micBtn").classList.remove("mic-active");

document.getElementById("status").innerText="Status: Rekaman dihentikan";

}


// ============================
// COPY TEXT
// ============================

function copySTT(){

let text = document.getElementById("sttResult").value;

navigator.clipboard.writeText(text);

alert("Teks berhasil disalin");

}
