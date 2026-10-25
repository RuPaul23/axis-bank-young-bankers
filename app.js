/* ==========================================================================
   AXIS BANK CBG RELATIONSHIP MANAGER PROGRAM - APP.JS
   Interactive Logic, Form Validation, EMI Calculator & Eligibility Quiz
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initStickyCta();
  updateEmiCalculation();
});

/* --------------------------------------------------------------------------
   NAVBAR & SCROLL SPY
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], div[id="about"]');

  window.addEventListener('scroll', () => {
    // Header shadow and padding adjustment
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
    } else {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)';
    }

    // Scroll spy for active link
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
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

    // Close on click link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
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

/* --------------------------------------------------------------------------
   ROADMAP MODULE SWITCHER (12 MONTHS PROGRAM)
   -------------------------------------------------------------------------- */
const moduleData = {
  1: {
    badge: "Module 1 (Months 1 & 2)",
    title: "Foundation Blocks – Online Mode",
    stipend: "<i class='fa-solid fa-laptop-code'></i> Virtual Interactive Campus",
    subjects: [
      "<strong>Business Banking Solutions I:</strong> Working capital facilities, cash credit, overdrafts, and commercial term loans.",
      "<strong>Communication & Professional Etiquettes:</strong> High-impact business English, email writing, and corporate boardroom etiquette.",
      "<strong>Sales & Customer Engagement:</strong> Consultative selling methodologies, client requirement mapping, and cross-selling.",
      "<strong>Banking Regulatory Frameworks:</strong> RBI guidelines, AML/KYC norms, and risk compliance management."
    ],
    deliverables: [
      "Daily live interactive webinars with senior faculty",
      "Weekly domain case studies and speech-analytics assessments",
      "Finacle simulator practice & banking ERP navigation"
    ]
  },
  2: {
    badge: "Module 2 (Months 3 & 4)",
    title: "Application Blocks – Residential Campus in Pune",
    stipend: "<i class='fa-solid fa-coins'></i> ₹15,000 / Month Paid Support",
    subjects: [
      "<strong>Advanced Commercial Credit Appraisal:</strong> Financial statement analysis, DSCR calculation, balance sheet forensics.",
      "<strong>Trade Finance & Forex:</strong> Letters of Credit (LC), Bank Guarantees (BG), hedging & cross-border transactions.",
      "<strong>Mock Client Pitching & Simulations:</strong> Face-to-face consultative boardroom roleplays and pitch decks.",
      "<strong>Axis Bank Product Suite:</strong> CMS, corporate current accounts, merchant POS & payment gateways."
    ],
    deliverables: [
      "Full residential immersion at premier Pune campus (accommodation & meals included)",
      "₹5,000/mo stipend from Axis Bank + ₹10,000/mo out-of-pocket expenses from Adda247",
      "Executive mentorship by senior Axis Bank regional leadership"
    ]
  },
  3: {
    badge: "Module 3 (Months 5 & 6)",
    title: "Live Branch Internship @ Axis Bank",
    stipend: "<i class='fa-solid fa-briefcase'></i> Full Monthly Salary Payout",
    subjects: [
      "<strong>Shadowing Senior CBG RMs:</strong> Accompanying experienced managers on live client calls and credit renewals.",
      "<strong>Lead Generation & Profiling:</strong> Sourcing prospective mid-market enterprises and industrial cluster clients.",
      "<strong>Customer Onboarding:</strong> End-to-end documentation, KYC processing, and system logins in branch Finacle.",
      "<strong>Branch Performance Metrics:</strong> Navigating credit sanction limits and legal vetting."
    ],
    deliverables: [
      "Posted at assigned Axis Bank commercial branches across India",
      "Direct client interaction with local SME and corporate business owners",
      "Regular salary payouts commence during the internship stage"
    ]
  },
  4: {
    badge: "Module 4 (Months 7 to 12)",
    title: "On-the-Job Training (OJT) as Deputy Manager",
    stipend: "<i class='fa-solid fa-award'></i> Starting ₹6.3 to ₹6.8 LPA CTC",
    subjects: [
      "<strong>Independent Portfolio Management:</strong> Managing high-value CBG client accounts with growth targets.",
      "<strong>Working Capital & Term Lending:</strong> Structuring credit lines from ₹1 Cr to ₹25 Cr+ for commercial enterprises.",
      "<strong>Cross-Selling & Fee Income:</strong> Penetrating FX, corporate cards, promoter wealth management, and insurance.",
      "<strong>Final PG Diploma Evaluation:</strong> Submission of capstone project and university certification."
    ],
    deliverables: [
      "Full-fledged operational charge as CBG Relationship Manager",
      "Eligibility for quarterly performance bonuses and incentives",
      "Award of Post Graduate Diploma from University upon completion"
    ]
  }
};

