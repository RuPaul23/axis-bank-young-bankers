/* ==========================================================================
   AXIS BANK YOUNG BANKERS (ABYB) - LEAD & CREDENTIAL ENGINE
   File Upload Handling, Local CRM, CSV Export, Direct WhatsApp Link & Quiz
   ========================================================================== */

let uploadedCredentials = {
  resumeName: null,
  marksheetName: null
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initStickyCta();
  refreshLeadsCount();
});

/* --------------------------------------------------------------------------
   NAVBAR & STICKY CTA
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
    } else {
      header.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.04)';
    }
  });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }
}

function initStickyCta() {
  const stickyBar = document.getElementById('stickyCta');
  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    if (!stickyBar || !heroSection) return;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight - 120;
    if (window.scrollY > heroBottom) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  });
}

function scrollToLeadForm(e) {
  if (e) e.preventDefault();
  const formElem = document.getElementById('applicationCard') || document.getElementById('quickLeadForm');
  if (formElem) {
    formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const input = document.getElementById('leadFullName');
    if (input) input.focus();
  }
}

/* --------------------------------------------------------------------------
   FILE UPLOAD HANDLER
   -------------------------------------------------------------------------- */
function handleFileSelected(type, inputElem) {
  if (!inputElem.files || inputElem.files.length === 0) return;
  const file = inputElem.files[0];
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

  if (file.size > 15 * 1024 * 1024) {
    alert('File size exceeds 15MB limit. Please select a smaller file.');
    inputElem.value = '';
    return;
  }

  if (type === 'resume') {
    uploadedCredentials.resumeName = `${file.name} (${sizeMb} MB)`;
    const box = document.getElementById('resumeBox');
    const label = document.getElementById('resumeFileLabel');
    if (box) box.classList.add('has-file');
    if (label) label.innerHTML = `<span class="file-status-tag"><i class="fa-solid fa-circle-check"></i> ${file.name.substring(0, 18)}...</span>`;
  } else if (type === 'marksheet') {
    uploadedCredentials.marksheetName = `${file.name} (${sizeMb} MB)`;
    const box = document.getElementById('marksheetBox');
    const label = document.getElementById('marksheetFileLabel');
    if (box) box.classList.add('has-file');
    if (label) label.innerHTML = `<span class="file-status-tag"><i class="fa-solid fa-circle-check"></i> ${file.name.substring(0, 18)}...</span>`;
  }
}

/* --------------------------------------------------------------------------
   LEAD CAPTURE ENGINE & LOCAL STORAGE CRM
   -------------------------------------------------------------------------- */
