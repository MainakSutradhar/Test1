const sampleSkills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Svelte",
  "Node.js", "Express", "Python", "Django", "Flask", "FastAPI",
  "Go", "Rust", "Java", "Spring", "Kotlin", "Swift",
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis",
  "Tailwind CSS", "CSS", "HTML", "GraphQL", "REST API",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes",
  "Machine Learning", "Deep Learning", "NLP", "Data Science",
  "Figma", "UI/UX", "Product Design", "Project Management"
];

const skillIcons = {
  "JavaScript": "🟨",
  "TypeScript": "🟦",
  "React": "⚛️",
  "Next.js": "⏭️",
  "Vue": "🟢",
  "Svelte": "🟠",
  "Node.js": "🟩",
  "Express": "🧭",
  "Python": "🐍",
  "Django": "🌿",
  "Flask": "🍶",
  "FastAPI": "⚡",
  "Go": "🐹",
  "Rust": "🦀",
  "Java": "☕",
  "Spring": "🌱",
  "Kotlin": "🟪",
  "Swift": "🟧",
  "MongoDB": "🍃",
  "PostgreSQL": "🐘",
  "MySQL": "💠",
  "SQLite": "🧩",
  "Redis": "🟥",
  "Tailwind CSS": "🌬️",
  "CSS": "🎨",
  "HTML": "🧱",
  "GraphQL": "🔺",
  "REST API": "🔌",
  "AWS": "☁️",
  "GCP": "☁️",
  "Azure": "☁️",
  "Docker": "🐳",
  "Kubernetes": "☸️",
  "Machine Learning": "🧠",
  "Deep Learning": "🧬",
  "NLP": "🗣️",
  "Data Science": "📊",
  "Figma": "🎛️",
  "UI/UX": "💡",
  "Product Design": "📐",
  "Project Management": "📋"
};

function getSkillIcon(skill) {
  return skillIcons[skill] || skill[0];
}

const sampleProfiles = [
  {
    id: "p1",
    name: "Aisha Khan",
    email: "aisha@example.com",
    organization: "IIT Delhi",
    location: "Delhi, IN",
    skills: ["React", "Node.js", "Tailwind CSS", "PostgreSQL"],
    readme: "Front-end focused full-stack dev. Loves building polished UX.",
    github: "https://github.com/aisha",
    linkedin: "https://linkedin.com/in/aisha"
  },
  {
    id: "p2",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    organization: "BITS Pilani",
    location: "Hyderabad, IN",
    skills: ["Python", "FastAPI", "MongoDB", "Docker"],
    readme: "Backend engineer with API and data modeling expertise.",
    github: "https://github.com/rahul",
    linkedin: "https://linkedin.com/in/rahul"
  },
  {
    id: "p3",
    name: "Sara Lee",
    email: "sara@example.com",
    organization: "NUS",
    location: "Singapore",
    skills: ["Machine Learning", "NLP", "Python", "AWS"],
    readme: "ML practitioner focusing on NLP and model serving.",
    github: "https://github.com/sara",
    linkedin: "https://linkedin.com/in/sara"
  }
];

const sampleTeams = [
  {
    id: "t1",
    name: "Dev Dynamos",
    lookingFor: ["React", "Tailwind CSS"],
    location: "Remote",
    description: "Frontend help for realtime collab tool.",
    members: ["Akash", "Meera"]
  },
  {
    id: "t2",
    name: "Data Sprinters",
    lookingFor: ["FastAPI", "PostgreSQL"],
    location: "Bengaluru, IN",
    description: "Need backend lead to scale APIs.",
    members: ["Liang", "Pooja", "Tom"]
  },
  {
    id: "t3",
    name: "Visioneers",
    lookingFor: ["Machine Learning", "AWS"],
    location: "Remote",
    description: "Computer vision app for accessibility.",
    members: ["Chloe"]
  }
];

const state = {
  tab: "teammate",
  selectedSkills: new Set(),
  locationFilter: "",
  chatContext: null,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function init() {
  bindTabs();
  bindFilters();
  bindNavLinks();
  renderSkills();
  applyFilters();
  setupChat();
  renderSuggestions();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  headerOnScroll();
  window.addEventListener('scroll', headerOnScroll, { passive: true });
}

function bindTabs() {
  const tabTeammate = $("#tabTeammate");
  const tabTeam = $("#tabTeam");
  tabTeammate.addEventListener("click", () => {
    state.tab = "teammate";
    tabTeammate.classList.add("active");
    tabTeam.classList.remove("active");
    applyFilters();
  });
  tabTeam.addEventListener("click", () => {
    state.tab = "team";
    tabTeam.classList.add("active");
    tabTeammate.classList.remove("active");
    applyFilters();
  });
}

function bindFilters() {
  $("#skillSearch").addEventListener("input", renderSkills);
  $("#locationFilter").addEventListener("input", (e) => {
    state.locationFilter = e.target.value.toLowerCase();
    applyFilters();
  });
  const clear = document.getElementById('clearSkillsBtn');
  if (clear) clear.addEventListener('click', () => { state.selectedSkills.clear(); renderSkills(); applyFilters(); });
}

function bindNavLinks() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      if (hash === '#search') {
        e.preventDefault();
        showSearchPanel();
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', hash);
        return;
      }
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', hash);
      }
    });
  });
}

