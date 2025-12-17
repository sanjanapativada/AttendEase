/*********************************
 * ATTENDEASE – FINAL STABLE APP
 *********************************/

// ---------- LOAD USER ----------
const userKey = localStorage.getItem("currentUser") || "guest";
const data = JSON.parse(localStorage.getItem(userKey)) || {
  user: { name: "Guest", email: "", min: 75 },
  subjects: [],
  reminders: []
};

const user = data.user;
let subjects = data.subjects;
let reminders = data.reminders;
const MIN = user.min;

// ---------- HELPERS ----------
const $ = id => document.getElementById(id);

// ---------- NAV ----------
function show(id){
  document.querySelectorAll(".section").forEach(s =>
    s.classList.add("hidden")
  );
  $(id).classList.remove("hidden");
}

// ---------- CALCULATIONS ----------
function percent(a, t){
  return ((a / t) * 100).toFixed(1);
}

function need(a, t){
  let x = 0;
  while (((a + x) / (t + x)) * 100 < MIN) x++;
  return x;
}

function safeSkips(a, t){
  let y = 0;
  while ((a / (t + y + 1)) * 100 >= MIN) y++;
  return y;
}

// ---------- SUBJECTS ----------
function addSubject(){
  const name = $("sub").value.trim();
  const a = Number($("att").value);
  const t = Number($("tot").value);

  if (!name || isNaN(a) || isNaN(t) || a < 0 || t <= 0 || a > t) {
    alert("Please enter valid subject data");
    return;
  }

  subjects.push({ name, a, t });

  $("sub").value = "";
  $("att").value = "";
  $("tot").value = "";

  save();
}

function editSubject(index){
  const s = subjects[index];

  const a = Number(prompt(`Attended classes for ${s.name}:`, s.a));
  const t = Number(prompt(`Total classes for ${s.name}:`, s.t));

  if (isNaN(a) || isNaN(t) || a < 0 || t <= 0 || a > t) {
    alert("Invalid values");
    return;
  }

  s.a = a;
  s.t = t;
  save();
}

// ---------- RENDER SUBJECT TABLE ----------
function renderSubjects(){
  const tbody = $("subjects");
  if (!tbody) return;

  tbody.innerHTML = "";

  subjects.forEach((s, i) => {
    const p = percent(s.a, s.t);

    const status =
      p < MIN
        ? `Attend ${need(s.a, s.t)} more`
        : `Safe 😌 | Skip ${safeSkips(s.a, s.t)} classes`;

    tbody.innerHTML += `
      <tr onclick="editSubject(${i})"
          class="cursor-pointer hover:bg-[#ecfdf5] dark:hover:bg-gray-700 transition">
        <td class="p-3 text-left font-semibold">${s.name}</td>
        <td class="p-3">${s.a}</td>
        <td class="p-3">${s.t}</td>
        <td class="p-3">${p}%</td>
        <td class="p-3 font-semibold">${status}</td>
      </tr>
    `;
  });
}

// ---------- OVERALL ATTENDANCE ----------
function overall(){
  let A = 0, T = 0;
  subjects.forEach(s => {
    A += s.a;
    T += s.t;
  });
  return { A, T, p: T ? (A / T) * 100 : 0 };
}

// ---------- ALERT ----------
function updateAlert(){
  const bar = $("alertBar");
  if (!bar) return;

  const o = overall();

  if (!o.T) {
    bar.innerText = "Add subjects to start tracking attendance";
    return;
  }

  bar.innerText =
    o.p < MIN
      ? `⚠️ Overall ${o.p.toFixed(1)}% — Attend ${need(o.A, o.T)} more classes`
      : `😌 Overall ${o.p.toFixed(1)}% — You are in the safe zone`;
}

// ---------- OVERALL STATS ----------
function renderOverallStats(){
  const box = $("overallStats");
  if (!box) return;

  const o = overall();
  if (!o.T) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = `
    <div class="bg-[#ecfdf5] p-4 rounded-xl">
      Overall Attendance<br>
      <b>${o.p.toFixed(1)}%</b>
    </div>

    <div class="bg-[#ecfdf5] p-4 rounded-xl">
      Classes to Attend<br>
      <b>${o.p < MIN ? need(o.A, o.T) : 0}</b>
    </div>

    <div class="bg-[#ecfdf5] p-4 rounded-xl">
      Safe Classes to Skip<br>
      <b>${o.p >= MIN ? safeSkips(o.A, o.T) : 0}</b>
    </div>
  `;
}

// ---------- ANALYTICS ----------
let barChart = null;
let pieChart = null;

function drawCharts(){
  const o = overall();

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart($("barChart"), {
    type: "bar",
    data: {
      labels: subjects.map(s => s.name),
      datasets: [{
        label: "Attendance %",
        data: subjects.map(s => percent(s.a, s.t)),
        backgroundColor: "#a7f3d0"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  pieChart = new Chart($("pieChart"), {
    type: "pie",
    data: {
      labels: ["Attended", "Missed"],
      datasets: [{
        data: [o.A, o.T - o.A],
        backgroundColor: ["#6ee7b7", "#bfdbfe"]
      }]
    }
  });
}

// ---------- REMINDERS ----------
function addReminder(){
  const subject = $("remSub").value;
  const day = $("remDay").value;
  const time = $("remTime").value;

  if (!subject || !day || !time) {
    alert("Fill all reminder fields");
    return;
  }

  reminders.push({ subject, day, time });

  $("remSub").value = "";
  $("remDay").value = "";
  $("remTime").value = "";

  save();
}

function renderReminders(){
  const list = $("reminderList");
  if (!list) return;

  list.innerHTML = "";

  reminders.forEach(r => {
    list.innerHTML += `
      <li class="p-3 bg-[#ecfdf5] rounded flex justify-between items-center">
        <span>📚 <b>${r.subject}</b> — ${r.day}, ${r.time}</span>
        <button
          onclick="sendClassReminder('${r.subject}','${r.time}')"
          class="text-emerald-600 font-semibold text-sm">
          Send Email
        </button>
      </li>
    `;
  });
}

// ---------- PROFILE (CLEAN UI) ----------
function renderProfile(){
  const box = $("profileData");
  if (!box) return;

  if (user.name === "Guest") {
    box.innerHTML = `
      <p class="text-xl font-semibold mb-2">👤 Guest User</p>
      <p><b>Minimum Attendance:</b> ${user.min}%</p>
      <p class="text-sm text-gray-500 mt-2">
        Guest data is temporary and not stored permanently.
      </p>
    `;
  } else {
    box.innerHTML = `
      <p class="text-xl font-semibold mb-2">👤 User Profile</p>
      <p><b>Name:</b> ${user.name}</p>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>Minimum Attendance:</b> ${user.min}%</p>
    `;
  }
}

// ---------- THEME ----------
function toggleTheme(){
  document.documentElement.classList.toggle("dark");
}

// ---------- SAVE ----------
function save(){
  localStorage.setItem(
    userKey,
    JSON.stringify({ user, subjects, reminders })
  );

  renderSubjects();
  renderOverallStats();
  updateAlert();
  renderReminders();
  drawCharts();
  renderProfile();
}

// ---------- INIT ----------
save();