function getStoredLeads() {
  try {
    const data = localStorage.getItem('abyb_leads');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredLeads(leads) {
  localStorage.setItem('abyb_leads', JSON.stringify(leads));
  refreshLeadsCount();
}

function refreshLeadsCount() {
  const leads = getStoredLeads();
  const countBadge = document.getElementById('leadsCountBadge');
  const totalCount = document.getElementById('totalLeadsCount');
  if (countBadge) countBadge.textContent = leads.length;
  if (totalCount) totalCount.textContent = leads.length;
}

function handleLeadCapture(e) {
  e.preventDefault();

  const name = document.getElementById('leadFullName').value.trim();
  const mobile = document.getElementById('leadMobile').value.trim();
  const email = document.getElementById('leadEmail').value.trim();
  const college = document.getElementById('leadCollege') ? document.getElementById('leadCollege').value.trim() : 'University Student';
  const degree = document.getElementById('leadDegree') ? document.getElementById('leadDegree').value : 'Graduate';
  const age = document.getElementById('leadAge') ? document.getElementById('leadAge').value : '21-25';
  const gradScore = document.getElementById('leadGradScore').value;
  const state = document.getElementById('leadState').value;
  const city = document.getElementById('leadCity').value.trim();

  if (mobile.length !== 10 || isNaN(mobile)) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  const btn = document.getElementById('leadSubmitBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading Credentials & Submitting...`;

  const newLead = {
    id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleString('en-IN'),
    name: name,
    mobile: mobile,
    email: email,
    college: college,
    degree: degree,
    age: age,
    gradScore: gradScore === '50-plus' ? '50%+' : (gradScore === 'final-year' ? 'Final Year' : '<50%'),
    location: `${city}, ${state}`,
    resume: uploadedCredentials.resumeName || 'Resume_attached.pdf',
    marksheet: uploadedCredentials.marksheetName || 'Marksheet_verified.pdf'
  };

  setTimeout(() => {
    const leads = getStoredLeads();
    leads.unshift(newLead);
    saveStoredLeads(leads);

    btn.disabled = false;
    btn.innerHTML = originalText;

    // Reset Form
    document.getElementById('leadCaptureForm').reset();
    uploadedCredentials = { resumeName: null, marksheetName: null };
    const rLabel = document.getElementById('resumeFileLabel');
    const mLabel = document.getElementById('marksheetFileLabel');
    if (rLabel) rLabel.textContent = 'Tap to browse file';
    if (mLabel) mLabel.textContent = 'Tap to browse file';

    alert(`🎉 Success, ${name}!\n\nYour application and credentials for Axis Bank Young Bankers Program have been submitted successfully.\n\nReference: ${newLead.id}\nAssessment Fee: Rs.118 (incl. GST).\nOur admissions advisor will connect with you via WhatsApp/Call at ${mobile}.`);

    // Open Leads Dashboard so the recruiter / student can view it
    openLeadsDashboard();
  }, 900);
}

/* --------------------------------------------------------------------------
   LEADS CRM DASHBOARD & CSV EXPORTER
   -------------------------------------------------------------------------- */
function openLeadsDashboard() {
  const modal = document.getElementById('leadsDashboardModal');
  if (!modal) return;

  const leads = getStoredLeads();
  const tbody = document.getElementById('leadsTableBody');
  tbody.innerHTML = '';

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 24px; color:#64748B;">
          <i class="fa-solid fa-inbox" style="font-size:2rem; margin-bottom:8px; display:block;"></i>
          No candidate leads captured yet. Submit the registration form above to see leads recorded here!
        </td>
      </tr>
    `;
  } else {
    leads.forEach(lead => {
      const waMsg = encodeURIComponent(`Hi ${lead.name}, regarding your application for the Axis Bank Young Bankers Program (Assistant Manager, ₹4.54 LPA). Please confirm your assessment slot.`);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-size:0.75rem; color:#64748B;">${lead.timestamp}</td>
        <td><strong>${lead.name}</strong><br><span style="font-size:0.72rem; color:#64748B;">${lead.location}</span></td>
        <td>
          <a href="tel:${lead.mobile}" style="font-weight:700; color:#0F172A;">${lead.mobile}</a><br>
          <a href="https://wa.me/91${lead.mobile}?text=${waMsg}" target="_blank" class="wa-chat-btn mt-1">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
        </td>
        <td><strong>${lead.college || 'College Student'}</strong><br><span style="font-size:0.72rem; color:#64748B;">${lead.degree || 'Degree'}</span></td>
        <td><span class="badge-pill" style="font-size:0.7rem; padding:2px 7px;">${lead.gradScore}</span></td>
        <td style="font-size:0.75rem;">
          <div title="${lead.resume}"><i class="fa-solid fa-file-pdf highlight-maroon"></i> ${lead.resume ? lead.resume.substring(0, 14) + '...' : 'Resume.pdf'}</div>
          <div title="${lead.marksheet}"><i class="fa-solid fa-id-card highlight-green"></i> ${lead.marksheet ? lead.marksheet.substring(0, 14) + '...' : 'Marksheet.pdf'}</div>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" style="padding:4px 8px; font-size:0.72rem;" onclick="viewLeadDetail('${lead.id}')">
            View
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  refreshLeadsCount();
  modal.classList.add('active');
}

function viewLeadDetail(leadId) {
  const leads = getStoredLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;
  alert(`📋 CANDIDATE PROFILE:\n\nName: ${lead.name}\nWhatsApp: ${lead.mobile}\nEmail: ${lead.email}\nCollege: ${lead.college || 'N/A'}\nDegree: ${lead.degree || 'N/A'}\nLocation: ${lead.location}\nGraduation Score: ${lead.gradScore}\nCredentials: \n- Resume: ${lead.resume}\n- Marksheet: ${lead.marksheet}`);
}

function closeLeadsDashboard() {
  const modal = document.getElementById('leadsDashboardModal');
  if (modal) modal.classList.remove('active');
}

function exportLeadsToCsv() {
  const leads = getStoredLeads();
  if (leads.length === 0) {
    alert('No leads to export yet!');
    return;
  }

  const headers = ['Lead ID', 'Timestamp', 'Full Name', 'WhatsApp Mobile', 'Email', 'College', 'Degree', 'Location', 'Graduation Score', 'Resume File', 'Marksheet File'];
  const rows = leads.map(l => [
    l.id,
    `"${l.timestamp}"`,
    `"${l.name}"`,
    `"${l.mobile}"`,
    `"${l.email}"`,
    `"${l.college || ''}"`,
    `"${l.degree || ''}"`,
    `"${l.location}"`,
    `"${l.gradScore}"`,
    `"${l.resume || ''}"`,
    `"${l.marksheet || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Axis_Bank_Campus_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function populateSampleLeads() {
  const sampleLeads = [
    { id: 'LEAD-1042', timestamp: '25/10/2026, 11:20 am', name: 'Amanpreet Kaur', mobile: '9876543210', email: 'aman.kaur@gmail.com', college: 'Guru Nanak Dev University (GNDU)', degree: 'B.Com (Hons)', location: 'Ludhiana, Punjab', gradScore: '68%', resume: 'Amanpreet_Resume.pdf', marksheet: 'GNDU_Sem6_Marksheet.pdf' },
    { id: 'LEAD-1043', timestamp: '25/10/2026, 11:45 am', name: 'Rohit Verma', mobile: '9812345678', email: 'rohit.v@yahoo.com', college: 'Kurukshetra University', degree: 'BBA', location: 'Ambala, Haryana', gradScore: '59%', resume: 'Rohit_CV_2026.pdf', marksheet: 'FinalYear_Card.pdf' },
    { id: 'LEAD-1044', timestamp: '25/10/2026, 12:10 pm', name: 'Simranjeet Singh', mobile: '9988776655', email: 'simran.singh@gmail.com', college: 'Thapar Institute', degree: 'B.Tech IT', location: 'Patiala, Punjab', gradScore: '74%', resume: 'Simran_Resume.pdf', marksheet: 'College_ID.jpg' },
    { id: 'LEAD-1045', timestamp: '25/10/2026, 12:35 pm', name: 'Pooja Sharma', mobile: '9765432109', email: 'pooja.sharma@gmail.com', college: 'Himachal Pradesh University (HPU)', degree: 'M.Com', location: 'Shimla, Himachal Pradesh', gradScore: '65%', resume: 'Pooja_Resume.pdf', marksheet: 'HPU_Degree.pdf' }
  ];

  const existing = getStoredLeads();
  saveStoredLeads([...sampleLeads, ...existing]);
  openLeadsDashboard();
}

/* --------------------------------------------------------------------------
   ELIGIBILITY QUIZ
   -------------------------------------------------------------------------- */
let abybAnswers = {};

function openEligibilityModal() {
  const modal = document.getElementById('eligibilityModal');
  if (!modal) return;
  modal.classList.add('active');
  resetAbybQuiz();
}

function closeEligibilityModal() {
  const modal = document.getElementById('eligibilityModal');
  if (modal) modal.classList.remove('active');
}

function resetAbybQuiz() {
  abybAnswers = {};
  document.querySelectorAll('#eligibilityModal .quiz-step').forEach((s, idx) => {
    s.classList.toggle('active', idx === 0);
  });
}

function answerAbybQuiz(step, val) {
  abybAnswers[step] = val;
  const current = document.getElementById(`quizStep${step}`);
  if (current) current.classList.remove('active');

  if (step < 3) {
    const next = document.getElementById(`quizStep${step + 1}`);
    if (next) next.classList.add('active');
  } else {
    const resStep = document.getElementById('quizResult');
    const resCard = document.getElementById('quizResultCard');
    resStep.classList.add('active');

    const isEligible = abybAnswers[1] === 'ok' && abybAnswers[2] === 'ok' && abybAnswers[3] === 'ok';

    if (isEligible) {
      resCard.className = 'quiz-result-card eligible';
      resCard.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <h3>You Are 100% Eligible!</h3>
        <p>Your profile qualifies for the Axis Bank Young Bankers Program (Assistant Manager Grade).</p>
        <button class="btn btn-primary btn-block" onclick="closeEligibilityModal(); scrollToLeadForm();">
          Upload Credentials & Apply Now <i class="fa-solid fa-arrow-right"></i>
        </button>
      `;
    } else {
      resCard.className = 'quiz-result-card ineligible';
      resCard.innerHTML = `
        <i class="fa-solid fa-circle-xmark"></i>
        <h3>Ineligibility Notice</h3>
        <p>Candidates must be 21-30 years old with 50%+ in graduation and have no immediate relatives in Axis Bank.</p>
        <button class="btn btn-secondary btn-block" onclick="resetAbybQuiz()">Retake Test</button>
      `;
    }
  }
}

/* --------------------------------------------------------------------------
   SYLLABUS DOWNLOAD MODAL
   -------------------------------------------------------------------------- */
function openSyllabusModal() {
  const modal = document.getElementById('syllabusModal');
  if (modal) modal.classList.add('active');
}

function closeSyllabusModal() {
  const modal = document.getElementById('syllabusModal');
  if (modal) modal.classList.remove('active');
}

function handleSyllabusDownload(e) {
  e.preventDefault();
  const name = document.getElementById('sylbName').value.trim();
  const phone = document.getElementById('sylbPhone').value.trim();
  const email = document.getElementById('sylbEmail').value.trim();

  const leads = getStoredLeads();
  leads.unshift({
    id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleString('en-IN'),
    name: name,
    mobile: phone,
    email: email,
    college: 'Downloaded Syllabus',
    degree: 'Brochure Lead',
    age: '21-30',
    gradScore: '50%+',
    location: 'Campus Lead',
    resume: 'Requested via WhatsApp',
    marksheet: 'Pending'
  });
  saveStoredLeads(leads);

  closeSyllabusModal();
  alert(`Thank you, ${name}! The Axis Bank Young Bankers syllabus and model question paper link has been sent to ${email} and WhatsApp ${phone}.`);
}

function closeModalOnOverlay(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
}
