// Dashboard interactions: audio toggle, calendar, course modal, i18n
let audioEnabled = false;
const audioToggle = document.getElementById('audioToggle');
const audioText = document.getElementById('audioText');
const languageSelector = document.getElementById('languageSelector');

// translations
const translations = {
  en: {
    'welcome': 'Welcome back, {name}!',
    'welcome.sub': "Ready to continue your learning journey? You're making great progress!",
    'recent_activity': 'Recent Activity',
    'learning_streak': 'Learning Streak',
    'days_in_a_row': 'Days in a row!',
    'keep_it_up': 'Keep it up!',
    'your_courses': 'Your Courses',
    'progress': 'Progress',
    'continue_learning': 'Continue Learning',
    'role': 'Student',
    'category.mathematics': 'Mathematics',
    'category.science': 'Science',
    'category.economics': 'Economics',
    'modal.course_title': 'Course Title',
    'modal.course_description': 'Course description goes here',
    'audio.on': 'Text to Speech: ON',
    'audio.off': 'Text to Speech: OFF'
  },
  hi: {
    'welcome': 'वापसी पर स्वागत है, {name}!',
    'welcome.sub': 'अपनी सीखने की यात्रा जारी रखने के लिए तैयार? आप शानदार प्रगति कर रहे हैं!',
    'recent_activity': 'हाल की गतिविधि',
    'learning_streak': 'सीखने की लकीर',
    'days_in_a_row': 'लगातार दिनों में!',
    'keep_it_up': 'इसे बनाए रखें!',
    'your_courses': 'आपके पाठ्यक्रम',
    'progress': 'प्रगति',
    'continue_learning': 'सीखना जारी रखें',
    'role': 'छात्र',
    'category.mathematics': 'गणित',
    'category.science': 'विज्ञान',
    'category.economics': 'अर्थशास्त्र',
    'modal.course_title': 'पाठ्यक्रम का शीर्षक',
    'modal.course_description': 'पाठ्यक्रम विवरण यहाँ जाएँ',
    'audio.on': 'टेक्स्ट टू स्पीच: ON',
    'audio.off': 'टेक्स्ट टू स्पीच: OFF'
  },
  bn: {
    'welcome': 'স্বাগতম ফিরে, {name}!',
    'welcome.sub': 'আপনি কি আপনার শেখার যাত্রা চালিয়ে যেতে প্রস্তুত? আপনি অসাধারণ অগ্রগতি করছেন!',
    'recent_activity': 'সাম্প্রতিক কার্যকলাপ',
    'learning_streak': 'শেখার ধারাবাহিকতা',
    'days_in_a_row': 'দিনের সারিতে!',
    'keep_it_up': 'চেষ্টা চালিয়ে যান!',
    'your_courses': 'আপনার কোর্সসমূহ',
    'progress': 'প্রগতি',
    'continue_learning': 'শিখতে চালিয়ে যান',
    'role': 'ছাত্র',
    'category.mathematics': 'গণিত',
    'category.science': 'বিজ্ঞান',
    'category.economics': 'অর্থনীতি',
    'modal.course_title': 'কোর্সের শিরোনাম',
    'modal.course_description': 'কোর্সের বিবরণ এখানে আছে',
    'audio.on': 'টেক্সট টু স্পীচ: ON',
    'audio.off': 'টেক্সট টু স্পীচ: OFF'
  },
  ta: {
    'welcome': 'திரும்ப வந்ததற்கு வருக, {name}!',
    'welcome.sub': 'உங்கள் கற்பனை பயணத்தை தொடர தயாரா? நீங்கள் சிறந்த முன்னேற்றத்தை அடைந்துள்ளீர்கள்!',
    'recent_activity': 'சமீபத்திய செயல்பாடு',
    'learning_streak': 'கற்றல் தொடர்ச்சி',
    'days_in_a_row': 'தொடர் நாட்கள்!',
    'keep_it_up': 'தொடர்ந்து செய்!',
    'your_courses': 'உங்கள் பாடங்கள்',
    'progress': 'முன்னேற்றம்',
    'continue_learning': 'கற்றலைத் தொடரவும்',
    'role': 'மாணவர்',
    'category.mathematics': 'கணிதம்',
    'category.science': 'அறிவியல்',
    'category.economics': 'பொருளியல்',
    'modal.course_title': 'பாடநெறியின் தலைப்பு',
    'modal.course_description': 'பாடநெறியின் விளக்கம் இங்கே உள்ளது',
    'audio.on': 'உரை-மீத்து: ON',
    'audio.off': 'உரை-மீத்து: OFF'
  },
  te: {
    'welcome': 'మీకు తిరిగి స్వాగతం, {name}!',
    'welcome.sub': 'మీ అభ్యాస ప్రయాణాన్ని కొనసాగించడానికి సిద్దంగా ఉన్నారా? మీరు అద్భుత పురోగతి సాధిస్తున్నారు!',
    'recent_activity': 'సమీప కార్యాచరణ',
    'learning_streak': 'అభ్యాస దశ',
    'days_in_a_row': 'వరుసగా రోజులు!',
    'keep_it_up': 'కొనసాగించండి!',
    'your_courses': 'మీ కోర్సులు',
    'progress': 'పరిణతి',
    'continue_learning': 'అభ్యసనాన్ని కొనసాగించండి',
    'role': 'విద్యార్థి',
    'category.mathematics': 'గ��ితం',
    'category.science': 'విజ్ఞానం',
    'category.economics': 'అర్ధశాస్త్రం',
    'modal.course_title': 'కోర్సు శీర్షిక',
    'modal.course_description': 'కోర్సు వివరణ ఇక్కడ ఉంది',
    'audio.on': 'పాఠ్యాన్ని మాట్లాడటం: ON',
    'audio.off': 'పాఠ్యాన్ని మాట్లాడటం: OFF'
  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let text = dict[key] || translations.en[key] || el.textContent;
    if (text && text.indexOf && text.indexOf('{name}') !== -1) {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const name = user.fullname || user.username || user.id || 'User';
      text = text.replace('{name}', name);
    }
    el.textContent = text;
  });
  // update audio text
  if (audioText) {
    audioText.textContent = (audioEnabled ? dict['audio.on'] : dict['audio.off']) || audioText.textContent;
  }
  // update document title
  if (dict['site.title']) document.title = dict['site.title'];
}