// search panel is visible by default now

function revealOnScroll() {
  const cards = document.querySelectorAll('.feature-card, .fade-up');
  const viewportBottom = window.scrollY + window.innerHeight;
  cards.forEach((el, idx) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    if (viewportBottom > top + 60) {
      setTimeout(() => el.classList.add('revealed'), idx * 80);
    }
  });
  const popCards = document.querySelectorAll('#suggestionsGrid .card, #resultsGrid .card');
  popCards.forEach((el, idx) => {
    el.classList.add('card-pop');
    const rect2 = el.getBoundingClientRect();
    const top2 = rect2.top + window.scrollY;
    if (viewportBottom > top2 + 60) {
      setTimeout(() => el.classList.add('revealed'), idx * 60);
    }
  });
}

function headerOnScroll() {
  const header = document.querySelector('.app-header');
  if (!header) return;
  if (window.scrollY > 4) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}

function renderSkills() {
  const list = $("#skillsList");
  const term = $("#skillSearch").value.toLowerCase();
  list.innerHTML = "";
  sampleSkills
    .filter((s) => s.toLowerCase().includes(term))
    .slice(0, 50)
    .forEach((skill) => {
      const item = document.createElement("div");
      item.className = "skill-item";
      const checked = state.selectedSkills.has(skill);
      item.innerHTML = `
        <div class="skill-left">
          <div class="skill-icon" aria-hidden="true">${getSkillIcon(skill)}</div>
          <span>${skill}</span>
        </div>
        <button class="skill-check ${checked ? 'selected' : ''}" aria-label="${checked ? 'Deselect' : 'Select'} ${skill}">✓</button>
      `;
      item.querySelector('.skill-check').addEventListener("click", (e) => { e.stopPropagation(); toggleSkill(skill); });
      item.addEventListener("click", () => toggleSkill(skill));
      list.appendChild(item);
    });
  renderSelectedChips();
}

function toggleSkill(skill) {
  if (state.selectedSkills.has(skill)) state.selectedSkills.delete(skill);
  else state.selectedSkills.add(skill);
  renderSkills();
  applyFilters();
}

function renderSelectedChips() {
  const container = $("#selectedSkills");
  container.innerHTML = "";
  if (state.selectedSkills.size === 0) {
    const hint = document.createElement("p");
    hint.className = "text-xs text-slate-400";
    hint.textContent = "No skills selected";
    container.appendChild(hint);
    return;
  }
  [...state.selectedSkills].forEach((skill) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${skill} <button aria-label="Remove ${skill}">✕</button>`;
    chip.querySelector("button").addEventListener("click", () => {
      state.selectedSkills.delete(skill);
      renderSkills();
      applyFilters();
    });
    container.appendChild(chip);
  });
}

function applyFilters() {
  const resultsGrid = $("#resultsGrid");
  const emptyState = $("#emptyState");
  resultsGrid.innerHTML = "";

  const skills = [...state.selectedSkills];
  const hasSkills = (arr) => skills.every((s) => arr.includes(s));

  if (state.tab === "teammate") {
    const title = document.getElementById('resultsTitle');
    if (title) title.textContent = 'Matching Teammates';
    const filtered = sampleProfiles.filter((p) =>
      (!state.locationFilter || p.location.toLowerCase().includes(state.locationFilter)) &&
      (skills.length === 0 || hasSkills(p.skills))
    );
    filtered.forEach((p) => resultsGrid.appendChild(renderProfileCard(p)));
    const count = document.getElementById('resultsCount');
    if (count) count.textContent = `${filtered.length} result${filtered.length!==1?'s':''}`;
    emptyState.classList.toggle("hidden", filtered.length !== 0);
  } else {
    const title = document.getElementById('resultsTitle');
    if (title) title.textContent = 'Matching Teams';
    const filtered = sampleTeams.filter((t) =>
      (!state.locationFilter || t.location.toLowerCase().includes(state.locationFilter)) &&
      (skills.length === 0 || hasSkills(t.lookingFor))
    );
    filtered.forEach((t) => resultsGrid.appendChild(renderTeamCard(t)));
    const count = document.getElementById('resultsCount');
    if (count) count.textContent = `${filtered.length} result${filtered.length!==1?'s':''}`;
    emptyState.classList.toggle("hidden", filtered.length !== 0);
  }
}

function renderSuggestions() {
  const grid = document.getElementById('suggestionsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  sampleProfiles.slice(0, 3).forEach((p) => grid.appendChild(renderProfileCard(p)));
}

function renderProfileCard(p) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-body">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 grid place-items-center text-slate-900">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12zm0 2c-4.418 0-8 2.91-8 6.5 0 .828.672 1.5 1.5 1.5h13c.828 0 1.5-.672 1.5-1.5 0-3.59-3.582-6.5-8-6.5z"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold">${p.name}</h4>
            <p class="text-xs text-slate-400">${p.organization} • ${p.location}</p>
          </div>
        </div>
        <span class="badge">Profile</span>
      </div>
      <p class="mt-3 text-sm text-slate-300">${p.readme}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${p.skills.map((s) => `<span class="badge">${s}</span>`).join("")}
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs">
          <a href="mailto:${p.email}" class="text-cyan-300 hover:underline">${p.email}</a>
          ${p.github ? `<a href="${p.github}" target="_blank" class="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 hover:bg-white/10">GitHub</a>` : ''}
          ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 hover:bg-white/10">LinkedIn</a>` : ''}
        </div>
        <button class="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15" data-action="chat" data-type="profile" data-id="${p.id}" data-name="${p.name}">Chat</button>
      </div>
    </div>
  `;
  card.querySelector('[data-action="chat"]').addEventListener("click", () => openChat({ type: "profile", targetId: p.id, name: p.name }));
  return card;
}

function renderTeamCard(t) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-body">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h4 class="font-semibold">${t.name}</h4>
          <p class="text-xs text-slate-400">${t.location} • ${t.members.length} member${t.members.length>1?"s":""}</p>
        </div>
        <span class="badge">Team</span>
      </div>
      <p class="mt-3 text-sm text-slate-300">${t.description}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${t.lookingFor.map((s) => `<span class="badge">Needs: ${s}</span>`).join("")}
      </div>
      <div class="mt-4 flex items-center justify-end">
        <button class="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15" data-action="chat" data-type="team" data-id="${t.id}" data-name="${t.name}">Chat</button>
      </div>
    </div>
  `;
  card.querySelector('[data-action="chat"]').addEventListener("click", () => openChat({ type: "team", targetId: t.id, name: t.name }));
  return card;
}

