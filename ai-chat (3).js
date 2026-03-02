// RootED AI Assistant — powered by Claude
(function () {
  // ── Inject CSS ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Chat bubble */
    #rooted-chat-bubble {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #C4622D; color: white;
      border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(196,98,45,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; transition: all 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    #rooted-chat-bubble:hover {
      background: #E8895A; transform: scale(1.08);
    }
    #rooted-chat-bubble .chat-label {
      position: absolute; right: 68px; top: 50%;
      transform: translateY(-50%);
      background: #1C1209; color: white;
      padding: 0.4rem 0.85rem; border-radius: 20px;
      font-size: 0.78rem; font-weight: 600;
      white-space: nowrap; pointer-events: none;
      font-family: 'DM Sans', sans-serif;
      opacity: 0; transition: opacity 0.2s;
    }
    #rooted-chat-bubble:hover .chat-label { opacity: 1; }

    /* Chat window */
    #rooted-chat-window {
      position: fixed; bottom: 5.5rem; right: 2rem; z-index: 9998;
      width: 380px; max-height: 560px;
      background: #FDFAF5; border: 1px solid #E0D8CC;
      border-radius: 20px; display: flex; flex-direction: column;
      box-shadow: 0 16px 48px rgba(28,18,9,0.15);
      overflow: hidden;
      transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
      transform-origin: bottom right;
    }
    #rooted-chat-window.hidden {
      opacity: 0; transform: scale(0.85); pointer-events: none;
    }

    /* Header */
    .chat-header {
      background: #3A5A40; padding: 1rem 1.25rem;
      display: flex; align-items: center; gap: 0.75rem;
    }
    .chat-header-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; flex-shrink: 0;
    }
    .chat-header-text { flex: 1; }
    .chat-header-text strong {
      display: block; color: white; font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif; font-weight: 700;
    }
    .chat-header-text span {
      color: rgba(255,255,255,0.6); font-size: 0.75rem;
      font-family: 'DM Sans', sans-serif;
    }
    .chat-close {
      background: none; border: none; color: rgba(255,255,255,0.6);
      font-size: 1.2rem; cursor: pointer; padding: 0.25rem;
      line-height: 1; transition: color 0.2s;
    }
    .chat-close:hover { color: white; }

    /* Messages */
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.75rem;
      scroll-behavior: smooth;
    }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-track { background: transparent; }
    .chat-messages::-webkit-scrollbar-thumb { background: #E0D8CC; border-radius: 2px; }

    .chat-msg {
      max-width: 88%; font-size: 0.88rem; line-height: 1.55;
      font-family: 'DM Sans', sans-serif;
    }
    .chat-msg.bot {
      align-self: flex-start;
      background: white; border: 1px solid #E0D8CC;
      border-radius: 14px 14px 14px 4px;
      padding: 0.75rem 1rem; color: #1C1209;
    }
    .chat-msg.user {
      align-self: flex-end;
      background: #C4622D; color: white;
      border-radius: 14px 14px 4px 14px;
      padding: 0.75rem 1rem;
    }
    .chat-msg.bot a {
      color: #C4622D; font-weight: 600;
    }

    /* Typing indicator */
    .chat-typing {
      align-self: flex-start;
      background: white; border: 1px solid #E0D8CC;
      border-radius: 14px 14px 14px 4px;
      padding: 0.75rem 1rem;
      display: flex; gap: 4px; align-items: center;
    }
    .chat-typing span {
      width: 7px; height: 7px; background: #8A7968;
      border-radius: 50%; animation: chatDot 1.2s infinite;
    }
    .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes chatDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* Suggestions */
    .chat-suggestions {
      display: flex; flex-wrap: wrap; gap: 0.4rem;
      padding: 0 1rem 0.75rem;
    }
    .chat-suggestion {
      background: white; border: 1px solid #E0D8CC;
      border-radius: 20px; padding: 0.35rem 0.8rem;
      font-size: 0.78rem; font-weight: 600; color: #3A5A40;
      cursor: pointer; transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;
    }
    .chat-suggestion:hover {
      background: #3A5A40; color: white; border-color: #3A5A40;
    }

    /* Input */
    .chat-input-row {
      display: flex; gap: 0.5rem; padding: 0.75rem 1rem 1rem;
      border-top: 1px solid #E0D8CC; background: white;
    }
    .chat-input {
      flex: 1; border: 1px solid #E0D8CC; border-radius: 50px;
      padding: 0.6rem 1rem; font-size: 0.88rem;
      font-family: 'DM Sans', sans-serif; color: #1C1209;
      background: #FDFAF5; outline: none; transition: border 0.2s;
    }
    .chat-input:focus { border-color: #C4622D; }
    .chat-send {
      width: 36px; height: 36px; border-radius: 50%;
      background: #C4622D; color: white; border: none;
      cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; flex-shrink: 0;
    }
    .chat-send:hover { background: #E8895A; }
    .chat-send:disabled { background: #E0D8CC; cursor: not-allowed; }

    /* Disclaimer */
    .chat-disclaimer {
      text-align: center; font-size: 0.68rem; color: #8A7968;
      padding: 0 1rem 0.5rem;
      font-family: 'DM Sans', sans-serif;
    }

    @media (max-width: 480px) {
      #rooted-chat-window { width: calc(100vw - 2rem); right: 1rem; bottom: 5rem; }
      #rooted-chat-bubble { bottom: 1.25rem; right: 1rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ───────────────────────────────────────────────────────────────
  const bubble = document.createElement('button');
  bubble.id = 'rooted-chat-bubble';
  bubble.setAttribute('aria-label', 'Open AI assistant');
  bubble.innerHTML = `🌱<span class="chat-label">Ask RootED AI</span>`;

  const win = document.createElement('div');
  win.id = 'rooted-chat-window';
  win.classList.add('hidden');
  win.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-icon">🌱</div>
      <div class="chat-header-text">
        <strong>RootED Assistant</strong>
        <span>AI-powered · East Bay resources</span>
      </div>
      <button class="chat-close" aria-label="Close chat">✕</button>
    </div>
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-suggestions" id="chatSuggestions"></div>
    <div class="chat-input-row">
      <input class="chat-input" id="chatInput" type="text"
        placeholder="Describe your situation…" autocomplete="off" />
      <button class="chat-send" id="chatSend" aria-label="Send">➤</button>
    </div>
    <p class="chat-disclaimer">For informational use only. Always verify directly with programs.</p>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(win);

  // ── State ────────────────────────────────────────────────────────────────────
  const history = [];
  let isOpen = false;
  let isLoading = false;

  const SYSTEM_PROMPT = `You are RootED Assistant, a warm and knowledgeable helper built into RootED — a platform connecting East Bay (Alameda County, California) residents to free and low-cost community resources.

Your job: help users find the right resource AND link them to the exact page on the RootED site that helps them. Always end your response with a clear action link using the formats below.

SITE PAGES — use these exact paths when linking:
- Resources directory: resources.html
- How to apply for CalFresh/EBT: apply.html#apply-calfresh (tab: CalFresh / EBT)
- How to apply for Medi-Cal: apply.html#apply-medical (tab: Medi-Cal)
- How to find a free clinic: apply.html#apply-clinic (tab: Free Clinic)
- How to get emergency shelter: apply.html#apply-shelter (tab: Emergency Shelter)
- Suggest a resource: suggest-resource.html
- Our story / credibility / who we are: about.html
- FAQ: faq.html

RESOURCE KNOWLEDGE:
- FOOD: Alameda County Community Food Bank (accfb.org), CalFresh/EBT (benefitscal.com — up to $973/mo family of 4), WIC for pregnant women and kids under 5, free meal sites Oakland/Hayward/Fremont
- HEALTH: Medi-Cal free insurance (benefitscal.com), La Clínica de La Raza (Oakland/Hayward, Spanish-speaking, laclinica.org), Roots Community Health Center (East Oakland), free vaccines at Alameda County Public Health (acphd.org), LifeLong Medical Care (Berkeley/Richmond)
- HOUSING: Call or text 211 immediately for shelter tonight, BOSS Oakland, Building Futures (Hayward/San Leandro), Covenant House (youth 18-24 Oakland), Alameda County rapid rehousing
- FINANCIAL: CalWORKs cash aid, PG&E REACH for utility bills, LIHEAP energy assistance, VITA free tax prep (under $67k), General Assistance for adults without children
- KIDS: Head Start/Early Head Start free preschool, free summer meals under 18, after-school programs Oakland/Fremont/Hayward
- LEGAL: Bay Area Legal Aid — free civil legal help, housing, immigration, benefits (baylegal.org)
- JOBS: Alameda County Workforce Development, Eastmont WorkSource Center — free training and job placement

ROUTING RULES — always follow these:
1. Resource question (food/health/housing/money/kids/legal/jobs) → answer with the specific program + link to resources.html or the relevant apply.html tab
2. "How do I apply for [program]" → walk through it briefly + link to the exact apply.html tab
3. FAQ-type question (am I eligible? do I need ID? is my info safe?) → answer it directly + link to faq.html for more
4. User wants to add/suggest a resource → acknowledge it warmly + link to suggest-resource.html
5. User asks who built this / why / is this legit → explain briefly + link to about.html
6. Immediate crisis (no shelter tonight, no food today) → lead with "Call or text 211 right now" before anything else

FORMAT RULES:
- 2-3 short paragraphs max. Plain language. No bullet walls.
- Always end with a line like: "👉 [View this in our directory](resources.html)" or "👉 [Step-by-step guide: CalFresh](apply.html)" — use markdown link format
- If user writes in Spanish, respond entirely in Spanish
- Never ask for name, SSN, address, or any identifying info`;

  const SUGGESTIONS = [
    'I need food for my family 🥗',
    'I need shelter tonight 🏠',
    'How do I apply for CalFresh? 📋',
    'Free healthcare near me 🏥',
    'I need help paying bills 💰',
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function scrollBottom() {
    const el = document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function addMessage(role, text) {
    const el = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    // simple link detection
    let html = text
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\[([^\]]+)\]\(([^)]+\.html[^)]*)\)/g, '<a href="$2">$1</a>')
      .replace(/((?<!href=")(https?:\/\/[^\s<"]+))/g, '<a href="$2" target="_blank" rel="noopener">$2</a>')
      .replace(/\n/g, '<br>');
    div.innerHTML = html;
    el.appendChild(div);
    scrollBottom();
    return div;
  }

  function showTyping() {
    const el = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.id = 'chatTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    el.appendChild(div);
    scrollBottom();
  }

  function removeTyping() {
    const t = document.getElementById('chatTyping');
    if (t) t.remove();
  }

  function showSuggestions(list) {
    const el = document.getElementById('chatSuggestions');
    el.innerHTML = '';
    list.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = s;
      btn.onclick = () => sendMessage(s);
      el.appendChild(btn);
    });
  }

  function hideSuggestions() {
    document.getElementById('chatSuggestions').innerHTML = '';
  }

  // ── Send ─────────────────────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;
    isLoading = true;

    hideSuggestions();
    addMessage('user', text);
    history.push({ role: 'user', content: text });

    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    if (input) input.value = '';
    if (send) send.disabled = true;

    showTyping();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('rooted_key') || '', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await res.json();
      removeTyping();

      const reply = data?.content?.[0]?.text || "I'm having trouble connecting right now. Please call 211 for immediate help, or browse our directory.";
      history.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);

    } catch {
      removeTyping();
      const fallback = "I'm having trouble connecting right now. For immediate help, call or text 211. You can also browse the RootED directory for resources.";
      addMessage('bot', fallback);
    }

    isLoading = false;
    if (send) send.disabled = false;
    if (input) input.focus();
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    win.classList.remove('hidden');
    bubble.innerHTML = `✕<span class="chat-label">Close</span>`;

    if (history.length === 0) {
      addMessage('bot', "Hi! I'm the RootED Assistant 🌱 I can help you find food, healthcare, housing, financial aid, and more across the East Bay.\n\nJust describe your situation in your own words — no jargon needed.");
      showSuggestions(SUGGESTIONS);
    }

    setTimeout(() => document.getElementById('chatInput')?.focus(), 100);
  }

  function closeChat() {
    isOpen = false;
    win.classList.add('hidden');
    bubble.innerHTML = `🌱<span class="chat-label">Ask RootED AI</span>`;
  }

  bubble.addEventListener('click', () => isOpen ? closeChat() : openChat());
  win.querySelector('.chat-close').addEventListener('click', closeChat);

  document.getElementById('chatSend').addEventListener('click', () => {
    const val = document.getElementById('chatInput').value;
    sendMessage(val);
  });

  document.getElementById('chatInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = e.target.value;
      sendMessage(val);
    }
  });

})();