// wire language selector
if (languageSelector) {
  const savedLang = localStorage.getItem('lang') || 'en';
  languageSelector.value = savedLang;
  // set username from session
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const displayName = user.fullname || user.username || '';
  const headerUserEl = document.getElementById('headerUserName');
  if (headerUserEl && displayName) headerUserEl.textContent = displayName;

  applyTranslations(savedLang);
  languageSelector.addEventListener('change', (e) => {
    const lang = e.target.value;
    localStorage.setItem('lang', lang);
    applyTranslations(lang);
    if (audioEnabled) speak((translations[lang]['welcome'] || translations.en['welcome']).replace('{name}', (JSON.parse(sessionStorage.getItem('user')||'{}').fullname || JSON.parse(sessionStorage.getItem('user')||'{}').username || 'User')));
  });
}

if (audioToggle) audioToggle.addEventListener('click', () => {
  audioEnabled = !audioEnabled;
  audioToggle.classList.toggle('active');
  if (audioText) audioText.textContent = audioEnabled ? (translations[localStorage.getItem('lang')||'en']['audio.on']) : (translations[localStorage.getItem('lang')||'en']['audio.off']);
  if (audioEnabled) {
    // speak entire page content for accessibility
    speakAll();
  } else {
    stopSpeak();
  }
});

// sequential speech queue for reading whole page
let speechQueue = [];
let currentUtterance = null;

function stopSpeak() {
  speechQueue = [];
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

function speak(text) {
  if (!('speechSynthesis' in window) || !text) return;
  // if audio disabled, do not speak
  if (!audioEnabled) return;
  // stop any current to avoid overlap
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  // set lang if available
  const lang = localStorage.getItem('lang') || 'en';
  try { utterance.lang = (lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : (lang === 'bn' ? 'bn-BD' : (lang === 'ta' ? 'ta-IN' : (lang === 'te' ? 'te-IN' : 'en-US'))))); } catch (e) {}
  window.speechSynthesis.speak(utterance);
  currentUtterance = utterance;
  return utterance;
}

function speakQueueNext() {
  if (!audioEnabled) return;
  if (speechQueue.length === 0) return;
  const next = speechQueue.shift();
  if (!next) return;
  const ut = new SpeechSynthesisUtterance(next.text);
  ut.rate = next.rate || 0.95;
  ut.pitch = next.pitch || 1;
  ut.volume = 1;
  const lang = localStorage.getItem('lang') || 'en';
  try { ut.lang = (lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : (lang === 'bn' ? 'bn-BD' : (lang === 'ta' ? 'ta-IN' : (lang === 'te' ? 'te-IN' : 'en-US'))))); } catch (e) {}
  ut.onend = () => {
    currentUtterance = null;
    // small pause before next
    setTimeout(() => speakQueueNext(), 250);
  };
  ut.onerror = () => {
    currentUtterance = null;
    setTimeout(() => speakQueueNext(), 250);
  };
  currentUtterance = ut;
  window.speechSynthesis.speak(ut);
}

