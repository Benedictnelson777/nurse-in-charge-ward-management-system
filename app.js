/* ============================================================
   WARDMATE — Nurse Incharge System · app.js
    — VANILLA CSS REFACTOR —
   ============================================================ */

// ── WARD CONFIG ──────────────────────────────────────────────
const WARDS = {
  gen: { id: 'gen', name: 'General Ward', icon: '🏥', totalBeds: 10 },
  mat: { id: 'mat', name: 'Maternity Ward', icon: '👶', totalBeds: 8 },
  icu: { id: 'icu', name: 'ICU', icon: '❤️', totalBeds: 6 },
  surg: { id: 'surg', name: 'Surgical Ward', icon: '🔬', totalBeds: 8 },
  ped: { id: 'ped', name: 'Pediatric Ward', icon: '🧒', totalBeds: 8 },
};

// ── STATE ────────────────────────────────────────────────────
const State = {
  beds: {},
  staff: [],
  store: [],
  incidents: [],
  activities: [],
  storeFilter: 'all',
  admitTarget: null,
};

// ── DEMO DATA ────────────────────────────────────────────────
const DEMO_PATIENTS = [
  { bed: 'G-01', ward: 'gen', name: 'James Otieno', age: 54, sex: 'M', admitDate: '2026-02-15', diagnosis: 'Hypertensive Crisis', doctor: 'Dr. Shepherd', allergies: 'None', blood: 'B+', diet: 'Low sodium', lines: ['IV cannula R-arm'], notes: 'BP monitoring q4h. On IV labetalol.', status: 'occupied', flagCritical: false },
  { bed: 'G-02', ward: 'gen', name: 'Esther Wambui', age: 38, sex: 'F', admitDate: '2026-02-17', diagnosis: 'Typhoid Fever', doctor: 'Dr. Torres', allergies: 'PCN', blood: 'O+', diet: 'Soft', lines: ['IV line L-arm'], notes: 'Day 3 of ceftriaxone. Temp settling.', status: 'occupied', flagCritical: false },
  { bed: 'G-03', ward: 'gen', name: 'Peter Maina', age: 67, sex: 'M', admitDate: '2026-02-14', diagnosis: 'COPD Exacerbation', doctor: 'Dr. Shepherd', allergies: 'None', blood: 'A-', diet: 'Regular', lines: ['Nasal prongs O2'], notes: 'SpO2 >92% on 2L O2. Due CXR review.', status: 'critical', flagCritical: true },
  { bed: 'G-05', ward: 'gen', name: 'Mary Akinyi', age: 29, sex: 'F', admitDate: '2026-02-18', diagnosis: 'Malaria (Severe)', doctor: 'Dr. Hunt', allergies: 'None', blood: 'A+', diet: 'Soft', lines: ['IV artesunate'], notes: 'Parasite count improving. Monitor urine output.', status: 'occupied', flagCritical: false },
  { bed: 'G-07', ward: 'gen', name: 'David Kipchoge', age: 45, sex: 'M', admitDate: '2026-02-16', diagnosis: 'Peptic Ulcer Disease', doctor: 'Dr. Torres', allergies: 'NSAIDs', blood: 'O-', diet: 'Bland', lines: [], notes: 'Nil per oral for scope tomorrow.', status: 'pending', flagCritical: false },
  { bed: 'G-09', ward: 'gen', name: 'Rose Njeri', age: 72, sex: 'F', admitDate: '2026-02-13', diagnosis: 'Stroke (CVA) — Recovery', doctor: 'Dr. Shepherd', allergies: 'None', blood: 'B-', diet: 'NGT feeds', lines: ['NGT', 'IDC'], notes: 'Physiotherapy daily. Swallowing assessment pending.', status: 'occupied', flagCritical: false },
  { bed: 'M-01', ward: 'mat', name: 'Grace Njeri', age: 26, sex: 'F', admitDate: '2026-02-18', diagnosis: 'Post-LSCS Day 1', doctor: 'Dr. Robbins', allergies: 'None', blood: 'B+', diet: 'Soft', lines: ['IV cannula'], notes: 'Uterus well contracted. Wound dry.', status: 'occupied', flagCritical: false },
  { bed: 'M-02', ward: 'mat', name: 'Fatuma Shukri', age: 22, sex: 'F', admitDate: '2026-02-17', diagnosis: 'Preterm Labour 34wks', doctor: 'Dr. Robbins', allergies: 'None', blood: 'O+', diet: 'Regular', lines: ['IV MgSO4'], notes: 'Contractions 3:10. Fetal heart 148bpm. Tocolysis ongoing.', status: 'critical', flagCritical: true },
  { bed: 'ICU-01', ward: 'icu', name: 'Samuel Korir', age: 58, sex: 'M', admitDate: '2026-02-13', diagnosis: 'Septic Shock', doctor: 'Dr. Burke', allergies: 'None', blood: 'O+', diet: 'TPN', lines: ['CVP line', 'IDC', 'Art line'], notes: 'MAP >65 on vasopressors. Cultures pending.', status: 'critical', flagCritical: true },
  { bed: 'S-02', ward: 'surg', name: 'Brian Otieno', age: 35, sex: 'M', admitDate: '2026-02-17', diagnosis: 'Appendectomy Day 1', doctor: 'Dr. Altman', allergies: 'None', blood: 'A+', diet: 'Fluid then soft', lines: ['IV cannula'], notes: 'Wound dry. Tolerating fluids. Encourage ambulation.', status: 'occupied', flagCritical: false },
];