function setupChat() {
  $("#closeChat").addEventListener("click", closeChat);
  $("#sendBtn").addEventListener("click", sendMessage);
  $("#messageInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  $("#approveBtn").addEventListener("click", () => addSystemMessage("You approved this teammate."));
  $("#rejectBtn").addEventListener("click", () => addSystemMessage("You rejected this candidate."));
  $("#acceptBtn").addEventListener("click", () => addSystemMessage("You accepted the invite."));
  $("#declineBtn").addEventListener("click", () => addSystemMessage("You rejected the invite."));
}

function openChat(ctx) {
  state.chatContext = ctx;
  $("#chatWith").textContent = ctx.name;
  $("#chatSub").textContent = ctx.type === "profile" ? "Recruiter actions enabled" : "Applicant actions enabled";
  $("#recruiterActions").classList.toggle("hidden", ctx.type !== "profile");
  $("#applicantActions").classList.toggle("hidden", ctx.type !== "team");
  $("#messages").innerHTML = "";
  addSystemMessage("Conversation started. Attachments and links are supported.");
  $("#chatModal").classList.remove("hidden");
  $("#chatModal").classList.add("flex");
  document.body.classList.add('modal-open');
  $("#messageInput").focus();
}

function closeChat() {
  $("#chatModal").classList.add("hidden");
  $("#chatModal").classList.remove("flex");
  document.body.classList.remove('modal-open');
}

function sendMessage() {
  const input = $("#messageInput");
  const text = input.value.trim();
  const fileInput = $("#attachmentInput");
  if (!text && !fileInput.files.length) return;

  if (text) addChatMessage({ text, fromSelf: true });
  if (fileInput.files.length) {
    const file = fileInput.files[0];
    addChatMessage({ attachment: file.name, fromSelf: true });
    fileInput.value = "";
  }
  input.value = "";
}

function addSystemMessage(text) {
  addChatMessage({ text, fromSelf: false, system: true });
}

function addChatMessage({ text = "", attachment = null, fromSelf = false, system = false }) {
  const container = $("#messages");
  const row = document.createElement("div");
  row.className = `flex ${fromSelf ? "justify-end" : "justify-start"}`;
  const bubble = document.createElement("div");
  bubble.className = `bubble max-w-[75%] rounded-xl px-3 py-2 text-sm ${
    system ? "bubble-system" : fromSelf ? "bubble-self" : "bubble-other"
  }`;
  if (text) {
    const maybeLink = linkify(text);
    bubble.innerHTML = maybeLink;
  }
  if (attachment) {
    const att = document.createElement("div");
    att.className = "mt-1 text-xs text-slate-300";
    att.innerHTML = `📎 ${attachment}`;
    bubble.appendChild(att);
  }
  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="underline text-cyan-300">${url}</a>`);
}

document.addEventListener("DOMContentLoaded", init);