function enqueueTexts(texts) {
  if (!Array.isArray(texts)) return;
  speechQueue = texts.slice();
  // start immediately
  if (speechQueue.length && !currentUtterance) speakQueueNext();
}

function isVisible(el) {
  if (!el) return false;
  if (!(el instanceof Element)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  return true;
}

function collectReadableText() {
  const texts = [];
  // header/logo
  const logo = document.querySelector('.logo h1');
  if (logo && isVisible(logo)) texts.push({ text: logo.textContent.trim() });
  // user
  const hdrUser = document.getElementById('headerUserName');
  if (hdrUser && isVisible(hdrUser)) texts.push({ text: (translations[localStorage.getItem('lang')||'en']['welcome'] || translations.en['welcome']).replace('{name}', hdrUser.textContent.trim()) });
  // welcome sub
  const welcomeSub = document.querySelector('[data-i18n="welcome.sub"]');
  if (welcomeSub && isVisible(welcomeSub)) texts.push({ text: welcomeSub.textContent.trim() });
  // recent activity title
  const recent = document.querySelector('[data-i18n="recent_activity"]');
  if (recent && isVisible(recent)) texts.push({ text: recent.textContent.trim() });
  // activity items
  document.querySelectorAll('.activity-item').forEach(item => {
    if (!isVisible(item)) return;
    const h = item.querySelector('h4');
    const p = item.querySelector('p');
    if (h) texts.push({ text: h.textContent.trim() });
    if (p) texts.push({ text: p.textContent.trim() });
  });
  // courses heading
  const coursesHeading = document.querySelector('[data-i18n="your_courses"]');
  if (coursesHeading && isVisible(coursesHeading)) texts.push({ text: coursesHeading.textContent.trim() });
  // course cards
  document.querySelectorAll('.course-card').forEach(card => {
    if (!isVisible(card)) return;
    const cat = card.querySelector('.course-category');
    const title = card.querySelector('h4');
    const desc = card.querySelector('.course-content p');
    if (cat) texts.push({ text: (cat.getAttribute('data-i18n') ? (translations[localStorage.getItem('lang')||'en'][cat.getAttribute('data-i18n')] || cat.textContent.trim()) : cat.textContent.trim()) });
    if (title) texts.push({ text: title.textContent.trim() });
    if (desc) texts.push({ text: desc.textContent.trim() });
  });
  // footer/other
  const footer = document.querySelector('footer');
  if (footer && isVisible(footer)) {
    const ftext = footer.textContent.trim().replace(/\s+/g, ' ');
    if (ftext) texts.push({ text: ftext });
  }
  return texts.map(t => ({ text: t.text }));
}

function speakAll() {
  if (!audioEnabled) return;
  stopSpeak();
  const texts = collectReadableText();
  if (texts.length === 0) return;
  enqueueTexts(texts);
}

// when modal opens, speak its content if audio enabled
const origOpenCourse = window.openCourse;
window.openCourse = function(courseId) {
  if (typeof origOpenCourse === 'function') origOpenCourse(courseId);
  if (!audioEnabled) return;
  // small delay to let modal populate
  setTimeout(() => {
    const title = document.getElementById('modalTitle')?.textContent || '';
    const desc = document.getElementById('modalDescription')?.textContent || '';
    stopSpeak();
    enqueueTexts([{ text: title }, { text: desc }]);
  }, 300);
};


// hover speak
document.querySelectorAll('[data-speak]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (audioEnabled) speak(el.textContent.trim());
  });
});

// calendar
(function generateCalendar(){
  const calendar = document.getElementById('calendar');
  if (!calendar) return;
  const today = new Date();
  const activeDays = new Set([0,1,2,4,5,6,8,9,11,13,14,15]);
  for (let i=20;i>=0;i--) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    if (activeDays.has(i)) dayDiv.classList.add('active');
    if (i===0) dayDiv.classList.add('today');
    const date = new Date(today); date.setDate(date.getDate()-i);
    dayDiv.textContent = date.getDate();
    dayDiv.title = date.toDateString();
    calendar.appendChild(dayDiv);
  }
})();