const DEMO_STUDENTS = [
  { name: 'Student George O.', school: 'SGH', year: 'Intern', mentor: 'Sr. Bailey', status: 'on-duty', assignment: 'General' },
  { name: 'Student Izzie S.', school: 'SGH', year: 'Intern', mentor: 'Nurse Karev', status: 'on-duty', assignment: 'Maternity' },
  { name: 'Student Lexie G.', school: 'Harvard', year: 'Resident', mentor: 'Nurse Grey', status: 'on-break', assignment: 'Neuro' },
];

const DEMO_STORE = [
  { id: 'st-01', name: 'Paracetamol 1g', count: 45, min: 20, unit: 'vials' },
  { id: 'st-02', name: 'Ceftriaxone 1g', count: 8, min: 15, unit: 'vials' },
  { id: 'st-03', name: 'N/S 500ml', count: 120, min: 50, unit: 'bags' },
  { id: 'st-04', name: 'Gloves (M)', count: 4, min: 10, unit: 'boxes' },
  { id: 'st-05', name: 'Syringes 5ml', count: 200, min: 100, unit: 'pcs' },
];

const DEMO_STAFF = [
  { name: 'Sr. Miranda Bailey', designation: 'Unit Manager', status: 'on-duty', hours: '06:00–20:00', assignment: 'Command Centre', totalHours: 72, compliance: 'crit', leave: 'REFUSED' },
  { name: 'Nurse Meredith Grey', designation: 'Senior Nurse', status: 'on-duty', hours: '08:00–20:00', assignment: 'General Ward', totalHours: 48, compliance: 'warn', leave: 'Due Soon' },
  { name: 'Nurse Cristina Yang', designation: 'ICU Specialist', status: 'on-break', hours: '05:00–22:00', assignment: 'ICU', totalHours: 90, compliance: 'crit', leave: 'Never' },
  { name: 'Nurse Alex Karev', designation: 'Peds Nurse', status: 'off', hours: 'Off Duty', assignment: '—', totalHours: 40, compliance: 'ok', leave: 'OK' },
  { name: 'Nurse Richard Webber', designation: 'Clinical Instructor', status: 'on-duty', hours: '07:00–15:00', assignment: 'Surgical', totalHours: 35, compliance: 'ok', leave: 'OK' },
];