function selectRoadmapModule(modNum) {
  const cards = document.querySelectorAll('.roadmap-card');
  cards.forEach(card => card.classList.remove('active'));

  const activeCard = document.querySelector(`.roadmap-card[data-module="${modNum}"]`);
  if (activeCard) activeCard.classList.add('active');

  const data = moduleData[modNum];
  if (!data) return;

  document.getElementById('panelModuleBadge').textContent = data.badge;
  document.getElementById('panelModuleTitle').textContent = data.title;
  document.getElementById('panelStipendBadge').innerHTML = data.stipend;

  const subjectsList = document.getElementById('panelSubjectsList');
  subjectsList.innerHTML = data.subjects.map(s => `<li>${s}</li>`).join('');

  const deliverablesBox = document.getElementById('panelDeliverables');
  deliverablesBox.innerHTML = data.deliverables.map(d => `
    <div class="deliv-item">
      <i class="fa-solid fa-circle-check"></i>
      <span>${d}</span>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   INTERACTIVE EMI CALCULATOR
   -------------------------------------------------------------------------- */
function updateEmiCalculation() {
  const loanSlider = document.getElementById('loanAmountSlider');
  const tenureSlider = document.getElementById('loanTenureSlider');
  if (!loanSlider || !tenureSlider) return;

  const principal = parseFloat(loanSlider.value);
  const tenureMonths = parseInt(tenureSlider.value);
  const annualRate = 0.13; // 13.00% p.a.
  const monthlyRate = annualRate / 12;

  // Format Slider labels
  document.getElementById('loanAmountDisplay').textContent = '₹ ' + principal.toLocaleString('en-IN');
  const years = tenureMonths / 12;
  document.getElementById('loanTenureDisplay').textContent = `${tenureMonths} Months (${years} ${years === 1 ? 'Yr' : 'Yrs'})`;

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const roundedEmi = Math.round(emi);

  document.getElementById('monthlyEmiDisplay').textContent = '₹ ' + roundedEmi.toLocaleString('en-IN');

  // Take home calculation (~44,000 gross monthly average)
  const approxMonthlySalary = 44000;
  const netEarnings = approxMonthlySalary - roundedEmi;
  document.getElementById('netSalaryDisplay').textContent = `~ ₹ ${netEarnings.toLocaleString('en-IN')} / mo`;
}

function openEmiCalculator() {
  const el = document.getElementById('fees');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/* --------------------------------------------------------------------------
   FAQS ACCORDION
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isActive = item.classList.contains('active');

  // Close all others
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   HERO QUICK FORM SUBMISSION
   -------------------------------------------------------------------------- */
function handleHeroQuickSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('quickFullName').value.trim();
  const email = document.getElementById('quickEmail').value.trim();
  const mobile = document.getElementById('quickMobile').value.trim();
  const city = document.getElementById('quickCity').value.trim();

  // Populate into main application form
  document.getElementById('appFullName').value = name;
  document.getElementById('appEmail').value = email;
  document.getElementById('appMobile').value = mobile;
  document.getElementById('appCity').value = city;

  // Scroll smoothly down to the application section
  scrollToApplication();
}

function scrollToApplication() {
  const portal = document.getElementById('application-section');
  if (portal) {
    portal.scrollIntoView({ behavior: 'smooth' });
  }
}

function openApplicationTab() {
  scrollToApplication();
}

/* --------------------------------------------------------------------------
   MULTI-STEP APPLICATION FORM WIZARD
   -------------------------------------------------------------------------- */
let currentAppStep = 1;

function navigateToStep(step) {
  if (step < 1 || step > 4) return;

  // If jumping forward, validate current step first
  if (step > currentAppStep) {
    const valid = validateStep(currentAppStep);
    if (!valid) return;
  }

  currentAppStep = step;
  updateStepUI(currentAppStep);
}

function validateAndGoToStep(nextStep) {
  const valid = validateStep(currentAppStep);
  if (valid) {
    currentAppStep = nextStep;
    updateStepUI(currentAppStep);
  }
}

function updateStepUI(step) {
  // Update pan views
  document.querySelectorAll('.form-step-pane').forEach((p, idx) => {
    p.classList.toggle('active', idx + 1 === step);
  });

  // Update Stepper indicators
  for (let i = 1; i <= 4; i++) {
    const indicator = document.getElementById(`stepIndicator${i}`);
    if (!indicator) continue;

    indicator.classList.remove('active', 'completed');
    if (i === step) {
      indicator.classList.add('active');
    } else if (i < step) {
      indicator.classList.add('completed');
    }
  }

  // Update Stepper lines
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');

  if (line1) line1.classList.toggle('active', step >= 2);
  if (line2) line2.classList.toggle('active', step >= 3);
  if (line3) line3.classList.toggle('active', step >= 4);

  // Scroll to portal top gently
  const portalHeader = document.querySelector('.app-portal-wrapper');
  if (portalHeader) {
    portalHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function validateStep(step) {
  clearErrors();
  let isValid = true;

  if (step === 1) {
    const fullName = document.getElementById('appFullName').value.trim();
    const gender = document.getElementById('appGender').value;
    const dob = document.getElementById('appDob').value;
    const pan = document.getElementById('appPan').value.trim().toUpperCase();
    const email = document.getElementById('appEmail').value.trim();
    const mobile = document.getElementById('appMobile').value.trim();
    const guardianName = document.getElementById('appGuardianName').value.trim();
    const guardianMobile = document.getElementById('appGuardianMobile').value.trim();
    const city = document.getElementById('appCity').value.trim();
    const pincode = document.getElementById('appPincode').value.trim();

    if (!fullName || fullName.length < 3) {
      showError('err_appFullName', 'Please enter your full name (at least 3 characters)');
      isValid = false;
    }

    if (!gender) {
      showError('err_appGender', 'Please select your gender');
      isValid = false;
    }

    if (!dob) {
      showError('err_appDob', 'Date of birth is required');
      isValid = false;
    } else {
      // Validate 22-28 years
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 21 || age > 29) {
        showError('err_appDob', `Candidate age is ${age} years. Must be between 22 and 28 years.`);
        isValid = false;
      }
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!pan || !panRegex.test(pan)) {
      showError('err_appPan', 'Please enter a valid 10-character PAN number (e.g. ABCDE1234F)');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError('err_appEmail', 'Please enter a valid email address');
      isValid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
      showError('err_appMobile', 'Please enter a valid 10-digit mobile number');
      isValid = false;
    }

    if (!guardianName || !guardianMobile) {
      alert('Parent / Guardian information is mandatory.');
      isValid = false;
    }

    if (!city || !pincode || pincode.length !== 6) {
      alert('Please enter a valid City and 6-digit PIN code.');
      isValid = false;
    }
  }

  if (step === 2) {
    const company = document.getElementById('appCurrentCompany').value.trim();
    const designation = document.getElementById('appDesignation').value.trim();
    const domain = document.getElementById('appExpDomain').value;
    const totalExp = document.getElementById('appTotalExpMonths').value;
    const relieving = document.getElementById('appRelievingStatus').value;

    if (!company || !designation || !domain || !totalExp || !relieving) {
      alert('Please fill all mandatory work experience fields.');
      isValid = false;
    }
  }

  if (step === 3) {
    const gradDegree = document.getElementById('appGradDegree').value.trim();
    const gradCollege = document.getElementById('appGradCollege').value.trim();
    const gradYear = document.getElementById('appGradYear').value;
    const gradPercent = document.getElementById('appGradPercent').value.trim();
    const b12 = document.getElementById('app12Board').value.trim();
    const p12 = document.getElementById('app12Percent').value.trim();
    const b10 = document.getElementById('app10Board').value.trim();
    const p10 = document.getElementById('app10Percent').value.trim();

    if (!gradDegree || !gradCollege || !gradYear || !gradPercent || !b12 || !p12 || !b10 || !p10) {
      alert('Please complete all academic qualification entries (10th, 12th, and Degree).');
      isValid = false;
    }
  }

  return isValid;
}

function showError(elemId, msg) {
  const el = document.getElementById(elemId);
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

function populateCities() {
  const state = document.getElementById('appState').value;
  const cityInput = document.getElementById('appCity');
  if (state === 'Maharashtra') {
    cityInput.placeholder = 'e.g. Mumbai, Pune, Nagpur, Nashik';
  } else if (state === 'Delhi') {
    cityInput.placeholder = 'e.g. New Delhi, Noida, Gurugram, Faridabad';
  } else if (state === 'Karnataka') {
    cityInput.placeholder = 'e.g. Bengaluru, Mysuru, Hubballi';
  } else {
    cityInput.placeholder = 'Enter city name';
  }
}

function handleApplicationSubmit(e) {
  e.preventDefault();

  const dec1 = document.getElementById('decRelative').checked;
  const dec2 = document.getElementById('decDisciplinary').checked;
  const dec3 = document.getElementById('decRegularMode').checked;
  const dec4 = document.getElementById('decTerms').checked;

  if (!dec1 || !dec2 || !dec3 || !dec4) {
    alert('You must review and agree to all declarations before proceeding.');
    return;
  }

  const submitBtn = document.getElementById('submitAppBtn');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Application & Payment...`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;

    // Show Success Modal
    const applicantName = document.getElementById('appFullName').value || 'Candidate';
    document.getElementById('successApplicantName').textContent = applicantName;
    const randomRef = 'AXIS-CBG-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('successRefId').textContent = randomRef;

    openSubmissionModal();
  }, 1200);
}

