export default async function handler(req,res){

if(req.method !== "POST"){
return res.status(405).json({error:"Method not allowed"});
}

try{

let body = req.body;

if(typeof body === "string"){
body = JSON.parse(body);
}

const { text, voice } = body;

if(!text){
return res.status(400).json({error:"Text kosong"});
}

const response = await fetch(
`https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
{
method:"POST",
headers:{
"xi-api-key":process.env.ELEVENLABS_API_KEY,
"Content-Type":"application/json"
},
body:JSON.stringify({
text:text,
model_id:"eleven_multilingual_v2"
})
}
);

if(!response.ok){

const errorText = await response.text();

return res.status(response.status).json({
error:"ElevenLabs error",
detail:errorText
});

}

const buffer = await response.arrayBuffer();

res.setHeader("Content-Type","audio/mpeg");

res.send(Buffer.from(buffer));

}catch(err){

console.error(err);

res.status(500).json({error:err.message});

}

}