// ── UTILS ────────────────────────────────────────────────────
const esc = s => s ? String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
const stockStatus = i => i.count <= i.min ? (i.count <= i.min / 2 ? 'critical' : 'low') : 'ok';
function logActivity(icon, text) {
  State.activities.unshift({ icon, text, time: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) });
  renderActivityFeed();
}
function toast(msg) {
  const el = document.getElementById('toastContainer');
  if (el) {
    const t = document.createElement('div');
    t.className = 'badge badge-teal';
    t.style.padding = '1rem'; t.style.background = '#0d9488'; t.style.color = 'white';
    t.textContent = msg;
    el.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
}

// ── NAVIGATION ───────────────────────────────────────────────
function navigate(viewId, wardId = null) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.classList.add('hidden');
  });

  // Show target
  const vid = wardId ? 'view-ward' : `view-${viewId}`;
  const target = document.getElementById(vid);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  // Sidebar active state
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btnSelector = (viewId === 'ward') ? `.nav-btn[data-view="ward-${wardId}"]` : `.nav-btn[data-view="${viewId}"]`;
  const btn = document.querySelector(btnSelector);
  if (btn) btn.classList.add('active');

  // Logic
  if (viewId === 'overview') renderDashboard();
  if (viewId === 'ward' && wardId) renderWard(wardId);
  if (viewId === 'staff') renderStaff();
  if (viewId === 'store') renderStore();
  if (viewId === 'incidents') renderIncidents();
  if (viewId === 'reports') renderReports();
  if (viewId === 'ai') renderAI();
}