/* --------------------------------------------------------------------------
   30-SECOND ELIGIBILITY QUIZ MODAL
   -------------------------------------------------------------------------- */
let quizAnswers = {};

function openEligibilityModal() {
  const modal = document.getElementById('eligibilityModal');
  if (!modal) return;
  modal.classList.add('active');
  resetQuiz();
}

function closeEligibilityModal() {
  const modal = document.getElementById('eligibilityModal');
  if (modal) modal.classList.remove('active');
}

function closeModalOnOverlay(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
}

function resetQuiz() {
  quizAnswers = {};
  document.querySelectorAll('.quiz-step').forEach((s, idx) => {
    s.classList.toggle('active', idx === 0);
  });
}

function answerQuiz(stepNumber, val) {
  quizAnswers[stepNumber] = val;

  const current = document.getElementById(`quizStep${stepNumber}`);
  if (current) current.classList.remove('active');

  if (stepNumber < 4) {
    const next = document.getElementById(`quizStep${stepNumber + 1}`);
    if (next) next.classList.add('active');
  } else {
    // Show Results
    evaluateQuizResults();
  }
}

function evaluateQuizResults() {
  const resultStep = document.getElementById('quizResult');
  const resultCard = document.getElementById('quizResultCard');
  resultStep.classList.add('active');

  const ageOk = quizAnswers[1] === '22-28';
  const eduOk = quizAnswers[2] === 'regular50';
  const expOk = quizAnswers[3] === 'grad_1yr' || quizAnswers[3] === 'pg_6mo';
  const relativeOk = quizAnswers[4] === 'no_relative';

  if (ageOk && eduOk && expOk && relativeOk) {
    resultCard.className = 'quiz-result-card eligible';
    resultCard.innerHTML = `
      <i class="fa-solid fa-circle-check"></i>
      <h3>Congratulations! You Are Eligible</h3>
      <p>Your profile aligns perfectly with the Axis Bank Commercial Banking Group (CBG) Deputy Manager criteria.</p>
      <div style="background:rgba(255,255,255,0.7); padding:12px; border-radius:8px; margin-bottom:16px; font-size:0.85rem; text-align:left;">
        <div>✓ <strong>Age:</strong> Within 22–28 years</div>
        <div>✓ <strong>Academics:</strong> 50%+ regular graduation/PG</div>
        <div>✓ <strong>Experience:</strong> Verified corporate/sales background</div>
        <div>✓ <strong>Relative Policy:</strong> Compliant with Axis Bank guidelines</div>
      </div>
      <button class="btn btn-primary btn-block" onclick="proceedFromQuizToApply()">
        Proceed Directly to Registration <i class="fa-solid fa-arrow-right"></i>
      </button>
    `;
  } else {
    let reasons = [];
    if (!ageOk) reasons.push('Candidate must be between 22 and 28 years old.');
    if (!eduOk) reasons.push('Requires regular 10th, 12th & Degree with at least 50% marks in each.');
    if (!expOk) reasons.push('Requires min 1-2 yrs experience for graduates, or min 6 months for post-graduates.');
    if (!relativeOk) reasons.push('Axis Bank internal policy prohibits hiring immediate relatives.');

    resultCard.className = 'quiz-result-card ineligible';
    resultCard.innerHTML = `
      <i class="fa-solid fa-circle-xmark"></i>
      <h3>Eligibility Notice</h3>
      <p>Based on your responses, your profile does not currently satisfy the Axis Bank CBG requirements:</p>
      <ul style="text-align:left; font-size:0.85rem; color:#991B1B; margin: 12px 0 20px 20px; list-style:disc;">
        ${reasons.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary btn-block" onclick="resetQuiz()">
          <i class="fa-solid fa-rotate-left"></i> Retake Test
        </button>
        <button class="btn btn-primary btn-block" onclick="proceedFromQuizToApply()">
          View Application Form
        </button>
      </div>
    `;
  }
}

function proceedFromQuizToApply() {
  closeEligibilityModal();
  scrollToApplication();
}

/* --------------------------------------------------------------------------
   CONFIRMATION MODAL
   -------------------------------------------------------------------------- */
function openSubmissionModal() {
  const modal = document.getElementById('submissionModal');
  if (modal) modal.classList.add('active');
}

function closeSubmissionModal() {
  const modal = document.getElementById('submissionModal');
  if (modal) modal.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
