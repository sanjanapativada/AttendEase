const userKey = localStorage.getItem("currentUser") || "guest";

const data = JSON.parse(localStorage.getItem(userKey)) || {
  user:{name:"Guest",email:"",min:75},
  subjects:[],
  reminders:[]
};

const user = data.user;
let subjects = data.subjects;
let reminders = data.reminders;
const MIN = user.min;

const $ = id => document.getElementById(id);

// ---------- NAV ----------
function show(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  const section = $(id);
  section.classList.remove("hidden");

  if(id === "analytics") {
    setTimeout(drawCharts, 100); // ensure visible
  }
}

// ---------- CALCULATIONS ----------
const percent=(a,t)=>((a/t)*100).toFixed(1);
const need=(a,t)=>{let x=0;while(((a+x)/(t+x))*100<MIN)x++;return x;}
const safeSkips=(a,t)=>{let y=0;while((a/(t+y+1))*100>=MIN)y++;return y;}

// ---------- SUBJECTS ----------
function addSubject(){
  if(!sub.value || att.value<0 || tot.value<=0 || +att.value>+tot.value) return;
  subjects.push({name:sub.value,a:+att.value,t:+tot.value});
  sub.value=att.value=tot.value="";
  save();
}

function editSubject(i){
  const s=subjects[i];
  const a=+prompt("Attended classes:",s.a);
  const t=+prompt("Total classes:",s.t);
  if(a<0 || t<=0 || a>t) return;
  s.a=a; s.t=t;
  save();
}

function renderSubjects(){
  subjectsEl.innerHTML = subjects.map((s,i)=>{
    const p = percent(s.a,s.t);
    const safe = p >= MIN;
    return `
    <tr onclick="editSubject(${i})"
      class="cursor-pointer hover:bg-[#ecfdf5] dark:hover:bg-gray-700">
      <td class="p-3 font-semibold">${s.name}</td>
      <td class="p-3">${s.a}</td>
      <td class="p-3">${s.t}</td>
      <td class="p-3">${p}%</td>
      <td class="p-3 font-semibold ${
        safe ? "text-emerald-600 dark:text-emerald-400"
             : "text-red-600 dark:text-red-400"
      }">
        ${safe ? `Safe 😌 | Skip ${safeSkips(s.a,s.t)}`
               : `Attend ${need(s.a,s.t)}`}
      </td>
    </tr>`;
  }).join("");
}

// ---------- OVERALL ----------
function overall(){
  let A=0,T=0;
  subjects.forEach(s=>{A+=s.a;T+=s.t});
  return {A,T,p:T?(A/T*100):0};
}

function updateAlert(){
  const o=overall();
  alertBar.innerText = !o.T
    ? "Add subjects to start tracking attendance"
    : o.p<MIN
      ? `⚠️ Overall ${o.p.toFixed(1)}% — Attend ${need(o.A,o.T)} more`
      : `😌 Overall ${o.p.toFixed(1)}% — Safe zone`;
}

function renderOverallStats(){
  const o = overall();
  if(!o.T){ overallStats.innerHTML=""; return; }

  overallStats.innerHTML = `
    <div class="p-4 rounded-xl bg-[#ecfdf5] dark:bg-gray-800
                text-gray-900 dark:text-gray-100">
      Overall Attendance<br>
      <b class="text-2xl">${o.p.toFixed(1)}%</b>
    </div>

    <div class="p-4 rounded-xl bg-[#ecfdf5] dark:bg-gray-800
                text-gray-900 dark:text-gray-100">
      Classes to Attend<br>
      <b class="text-2xl">${o.p<MIN?need(o.A,o.T):0}</b>
    </div>

    <div class="p-4 rounded-xl bg-[#ecfdf5] dark:bg-gray-800
                text-gray-900 dark:text-gray-100">
      Safe Classes to Skip<br>
      <b class="text-2xl">${o.p>=MIN?safeSkips(o.A,o.T):0}</b>
    </div>`;
}

// ---------- CHARTS ----------
let barChart, pieChart;

function drawCharts(){
  const o = overall();
  if(!subjects.length) return;

  const barCanvas = document.getElementById("barChart");
  const pieCanvas = document.getElementById("pieChart");

  if(barChart) barChart.destroy();
  if(pieChart) pieChart.destroy();

  barChart = new Chart(barCanvas,{
    type:"bar",
    data:{
      labels:subjects.map(s=>s.name),
      datasets:[{
        label:"Attendance %",
        data:subjects.map(s=>percent(s.a,s.t)),
        backgroundColor:"#a7f3d0"
      }]
    },
    options:{
      responsive:true,
      scales:{y:{beginAtZero:true,max:100}}
    }
  });

  pieChart = new Chart(pieCanvas,{
    type:"pie",
    data:{
      labels:["Attended","Missed"],
      datasets:[{
        data:[o.A,o.T-o.A],
        backgroundColor:["#6ee7b7","#bfdbfe"]
      }]
    }
  });
}

// ---------- REMINDERS ----------
function addReminder(){
  reminders.push({subject:remSub.value,day:remDay.value,time:remTime.value});
  remSub.value=remDay.value=remTime.value="";
  save();
}

function renderReminders(){
  reminderList.innerHTML = reminders.map(r=>`
    <li class="p-3 rounded bg-[#ecfdf5] dark:bg-gray-800
               flex justify-between items-center">
      ${r.subject} – ${r.day} ${r.time}
      <button onclick="sendClassReminder('${r.subject}','${r.time}')"
        class="text-emerald-600 dark:text-emerald-400">
        Send
      </button>
    </li>`).join("");
}

// ---------- PROFILE ----------
function renderProfile(){
  profileData.innerHTML = `
    <p><b>User:</b> ${user.name}</p>
    <p><b>Minimum Attendance:</b> ${user.min}%</p>
  `;
}

// ---------- THEME ----------
function toggleTheme(){
  document.documentElement.classList.toggle("dark");
}

// ---------- SAVE ----------
function save(){
  localStorage.setItem(userKey,JSON.stringify({user,subjects,reminders}));
  renderSubjects();
  renderOverallStats();
  updateAlert();
  renderReminders();
  renderProfile();
  drawCharts();
}

const subjectsEl = document.getElementById("subjects");
save();
