document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const speakBtn = document.getElementById('speak');
  const recordBtn = document.getElementById('record');

  function appendMessage(text, role='assistant'){
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const span = document.createElement('div');
    span.className = 'bubble';
    span.textContent = text;
    div.appendChild(span);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendText(text){
    appendMessage(text, 'user');
    try{
      const resp = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: text }) });
      const json = await resp.json();
      if(!resp.ok){ appendMessage('Error: ' + (json.error||'unknown'), 'assistant'); return; }
      appendMessage(json.reply, 'assistant');
      lastAssistant = json.reply;
    }catch(err){ appendMessage('Network error', 'assistant'); }
  }

  sendBtn.addEventListener('click', ()=>{
    const v = input.value.trim(); if(!v) return; input.value=''; sendText(v);
  });
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ sendBtn.click(); }});

  let lastAssistant = '';
  speakBtn.addEventListener('click', async ()=>{
    if(!lastAssistant) { alert('No assistant message to speak'); return; }
    try{
      const resp = await fetch('/api/tts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: lastAssistant }) });
      if(!resp.ok){ const txt = await resp.text(); alert('TTS failed: '+txt); return; }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url); audio.play();
    }catch(err){ alert('TTS network error'); }
  });

  // Recording and STT
  let recorder = null; let chunks = [];
  recordBtn.addEventListener('click', async ()=>{
    if(recorder && recorder.state==='recording'){
      recorder.stop(); recordBtn.textContent='Record';
      return;
    }
    // start
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = async ()=>{
      const blob = new Blob(chunks, { type: 'audio/webm' });
      chunks = [];
      const arrayBuffer = await blob.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      try{
        const resp = await fetch('/api/stt', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ audio: b64 }) });
        const json = await resp.json();
        if(!resp.ok) { alert('STT failed'); return; }
        const text = json.text || '';
        input.value = text;
      }catch(err){ alert('STT network error'); }
    };
    recorder.start(); recordBtn.textContent='Stop';
  });

});