// ── DASHBOARD ────────────────────────────────────────────────
function renderDashboard() {
  const allBeds = Object.values(State.beds).flat();
  const occ = allBeds.filter(b => b.patient).length;
  const crit = allBeds.filter(b => b.status === 'critical').length;
  const staff = State.staff.filter(s => s.status === 'on-duty').length + DEMO_STUDENTS.filter(s => s.status === 'on-duty').length;

  const kpis = [
    { label: 'Occupancy', val: occ, color: 'var(--color-teal-500)' },
    { label: 'Critical', val: crit, color: 'var(--color-red-500)' },
    { label: 'Staffing', val: staff, color: 'var(--color-blue-500)' },
    { label: 'Incidents', val: State.incidents.length, color: 'var(--color-amber-500)' },
  ];

  const kpiEl = document.getElementById('kpiPills');
  if (kpiEl) {
    kpiEl.innerHTML = kpis.map(k => `
      <div class="kpi-card">
        <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">${k.label}</div>
        <div style="font-size:2rem; font-weight:800; font-family:var(--font-mono); color:${k.color}">${k.val}</div>
      </div>
    `).join('');
  }

  const wardEl = document.getElementById('wardRows');
  if (wardEl) {
    wardEl.innerHTML = Object.values(WARDS).map(w => {
      const b = State.beds[w.id] || [];
      const o = b.filter(x => x.patient).length;
      const pct = Math.round((o / w.totalBeds) * 100);
      const color = pct > 80 ? 'var(--color-red-500)' : pct > 50 ? 'var(--color-amber-500)' : 'var(--color-teal-500)';
      return `
        <div class="card" onclick="navigate('ward','${w.id}')" style="cursor:pointer; padding:0.75rem; border:1px solid var(--border-light); background:rgba(255,255,255,0.03);">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
             <div style="font-weight:700;">${w.icon} ${w.name}</div>
             <div style="font-family:var(--font-mono); font-size:0.8rem; color:${color};">${o}/${w.totalBeds}</div>
          </div>
          <div style="height:4px; background:var(--color-slate-800); border-radius:2px; overflow:hidden;">
             <div style="height:100%; width:${pct}%; background:${color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  const critDiv = document.getElementById('critPatientList');
  if (critDiv) {
    const list = allBeds.filter(b => b.status === 'critical');
    if (list.length) {
      critDiv.classList.remove('hidden');
      critDiv.innerHTML = `
         <div style="margin-top:1rem; border:1px solid var(--color-red-900); background:rgba(127,29,29,0.2); border-radius:0.75rem; padding:1rem;">
            <div style="color:var(--color-red-500); font-weight:700; font-size:0.8rem; text-transform:uppercase; margin-bottom:0.5rem;">⚠️ Critical Attention Needed</div>
            ${list.map(b => `
              <div class="btn-secondary" style="padding:0.5rem; border-radius:0.5rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem; cursor:pointer;" onclick="openPatientModal('${b.ward}','${b.id}')">
                 <span class="anim-pulse" style="width:8px; height:8px; background:var(--color-red-500); border-radius:50%;"></span>
                 <span style="font-weight:700;">${b.patient.name}</span>
                 <span style="font-size:0.8rem; color:var(--text-muted); margin-left:auto;">${b.id}</span>
              </div>
            `).join('')}
         </div>
       `;
    } else critDiv.classList.add('hidden');
  }
  renderActivityFeed();
}

function renderActivityFeed() {
  const el = document.getElementById('activityFeed');
  if (el) el.innerHTML = State.activities.slice(0, 10).map(a => `
    <div style="padding:0.5rem; border-bottom:1px solid var(--border-light); display:flex; gap:0.5rem; font-size:0.85rem;">
      <span>${a.icon}</span>
      <span style="color:var(--text-muted); flex:1;">${a.text}</span>
      <span style="font-family:var(--font-mono); font-size:0.7rem; opacity:0.7;">${a.time}</span>
    </div>
  `).join('');
}

// ── WARD ─────────────────────────────────────────────────────
function renderWard(wardId) {
  const w = WARDS[wardId];
  if (!w) return;

  document.getElementById('ward-title').textContent = w.name;
  document.getElementById('ward-icon').textContent = w.icon;
  document.getElementById('ward-stats-incharge').textContent = "Incharge: Sr. Miranda Bailey";

  const beds = State.beds[wardId] || [];
  const occ = beds.filter(b => b.patient).length;
  document.getElementById('stats-occ')?.remove(); // Cleanup old logic if any
  document.getElementById('ward-stats-occ').textContent = `${occ} / ${w.totalBeds} Occupied`;

  // Attach Admit Handler
  const admitBtn = document.getElementById('btn-admit');
  if (admitBtn) admitBtn.onclick = () => openAdmitModal(wardId);

  document.getElementById('wardBedGrid').innerHTML = beds.map(b => bedTile(b)).join('');
}

function bedTile(b) {
  let status = b.status === 'occupied' ? 'occupied' : b.status === 'critical' ? 'critical' : b.status === 'pending' ? 'pending' : b.status === 'maintenance' ? 'maintenance' : 'empty';
  return `
    <div class="bed-card ${status}" onclick="openPatientModal('${b.ward}','${b.id}')">
       <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
          <span style="font-family:var(--font-mono); font-weight:700; font-size:0.8rem; color:var(--text-muted);">${b.id}</span>
          ${b.status === 'critical' ? '<span class="anim-pulse" style="color:var(--color-red-500);">⚠️</span>' : ''}
       </div>
       ${b.patient ? `
         <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.2rem; line-height:1.2;">${esc(b.patient.name)}</div>
         <div style="font-size:0.75rem; color:var(--text-muted);">${esc(b.patient.diagnosis)}</div>
       ` : `
         <div style="color:var(--color-slate-500); font-size:0.8rem; font-style:italic;">Available</div>
       `}
    </div>
  `;
}

// ── STAFF ────────────────────────────────────────────────────
function renderStaff() {
  const nurseOn = State.staff.filter(s => s.status === 'on-duty').length;
  const studOn = DEMO_STUDENTS.filter(s => s.status === 'on-duty').length;
  document.getElementById('staffOnDutyCount').textContent = `${nurseOn + studOn}`;

  document.getElementById('staffList').innerHTML = State.staff.map(s => `
    <div class="staff-row">
       <div style="width:32px; height:32px; background:var(--color-slate-800); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">${s.name.substring(0, 2)}</div>
       <div style="flex:1;">
          <div style="font-weight:600; font-size:0.9rem;">${s.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${s.designation} · ${s.assignment}</div>
       </div>
       <div style="text-align:right;">
          <span class="badge ${s.status === 'on-duty' ? 'badge-teal' : s.status === 'on-break' ? 'badge-amber' : 'badge-blue'}" style="opacity:0.8;">${s.status}</span>
          <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-muted); margin-top:0.2rem;">${s.hours}</div>
          <div style="margin-top:0.3rem;">
            <span class="compliance-badge ${s.compliance === 'crit' ? 'compliance-crit' : s.compliance === 'warn' ? 'compliance-warn' : 'compliance-ok'}">${s.totalHours}h/wk</span>
            ${s.leave !== 'OK' ? `<span class="compliance-badge compliance-warn" style="font-size:0.6rem;">Leave: ${s.leave}</span>` : ''}
          </div>
       </div>
    </div>
  `).join('');

  document.getElementById('studentList').innerHTML = DEMO_STUDENTS.map(s => `
    <div class="staff-row">
       <div style="width:32px; height:32px; background:var(--color-slate-800); border-radius:50%; display:flex; align-items:center; justify-content:center;">🎓</div>
       <div style="flex:1;">
          <div style="font-weight:600; font-size:0.9rem;">${s.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${s.school} · ${s.year}</div>
       </div>
       <div style="text-align:right;">
          <span class="badge ${s.status === 'on-duty' ? 'badge-teal' : 'badge-amber'}" style="opacity:0.8;">${s.status}</span>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.2rem;">Mentor: ${s.mentor}</div>
       </div>
    </div>
  `).join('');
}

// ── STORE ────────────────────────────────────────────────────
function renderStore() {
  const filter = State.storeFilter; // 'all', 'critical', 'low'
  const items = State.store.filter(i => {
    const s = stockStatus(i);
    if (filter === 'critical') return s === 'critical';
    if (filter === 'low') return s === 'low' || s === 'critical';
    return true;
  });

  const grid = document.getElementById('storeGrid');
  if (!items.length) { grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No items match filter</div>'; return; }

  grid.innerHTML = items.map(i => {
    const s = stockStatus(i);
    return `
      <div class="store-card ${s}">
         <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); font-weight:700;">${i.id}</div>
         <div style="font-weight:700; color:white;">${i.name}</div>
         <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
            <div style="font-family:var(--font-mono); font-size:1.2rem; font-weight:800; color:${s === 'ok' ? 'var(--color-teal-500)' : 'var(--color-red-500)'}">${i.count}</div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
                <div style="font-size:0.75rem; color:var(--text-muted);">${i.unit}</div>
                <button onclick="restockItem('${i.id}')" class="btn btn-secondary btn-icon" style="padding:0.2rem 0.6rem; font-weight:900;">+</button>
            </div>
         </div>
      </div>
    `;
  }).join('');
}
function filterStore(f) { State.storeFilter = f; renderStore(); }

// ── INCIDENTS ────────────────────────────────────────────────
function renderIncidents() {
  const list = document.getElementById('incidentList');
  if (!State.incidents.length) { list.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--text-muted);">No incidents logged</div>'; return; }
  list.innerHTML = State.incidents.map(inc => `
    <div class="incident-row">
       <div style="margin-top:0.2rem;"><span class="badge badge-red">${inc.type}</span></div>
       <div style="flex:1;">
          <div style="font-weight:600; color:white;">${esc(inc.desc)}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.3rem;">
            ${WARDS[inc.ward]?.name || inc.ward} — Patient: ${esc(inc.patient)} — Severity: <b>${inc.severity}</b>
          </div>
       </div>
       <div style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted); text-align:right;">
          ${inc.date}<br>${inc.time}
       </div>
    </div>
  `).join('');
}

function openIncidentModal() {
  document.getElementById('incidentModal').classList.remove('hidden');
  document.getElementById('incidentModal').classList.add('flex');
}
function closeIncidentModal() {
  document.getElementById('incidentModal').classList.add('hidden');
  document.getElementById('incidentModal').classList.remove('flex');
}
function selectSeverity(lvl, btn) {
  document.getElementById('inc-severity').value = lvl;
  document.querySelectorAll('.sev-btn').forEach(b => b.style.borderColor = 'transparent');
  btn.style.borderColor = 'white';
}
function submitIncident() {
  const desc = document.getElementById('inc-desc').value;
  if (!desc) { toast("Describe incident"); return; }
  State.incidents.unshift({
    type: document.getElementById('inc-type').value,
    ward: document.getElementById('inc-ward').value,
    patient: document.getElementById('inc-patient').value || 'N/A',
    desc,
    severity: document.getElementById('inc-severity').value,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  });
  closeIncidentModal();
  toast("Incident Logged");
  renderIncidents();
  renderDashboard();
}

// ── MODALS (Patient/Admit stub) ──────────────────────────────
function openPatientModal(ward, id) {
  const modal = document.getElementById('patientModal');
  const beds = State.beds[ward];
  const bed = beds.find(b => b.id === id);
  if (!bed || !bed.patient) return;

  document.getElementById('pm-name').textContent = bed.patient.name;
  document.getElementById('pm-meta').textContent = `${bed.patient.age}y / ${bed.patient.sex} / ${bed.patient.doctor}`;
  document.getElementById('pm-body').innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
      <div>
        <div style="font-weight:700; color:var(--text-muted);">Diagnosis</div>
        <div style="margin-bottom:0.5rem;">${bed.patient.diagnosis}</div>
        <div style="font-weight:700; color:var(--text-muted);">Lines</div>
        <div style="margin-bottom:0.5rem;">${bed.patient.lines.join(', ') || 'None'}</div>
      </div>
      <div>
        <div style="font-weight:700; color:var(--text-muted);">Notes</div>
        <div style="font-style:italic; color:var(--color-slate-300);">${bed.patient.notes}</div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closePatientModal() {
  document.getElementById('patientModal').classList.add('hidden');
  document.getElementById('patientModal').classList.remove('flex');
}

// ── ADMISSION LOGIC ──────────────────────────────────────────
function openAdmitModal(wardId) {
  State.admitTarget = wardId;
  const w = WARDS[wardId];
  const modal = document.getElementById('admitModal');
  document.getElementById('admit-title').textContent = `Admit to ${w.name}`;
  document.getElementById('admit-body').innerHTML = `
    <div style="display:grid; gap:1rem;">
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:0.3rem;">Patient Name</label>
        <input id="adm-name" class="input" placeholder="Full Name">
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
        <div>
           <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:0.3rem;">Age</label>
           <input id="adm-age" type="number" class="input" placeholder="Age">
        </div>
        <div>
           <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:0.3rem;">Sex</label>
           <select id="adm-sex" class="select"><option>M</option><option>F</option></select>
        </div>
      </div>
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:0.3rem;">Diagnosis</label>
        <input id="adm-diag" class="input" placeholder="Primary Diagnosis">
      </div>
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:0.3rem;">Admitting Doctor</label>
        <input id="adm-doc" class="input" placeholder="Dr. Name">
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function confirmAdmit() {
  const nameEl = document.getElementById('adm-name');
  const ageEl = document.getElementById('adm-age');
  const sexEl = document.getElementById('adm-sex');
  const diagEl = document.getElementById('adm-diag');
  const docEl = document.getElementById('adm-doc');

  if (!nameEl) { console.error("Admit form missing"); return; }

  const name = nameEl.value.trim();
  const age = ageEl.value;
  const sex = sexEl.value;
  const diag = diagEl.value.trim();
  const doc = docEl.value.trim();

  if (!name || !diag || !age) { toast("⚠️ Name, Age, and Diagnosis required"); return; }

  const wardId = State.admitTarget || 'gen';
  const beds = State.beds[wardId];
  if (!beds) { toast("Error: Ward ID invalid"); return; }

  // Validation
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) { toast("Invalid Age"); return; }

  if (wardId === 'mat' && sex === 'M') { toast("🛑 Maternity is Female Only"); return; }
  if (wardId === 'ped' && ageNum >= 18) { toast("🛑 Pediatrics is for <18y only"); return; }
  if ((wardId === 'gen' || wardId === 'surg') && ageNum < 18) { toast("🛑 Assign Child to Pediatrics"); return; }

  // Find Bed
  const emptyBed = beds.find(b => !b.patient && b.status !== 'maintenance');

  if (!emptyBed) { toast(`⚠️ No empty beds available in ${WARDS[wardId].name}!`); return; }

  emptyBed.patient = {
    name, age: ageNum, sex, diagnosis: diag, doctor: doc || 'On Call',
    admitDate: new Date().toISOString().split('T')[0],
    lines: [], notes: 'New admission via App.', allergies: 'None', blood: 'Unknown', diet: 'Regular'
  };
  emptyBed.status = 'occupied';

  toast(`✅ Admitted ${name} to ${emptyBed.id}`);
  logActivity('➕', `Admitted ${name} to ${emptyBed.id} (${diag})`);

  document.getElementById('admitModal').classList.add('hidden');
  document.getElementById('admitModal').classList.remove('flex');
  renderWard(wardId);
  renderDashboard();
}

// ── NEW FEATURES ─────────────────────────────────────────────
function restockItem(id) {
  const item = State.store.find(i => i.id === id);
  if (!item) return;
  const qty = prompt(`Restock ${item.name} (${item.unit}). Enter quantity:`, "10");
  if (qty && !isNaN(qty)) {
    item.count += parseInt(qty);
    toast(`Restocked ${item.name}`);
    renderStore();
    logActivity('📦', `Restocked ${item.name} (+${qty})`);
  }
}

function renderAI() {
  // Staff
  const fatigued = State.staff.filter(s => s.status === 'on-duty' && s.hours.includes('20:00'));
  const htmlStaff = `
    <div style="margin-bottom:0.8rem;">
      <div style="font-weight:700; color:#a78bfa; margin-bottom:0.2rem;">Fatigue Watch</div>
      <div style="font-size:0.85rem;">${fatigued.length > 0 ? fatigued.map(f => f.name).join(', ') + ' are on extended shifts.' : 'No staff currently flagged for fatigue.'}</div>
    </div>
    <div>
      <div style="font-weight:700; color:#a78bfa; margin-bottom:0.2rem;">Student Insights</div>
      <div style="font-size:0.85rem;">Active: ${DEMO_STUDENTS.length}. 'Student Faith K' showing high engagement in Maternity. Recommendation: Assign to complex case.</div>
    </div>
  `;
  document.getElementById('ai-staff-analysis').innerHTML = htmlStaff;

  // Stock
  const low = State.store.filter(i => stockStatus(i) !== 'ok');
  const htmlStock = low.length ?
    `<div style="color:#ef4444; font-weight:700; margin-bottom:0.5rem;">CRITICAL SHORTAGE</div>
     ${low.map(i => `<div style="font-size:0.85rem;">• ${i.name} (${i.count} ${i.unit})</div>`).join('')}
     <div style="margin-top:0.5rem; font-size:0.8rem; opacity:0.8;">Action: Automated request sent to Central Depot.</div>` :
    `<div style="color:#10b981; font-weight:700;">✔ Supply Chain Optimal</div>
     <div style="font-size:0.85rem; margin-top:0.5rem;">Predictive AI: 'N/S 500ml' usage +15% this shift. Restock suggested within 48h.</div>`;
  document.getElementById('ai-stock-analysis').innerHTML = htmlStock;

  // Wards
  const htmlWard = Object.values(WARDS).map(w => {
    const beds = State.beds[w.id] || [];
    const occ = beds.filter(b => b.patient).length;
    const pct = Math.round(occ / w.totalBeds * 100);
    return `<div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.85rem; padding-bottom:0.2rem; border-bottom:1px solid rgba(255,255,255,0.05);">
       <span>${w.name}</span>
       <span style="font-family:var(--font-mono); font-weight:700; color:${pct > 85 ? '#ef4444' : pct > 60 ? '#fbbf24' : '#34d399'}">${pct}%</span>
     </div>`;
  }).join('') + `<div style="margin-top:0.8rem; font-size:0.8rem; font-style:italic; border-left:2px solid #34d399; padding-left:0.5rem;">AI Suggestion: Balance load by diverting non-critical admits from General Ward to Surgical Ward.</div>`;
  document.getElementById('ai-ward-analysis').innerHTML = htmlWard;
}

// Global Exports update
window.restockItem = restockItem;
window.renderAI = renderAI;
window.toggleChat = toggleChat;
window.sendChat = sendChat;
window.openAdmitModal = openAdmitModal;
window.confirmAdmit = confirmAdmit;
window.closeAdmitModal = () => { document.getElementById('admitModal').classList.add('hidden'); document.getElementById('admitModal').classList.remove('flex'); };

// ── CHAT BOT ─────────────────────────────────────────────────
function toggleChat() {
  const w = document.getElementById('aiChatWindow');
  const fab = document.getElementById('fabChat');
  if (w.classList.contains('active')) {
    w.classList.remove('active');
    fab.classList.remove('hidden');
  } else {
    w.classList.add('active');
    fab.classList.add('hidden');
    document.getElementById('chatInput').focus();
  }
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg) return;
  addBubble(msg, 'user');
  inp.value = '';
  setTimeout(() => {
    const reply = processQuery(msg.toLowerCase());
    addBubble(reply, 'bot');
  }, 600);
}

function addBubble(text, type) {
  const c = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = `chat-bubble ${type}`;
  d.textContent = text;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function processQuery(q) {
  if (q.includes('leave') || q.includes('holiday') || q.includes('off')) {
    const due = State.staff.filter(s => s.leave !== 'OK').map(s => s.name);
    return due.length ? `Staff due for leave: ${due.join(', ')}. Recommend scheduling immediately.` : "All staff leave balances are healthy.";
  }
  if (q.includes('fatigue') || q.includes('tired') || q.includes('hours') || q.includes('work')) {
    const crit = State.staff.filter(s => s.compliance === 'crit').map(s => `${s.name} (${s.totalHours}h)`);
    return crit.length ? `CRITICAL: ${crit.join(', ')} have exceeded the 48h limit. Immediate rotation required.` : "Staff hours are within limits.";
  }
  if (q.includes('stock') || q.includes('supply') || q.includes('items')) {
    const low = State.store.filter(i => stockStatus(i) !== 'ok').map(i => i.name);
    return low.length ? `Low stock alerts: ${low.join(', ')}. Please restock.` : "Central Store is fully stocked.";
  }
  if (q.includes('ward') || q.includes('census') || q.includes('patients')) {
    return "Analyzing Wards... General Ward is busiest (High Load). Maternity is stable.";
  }
  return "I can help with: Leave status, Staff fatigue (hours), Stock levels, or Ward census.";
}

// ── INIT ─────────────────────────────────────────────────────
function initBeds() {
  Object.keys(WARDS).forEach(k => {
    const w = WARDS[k];
    const b = [];
    for (let i = 1; i <= w.totalBeds; i++) {
      const bid = (k === 'gen' ? 'G' : k === 'mat' ? 'M' : k === 'icu' ? 'ICU' : k === 'surg' ? 'S' : 'P') + '-' + String(i).padStart(2, '0');
      const p = DEMO_PATIENTS.find(x => x.bed === bid);
      if (p) b.push({ id: bid, ward: k, status: p.status, patient: p });
      else b.push({ id: bid, ward: k, status: 'empty', patient: null });
    }
    State.beds[k] = b;
  });
}

function startClock() {
  setInterval(() => {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-KE');
    document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });
  }, 1000);
}

// Global Exports
window.navigate = navigate;
window.openPatientModal = openPatientModal;
window.closePatientModal = closePatientModal;
window.openIncidentModal = openIncidentModal;
window.closeIncidentModal = closeIncidentModal;
window.selectSeverity = selectSeverity;
window.submitIncident = submitIncident;
window.filterStore = filterStore;
// Stubs removed - implemented above

document.addEventListener('DOMContentLoaded', () => {
  console.log("WardMate Vanilla Init");
  initBeds();
  State.staff = DEMO_STAFF;
  State.store = DEMO_STORE;

  logActivity('★', 'System Reloaded (Vanilla Mode)');
  startClock();

  // Header badges (basic)
  document.getElementById('inchargeName').textContent = "Sr. Miranda Bailey";
  const shift = new Date().getHours() < 18 && new Date().getHours() > 6 ? 'Day Shift' : 'Night Shift';
  document.getElementById('shiftPill').textContent = shift;

  navigate('overview');
});
