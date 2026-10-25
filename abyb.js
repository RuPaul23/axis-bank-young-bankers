/* ==========================================================================
   AXIS BANK YOUNG BANKERS (ABYB) - APP & LEAD ENGINE
   Digital Marketing Lead Capture, CRM Dashboard, CSV Exporter & Quiz
   ========================================================================== */

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
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)';
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
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight - 150;
    if (window.scrollY > heroBottom) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  });
}

function scrollToLeadForm() {
  const formElem = document.getElementById('quickLeadForm');
  if (formElem) {
    formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const input = document.getElementById('leadFullName');
    if (input) input.focus();
  }
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  if (!isActive) item.classList.add('active');
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
  const age = document.getElementById('leadAge').value;
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
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registering Lead...`;

  const newLead = {
    id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleString('en-IN'),
    name: name,
    mobile: mobile,
    email: email,
    age: age,
    gradScore: gradScore === '50-plus' ? '>=50%' : gradScore,
    location: `${city}, ${state}`
  };

  setTimeout(() => {
    const leads = getStoredLeads();
    leads.unshift(newLead);
    saveStoredLeads(leads);

    btn.disabled = false;
    btn.innerHTML = originalText;

    // Reset Form
    document.getElementById('leadCaptureForm').reset();

    alert(`🎉 Success, ${name}! Your application lead has been captured.\n\nReference: ${newLead.id}\nAssessment fee: Rs.118 (incl. GST).\nOur admissions advisor will call you at ${mobile} shortly!`);

    // Open Leads Dashboard so user can see it recorded
    openLeadsDashboard();
  }, 800);
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
        <td colspan="6" style="text-align:center; padding: 24px; color:#64748B;">
          <i class="fa-solid fa-inbox" style="font-size:2rem; margin-bottom:8px; display:block;"></i>
          No leads captured yet. Submit the form above or click "+ Add Sample Leads" to test your funnel!
        </td>
      </tr>
    `;
  } else {
    leads.forEach(lead => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-size:0.75rem; color:#64748B;">${lead.timestamp}</td>
        <td><strong>${lead.name}</strong></td>
        <td><a href="tel:${lead.mobile}" style="color:var(--axis-primary); font-weight:600;">${lead.mobile}</a></td>
        <td>${lead.email}</td>
        <td>${lead.location}</td>
        <td><span class="badge-pill" style="font-size:0.72rem; padding:2px 8px;">${lead.gradScore}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  refreshLeadsCount();
  modal.classList.add('active');
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

  const headers = ['Lead ID', 'Timestamp', 'Full Name', 'Mobile Number', 'Email', 'Location', 'Graduation %'];
  const rows = leads.map(l => [
    l.id,
    `"${l.timestamp}"`,
    `"${l.name}"`,
    `"${l.mobile}"`,
    `"${l.email}"`,
    `"${l.location}"`,
    `"${l.gradScore}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Axis_Bank_ABYB_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function populateSampleLeads() {
  const sampleLeads = [
    { id: 'LEAD-1042', timestamp: '25/10/2026, 11:20:15 am', name: 'Amanpreet Kaur', mobile: '9876543210', email: 'aman.kaur@gmail.com', location: 'Ludhiana, Punjab', gradScore: '68%' },
    { id: 'LEAD-1043', timestamp: '25/10/2026, 11:45:22 am', name: 'Rohit Verma', mobile: '9812345678', email: 'rohit.v@yahoo.com', location: 'Ambala, Haryana', gradScore: '59%' },
    { id: 'LEAD-1044', timestamp: '25/10/2026, 12:10:04 pm', name: 'Simranjeet Singh', mobile: '9988776655', email: 'simran.singh@gmail.com', location: 'Chandigarh, Punjab', gradScore: '74%' },
    { id: 'LEAD-1045', timestamp: '25/10/2026, 12:35:50 pm', name: 'Pooja Sharma', mobile: '9765432109', email: 'pooja.sharma@gmail.com', location: 'Shimla, Himachal Pradesh', gradScore: '62%' },
    { id: 'LEAD-1046', timestamp: '25/10/2026, 01:05:12 pm', name: 'Vikram Rajput', mobile: '9419123456', email: 'vikram.raj@gmail.com', location: 'Jammu, Jammu & Kashmir', gradScore: '65%' }
  ];

  const existing = getStoredLeads();
  saveStoredLeads([...sampleLeads, ...existing]);
  openLeadsDashboard();
}

/* --------------------------------------------------------------------------
   ELIGIBILITY QUIZ (ABYB SPECIFIC)
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
    // Show Results
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
          Fill Application Form Now <i class="fa-solid fa-arrow-right"></i>
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

  // Save as lead too!
  const leads = getStoredLeads();
  leads.unshift({
    id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleString('en-IN'),
    name: name,
    mobile: phone,
    email: email,
    age: '21-30',
    gradScore: 'Brochure Lead',
    location: 'Online Download'
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