// courses data and modal
const courses = {
  algebra: { title:'Algebra', description:'Master the fundamentals of Algebra.', lessons:[{name:'Intro',duration:'15 min',completed:true},{name:'Linear Equations',duration:'20 min',completed:true}] },
  physics: { title:'Physics', description:'Core concepts of Physics.', lessons:[] },
  economics: { title:'Production and Consumption', description:'Fundamentals of Economics.', lessons:[] }
};

function openCourse(courseId) {
  const course = courses[courseId];
  if (!course) return;
  const modal = document.getElementById('courseModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const lessonList = document.getElementById('lessonList');
  if (modalTitle) modalTitle.textContent = course.title;
  if (modalDescription) modalDescription.textContent = course.description;
  if (lessonList) {
    lessonList.innerHTML = '';
    (course.lessons || []).forEach((lesson, index) => {
      const lessonItem = document.createElement('div');
      lessonItem.className = 'lesson-item';
      lessonItem.innerHTML = `<div><strong>${index+1}. ${lesson.name}</strong><small style="display:block;color:#888;">${lesson.duration}</small></div><i class="bi ${lesson.completed? 'bi-check-circle-fill':'bi-circle'}" style="font-size:20px;color:${lesson.completed? '#28a745':'#ccc'};"></i>`;
      lessonItem.addEventListener('click', ()=>{ speak(`Starting lesson: ${lesson.name}`); alert(`Starting lesson: ${lesson.name}`); });
      lessonList.appendChild(lessonItem);
    });
  }
  if (modal) modal.classList.add('active');
  speak(`Opened ${course.title} course`);
}

function closeModal(){ const m=document.getElementById('courseModal'); if (m) m.classList.remove('active'); }
const courseModalEl = document.getElementById('courseModal'); if (courseModalEl) courseModalEl.addEventListener('click', (e)=>{ if (e.target.id==='courseModal') closeModal(); });

// Chatbot implementation
(function initChatbot(){
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatStatus = document.getElementById('chatStatus');

  if (!chatToggle || !chatPanel) return;

  function openChat(){
    chatPanel.setAttribute('aria-hidden','false');
    chatToggle.setAttribute('aria-expanded','true');
    chatInput && chatInput.focus();
  }
  function closeChat(){
    chatPanel.setAttribute('aria-hidden','true');
    chatToggle.setAttribute('aria-expanded','false');
    stopSpeak();
  }

  chatToggle.addEventListener('click', ()=>{
    const open = chatPanel.getAttribute('aria-hidden') === 'false';
    open ? closeChat() : openChat();
  });
  if (chatClose) chatClose.addEventListener('click', closeChat);

  // render message
  function appendMessage(cls, text){
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = 'chat-message ' + cls;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.parentElement.scrollTop = chatMessages.parentElement.scrollHeight;
  }

  // load saved
  try{
    const saved = JSON.parse(localStorage.getItem('edusetu_chat')||'[]');
    saved.forEach(m => appendMessage(m.role==='user'?'user':'bot', m.text));
  }catch(e){}

  // OFFLINE assistant mode (user requested)
  const OFFLINE_MODE = true;

  function getCourseProgressMap() {
    const map = {};
    document.querySelectorAll('.course-card').forEach(card => {
      const title = card.querySelector('h4')?.textContent?.trim();
      const prog = card.querySelector('.progress-label span:last-child')?.textContent?.trim();
      if (title) map[title.toLowerCase()] = prog || '';
    });
    return map;
  }

  function offlineAssistant(message) {
    const m = (message || '').trim();
    const lc = m.toLowerCase();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const name = user.fullname || user.username || 'Learner';
    const courseMap = getCourseProgressMap();

    if (!m) return "Hi — I'm EduSetu Assistant. Ask me about your courses, progress, or accessibility features.";
    if (/^hi|hello|hey|hii\b/.test(lc)) return `Hello ${name}! I'm EduSetu Assistant — I can help with courses, progress, language and accessibility. What do you want to know?`;
    if (lc.includes('who are you') || lc.includes('what are you')) return `I'm EduSetu Assistant — an offline helper built into this dashboard. I can read your courses, tell progress, and give tips.`;
    if (lc.includes('courses') || lc.includes('course')) {
      const keys = Object.keys(courseMap);
      if (keys.length) return `You have ${keys.length} courses: ${keys.map(k => `${k} (${courseMap[k]||'progress unknown'})`).join('; ')}.`;
      return 'I cannot find your courses right now.';
    }
    if (lc.includes('algebra') || lc.includes('physics') || lc.includes('economics')) {
      for (const id of Object.keys(courses)) {
        const c = courses[id];
        if (lc.includes(c.title.toLowerCase()) || lc.includes(id)) {
          return `${c.title}: ${c.description} Lessons: ${c.lessons.map(l=>l.name).slice(0,5).join(', ')}.`;
        }
      }
    }
    if (lc.includes('progress')) {
      const keys = Object.keys(courseMap);
      if (keys.length) return keys.map(k => `${k}: ${courseMap[k]||'N/A'}`).join('; ');
      return 'I cannot detect progress values on this page.';
    }
    if (lc.includes('text to speech') || lc.includes('tts') || lc.includes('speak')) {
      // enable audio
      audioEnabled = true;
      if (audioText) audioText.textContent = translations[localStorage.getItem('lang')||'en']['audio.on'];
      speakAll();
      return 'Text to speech has been enabled — I will start reading the page content aloud.';
    }
    if (lc.includes('language') || lc.includes('hindi') || lc.includes('english') || lc.includes('bengali') || lc.includes('tamil') || lc.includes('telugu')) {
      return 'Use the language dropdown at the top-right to change the interface language. I will speak in the selected language if Text to Speech is enabled.';
    }
    if (lc.includes('help') || lc.includes('support')) {
      return 'I can help you find courses, read content aloud, and explain features. Try: "What courses do I have?", "Read the page", or "Tell me about Algebra".';
    }
    // fallback: attempt concise helpful reply based on page content
    const titles = Object.values(courses).map(c=>c.title).join(', ');
    return `I don't have internet access. Quick help: Your courses include ${titles}. Ask me specifically about a course or say 'Read the page' to have me speak the visible content.`;
  }

  async function sendToApi(message){
    if (OFFLINE_MODE) {
      return offlineAssistant(message);
    }

    const originsToTry = [window.location.origin];
    // common development ports where backend might be running
    const host = window.location.hostname || 'localhost';
    const devPorts = ['3000','8080','48752'];
    devPorts.forEach(p => {
      const o = window.location.protocol + '//' + host + (p ? (':' + p) : '');
      if (!originsToTry.includes(o)) originsToTry.push(o);
    });

    const path = '/api/chat';
    const errors = [];

    for (const base of originsToTry) {
      const url = base + path;
      try{
        const controller = new AbortController();
        const timer = setTimeout(()=>controller.abort(), 20000);
        const resp = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message }), signal: controller.signal });
        clearTimeout(timer);
        if (!resp.ok) {
          const txt = await resp.text().catch(()=>(''));
          errors.push(`${url}: ${txt || resp.status}`);
          continue;
        }
        const data = await resp.json().catch(()=>({}));
        const reply = data.reply || data?.choices?.[0]?.message?.content || data?.raw?.choices?.[0]?.message?.content || data?.raw || JSON.stringify(data);
        return String(reply || 'Sorry, I could not generate a reply.');
      } catch (err) {
        errors.push(`${url}: ${err.message || err}`);
        continue;
      }
    }

    console.warn('All chat API attempts failed:', errors.join(' | '));
    return `I'm offline right now. Here's a quick tip: ${message.slice(0,120)}...`;
  }

  async function handleSend(text){
    if (!text || !chatMessages) return;
    appendMessage('user', text);
    // persist
    try{ const arr = JSON.parse(localStorage.getItem('edusetu_chat')||'[]'); arr.push({ role:'user', text }); localStorage.setItem('edusetu_chat', JSON.stringify(arr)); }catch(e){}
    // show status
    if (chatStatus) chatStatus.textContent = 'Thinking...';
    // get reply
    const reply = await sendToApi(text);
    appendMessage('bot', reply);
    if (chatStatus) chatStatus.textContent = '';
    // persist bot
    try{ const arr = JSON.parse(localStorage.getItem('edusetu_chat')||'[]'); arr.push({ role:'bot', text:reply }); localStorage.setItem('edusetu_chat', JSON.stringify(arr)); }catch(e){}
    // speak reply
    if (audioEnabled) speak(reply);
  }

  if (chatForm) chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = chatInput && chatInput.value && chatInput.value.trim();
    if (!v) return;
    chatInput.value = '';
    handleSend(v);
  });

})();
