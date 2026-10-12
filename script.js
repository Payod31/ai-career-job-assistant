// Embedded sample data to avoid CORS issues when loading from file://
const sampleData = {
  "sampleResumes": {
    "ecommerce-ops": "E-commerce Operations Specialist\nPattern Technologies India Pvt Ltd, Pune | 2022 - Present\n- Amazon product onboarding, Master ID creation, flat files, ASIN setup, catalog management, and listing compliance for 500+ SKUs monthly\n- Pattern PXM (Amplifi), digital asset management, A+ Content, Brand Stories, and Amazon Storefronts management\n- Listing suppression resolution, Amazon case management, promotions, Subscribe & Save, and Buy Box monitoring\n- Marketplace operations across Amazon, Walmart, Target, eBay, and TikTok Shop\n- Performance marketing: Meta Ads, Google Ads, Google Analytics, Excel, KPI reporting, and competitive analysis\n- Education: B.Tech Computer Science Engineering, MBA in Marketing\n- Previous data science internship: Python, data analysis, machine learning, NLP exposure\n- Automation projects: bulk image asset downloading, link-to-PDF conversion, Amazon Brand Store media extraction",
    "marketing-analyst": "Marketing Analyst\nVarious Companies | 2020 - 2022\n- Managed Meta Ads and Google Ads campaigns with monthly budgets of $50K+\n- Analyzed campaign performance using Google Analytics and Excel\n- Created weekly performance reports and optimization recommendations\n- Conducted A/B testing on ad creatives and landing pages\n- Tracked KPIs: ROAS, CTR, CPC, conversion rates\n- Collaborated with design and content teams on campaign assets\n- Education: B.Tech Computer Science Engineering, MBA in Marketing",
    "business-analyst": "Business Analyst\nPattern Technologies India Pvt Ltd | 2021 - 2023\n- Analyzed marketplace performance data and created actionable insights\n- Built dashboards in Excel and Power BI for stakeholders\n- Documented business processes and identified optimization opportunities\n- Collaborated with tech teams on system requirements\n- Conducted competitive analysis and market research\n- Education: B.Tech Computer Science Engineering, MBA in Marketing"
  },
  "sampleJobs": {
    "ecommerce-analyst": "E-commerce Analyst\nCompany: RetailTech Solutions\nLocation: Pune (Hybrid)\nWe are looking for an E-commerce Analyst to join our team and help optimize our clients' online marketplace performance.\n\nRequirements:\n- Bachelor's degree in Business, Marketing, or related field (MBA preferred)\n- 2+ years experience in e-commerce operations or marketplace management\n- Proficiency in Excel for data analysis and reporting\n- Experience with Amazon Seller Central, Walmart Marketplace, or similar platforms\n- Knowledge of performance marketing (Meta Ads, Google Ads)\n- Strong analytical skills with ability to interpret data and make recommendations\n- Experience with SQL or Power BI is a plus\n- Excellent communication and presentation skills\n\nResponsibilities:\n- Analyze sales performance across multiple marketplaces\n- Create weekly/monthly performance reports for clients\n- Identify trends and opportunities for optimization\n- Assist with product listing optimization and compliance\n- Monitor competitor activity and pricing strategies\n- Support clients with advertising campaign analysis and optimization",
    "marketing-analyst-job": "Marketing Analyst\nCompany: DigitalGrowth Agency\nLocation: Mumbai (Remote)\nJoin our team as a Marketing Analyst to help clients optimize their digital marketing performance.\n\nRequirements:\n- Bachelor's degree in Marketing, Business, or Statistics\n- 1-3 years experience in digital marketing analysis\n- Proficiency in Google Analytics and Excel\n- Experience managing Meta Ads and Google Ads campaigns\n- Strong understanding of marketing funnels and attribution models\n- Ability to create actionable insights from marketing data\n- Experience with A/B testing and conversion rate optimization\n- Excellent communication and reporting skills\n\nResponsibilities:\n- Analyze digital marketing campaign performance\n- Create performance reports and optimization recommendations\n- Conduct A/B tests on ad creatives, landing pages, and audiences\n- Monitor and report on key metrics: ROAS, CTR, CPC, conversion rates\n- Stay updated with latest digital marketing trends and platform changes\n- Collaborate with clients to understand business goals and translate to marketing strategies",
    "business-analyst-job": "Business Analyst\nCompany: FinTech Innovations\nLocation: Bangalore (On-site)\nWe are seeking a Business Analyst to bridge the gap between business needs and technical solutions.\n\nRequirements:\n- Bachelor's degree in Computer Science, Business, or Engineering (MBA preferred)\n- 2+ years experience as a Business Analyst or in similar role\n- Experience with requirement gathering and documentation\n- Proficiency in Excel and Power BI for data visualization\n- Knowledge of SDLC and Agile methodologies\n- Strong analytical and problem-solving skills\n- Experience with SQL or database querying is a plus\n- Excellent communication and stakeholder management skills\n\nResponsibilities:\n- Gather and document business requirements from stakeholders\n- Create functional specifications and user stories\n- Analyze current processes and identify improvement opportunities\n- Collaborate with development teams on solution design\n- Conduct user acceptance testing and training\n- Monitor and report on project progress and key metrics",
    "automation-specialist": "Automation Specialist\nCompany: TechFlow Solutions\nLocation: Pune (Hybrid)\nLooking for an Automation Specialist to help streamline business processes through intelligent automation.\n\nRequirements:\n- Bachelor's degree in Computer Science or related field\n- 1-3 years experience with automation or scripting\n- Proficiency in Python for automation tasks\n- Experience with web scraping, data extraction, or API integration\n- Knowledge of Excel automation (VBA or openpyxl)\n- Familiarity with workflow automation tools (Zapier, Power Automate, etc.)\n- Basic understanding of AI/ML concepts for process optimization\n- Strong problem-solving skills and attention to detail\n\nResponsibilities:\n- Develop automation scripts for repetitive business tasks\n- Create data extraction and transformation pipelines\n- Build Excel automation for reporting and analysis\n- Integrate various systems through APIs\n- Monitor and maintain automation solutions\n- Identify opportunities for process improvement through automation\n- Document automation solutions and provide training to users"
  }
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Get all UI elements
  const resumeInput = document.getElementById('resumeInput');
  const resumeUpload = document.getElementById('resumeUpload');
  const resumeSample = document.getElementById('resumeSample');
  const analyzeResumeBtn = document.getElementById('analyzeResumeBtn');
  const jobInput = document.getElementById('jobInput');
  const jobSample = document.getElementById('jobSample');
  const analyzeJobBtn = document.getElementById('analyzeJobBtn');
  const calculateMatchBtn = document.getElementById('calculateMatchBtn');
  const addApplicationBtn = document.getElementById('addApplicationBtn');
  const findJobsBtn = document.getElementById('findJobsBtn');
  const resumeScore = document.getElementById('resume-score');
  const resumeFeedback = document.getElementById('resume-feedback');
  const resumeStrengths = document.getElementById('resume-strengths');
  const resumeWeaknesses = document.getElementById('resume-weaknesses');
  const resumeSuggestions = document.getElementById('resume-suggestions');
  const careerFitScore = document.getElementById('career-fit-score');
  const careerFitFeedback = document.getElementById('career-fit-feedback');
  const careerFitDetails = document.getElementById('career-fit-details');
  const targetRoleSelect = document.getElementById('targetRoleSelect');
  const totalExperience = document.getElementById('total-experience');
  const relevantExperience = document.getElementById('relevant-experience');
  const seniorityLevel = document.getElementById('seniority-level');
  const poorFitExplanation = document.getElementById('poor-fit-explanation');
  const jobResults = document.getElementById('jobResults');
  const matchResults = document.getElementById('matchResults');
  const matchFeedback = document.getElementById('match-feedback');
  const matchSuggestions = document.getElementById('match-suggestions');
  const discoveryResumeStatus = document.getElementById('discoveryResumeStatus');
  const discoveryResults = document.getElementById('discoveryResults');
  const resumeInputMessage = document.getElementById('resumeInputMessage');
const discoveryModeSwitch = document.getElementById('discoveryModeSwitch');
  const discRoleFilter = document.getElementById('discRoleFilter');
  const discLocationFilter = document.getElementById('discLocationFilter');
  const discSalaryMin = document.getElementById('discSalaryMin');
  const discSalaryMax = document.getElementById('discSalaryMax');
  const discExperience = document.getElementById('discExperience');
  const discoveryClearProfileBtn = document.getElementById('discoveryClearProfileBtn');
  const salaryInfo = document.getElementById('salaryInfo');
  const jobInputMessage = document.getElementById('jobInputMessage');

  // Tab buttons
  const tabButtons = {
    resumeAnalysis: document.getElementById('resume-tab'),
    jobAnalysis: document.getElementById('job-tab'),
    matchCalculation: document.getElementById('match-tab'),
    applicationTracker: document.getElementById('tracker-tab'),
    jobDiscovery: document.getElementById('discovery-tab')
  };

  const tabPanes = {
    resumeAnalysis: document.getElementById('resume-panel'),
    jobAnalysis: document.getElementById('job-panel'),
    matchCalculation: document.getElementById('match-panel'),
    applicationTracker: document.getElementById('tracker-panel'),
    jobDiscovery: document.getElementById('discovery-panel')
  };

  // Show a tab pane and mark its button as active — no Bootstrap dependency
  function switchTab(tabName) {
    // Hide all panes and deactivate all buttons
    Object.keys(tabPanes).forEach(key => {
      tabPanes[key].classList.remove('show', 'active');
      tabPanes[key].style.display = 'none';
      tabButtons[key].classList.remove('active');
      tabButtons[key].setAttribute('aria-selected', 'false');
    });
    // Show the requested pane
    if (tabPanes[tabName]) {
      tabPanes[tabName].classList.add('show', 'active');
      tabPanes[tabName].style.display = '';
      tabPanes[tabName].classList.remove('fade');
    }
    if (tabButtons[tabName]) {
      tabButtons[tabName].classList.add('active');
      tabButtons[tabName].setAttribute('aria-selected', 'true');
    }
  }

  // Attach direct click handlers to every tab button
  Object.keys(tabButtons).forEach(key => {
    tabButtons[key].addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      switchTab(key);
    });
  });

  // Global data storage
  let resumeData = {};
  let careerFitData = {};
  let jobApplications = [];

  // Load applications from localStorage on startup
  function loadApplications() {
    try {
      const data = localStorage.getItem('jobApplications');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load applications:', e);
      return [];
    }
  }

  // Save applications to localStorage
  function saveApplications(applications) {
    try {
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save applications:', e);
    }
  }

  // Initialize applications
  jobApplications = loadApplications();

  // Resume file upload handler
  resumeUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show loading state
    resumeInput.value = 'Extracting text from file...';
    resumeInput.disabled = true;

    try {
      let text = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Handle PDF file
        text = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.toLowerCase().endsWith('.docx')) {
        // Handle DOCX file
        text = await extractTextFromDOCX(file);
      } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        // Handle TXT file
        text = await extractTextFromTXT(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      }

      if (text.trim() === '') {
        throw new Error('No text could be extracted from the file. The file may be empty, scanned, or image-only.');
      }

      // Update the textarea with extracted text
      resumeInput.value = text;
      resumeInput.disabled = false;

      // Show success message with filename
      resumeInputMessage.innerHTML = `<div class="alert alert-success alert-dismissible fade show mb-0" role="alert">
        <i class="bi bi-check-circle me-2"></i>Resume text loaded from <strong>${file.name}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      // Enable the Analyze Resume button when there's text
      analyzeResumeBtn.disabled = false;

      // Hide results panels until analysis is performed
      document.getElementById('resumeResultsCard').classList.add('d-none');
      document.getElementById('careerFitCard').classList.add('d-none');

      // Reset career fit fields
      document.getElementById('career-fit-score').textContent = '0%';
      document.getElementById('career-fit-feedback').textContent = 'Analyze your resume to see career fit details.';
      document.getElementById('career-fit-details').innerHTML = '<div class="text-center py-4"><p class="text-muted">Analyze your resume to see specific career fit details.</p></div>';
    } catch (error) {
      // Handle errors
      resumeInput.value = '';
      resumeInput.disabled = false;
      resumeInput.placeholder = 'Copy and paste your resume text...';
      analyzeResumeBtn.disabled = true;

      // Show error message
      resumeInputMessage.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mb-0" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>${error.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      console.error('File processing error:', error);
    }
  });

  // Resume upload zone event listeners
  const resumeUploadZone = document.getElementById('resumeUploadZone');
  if (resumeUploadZone) {
    // Handle click on upload zone
    resumeUploadZone.addEventListener('click', () => {
      document.getElementById('resumeUpload').click();
    });

    // Handle drag over
    resumeUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      resumeUploadZone.classList.add('dragover');
    });

    // Handle drag leave
    resumeUploadZone.addEventListener('dragleave', () => {
      resumeUploadZone.classList.remove('dragover');
    });

    // Handle drop
    resumeUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      resumeUploadZone.classList.remove('dragover');

      const file = e.dataTransfer.files[0];
      if (file) {
        // Create a new FileList object with the dropped file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        document.getElementById('resumeUpload').files = dataTransfer.files;

        // Trigger the change event
        document.getElementById('resumeUpload').dispatchEvent(new Event('change'));
      }
    });
  }

  // Analyze resume button handler
  analyzeResumeBtn.addEventListener('click', () => {
    const resumeText = resumeInput.value.trim();
    if (resumeText) {
      resumeData = parseResume(resumeText);
      saveResumeProfile(resumeData);
      updateResumeAnalysisUI();

      // Show results panels after analysis
      document.getElementById('resumeResultsCard').classList.remove('d-none');
      document.getElementById('careerFitCard').classList.remove('d-none');

      // Switch to resume analysis tab
      switchTab('resumeAnalysis');
    } else {
      alert('Please enter your resume text');
    }
  });

  // Sample resume selection handler
  resumeSample.addEventListener('change', () => {
    const sampleValue = resumeSample.value;
    if (sampleValue) {
      // Load sample resume from embedded data (avoids CORS issues)
      const sampleResume = sampleData.sampleResumes[sampleValue];
      if (sampleResume) {
        resumeInput.value = sampleResume;
        resumeInput.disabled = false;

        // Show success message
        resumeInputMessage.innerHTML = `<div class="alert alert-success alert-dismissible fade show mb-0" role="alert">
          <i class="bi bi-check-circle me-2"></i>Sample resume loaded: <strong>${resumeSample.options[resumeSample.selectedIndex].text}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

        // Enable the Analyze Resume button when there's text
        analyzeResumeBtn.disabled = false;

        // Hide results panels until analysis is performed
        document.getElementById('resumeResultsCard').classList.add('d-none');
        document.getElementById('careerFitCard').classList.add('d-none');

        // Reset career fit fields
        document.getElementById('career-fit-score').textContent = '0%';
        document.getElementById('career-fit-feedback').textContent = 'Analyze your resume to see career fit details.';
        document.getElementById('career-fit-details').innerHTML = '<div class="text-center py-4"><p class="text-muted">Analyze your resume to see specific career fit details.</p></div>';
      } else {
        // Show error message if sample not found
        resumeInputMessage.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mb-0" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>Sample resume not found
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      }
    }
  });

  // Analyze job description button handler
  analyzeJobBtn.addEventListener('click', () => {
    const jobDescText = jobInput.value.trim();
    if (jobDescText) {
      careerFitData = parseJobDescription(jobDescText);
      updateJobAnalysisUI();
      document.getElementById('jobResultsCard').classList.remove('d-none');
      // Show the results card
      setTimeout(() => {
        document.getElementById('jobResultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      document.getElementById('jobInputMessage').innerHTML = `<div class="alert alert-danger alert-dismissible fade show mb-0" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>Please paste or load a job description first
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    }
  });

  // Sample job description selection handler
  jobSample.addEventListener('change', () => {
    const sampleValue = jobSample.value;
    if (sampleValue) {
      // Load sample job description from embedded data (avoids CORS issues)
      const sampleJob = sampleData.sampleJobs[sampleValue];
      if (sampleJob) {
        jobInput.value = sampleJob;

        // Hide previous results — user must click Analyze to see new results
        document.getElementById('jobResultsCard').classList.add('d-none');

        // Show success message
        document.getElementById('jobInputMessage').innerHTML = `<div class="alert alert-success alert-dismissible fade show mb-0" role="alert">
          <i class="bi bi-check-circle me-2"></i>Sample job description loaded: <strong>${jobSample.options[jobSample.selectedIndex].text}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

        // Switch to job analysis tab
        switchTab('jobAnalysis');
      } else {
        // Show error message if sample not found
        alert('Sample job description not found');
      }
    }
  });

  // --- Job Description: unified input handlers (one textarea + source pills) ---
  const jdUploadBtn = document.getElementById('jdUploadBtn');
  const jdFetchToggleBtn = document.getElementById('jdFetchToggleBtn');
  const jdSampleToggleBtn = document.getElementById('jdSampleToggleBtn');
  const jdUrlRow = document.getElementById('jdUrlRow');
  const jdSampleRow = document.getElementById('jdSampleRow');
  const jobUrlInput = document.getElementById('jobUrlInput');
  const fetchJobUrlBtn = document.getElementById('fetchJobUrlBtn');
  const jdFileUpload = document.getElementById('jdFileUpload');
  const copyJobBtn = document.getElementById('copyJobBtn');

  // Upload pill → open the file dialog
  jdUploadBtn.addEventListener('click', () => jdFileUpload.click());

  // Fetch pill → reveal the inline URL row
  jdFetchToggleBtn.addEventListener('click', () => {
    jdSampleRow.classList.add('d-none');
    jdUrlRow.classList.toggle('d-none');
    if (!jdUrlRow.classList.contains('d-none')) jobUrlInput.focus();
  });

  // Sample pill → reveal the inline sample row
  jdSampleToggleBtn.addEventListener('click', () => {
    jdUrlRow.classList.add('d-none');
    jdSampleRow.classList.toggle('d-none');
  });

  // Small helper to render feedback in the unified area
  function showJdMessage(type, html) {
    const cls = { success: 'alert-success', danger: 'alert-danger', info: 'alert-info' }[type] || 'alert-info';
    document.getElementById('jobInputMessage').innerHTML =
      `<div class="alert ${cls} alert-dismissible fade show mb-0" role="alert">${html}` +
      `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  }

  // Fetch JD from URL — tries multiple CORS proxies, fills the shared textarea
  fetchJobUrlBtn.addEventListener('click', async () => {
    const url = jobUrlInput.value.trim();
    if (!url) {
      showJdMessage('danger', '<i class="bi bi-exclamation-triangle me-2"></i>Please paste a valid job posting URL.');
      return;
    }

    document.getElementById('jobInputMessage').innerHTML =
      '<div class="alert alert-info mb-0"><span class="spinner-border spinner-border-sm me-2"></span>Fetching job description…</div>';

    let extractedText = '';
    let lastError = null;

    // Step 1: Jina Reader — purpose-built to pull readable text; works on many
    // sites (including LinkedIn) that block generic CORS proxies.
    try {
      const resp = await fetch(`https://r.jina.ai/${url}`);
      if (resp.ok) {
        const txt = (await resp.text()).trim();
        if (txt.length >= 50) {
          extractedText = txt;
        } else {
          lastError = new Error('Reader returned too little text');
        }
      } else {
        lastError = new Error(`Reader returned ${resp.status}`);
      }
    } catch (e) {
      lastError = e;
    }

    // Step 2: fall back to HTML proxies if the reader failed
    if (extractedText.length < 50) {
      const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
      ];
      for (const proxyUrl of proxies) {
        try {
          const response = await fetch(proxyUrl);
          if (!response.ok) { lastError = new Error(`Server ${response.status}`); continue; }
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          doc.querySelectorAll('script, style, nav, footer, header, aside, iframe').forEach(el => el.remove());
          const main = doc.querySelector('main, article, [class*="job-description"], [class*="description"]') || doc.body;
          extractedText = main.innerText.replace(/\n{3,}/g, '\n\n').replace(/\s{3,}/g, '  ').trim();
          if (extractedText.length >= 50) break;
        } catch (e) { lastError = e; }
      }
    }

    if (extractedText.length >= 50) {
      jobInput.value = extractedText;
      showJdMessage('success',
        `<i class="bi bi-check-circle me-2"></i><strong>Job description fetched</strong> — ${extractedText.length} characters loaded into the box above. Click <strong>Analyze</strong> when ready.`);
    } else {
      const isLinkedIn = /linkedin\.com/i.test(url);
      showJdMessage('danger',
        `<i class="bi bi-exclamation-triangle me-2"></i><strong>Couldn't fetch this page</strong> (${lastError ? lastError.message : 'blocked'}).<br>` +
        `<small>${isLinkedIn
          ? 'LinkedIn blocks almost all automated fetches. Easiest fix: open the job in a new tab → <b>Ctrl+A → Ctrl+C</b> → paste into the box above.'
          : 'This site blocks automated requests. Open the posting → select the text → copy → paste into the box above.'}</small>`);
    }
  });

  // JD file upload — change handler
  jdFileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('jobInputMessage').innerHTML =
      '<div class="alert alert-info mb-0"><span class="spinner-border spinner-border-sm me-2"></span>Reading file…</div>';

    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        text = await extractTextFromDOCX(file);
      } else {
        text = await extractTextFromTXT(file);
      }

      if (!text.trim()) throw new Error('No text found in file. It may be scanned or image-only.');

      jobInput.value = text;
      showJdMessage('success',
        `<i class="bi bi-check-circle me-2"></i><strong>JD loaded:</strong> ${file.name} — ${text.length} characters. Click <strong>Analyze</strong> when ready.`);
    } catch (err) {
      showJdMessage('danger', `<i class="bi bi-exclamation-triangle me-2"></i>${err.message}`);
    }
  });

  // Copy JD to clipboard
  copyJobBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(jobInput.value || JSON.stringify(careerFitData, null, 2));
      copyJobBtn.textContent = 'Copied!';
      setTimeout(() => copyJobBtn.textContent = 'Copy JD', 2000);
    } catch (e) {
      alert('Copy not supported in this browser context.');
    }
  });

  // Calculate match button handler
  calculateMatchBtn.addEventListener('click', () => {
    if (Object.keys(resumeData).length === 0) {
      switchTab('resumeAnalysis');
      alert('Analyze your resume first, then come back here to run a match.');
      return;
    }
    if (Object.keys(careerFitData).length === 0) {
      switchTab('jobAnalysis');
      alert('Analyze a job description first, then come back here to run a match.');
      return;
    }
    analyzeCareerFit();
    renderMatchResults();
    switchTab('matchCalculation');
  });

  // Application tracker handlers
  addApplicationBtn.addEventListener('click', () => {
    const applicationForm = document.getElementById('applicationForm');
    applicationForm.classList.remove('d-none');
    addApplicationBtn.classList.add('d-none');
  });

  cancelAppBtn.addEventListener('click', () => {
    const applicationForm = document.getElementById('applicationForm');
    applicationForm.classList.add('d-none');
    addApplicationBtn.classList.remove('d-none');
    appForm.reset();
  });

  appForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const application = {
      company: appCompany.value.trim(),
      role: appRole.value.trim(),
      date: appDate.value,
      link: appLink.value.trim(),
      status: appStatus.value,
      notes: appNotes.value.trim()
    };

    // Validate required fields
    if (!application.company || !application.role || !application.date) {
      alert('Please fill in all required fields');
      return;
    }

    jobApplications.push(application);
    saveApplications(jobApplications);
    renderApplicationsList();

    // Reset form and hide it
    appForm.reset();
    const applicationFormDiv = document.getElementById('applicationForm');
    applicationFormDiv.classList.add('d-none');
    addApplicationBtn.classList.remove('d-none');
  });

  // Discovery panel handlers
  discoveryClearProfileBtn.addEventListener('click', () => {
    localStorage.removeItem('discoveryResumeProfile');
    discoveryResumeStatus.innerHTML = '<p class="text-muted">No resume profile loaded</p>';
  });

  discoveryResumeUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    discoveryResumeStatus.innerHTML = '<p>Extracting text from file...</p>';

    try {
      let text = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.toLowerCase().endsWith('.docx')) {
        text = await extractTextFromDOCX(file);
      } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        text = await extractTextFromTXT(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      }

      if (text.trim() === '') {
        throw new Error('No text could be extracted from the file.');
      }

      // Build resume profile and save to localStorage
      const resumeProfile = buildResumeProfile(text);
      localStorage.setItem('discoveryResumeProfile', JSON.stringify(resumeProfile));
      discoveryResumeStatus.innerHTML = '<p class="text-success">Resume profile loaded successfully!</p>';

      // Auto-search if enabled
      if (discoveryModeSwitch.checked) {
        findRelevantJobs();
      }
    } catch (error) {
      discoveryResumeStatus.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
      console.error('Discovery resume upload error:', error);
    }
  });

  clearFiltersBtn.addEventListener('click', () => {
    discRoleFilter.value = '';
    discLocationFilter.value = '';
    discSalaryMin.value = '';
    discSalaryMax.value = '';
    discExperience.value = '';

    if (discoveryModeSwitch.checked) {
      findLiveVacancies();
    } else {
      findRelevantJobs();
    }
  });

  findJobsBtn.addEventListener('click', () => {
    if (discoveryModeSwitch.checked) {
      findLiveVacancies();
    } else {
      findRelevantJobs();
    }
  });

  discoveryModeSwitch.addEventListener('change', () => {
    if (discoveryModeSwitch.checked) {
      document.querySelector('[for="discoveryModeSwitch"] .ms-2').textContent = 'Show live vacancy listings (unchecked = job-board search)';
      // Search with live vacancies when switched to live mode
      if (localStorage.getItem('discoveryResumeProfile')) {
        findLiveVacancies();
      }
    } else {
      document.querySelector('[for="discoveryModeSwitch"] .ms-2').textContent = 'Show job-board search (unchecked = live vacancy listings)';
      // Search with job boards when switched to job-board mode
      if (localStorage.getItem('discoveryResumeProfile')) {
        findRelevantJobs();
      }
    }
  });

  // Helper function to format experience years
  function formatExperienceYears(years) {
    if (years < 1) {
      const months = years * 12;
      return months.toFixed(0) + ' months';
    }
    return years.toFixed(2) + ' years';
  }

  // Save resume profile to localStorage
  function saveResumeProfile(data) {
    try {
      localStorage.setItem('resumeProfile', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save resume profile:', e);
    }
  }

  // Load resume profile from localStorage
  function loadResumeProfile() {
    try {
      const data = localStorage.getItem('resumeProfile');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load resume profile:', e);
      return {};
    }
  }

  // Load resume profile and update UI on startup
 function loadResumeProfileAndUpdateUI() {
  // Do not automatically display an old resume analysis on startup.
  resumeData = {};
}

  // Update resume analysis UI
  function updateResumeAnalysisUI() {
    if (Object.keys(resumeData).length === 0) return;

    // Calculate a resume quality score (simplified)
    const skillScore = Math.min(resumeData.skills.length * 5, 30); // Up to 30 points for skills
    const expScore = Math.min(resumeData.totalExperience * 3, 30); // Up to 30 points for experience
    const eduScore = resumeData.education.length > 0 ? 20 : 0; // 20 points for education
    const contactScore = (resumeData.contactInfo.email || resumeData.contactInfo.phone) ? 10 : 0; // 10 points for contact
    const resumeScoreValue = skillScore + expScore + eduScore + contactScore;

    const score = Math.round(resumeScoreValue);
    let feedback = '';
    let scoreColor = '';
    let scoreLabel = '';
    if (score >= 80) {
      feedback = 'Strong resume with well-presented skills and experience. You are competitive in your target roles.';
      scoreColor = '#C8F54A';
      scoreLabel = 'Strong';
    } else if (score >= 60) {
      feedback = 'Good resume with clear strengths. Focus on a few targeted improvements to stand out more.';
      scoreColor = '#FFB454';
      scoreLabel = 'Good';
    } else if (score >= 40) {
      feedback = 'Fair resume that could benefit from stronger achievement framing and quantified impact.';
      scoreColor = '#FF6B6B';
      scoreLabel = 'Needs Work';
    } else {
      feedback = 'Resume needs significant restructuring. Consider highlighting measurable results and relevant skills.';
      scoreColor = '#FF6B6B';
      scoreLabel = 'Needs Improvement';
    }

    const skillChips = skills => skills && skills.length > 0
      ? `<div class="skill-chips">${skills.map(s => `<span class="chip chip-accent">${s}</span>`).join('')}</div>`
      : `<span class="text-muted" style="font-size:0.85rem">Not detected</span>`;

    resumeResults.innerHTML = `
      <!-- Score Hero Section -->
      <div class="score-hero">
        <div class="score-hero-ring">
          <svg viewBox="0 0 120 120" width="140" height="140">
            <circle cx="60" cy="60" r="52" fill="none" stroke-width="8" class="ring-bg"/>
            <circle id="resumeScoreRing" cx="60" cy="60" r="52" fill="none" stroke-width="8"
              stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="326.73"
              transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1.5s ease-in-out;filter:drop-shadow(0 0 6px ${scoreColor}44)"/>
          </svg>
          <div class="score-hero-value">
            <span id="resume-score" class="score-hero-number" style="color:${scoreColor}">${score}%</span>
            <span class="score-hero-label">${scoreLabel}</span>
          </div>
        </div>
        <div class="score-hero-text">
          <h4 style="color:var(--text);font-family:'Sora';font-size:1.1rem;font-weight:700;margin-bottom:8px">Resume Health Score</h4>
          <p id="resume-feedback" style="color:var(--muted);line-height:1.7;font-size:0.95rem;margin:0;max-width:400px">${feedback}</p>
          <div class="score-stats-row">
            <div class="score-stat">
              <span class="score-stat-val">${resumeData.skills.length}</span>
              <span class="score-stat-lbl">Skills</span>
            </div>
            <div class="score-stat">
              <span class="score-stat-val">${formatExperienceYears(resumeData.totalExperience)}</span>
              <span class="score-stat-lbl">Experience</span>
            </div>
            <div class="score-stat">
              <span class="score-stat-val">${resumeData.education.length}</span>
              <span class="score-stat-lbl">Education</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Info Strip -->
      ${resumeData.contactInfo.email || resumeData.contactInfo.phone ? `
      <div class="contact-strip">
        ${resumeData.contactInfo.email ? `<span class="contact-item"><span class="contact-icon">✉</span>${resumeData.contactInfo.email}</span>` : ''}
        ${resumeData.contactInfo.phone ? `<span class="contact-item"><span class="contact-icon">☎</span>${resumeData.contactInfo.phone}</span>` : ''}
      </div>` : ''}

      <!-- Skill Sections Grid -->
      <div class="skill-grid">
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:#8B7BFF"></span>
            <span>Functional</span>
          </div>
          ${skillChips(resumeData.functionalSkills)}
        </div>
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:#C8F54A"></span>
            <span>Technical</span>
          </div>
          ${skillChips(resumeData.technicalSkills)}
        </div>
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:#FFB454"></span>
            <span>Marketplace</span>
          </div>
          ${skillChips(resumeData.marketplacePlatforms)}
        </div>
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:#5ECFE8"></span>
            <span>Tools</span>
          </div>
          ${skillChips(resumeData.tools)}
        </div>
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:#FF6B9D"></span>
            <span>Analytics</span>
          </div>
          ${skillChips(resumeData.analytics)}
        </div>
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:#A3A9B8"></span>
            <span>Transferable</span>
          </div>
          ${skillChips(resumeData.transferableSkills)}
        </div>
      </div>

      <!-- Strengths & Weaknesses -->
      <div class="insight-grid">
        <div class="insight-card insight-card-strengths">
          <div class="insight-card-icon">✓</div>
          <div>
            <h6>Strengths</h6>
            <ul class="insight-list">${generateStrengthsList(resumeData)}</ul>
          </div>
        </div>
        <div class="insight-card insight-card-weaknesses">
          <div class="insight-card-icon">!</div>
          <div>
            <h6>Areas to Improve</h6>
            <ul class="insight-list">${generateWeaknessesList(resumeData)}</ul>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div class="insight-card insight-card-suggestions mt-3">
        <div class="insight-card-icon">→</div>
        <div>
          <h6>Suggestions</h6>
          <ul class="insight-list">${generateSuggestionsList(resumeData)}</ul>
        </div>
      </div>
    `;

    // Animate the score ring after DOM render
    setTimeout(() => {
      const resumeRing = document.getElementById('resumeScoreRing');
      if (resumeRing) {
        const circumference = 326.73;
        resumeRing.style.stroke = scoreColor;
        resumeRing.style.strokeDashoffset = circumference - (circumference * score / 100);
      }
    }, 50);

    // Also update Career Fit experience fields when resume is analyzed
    if (totalExperience && relevantExperience && seniorityLevel) {
      totalExperience.textContent = formatExperienceYears(resumeData.totalExperience);
      relevantExperience.textContent = formatExperienceYears(resumeData.relevantExperience);

      // Determine seniority level
      let level = 'Entry Level';
      if (resumeData.totalExperience >= 8) level = 'Senior';
      else if (resumeData.totalExperience >= 5) level = 'Mid-Senior';
      else if (resumeData.totalExperience >= 2) level = 'Mid Level';
      seniorityLevel.textContent = level;
    }

    // Update Career Fit score and feedback when no job description is analyzed yet
    // Show appropriate empty state instead of fake scores
    if (careerFitScore && careerFitFeedback && Object.keys(careerFitData).length === 0) {
      // Show empty state - no job description analyzed yet
      careerFitScore.textContent = '0%';
      careerFitFeedback.textContent = 'Analyze a job description to see career fit details.';

      // Clear experience fields
      if (totalExperience) totalExperience.textContent = formatExperienceYears(resumeData.totalExperience);
      if (relevantExperience) relevantExperience.textContent = '0 years';
      if (seniorityLevel) seniorityLevel.textContent = 'Entry Level';
      if (poorFitExplanation) poorFitExplanation.textContent = '';

      // Clear the detailed breakdown
      if (careerFitDetails) {
        careerFitDetails.innerHTML = `
          <div class="text-center py-4">
            <p class="text-muted">Analyze a job description to see specific career fit details.</p>
          </div>
        `;
      }
    }
  }

  // Update job analysis UI — full premium redesign
  function updateJobAnalysisUI() {
    if (Object.keys(careerFitData).length === 0) {
      document.getElementById('jobResultsCard').classList.add('d-none');
      return;
    }
    document.getElementById('jobResultsCard').classList.remove('d-none');

    const rawText = careerFitData.rawText || '';
    const jobTextLower = rawText.toLowerCase();

    // Extract a clean job title with a better heuristic
    const jobTitle = extractJobTitle(rawText);

    // Job type
    const isRemote   = /\bremote\b/.test(jobTextLower);
    const isHybrid   = /\bhybrid\b/.test(jobTextLower);
    const isOnsite   = /\b(on-site|onsite|in-office|in office)\b/.test(jobTextLower);
    const jobType    = isRemote ? 'Remote' : isHybrid ? 'Hybrid' : isOnsite ? 'On-site' : '';

    // Location
    const locationMatch = jobTextLower.match(/\b(pune|bengaluru|mumbai|hyderabad|delhi|gurgaon|noida|chennai|kolkata|remote|india|remote work|work from home)\b/);
    const location = locationMatch ? locationMatch[0].replace('remote work', 'Remote').replace('work from home', 'WFM')
      .split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : '';

    // Salary
    const salaryMatch = jobTextLower.match(/(₹|rs\.?\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|l\b|k\b|cr\b|inr|\$|eur)\s*\/?\s*(year|yearly|annum|lpa)?/i)
      || jobTextLower.match(/salary[:\s]*([^.\n]{5,60})/i);
    const salary = salaryMatch ? salaryMatch[0].trim().substring(0, 50) : '';

    // Experience
    const expReq = careerFitData.experienceRequired && careerFitData.experienceRequired !== 'Not specified'
      ? careerFitData.experienceRequired : '';

    // Education
    const eduReq = careerFitData.educationRequired && careerFitData.educationRequired !== 'Not specified'
      ? careerFitData.educationRequired : '';

    // Key skills — deduplicated
    const keySkills = [...new Set((careerFitData.keySkills || []).map(s => s.trim()).filter(Boolean))];
    const mustHaves = extractMustHaves(rawText);

    // JD Completeness Score
    let completeness = 0;
    if (expReq)  completeness += 20;
    if (eduReq)  completeness += 20;
    if (keySkills.length > 3) completeness += 20;
    if (careerFitData.requirements?.length > 2) completeness += 20;
    if (jobType) completeness += 10;
    if (salary)  completeness += 10;

    // Skill Gap Analysis (only if resume is analyzed)
    let skillGapHtml = '';
    if (Object.keys(resumeData).length > 0 && keySkills.length > 0) {
      const resumeSkillSet = new Set((resumeData.skills || []).map(s => s.toLowerCase().trim()));
      const matched = keySkills.filter(s => resumeSkillSet.has(s.toLowerCase().trim()));
      const missing = keySkills.filter(s => !resumeSkillSet.has(s.toLowerCase().trim()));
      const matchPct = Math.round((matched.length / keySkills.length) * 100);

      skillGapHtml = `
        <div class="jd-skill-gap">
          <h6>Skill Gap Analysis <span class="text-muted" style="font-weight:400;font-size:0.75rem">vs. your resume</span></h6>
          <div class="jd-skill-gap-stats">
            <div class="jd-skill-stat matched">
              <span class="stat-val">${matched.length}</span>
              <span class="stat-lbl">Matched</span>
            </div>
            <div class="jd-skill-stat missing">
              <span class="stat-val">${missing.length}</span>
              <span class="stat-lbl">Missing</span>
            </div>
            <div class="jd-skill-stat total">
              <span class="stat-val">${keySkills.length}</span>
              <span class="stat-lbl">Total</span>
            </div>
          </div>
          <div class="jd-skill-gap-bar">
            <div class="jd-skill-gap-fill" style="width:${matchPct}%"></div>
          </div>
          <div style="font-size:0.8rem;color:var(--muted);margin-bottom:10px">${matchPct}% skill overlap with your resume</div>
          ${missing.length > 0 ? `<div class="jd-skill-chips-label">JD skills you may be missing:</div>
          <div class="skill-chips">${missing.slice(0, 8).map(s =>
            `<span class="chip" style="background:rgba(255,107,107,0.1);border-color:rgba(255,107,107,0.3);color:#FF9999">${s}</span>`
          ).join('')}</div>` : '<div style="color:var(--accent);font-size:0.85rem">✓ You have all detected JD skills in your resume!</div>'}
        </div>`;
    }

    // Requirements & responsibilities lists
    const reqList = careerFitData.requirements?.length > 0
      ? `<ul class="jd-req-list">${careerFitData.requirements.slice(0, 6).map(r =>
          `<li>${r.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}</ul>`
      : '<p class="text-muted" style="font-size:0.88rem">No structured requirements detected in this JD.</p>';

    const respMatch = rawText.match(/(?:Responsibilities|What you.ll do|What you will do)[:\s]*\n?([\s\S]{0,1000})/i);
    const respLines = respMatch
      ? respMatch[1].split('\n').map(s => s.trim()).filter(s => s.length > 10 && !/^(about|requirements|benefits)/i.test(s)).slice(0, 5)
      : [];
    const respList = respLines.length > 0
      ? `<ul class="jd-req-list">${respLines.map(r =>
          `<li>${r.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/^[\-\*•●\d]+\s*/,'')}</li>`).join('')}</ul>`
      : '<p class="text-muted" style="font-size:0.88rem">No responsibilities section detected.</p>';

    // Completeness ring
    const circumference = 326.73;
    const ringOffset = circumference - (circumference * completeness / 100);
    const compColor = completeness >= 80 ? '#C8F54A' : completeness >= 50 ? '#FFB454' : '#FF6B6B';

    jobResults.innerHTML = `
      <div class="p-4">

        <!-- Top: Hero + Completeness Ring -->
        <div class="jd-hero-v2">
          <div class="jd-hero-v2-ring">
            <svg viewBox="0 0 120 120" width="110" height="110">
              <circle cx="60" cy="60" r="52" fill="none" stroke-width="8" class="ring-bg"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke-width="8"
                stroke-linecap="round" stroke-dasharray="${circumference}"
                stroke-dashoffset="${ringOffset}" stroke="${compColor}"
                transform="rotate(-90 60 60)"
                style="filter:drop-shadow(0 0 4px ${compColor}44)"/>
            </svg>
            <div class="jd-hero-v2-ring-val">
              <span style="color:${compColor};font-family:'Sora';font-size:1.5rem;font-weight:700">${completeness}%</span>
              <span class="text-muted" style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.05em;display:block">JD Quality</span>
            </div>
          </div>
          <div class="jd-hero-v2-content">
            <h4 style="font-family:'Sora';font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:4px">
              ${jobTitle}
            </h4>
            <div style="color:var(--muted);font-size:0.82rem;margin-bottom:10px">
              ${expReq ? `⏱ ${expReq}` : ''} ${eduReq ? `🎓 ${eduReq}` : ''} ${jobType ? `📍 ${jobType}` : ''} ${location ? `🌐 ${location}` : ''} ${salary ? `💰 ${salary}` : ''}
            </div>
            <div class="jd-hero-v2-chips">
              <span class="jd-chip">⭐ ${keySkills.length} skills detected</span>
              <span class="jd-chip">📋 ${careerFitData.requirements?.length || 0} requirements</span>
              ${skillGapHtml ? `<span class="jd-chip" style="background:rgba(200,245,74,0.1);border-color:rgba(200,245,74,0.3);color:var(--accent)">🔗 Skill gap shown</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Skill Gap Section (when resume analyzed) -->
        ${skillGapHtml ? skillGapHtml : ''}

        <!-- Must-Have Skills (highlighted) -->
        ${mustHaves.length > 0 ? `
        <div class="jd-musthave-card">
          <div class="jd-musthave-header">
            <h6>Must-Have Skills</h6>
            <span class="jd-musthave-badge">Priority</span>
          </div>
          <div class="skill-chips">
            ${mustHaves.map(s => `<span class="chip" style="background:rgba(255,180,84,0.12);border:1px solid rgba(255,180,84,0.3);color:var(--warn);font-size:0.82rem;font-weight:600">✦ ${s}</span>`).join('')}
          </div>
        </div>` : ''}

        <!-- All Detected Skills -->
        ${keySkills.length > 0 ? `
        <div class="jd-section-card">
          <h6>All Detected Skills</h6>
          <div class="skill-chips">
            ${keySkills.slice(0, 14).map(s => `<span class="chip" style="background:rgba(139,123,255,0.12);border:1px solid rgba(139,123,255,0.3);color:var(--ai-text);font-size:0.8rem">${s}</span>`).join('')}
          </div>
        </div>` : ''}

        <!-- Requirements + Responsibilities -->
        <div class="jd-requirements-grid">
          <div class="jd-req-card">
            <h6>Key Requirements</h6>
            ${reqList}
          </div>
          <div class="jd-req-card">
            <h6>Core Responsibilities</h6>
            ${respList}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="jd-actions-row">
          <button class="jd-action-btn" id="copyJDTextBtn">
            <span>📋</span> Copy JD
          </button>
          <button class="jd-action-btn" id="matchAnalysisBtn">
            <span>🎯</span> Match Analysis
          </button>
        </div>

      </div>
    `;

    // Wire up the new action buttons
    document.getElementById('copyJDTextBtn')?.addEventListener('click', async () => {
      await navigator.clipboard.writeText(rawText);
      document.getElementById('copyJDTextBtn').innerHTML = '<span>✓</span> Copied!';
      setTimeout(() => document.getElementById('copyJDTextBtn').innerHTML = '<span>📋</span> Copy JD', 2000);
    });

    document.getElementById('matchAnalysisBtn')?.addEventListener('click', () => {
      switchTab('matchCalculation');
      // Trigger match calculation if both resume and JD are analyzed
      if (Object.keys(resumeData).length > 0 && Object.keys(careerFitData).length > 0) {
        analyzeCareerFit();
      }
    });
  }

  // Render the Match Analysis panel — helpful empty state OR a real breakdown
  function renderMatchResults() {
    if (!matchResults) return;

    const hasResume = Object.keys(resumeData).length > 0;
    const hasJob = Object.keys(careerFitData).length > 0;

    if (!hasResume || !hasJob) {
      const missing = !hasResume ? 'your resume' : 'a job description';
      matchResults.innerHTML = `
        <div class="match-empty">
          <div class="match-empty-icon">🎯</div>
          <h5>Let's compute your match</h5>
          <p>To see how well your resume fits a role, make sure you've analyzed ${missing}, then run the match.</p>
          <div class="match-empty-actions">
            ${!hasResume ? `<button class="btn btn-outline-primary" id="matchGoResume">Go to Resume Analysis</button>` : ''}
            ${!hasJob ? `<button class="btn btn-outline-primary" id="matchGoJob">Go to Job Description</button>` : ''}
            <button class="btn btn-primary" id="matchCalcBtn2">Run Match Analysis</button>
          </div>
        </div>`;
      document.getElementById('matchGoResume')?.addEventListener('click', () => switchTab('resumeAnalysis'));
      document.getElementById('matchGoJob')?.addEventListener('click', () => switchTab('jobAnalysis'));
      document.getElementById('matchCalcBtn2')?.addEventListener('click', () => {
        if (hasResume && hasJob) { analyzeCareerFit(); renderMatchResults(); }
        else { calculateMatchBtn.click(); }
      });
      return;
    }

    // Both analyzed — compute the match breakdown
    const skillsMatch = calculateSkillsMatch(resumeData.skills, careerFitData.keySkills || []);
    const expMatch = calculateExperienceMatch(resumeData.totalExperience, careerFitData.experienceRequired);
    const eduMatch = calculateEducationMatch(resumeData.education, careerFitData.educationRequired);
    const overall = Math.round((skillsMatch * 0.4 + expMatch * 0.4 + eduMatch * 0.2) * 100);

    const overallColor = overall >= 80 ? '#C8F54A' : overall >= 60 ? '#FFB454' : '#FF6B6B';
    const verdict = overall >= 80 ? 'Strong match' : overall >= 60 ? 'Good match' : overall >= 40 ? 'Fair match' : 'Weak match';
    const ringOffset = 326.73 - (326.73 * overall / 100);

    // Identify the top gap skills
    const resumeSet = new Set((resumeData.skills || []).map(s => s.toLowerCase().trim()));
    const gapSkills = (careerFitData.keySkills || [])
      .filter(s => !resumeSet.has(s.toLowerCase().trim()))
      .slice(0, 5);

    matchResults.innerHTML = `
      <div class="match-hero">
        <div class="match-hero-ring">
          <svg viewBox="0 0 120 120" width="130" height="130">
            <circle cx="60" cy="60" r="52" fill="none" stroke-width="8" class="ring-bg"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke-width="8"
              stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${ringOffset}"
              stroke="${overallColor}" transform="rotate(-90 60 60)"
              style="filter:drop-shadow(0 0 6px ${overallColor}55)"/>
          </svg>
          <div class="match-hero-ring-val">
            <span style="color:${overallColor};font-family:'Sora';font-size:1.9rem;font-weight:700">${overall}%</span>
            <span class="text-muted" style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.05em;display:block">${verdict}</span>
          </div>
        </div>
        <div style="flex:1;min-width:0">
          <h5 style="font-family:'Sora';color:var(--text);font-weight:700;margin-bottom:6px">Overall Match Score</h5>
          <p style="color:var(--muted);font-size:0.9rem;line-height:1.65;margin:0">
            Weighted blend of skills (40%), experience (40%) and education (20%) between your resume and this job description.
          </p>
        </div>
      </div>

      <div class="match-bars">
        <div class="match-bar-row">
          <span class="match-bar-label">Skills</span>
          <div class="match-bar-track"><div class="match-bar-fill" style="width:${skillsMatch*100}%;background:var(--accent)"></div></div>
          <span class="match-bar-val">${Math.round(skillsMatch*100)}%</span>
        </div>
        <div class="match-bar-row">
          <span class="match-bar-label">Experience</span>
          <div class="match-bar-track"><div class="match-bar-fill" style="width:${expMatch*100}%;background:var(--ai)"></div></div>
          <span class="match-bar-val">${Math.round(expMatch*100)}%</span>
        </div>
        <div class="match-bar-row">
          <span class="match-bar-label">Education</span>
          <div class="match-bar-track"><div class="match-bar-fill" style="width:${eduMatch*100}%;background:var(--warn)"></div></div>
          <span class="match-bar-val">${Math.round(eduMatch*100)}%</span>
        </div>
      </div>

      ${gapSkills.length > 0 ? `
      <div class="match-gap-card">
        <h6>Skills this JD wants that aren't in your resume</h6>
        <div class="skill-chips">
          ${gapSkills.map(s => `<span class="chip" style="background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);color:#FF9999;font-size:0.8rem">${s}</span>`).join('')}
        </div>
      </div>` : '<div class="match-gap-card"><h6>Skill coverage</h6><p style="color:var(--accent);font-size:0.9rem;margin:0">✓ No detected skill gaps against this job description.</p></div>'}
    `;
  }

  // Assess resume against the selected target role.
  // This deliberately does not change careerFitData, so Match Analysis stays separate.
  function assessTargetRole() {
    if (!targetRoleSelect || !targetRoleSelect.value) return;

    if (!resumeData || !Array.isArray(resumeData.skills) || resumeData.skills.length === 0) {
      if (careerFitScore) careerFitScore.textContent = '--';
      if (careerFitFeedback) {
        careerFitFeedback.textContent = 'Please analyze your resume before assessing a target role.';
      }
      if (careerFitDetails) {
        careerFitDetails.innerHTML = '<p class="text-muted">Upload or analyze your resume first, then select a target role.</p>';
      }
      return;
    }

    const roleProfiles = {
      'ecommerce-operations-specialist': {
        name: 'E-commerce Operations Specialist',
        keySkills: ['amazon', 'excel', 'stakeholder management', 'quality assurance', 'data analysis', 'shopify'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'marketplace-analyst': {
        name: 'Marketplace Analyst',
        keySkills: ['amazon', 'excel', 'data analysis', 'google analytics', 'shopify', 'reporting'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'ecommerce-analyst': {
        name: 'E-commerce Analyst',
        keySkills: ['amazon', 'excel', 'data analysis', 'google analytics', 'reporting', 'kpi tracking'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'business-analyst': {
        name: 'Business Analyst',
        keySkills: ['excel', 'data analysis', 'sql', 'stakeholder management', 'process improvement', 'jira'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'operations-analyst': {
        name: 'Operations Analyst',
        keySkills: ['excel', 'data analysis', 'process improvement', 'quality assurance', 'project management', 'reporting'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'marketing-analyst': {
        name: 'Marketing Analyst',
        keySkills: ['google analytics', 'meta ads', 'google ads', 'excel', 'data analysis', 'reporting'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'performance-marketing-analyst': {
        name: 'Performance Marketing Analyst',
        keySkills: ['meta ads', 'google ads', 'google analytics', 'excel', 'reporting', 'data analysis'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'marketing-analytics-analyst': {
        name: 'Marketing Analytics Analyst',
        keySkills: ['google analytics', 'meta ads', 'google ads', 'excel', 'data analysis', 'tableau', 'power bi'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'ai-operations-analyst': {
        name: 'AI Operations Analyst',
        keySkills: ['excel', 'data analysis', 'python', 'process improvement', 'project management', 'reporting'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'workflow-automation-analyst': {
        name: 'Workflow Automation Analyst',
        keySkills: ['excel', 'python', 'process improvement', 'project management', 'jira', 'google workspace'],
        experienceRequired: '2 years',
        educationRequired: 'bachelor'
      },
      'junior-data-analyst': {
        name: 'Junior Data Analyst',
        keySkills: ['excel', 'sql', 'python', 'power bi', 'tableau', 'data analysis'],
        experienceRequired: '1 year',
        educationRequired: 'bachelor'
      }
    };

    const role = roleProfiles[targetRoleSelect.value];
    if (!role) return;

    const skillsMatch = calculateTargetRoleSkillsMatch(
  resumeData.skills,
  role.keySkills
);
    const experienceMatch = calculateExperienceMatch(
      Number(resumeData.totalExperience) || 0,
      role.experienceRequired
    );
    const educationMatch = calculateEducationMatch(
      resumeData.education || [],
      role.educationRequired
    );

    const score = Math.round(
      skillsMatch * 40 +
      experienceMatch * 40 +
      educationMatch * 20
    );

    if (careerFitScore) careerFitScore.textContent = `${score}%`;

    // Animate the score ring
    const ring = document.getElementById('careerFitRing');
    if (ring) {
      const circumference = 326.73;
      ring.style.strokeDashoffset = circumference - (circumference * score / 100);
      // Set ring color based on score
      ring.style.stroke = score >= 80 ? '#C8F54A' : score >= 60 ? '#FFB454' : '#FF6B6B';
    }

    if (careerFitFeedback) {
      careerFitFeedback.textContent =
        `Estimated fit for ${role.name}, based on the skills and experience detected in your resume.`;
    }

    if (totalExperience) {
      totalExperience.textContent = formatExperienceYears(
        Number(resumeData.totalExperience) || 0
      );
    }

    if (relevantExperience) {
      relevantExperience.textContent = formatExperienceYears(
        (Number(resumeData.totalExperience) || 0) * experienceMatch
      );
    }

    if (seniorityLevel) {
      const years = Number(resumeData.totalExperience) || 0;
      seniorityLevel.textContent =
        years >= 8 ? 'Senior' :
        years >= 5 ? 'Mid-Senior' :
        years >= 2 ? 'Mid Level' : 'Entry Level';
    }

    if (careerFitDetails) {
      careerFitDetails.innerHTML = `
        <div class="match-result-card">
          <h5>Role Assessment: ${role.name}</h5>
          <div class="mb-4">
            <div class="match-label-row"><span>Skills Match</span><strong>${Math.round(skillsMatch * 100)}%</strong></div>
            <div class="progress"><div class="progress-bar bg-success" style="width:${skillsMatch * 100}%"></div></div>
          </div>
          <div class="mb-4">
            <div class="match-label-row"><span>Experience Match</span><strong>${Math.round(experienceMatch * 100)}%</strong></div>
            <div class="progress"><div class="progress-bar bg-info" style="width:${experienceMatch * 100}%"></div></div>
          </div>
          <div class="mb-4">
            <div class="match-label-row"><span>Education Match</span><strong>${Math.round(educationMatch * 100)}%</strong></div>
            <div class="progress"><div class="progress-bar bg-warning" style="width:${educationMatch * 100}%"></div></div>
          </div>
          <p class="text-muted small mb-0">Preliminary estimate — not a hiring prediction. Skills the parser misses may affect the score.</p>
        </div>
        <div class="mt-4">
          ${generateCareerFitRecommendations(resumeData, role, skillsMatch, experienceMatch, educationMatch)}
        </div>
      `;
    }
  }

  // Reassess whenever the selected role changes.
  if (targetRoleSelect) {
    targetRoleSelect.addEventListener('change', assessTargetRole);
  }

  // Analyze career fit between resume and job description
  function analyzeCareerFit() {
    if (Object.keys(resumeData).length === 0 || Object.keys(careerFitData).length === 0) {
      return;
    }

    // Calculate match score based on skills, experience, and education
    const skillsMatch = calculateSkillsMatch(resumeData.skills, careerFitData.keySkills || []);
    const experienceMatch = calculateExperienceMatch(resumeData.totalExperience, careerFitData.experienceRequired);
    const educationMatch = calculateEducationMatch(resumeData.education, careerFitData.educationRequired);

    // Weighted average (skills: 40%, experience: 40%, education: 20%)
    const matchScore = (skillsMatch * 0.4) + (experienceMatch * 0.4) + (educationMatch * 0.2);

    const scorePct = Math.round(matchScore * 100);
    // Update career fit score
    careerFitScore.textContent = `${scorePct}%`;

    // Animate the score ring
    const ring = document.getElementById('careerFitRing');
    if (ring) {
      const circumference = 326.73;
      ring.style.strokeDashoffset = circumference - (circumference * scorePct / 100);
      ring.style.stroke = scorePct >= 80 ? '#C8F54A' : scorePct >= 60 ? '#FFB454' : '#FF6B6B';
    }

    // Update career fit feedback
    let feedback = '';
    if (matchScore >= 80) {
      feedback = 'Excellent match! Your resume strongly aligns with this job description.';
    } else if (matchScore >= 60) {
      feedback = 'Good match! Your resume shows strong alignment with this job description.';
    } else if (matchScore >= 40) {
      feedback = 'Fair match. Consider highlighting more relevant skills and experience.';
    } else {
      feedback = 'Limited match. You may need to gain more relevant experience or skills for this role.';
    }
    careerFitFeedback.textContent = feedback;

    // Update experience fields
    if (totalExperience && relevantExperience && seniorityLevel) {
      totalExperience.textContent = formatExperienceYears(resumeData.totalExperience);
      relevantExperience.textContent = formatExperienceYears(Math.round(resumeData.totalExperience * experienceMatch));

      // Determine seniority level based on matched experience
      const matchedExperience = resumeData.totalExperience * experienceMatch;
      let level = 'Entry Level';
      if (matchedExperience >= 8) level = 'Senior';
      else if (matchedExperience >= 5) level = 'Mid-Senior';
      else if (matchedExperience >= 2) level = 'Mid Level';
      seniorityLevel.textContent = level;
    }

    // Generate detailed breakdown
    if (careerFitDetails) {
      careerFitDetails.innerHTML = `
        <div class="match-result-card">
          <h5>Match Breakdown</h5>
          <div class="mb-4">
            <div class="match-label-row"><span>Skills</span><strong>${Math.round(skillsMatch * 100)}%</strong></div>
            <div class="progress"><div class="progress-bar bg-success" style="width:${skillsMatch * 100}%"></div></div>
          </div>
          <div class="mb-4">
            <div class="match-label-row"><span>Experience</span><strong>${Math.round(experienceMatch * 100)}%</strong></div>
            <div class="progress"><div class="progress-bar bg-info" style="width:${experienceMatch * 100}%"></div></div>
          </div>
          <div class="mb-4">
            <div class="match-label-row"><span>Education</span><strong>${Math.round(educationMatch * 100)}%</strong></div>
            <div class="progress"><div class="progress-bar bg-warning" style="width:${educationMatch * 100}%"></div></div>
          </div>
          <div class="mt-4">
            <h6 class="text-muted mb-2" style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Recommendations</h6>
            ${generateCareerFitRecommendations(resumeData, careerFitData, skillsMatch, experienceMatch, educationMatch)}
          </div>
        </div>
      `;
    }

    // Keep the dedicated Match Analysis panel in sync
    renderMatchResults();
  }

  // Calculate skills match percentage
  function calculateSkillsMatch(resumeSkills, jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 1.0; // If no skills specified, assume full match

    const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

    let matches = 0;
    jobSkillsLower.forEach(jobSkill => {
      // Check for exact match or substring match
      if (resumeSkillsLower.some(resumeSkill =>
        resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill))) {
        matches++;
      }
    });

    return Math.min(matches / jobSkills.length, 1.0);
  }

function calculateTargetRoleSkillsMatch(resumeSkills, jobSkills) {
  if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
    return 0;
  }

  const normalize = value =>
    String(value).toLowerCase().trim().replace(/\s+/g, ' ');

  const aliases = {
    'microsoft excel': 'excel',
    'google spreadsheets': 'google sheets',
    'google analytics 4': 'google analytics',
    'stakeholder coordination': 'stakeholder management',
    'quality control': 'quality assurance',
    'kpi monitoring': 'kpi tracking'
  };

  const canonical = value => {
    const skill = normalize(value);
    return aliases[skill] || skill;
  };

  const resumeSkillSet = new Set(
    (Array.isArray(resumeSkills) ? resumeSkills : []).map(canonical)
  );

  const matches = jobSkills.filter(skill =>
    resumeSkillSet.has(canonical(skill))
  ).length;

  return matches / jobSkills.length;
}

  // Calculate experience match percentage
  function calculateExperienceMatch(resumeExperience, requiredExperience) {
    if (!requiredExperience) return 1.0; // If no experience required, assume full match

    // Extract numeric value from required experience (e.g., "2+ years" -> 2)
    const requiredMatch = requiredExperience.match(/(\d+)/);
    if (!requiredMatch) return 1.0; // If no number found, assume full match

    const requiredYears = parseInt(requiredMatch[1]);
    if (isNaN(requiredYears)) return 1.0;

    // Calculate match ratio (capped at 1.0)
    return Math.min(resumeExperience / requiredYears, 1.0);
  }

  // Calculate education match percentage
  function calculateEducationMatch(resumeEducation, requiredEducation) {
  if (!requiredEducation || /not specified|not required/i.test(requiredEducation)) {
    return 1.0;
  }

  if (!Array.isArray(resumeEducation) || resumeEducation.length === 0) {
    return 0.0;
  }

  const educationText = resumeEducation.map(edu =>
    `${edu.degree || ''} ${edu.field || ''} ${edu.institution || ''}`
  ).join(' ').toLowerCase();

  const required = requiredEducation.toLowerCase();

  // A bachelor's-level requirement can be met by common undergraduate degrees.
  if (/bachelor|undergraduate/i.test(required)) {
    return /\bbachelor\b|\bb\.?\s?tech\b|\bb\.?\s?e\.?\b|\bb\.?\s?sc\b|\bb\.?\s?com\b|\bbca\b|\bbba\b/.test(educationText)
      ? 1.0 : 0.0;
  }

  // An MBA or master's requirement can be met by common postgraduate degrees.
  if (/master|mba|postgraduate/i.test(required)) {
    return /\bmba\b|\bm\.?\s?tech\b|\bm\.?\s?e\.?\b|\bm\.?\s?sc\b|\bm\.?\s?com\b|\bm\.?\s?a\.?\b|\bmaster\b/.test(educationText)
      ? 1.0 : 0.0;
  }

  if (/ph\.?d|doctorate/i.test(required)) {
    return /\bph\.?\s?d\b|\bdoctorate\b|\bdoctoral\b/.test(educationText)
      ? 1.0 : 0.0;
  }

  const normalizedRequired = required.replace(/[^a-z0-9]/g, '');
  const normalizedEducation = educationText.replace(/[^a-z0-9]/g, '');

  return normalizedEducation.includes(normalizedRequired) ? 1.0 : 0.0;
}

  // Generate career fit recommendations
  function generateCareerFitRecommendations(resumeData, careerFitData, skillsMatch, experienceMatch, educationMatch) {
    const recommendations = [];

    if (skillsMatch < 0.7) {
      const missingSkills = careerFitData.keySkills ?
        careerFitData.keySkills.filter(jobSkill =>
          !resumeData.skills.some(resumeSkill =>
            resumeSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(resumeSkill.toLowerCase())
          )
        ) : [];

      if (missingSkills.length > 0) {
        recommendations.push(`<div>Consider adding these skills to your resume: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? ', and more' : ''}</div>`);
      }
    }

    if (experienceMatch < 0.7) {
      const neededExperience = careerFitData.experienceRequired || 'more relevant experience';
      recommendations.push(`<div>You may need to gain more ${neededExperience} to be competitive for this role.</div>`);
    }

    if (educationMatch < 0.7) {
      const neededEducation = careerFitData.educationRequired || 'relevant educational qualifications';
      recommendations.push(`<div>Consider highlighting or pursuing ${neededEducation} to strengthen your application.</div>`);
    }

    if (recommendations.length === 0) {
      recommendations.push('<div>Your profile shows strong alignment with this job description!</div>');
    }

    return recommendations.join('');
  }

  // Build resume profile for job discovery
  function buildResumeProfile(text) {
    const parsed = parseResume(text);
    return {
      skills: parsed.skills,
      experience: parsed.totalExperience,
      education: parsed.education.length,
      contactInfo: parsed.contactInfo
    };
  }

  // Find relevant jobs using job-board search mode
  function findRelevantJobs() {
    const profile = localStorage.getItem('discoveryResumeProfile');
    if (!profile) {
      discoveryResults.innerHTML = '<div class="empty-state"><div class="empty-state-icon">ðŸ’¼</div><p>Please upload a resume to build your profile first</p></div>';
      return;
    }

    const parsedProfile = JSON.parse(profile);

    // Build search parameters
    const role = discRoleFilter.value;
    const location = discLocationFilter.value;
    const salaryMin = discSalaryMin.value;
    const salaryMax = discSalaryMax.value;
    const experience = discExperience.value;

    // Generate search URLs for major job boards
    const searchUrls = {
      linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role || '')}&location=${encodeURIComponent(location || '')}`,
      indeed: `https://in.indeed.com/jobs?q=${encodeURIComponent(role || '')}&l=${encodeURIComponent(location || '')}`,
      naukri: `https://www.naukri.com/jobs?name=${encodeURIComponent(role || '')}&location=${encodeURIComponent(location || '')}`,
      monster: `https://www.monsterindia.com/jobs/search/?q=${encodeURIComponent(role || '')}&where=${encodeURIComponent(location || '')}`
    };

    // Display results
    let html = `<h6>Job Board Search Results</h6>`;
    html += `<div class="row mb-3">`;
    html += `<div class="col-md-3"><h6>LinkedIn</h6><a href="${searchUrls.linkedin}" target="_blank" class="btn btn-outline-primary btn-sm w-100">Search Jobs</a></div>`;
    html += `<div class="col-md-3"><h6>Indeed</h6><a href="${searchUrls.indeed}" target="_blank" class="btn btn-outline-primary btn-sm w-100">Search Jobs</a></div>`;
    html += `<div class="col-md-3"><h6>Naukri</h6><a href="${searchUrls.naukri}" target="_blank" class="btn btn-outline-primary btn-sm w-100">Search Jobs</a></div>`;
    html += `<div class="col-md-3"><h6>Monster</h6><a href="${searchUrls.monster}" target="_blank" class="btn btn-outline-primary btn-sm w-100">Search Jobs</a></div>`;
    html += `</div>`;

    html += `<div class="mt-3"><small class="text-muted">Tip: Use live vacancy mode for real-time curated job listings.</small></div>`;

    discoveryResults.innerHTML = html;
  }

  // Find live vacancies (placeholder - would connect to actual API in production)
  function findLiveVacancies() {
    const profile = localStorage.getItem('discoveryResumeProfile');
    if (!profile) {
      discoveryResults.innerHTML = '<div class="empty-state"><div class="empty-state-icon">ðŸ’¼</div><p>Please upload a resume to build your profile first</p></div>';
      return;
    }

    // In a real implementation, this would call an API to get live vacancies
    // For now, we'll show a placeholder
    discoveryResults.innerHTML = `
      <div class="alert alert-info">
        <h6>Live Vacancy Listings</h6>
        <p>This feature would connect to real job APIs in a production environment.</p>
        <p>For now, please use the job-board search mode above to find opportunities.</p>
        <p><small>Your profile shows:</small></p>
        <ul>
          <li>${JSON.parse(profile).skills.length} skills identified</li>
          <li>${formatExperienceYears(JSON.parse(profile).experience)} of experience</li>
          <li>${JSON.parse(profile).education.length} educational qualifications</li>
        </ul>
      </div>
    `;
  }

  // Surely Remote integration function
  function searchSurelyRemote() {
    // Since the app doesn't have direct integration with Surely Remote's API,
    // we'll use the job-board search mode with remote filter
    document.getElementById('discModeSwitch').checked = false; // Switch to job-board mode
    document.getElementById('discLocationFilter').value = 'remote'; // Set location to remote
    findRelevantJobs(); // Perform the search
  }

  // Render applications list
  function renderApplicationsList() {
    if (jobApplications.length === 0) {
      applicationsList.innerHTML = '<p class="text-muted">No applications recorded yet. Click "Add Application" to get started.</p>';
      return;
    }

    let html = '';
    jobApplications.forEach((app, index) => {
      html += `
        <div class="card mb-3">
          <div class="card-body">
            <h6>${app.role} at ${app.company}</h6>
            <div class="mb-2">
              <small class="text-muted">Applied on: ${new Date(app.date).toLocaleDateString()}</small>
            </div>
            <div class="mb-2">
              <small class="text-muted">Status: ${app.status}</small>
            </div>
            ${app.link ? `<div class="mb-2"><a href="${app.link}" target="_blank" class="text-decoration-none">View Job Link</a></div>` : ''}
            ${app.notes ? `<div class="mb-2"><small>Notes:</small> ${app.notes}</div>` : ''}
          </div>
        </div>
      `;
    });

    applicationsList.innerHTML = html;
  }

  // Initialize the application
  function init() {
    // Set initial tab state — show Resume Analysis, hide all others
    switchTab('resumeAnalysis');

    // Load resume profile on startup
    loadResumeProfileAndUpdateUI();

    // Render applications list
    renderApplicationsList();

    // Seed the Match Analysis panel with a helpful empty state
    renderMatchResults();

    // Career fit placeholders (cards already hidden via d-none in HTML)
    document.getElementById('career-fit-score').textContent = '0%';
    document.getElementById('career-fit-feedback').textContent = 'Analyze your resume to see career fit details.';

    // Set initial discovery mode switch label
    if (discoveryModeSwitch.checked) {
      document.querySelector('[for="discoveryModeSwitch"] .ms-2').textContent = 'Show live vacancy listings (unchecked = job-board search)';
    } else {
      document.querySelector('[for="discoveryModeSwitch"] .ms-2').textContent = 'Show job-board search (unchecked = live vacancy listings)';
    }
  }

  // Initialize the app
  init();

  // =============================================
  // RESUME PARSING FUNCTIONS
  // =============================================

  // Main resume parsing function
  function parseResume(resumeText) {
    // Extract skills
    const skills = extractSkills(resumeText);

    // Extract experience
    const experience = extractExperience(resumeText);

    // Extract education
    const education = extractEducation(resumeText);

    // Extract contact info
    const contactInfo = extractContactInfo(resumeText);

    // Flatten all skills for backward compatibility
    const allSkills = Object.values(skills).flat();

    return {
      rawText: resumeText,
      skills: allSkills,
      experience: experience,
      education: education,
      contactInfo: contactInfo,
      totalExperience: experience.totalYears,
      // Relevant experience will be calculated when analyzing career fit
      relevantExperience: 0,
      internshipExperience: experience.internshipYears,
      // Individual skill categories
      functionalSkills: skills.functional || [],
      technicalSkills: skills.technical || [],
      marketplacePlatforms: skills.marketplacePlatforms || [],
      tools: skills.tools || [],
      analytics: skills.analytics || [],
      transferableSkills: skills.transferable || [],
      allSkills: allSkills
    };
  }

  // Skills extraction function
  function extractSkills(text) {
    // Define skill categories as requested by the user
    const skillCategories = {
      functional: [
        'project management', 'data analysis', 'market research', 'client relations',
        'strategic planning', 'process improvement', 'quality assurance', 'risk management',
        'stakeholder management', 'budget management', 'vendor management', 'team leadership',
        'cross-functional collaboration', 'change management', 'performance management'
      ],
      technical: [
  'meta ads', 'google ads', 'google analytics', 'excel',
  'python', 'sql', 'tableau', 'power bi', 'r', 'sas',
  'machine learning', 'deep learning', 'nlp', 'computer vision',
  'data mining', 'etl', 'data warehousing', 'big data',
  'hadoop', 'spark', 'aws', 'azure', 'gcp', 'docker',
  'kubernetes', 'jenkins', 'git', 'jira', 'confluence',
  'salesforce', 'hubspot', 'marketo', 'mailchimp',
  'google workspace', 'microsoft office'
],
      marketplacePlatforms: [
  'amazon', 'walmart', 'target', 'ebay', 'tiktok', 'shopify',
  'etsy', 'woocommerce', 'magento', 'bigcommerce',
  'salesforce commerce cloud', 'shopify plus'
],
      tools: [
        'excel', 'powerpoint', 'word', 'outlook', 'google sheets', 'google docs',
        'google slides', 'gmail', 'notion', 'airtable', 'trello', 'asana', 'monday.com',
        'slack', 'teams', 'zoom', 'webex', 'googletomeeting'
      ],
      analytics: [
        'google analytics', 'adobe analytics', 'mixpanel', 'amplitude', 'heap',
        'hotjar', 'crazy egg', 'google tag manager', 'facebook pixel', 'google ads',
        'meta ads', 'linkedin ads', 'twitter ads', 'programmatic advertising',
        'data analysis', 'statistical analysis', 'predictive modeling', 'machine learning',
        'data visualization', 'dashboarding', 'reporting', 'kpi tracking'
      ],
      transferable: [
        'communication', 'problem solving', 'critical thinking', 'time management',
        'organization', 'adaptability', 'creativity', 'innovation', 'research',
        'writing', 'editing', 'presentation', 'public speaking', 'negotiation',
        'persuasion', 'mentoring', 'coaching', 'training', 'facilitation'
      ]
    };

    const result = {};
    const lowerText = text.toLowerCase();

    // Initialize all categories
    Object.keys(skillCategories).forEach(category => {
      result[category] = [];
    });

    // Check each skill category
    Object.keys(skillCategories).forEach(category => {
      skillCategories[category].forEach(skill => {
        const escapedSkill = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
if (new RegExp(`\\b${escapedSkill}\\b`, 'i').test(text)) {
          result[category].push(skill);
        }
      });

      // Remove duplicates and sort
      result[category] = [...new Set(result[category])].sort();
    });

    return result;
  }

  // Experience extraction function
  function extractExperience(text) {
    // Extract date ranges with context
    const dateRanges = extractDateRangesWithContext(text);

    // Enhance each date range with position, company, location, and responsibilities
    const enhancedDateRanges = dateRanges.map(range => {
      // Extract position title from the context around the date range
      const positionTitle = extractPositionTitleFromContext(text, range.raw);

      // Extract company name from the context around the date range
      const companyName = extractCompanyNameFromContext(text, range.raw);

      // Extract location from the context around the date range
      const location = extractLocationFromContext(text, range.raw);

      // Extract responsibilities/achievements from the context around the date range
      const responsibilities = extractResponsibilitiesFromContext(text, range.raw);

      return {
        ...range,
        positionTitle,
        companyName,
        location,
        responsibilities
      };
    });

    // Calculate experience using sweep line algorithm
    const experienceData = calculateExperienceFromDateRanges(enhancedDateRanges);

    // Determine if any internships were found
    const hasInternship = enhancedDateRanges.some(range => range.isInternship);

    return {
      dateRanges: enhancedDateRanges,
      totalYears: experienceData.totalExperience,
      internshipYears: experienceData.internshipExperience,
      hasInternship: hasInternship,
      warnings: experienceData.warnings
    };
  }

  // Education extraction function
  function extractEducation(text) {
    const education = [];
    const lowerText = text.toLowerCase();

    // Education patterns to look for
    const educationPatterns = [
      { pattern: /b\.?tech\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'B.Tech' },
      { pattern: /bachelor(?:'s)?\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Bachelor' },
      { pattern: /master(?:'s)?\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Master' },
      { pattern: /m\.?ba\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'MBA' },
      { pattern: /ph\.?d\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Ph.D.' },
      { pattern: /doctor\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Doctor' },
      { pattern: /associate\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Associate' },
      { pattern: /diploma\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Diploma' },
      { pattern: /certificate\s*[\(\[]([^\)\]]+)[\)\]]/i, degree: 'Certificate' },
      { pattern: /(?:university|college|institute|school)\s+([^,\n\.]+)/i, degree: undefined },
      { pattern: /([^,\n\.]+)\s+(?:university|college|institute|school)/i, degree: undefined }
    ];

    educationPatterns.forEach(patternObj => {
      let match;
      const regex = new RegExp(patternObj.pattern, 'g');
      while ((match = regex.exec(text)) !== null) {
        let field = match[1] ? match[1].trim() : '';
        if (field.length > 2 && field.length < 100) { // Reasonable field length
          education.push({
            degree: patternObj.degree || 'Unknown',
            field: field,
            institution: 'Unknown' // Would need more complex parsing to extract institution
          });
        }
      }
    });

    // Also look for common education keywords without specific formatting
 
const educationFallbacks = [
  { pattern: /\bMBA\b/i, degree: 'MBA', field: 'Business Administration' },
  { pattern: /\bB\.?\s?E\.?\b/i, degree: 'B.E.', field: 'Engineering' },
  { pattern: /\bB\.?\s?Tech\b/i, degree: 'B.Tech', field: 'Engineering' },
  { pattern: /\bB\.?\s?Sc\b/i, degree: 'B.Sc.', field: 'Science' },
  { pattern: /\bB\.?\s?Com\b/i, degree: 'B.Com.', field: 'Commerce' },
  { pattern: /\bBCA\b/i, degree: 'BCA', field: 'Computer Applications' },
  { pattern: /\bBBA\b/i, degree: 'BBA', field: 'Business Administration' },
  { pattern: /\bBachelor(?:'s)?\b/i, degree: 'Bachelor', field: 'Bachelor degree' },
  { pattern: /\bMaster(?:'s)?\b/i, degree: 'Master', field: 'Master degree' },
  { pattern: /\bPh\.?\s?D\b/i, degree: 'Ph.D.', field: 'Doctorate' }
];

educationFallbacks.forEach(item => {
  if (item.pattern.test(text)) {
    const exists = education.some(edu =>
      edu.degree &&
      edu.degree.replace(/[^a-z]/gi, '').toLowerCase() ===
      item.degree.replace(/[^a-z]/gi, '').toLowerCase()
    );

    if (!exists) {
      education.push({
        degree: item.degree,
        field: item.field,
        institution: 'Unknown'
      });
    }
  }
});

    // Remove duplicates based on field and degree
    const uniqueEducation = [];
    const seen = new Set();

    education.forEach(edu => {
      const key = `${edu.degree}|${edu.field}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEducation.push(edu);
      }
    });

    return uniqueEducation;
  }

  // Contact info extraction function
  function extractContactInfo(text) {
    const contactInfo = {
      email: '',
      phone: '',
      linkedin: '',
      github: ''
    };

    // Email extraction
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatch = text.match(emailPattern);
    if (emailMatch && emailMatch.length > 0) {
      contactInfo.email = emailMatch[0];
    }

    // Phone extraction (simple pattern for Indian numbers)
    const phonePatterns = [
      /(?:\+91[-\s]?)?[0]?(?:[789]\d{9})/g, // Indian mobile
      /(?:\+91[-\s]?)?\d{2,4}[-\s]?\d{6,8}/g // Landline with STD
    ];

    phonePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match.length > 0) {
        // Take the first reasonable match
        const phone = match[0].replace(/[^\d+]/g, '');
        if (phone.length >= 10 && phone.length <= 15) {
          contactInfo.phone = match[0];
        }
      }
    });

    // LinkedIn extraction
    const linkedinPattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/g;
    const linkedinMatch = text.match(linkedinPattern);
    if (linkedinMatch && linkedinMatch.length > 0) {
      contactInfo.linkedin = linkedinMatch[0];
    }

    // GitHub extraction
    const githubPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/g;
    const githubMatch = text.match(githubPattern);
    if (githubMatch && githubMatch.length > 0) {
      contactInfo.github = githubMatch[0];
    }

    return contactInfo;
  }

  // =============================================
  // DATE PARSING FUNCTIONS (FIXED)
  // =============================================

  function parseDateString(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;

    dateStr = dateStr.trim();

    // Try format like "MM/yyyy" or "MM-yyyy" (e.g., "10/2021" or "10-2021")
    const mYMatch = dateStr.match(/^(\d{1,2})[-\/](\d{4})$/);
    if (mYMatch) {
      let month = parseInt(mYMatch[1]) - 1; // Convert to 0-based
      let year = parseInt(mYMatch[2]);

      // Check if month and year are valid numbers
      if (isNaN(month) || isNaN(year)) {
        return null;
      }

      if (month >= 0 && month < 12) {
        // Return first day of the month
        return new Date(year, month, 1);
      }
      return null; // Invalid month
    }

    // Try format like "Month yyyy" or "Month-yyyy" (e.g., "Oct 2021" or "Oct-2021")
    const monthNameMatch = dateStr.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\s\/-](\d{4})$/i);
    if (monthNameMatch) {
      let month = monthNameMatch[1].toLowerCase();
      let year = parseInt(monthNameMatch[2]);
      const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(month);

      // Check if month and year are valid numbers
      if (monthIndex === -1 || isNaN(year)) {
        return null;
      }

      // Return first day of the month
      return new Date(year, monthIndex, 1);
    }

    // Try format like "yyyy/MM/dd" or "yyyy-MM-dd" (e.g., "2021/10/15" or "2021-10-15")
    const yMdMatch = dateStr.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (yMdMatch) {
      let year = parseInt(yMdMatch[1]);
      let month = parseInt(yMdMatch[2]) - 1; // Convert to 0-based
      let day = parseInt(yMdMatch[3]);

      // Check if year, month, and day are valid numbers
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
      }

      if (month >= 0 && month < 12 && day >= 1 && day <= 31) {
        return new Date(year, month, day);
      }
      return null; // Invalid date
    }

    // Try format like "Month dd, yyyy" (e.g., "Oct 15, 2021")
    const monthDayYearMatch = dateStr.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2}),?\s+(\d{4})$/i);
    if (monthDayYearMatch) {
      let month = monthDayYearMatch[1].toLowerCase();
      let day = parseInt(monthDayYearMatch[2]);
      let year = parseInt(monthDayYearMatch[3]);
      const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(month);

      // Check if month, day, and year are valid numbers
      if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
        return null;
      }

      if (day >= 1 && day <= 31) {
        return new Date(year, monthIndex, day);
      }
      return null; // Invalid date
    }

    // Try format like "yyyy/MM/dd HH:mm:ss" or "yyyy-MM-dd HH:mm:ss"
    const yMdHmsMatch = dateStr.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (yMdHmsMatch) {
      let year = parseInt(yMdHmsMatch[1]);
      let month = parseInt(yMdHmsMatch[2]) - 1; // Convert to 0-based
      let day = parseInt(yMdHmsMatch[3]);
      let hour = parseInt(yMdHmsMatch[4]);
      let minute = parseInt(yMdHmsMatch[5]);
      let second = parseInt(yMdHmsMatch[6]);

      // Check if all values are valid numbers
      if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second)) {
        return null;
      }

      if (month >= 0 && month < 12 && day >= 1 && day <= 31 && hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
        return new Date(year, month, day, hour, minute, second);
      }
      return null; // Invalid date/time
    }

    // Try format like "yyyy" (standalone year) - THIS IS THE FIX
    const yearMatch = dateStr.match(/^(\d{4})$/);
    if (yearMatch) {
      let year = parseInt(yearMatch[1]);
      // Check if year is a valid number
      if (!isNaN(year)) {
        // Return January 1st of the year
        return new Date(year, 0, 1);
      }
      return null; // Invalid year
    }

    // If we can't parse it, return null
    return null;
  }

  function extractDateRangesWithContext(text) {
    if (!text || typeof text !== 'string') return [];

    // Regex to match date ranges like "October 2021â€“June 2023" or "Oct 2021 - Jun 2023"
    // Also matches "Month YYYYâ€“Present" or "Month YYYY - Present"
    // Also matches "YYYYâ€“YYYY" or "YYYY - Present" or "YYYY - YYYY" - THIS IS THE FIX
    const dateRangeRegex = /([a-zA-Z]+[\s\/-]+\d{4}|\d{4})\s*[-\u2013\u2014]\s*([a-zA-Z]+[\s\/-]+\d{4}|\d{4}|present|current)/gi;

    const ranges = [];
    let match;

    while ((match = dateRangeRegex.exec(text)) !== null) {
      const startStr = match[1].trim();
      const endStr = match[2].trim();

      const startDate = parseDateString(startStr);
      let endDate;

      if (endStr.toLowerCase() === 'present' || endStr.toLowerCase() === 'current') {
        endDate = new Date(); // Current date
      } else {
        endDate = parseDateString(endStr);
      }

      // Only add if both dates were parsed successfully
      if (startDate !== null && endDate !== null) {
        // Get context around the match to check for internship and education indicators
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;
        const contextBefore = text.substring(Math.max(0, matchStart - 50), matchStart);
        const contextAfter = text.substring(matchEnd, Math.min(text.length, matchEnd + 50));
        const context = (contextBefore + " " + contextAfter).toLowerCase();

        // Check if this is likely an internship based on context
        const isInternship = context.includes('intern') ||
                            context.includes('internship') ||
                            context.includes('training') ||
                            context.includes('apprentice');

        // Check if this is likely an educational period based on context
        const isEducation = contextBefore.match(/(b\.e\.|bachelor|master|mba|ph\.d\.|doctor|university|college|institute|school|science|arts|engineering|commerce|business)\b/i) !== null;

        // ONLY ADD IF IT'S NOT AN EDUCATIONAL PERIOD
        if (!isEducation) {
          ranges.push({
            start: startDate,
            end: endDate,
            raw: match[0],
            isInternship: isInternship
          });
        }
      }
    }

    return ranges;
  }

  // =============================================
  // HELPER FUNCTIONS FOR EXPERIENCE CALCULATION
  // =============================================

  function calculateExperienceFromDateRanges(dateRanges) {
    if (!dateRanges || dateRanges.length === 0) {
      return {
        totalExperience: 0,
        internshipExperience: 0,
        warnings: []
      };
    }

    // Convert date ranges to timeline events
    const events = [];
    dateRanges.forEach(range => {
      events.push({ date: range.start, type: 'start' });
      events.push({ date: range.end, type: 'end' });
    });

    // Sort events by date
    events.sort((a, b) => a.date - b.date);

    // Sweep line algorithm to calculate total experience
    let totalExperienceDays = 0;
    let internshipExperienceDays = 0;
    let activeCount = 0;
    let previousDate = null;

    events.forEach(event => {
      if (previousDate !== null) {
        const timeDiff = event.date.getTime() - previousDate.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

        if (activeCount > 0) {
          totalExperienceDays += dayDiff;
          // Check if any active range is an internship
          const activeRanges = dateRanges.filter(range =>
            event.date >= range.start && event.date <= range.end
          );
          if (activeRanges.some(range => range.isInternship)) {
            internshipExperienceDays += dayDiff;
          }
        }
      }

      if (event.type === 'start') {
        activeCount++;
      } else if (event.type === 'end') {
        activeCount--;
      }

      previousDate = event.date;
    });

    // Convert days to years
    const totalExperience = totalExperienceDays / 365.25;
    const internshipExperience = internshipExperienceDays / 365.25;

    return {
      totalExperience: totalExperience,
      internshipExperience: internshipExperience,
      warnings: [] // Would populate with warnings about overlapping ranges, etc.
    };
  }

  // =============================================
  // CONTEXTUAL EXTRACTION FUNCTIONS (FALLBACKS ADDED)
  // =============================================

  function extractPositionTitleFromContext(fullText, dateRangeText) {
    // Get context around the date range (100 characters before and after)
    const dateRangeIndex = fullText.indexOf(dateRangeText);
    if (dateRangeIndex === -1) return extractPositionTitle(dateRangeText); // Fallback to original method

    const contextStart = Math.max(0, dateRangeIndex - 150);
    const contextEnd = Math.min(fullText.length, dateRangeText.length + 150);
    const context = fullText.substring(contextStart, contextEnd);

    // Look for position titles in the context
    const positions = [
      'specialist', 'analyst', 'manager', 'engineer', 'developer', 'consultant',
      'coordinator', 'associate', 'assistant', 'director', 'lead', 'senior',
      'junior', 'intern', 'trainee', 'officer', 'executive', 'administrator',
      'representative', 'advisor'
    ];

    const lowerContext = context.toLowerCase();
    for (const position of positions) {
      if (lowerContext.includes(position)) {
        // Extract a reasonable snippet around the position
        const words = context.split(' ');
        for (let i = 0; i < words.length; i++) {
          if (words[i].toLowerCase().includes(position)) {
            // Return a snippet of 3-4 words around the position
            const start = Math.max(0, i - 2);
            const end = Math.min(words.length, i + 3);
            return words.slice(start, end).join(' ');
          }
        }
      }
    }

    // Fallback to original method if nothing found in context
    return extractPositionTitle(dateRangeText);
  }

  // Simple position title extraction fallback
  function extractPositionTitle(text) {
    // If text is too short or empty, return empty string
    if (!text || text.length < 2) {
      return '';
    }

    // Look for position titles in the text
    const positions = [
      'specialist', 'analyst', 'manager', 'engineer', 'developer', 'consultant',
      'coordinator', 'associate', 'assistant', 'director', 'lead', 'senior',
      'junior', 'intern', 'trainee', 'officer', 'executive', 'administrator',
      'representative', 'advisor'
    ];

    const lowerText = text.toLowerCase();
    for (const position of positions) {
      if (lowerText.includes(position)) {
        // Extract a reasonable snippet around the position
        const words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
          if (words[i].toLowerCase().includes(position)) {
            // Return a snippet of 3-4 words around the position
            const start = Math.max(0, i - 2);
            const end = Math.min(words.length, i + 3);
            return words.slice(start, end).join(' ');
          }
        }
      }
    }

    // Return empty string if no position title found
    return '';
  }

  // Helper function to extract company name from text context
  function extractCompanyNameFromContext(fullText, dateRangeText) {
    // Get context around the date range (100 characters before and after)
    const dateRangeIndex = fullText.indexOf(dateRangeText);
    if (dateRangeIndex === -1) return extractCompanyName(dateRangeText); // Fallback to original method

    const contextStart = Math.max(0, dateRangeIndex - 150);
    const contextEnd = Math.min(fullText.length, dateRangeText.length + 150);
    const context = fullText.substring(contextStart, contextEnd);

    // Look for company patterns in the context
    const companyPatterns = [
      /at\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s*[,|\-]|\s*$)/i,
      /([A-Z][a-zA-Z\s&.,]+?)\s*[,|\-]\s*(?:\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
      /([A-Z][a-zA-Z\s&.,]+?)(?:\s*Ltd|\s*Inc|\s*Corp|\s*LLC|\s*Company|\s*Company)/i,
      /([A-Z][a-zA-Z\s&.,]+?)\s*(?:incorporated|corporation|limited|llc|ltd)/i
    ];

    let cleaned = context;
    for (const pattern of companyPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        // Extract the company name (first capture group)
        const companyName = match[1].trim();
        // Clean up extra spaces and punctuation
        return companyName.replace(/[,|\-]{2,}/g, ',').replace(/\s{2,}/g, ' ').trim();
      }
    }

    // Return empty string if no company name found
    return '';
  }

  // Simple company name extraction fallback
  function extractCompanyName(text) {
    // If text is too short or empty, return empty string
    if (!text || text.length < 2) {
      return '';
    }

    // Look for company patterns in the text
    const companyPatterns = [
      /at\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s*[,|\-]|\s*$)/i,
      /([A-Z][a-zA-Z\s&.,]+?)\s*[,|\-]\s*(?:\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
      /([A-Z][a-zA-Z\s&.,]+?)(?:\s*Ltd|\s*Inc|\s*Corp|\s*LLC|\s*Company|\s*Company)/i,
      /([A-Z][a-zA-Z\s&.,]+?)\s*(?:incorporated|corporation|limited|llc|ltd)/i
    ];

    let cleaned = text;
    for (const pattern of companyPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        // Extract the company name (first capture group)
        const companyName = match[1].trim();
        // Clean up extra spaces and punctuation
        return companyName.replace(/[,|\-]{2,}/g, ',').replace(/\s{2,}/g, ' ').trim();
      }
    }

    // Return empty string if no company name found
    return '';
  }

  // Helper function to extract location from text context
  function extractLocationFromContext(fullText, dateRangeText) {
    // Get context around the date range
    const dateRangeIndex = fullText.indexOf(dateRangeText);
    if (dateRangeIndex === -1) {
      // Simple fallback: look for location patterns in the date range text itself
      return extractSimpleLocation(dateRangeText);
    }

    const contextStart = Math.max(0, dateRangeIndex - 150);
    const contextEnd = Math.min(fullText.length, dateRangeText.length + 150);
    const context = fullText.substring(contextStart, contextEnd);

    // Look for location patterns in the context
    const locationPatterns = [
      /,\s*([A-Z][a-zA-Z\s&.,]+?)(?:\s*$|[,|\-])/i,
      /[-|]\s*([A-Z][a-zA-Z\s&.,]+?)(?:\s*$|[,|\-])/i,
      /\b(pune|bengaluru|mumbai|hyderabad|delhi| gurgaon|noida|chennai|kolkata)\b/i
    ];

    let cleaned = context;
    for (const pattern of locationPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        // Extract the location (first capture group)
        const location = match[1].trim();
        // Clean up extra spaces and punctuation
        return location.replace(/[,|\-]{2,}/g, ',').replace(/\s{2,}/g, ' ').trim();
      }
    }

    // Return empty string if no location found
    return '';
  }

  // Simple location extraction fallback
  function extractSimpleLocation(text) {
    // If text is too short or empty, return empty string
    if (!text || text.length < 2) {
      return '';
    }

    // Look for location patterns in the text
    const locationPatterns = [
      /,\s*([A-Z][a-zA-Z\s&.,]+?)(:\s*$|[,|\-])/i,
      /[-|]\s*([A-Z][a-zA-Z\s&.,]+?)(:\s*$|[,|\-])/i,
      /\b(pune|bengaluru|mumbai|hyderabad|delhi| gurgaon|noida|chennai|kolkata)\b/i
    ];

    let cleaned = text;
    for (const pattern of locationPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        // Extract the location (first capture group)
        const location = match[1].trim();
        // Clean up extra spaces and punctuation
        return location.replace(/[,|\-]{2,}/g, ',').replace(/\s{2,}/g, ' ').trim();
      }
    }

    // Return empty string if no location found
    return '';
  }

  // Helper function to extract responsibilities from text context
  function extractResponsibilitiesFromContext(fullText, dateRangeText) {
    // Get context around the date range (100 characters before and after)
    const dateRangeIndex = fullText.indexOf(dateRangeText);
    if (dateRangeIndex === -1) return extractResponsibilities(dateRangeText); // Fallback to original method

    const contextStart = Math.max(0, dateRangeIndex - 150);
    const contextEnd = Math.min(fullText.length, dateRangeText.length + 150);
    const context = fullText.substring(contextStart, contextEnd);

    // Extract responsibilities from the context
    return extractResponsibilities(context);
  }

  // Simple responsibilities extraction fallback
  function extractResponsibilities(text) {
    // If text is too short or empty, return empty string
    if (!text || text.length < 2) {
      return '';
    }

    // Look for common responsibility indicators
    const responsibilityIndicators = [
      'responsible for', 'managed', 'led', 'developed', 'created', 'implemented',
      'maintained', 'supported', 'coordinated', 'organized', 'planned', 'executed',
      'delivered', 'achieved', 'improved', 'increased', 'reduced', 'optimized',
      'streamlined', 'automated', 'designed', 'built', 'launched', 'introduced'
    ];

    const lowerText = text.toLowerCase();
    const sentences = text.split(/[.!?]+/);

    let responsibilities = [];
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      responsibilityIndicators.forEach(indicator => {
        if (lowerSentence.includes(indicator)) {
          // Clean up the sentence
          let cleaned = sentence.trim();
          // Remove extra whitespace
          cleaned = cleaned.replace(/\s+/g, ' ');
          // Limit length
          if (cleaned.length > 200) {
            cleaned = cleaned.substring(0, 200) + '...';
          }
          responsibilities.push(cleaned);
        }
      });
    });

    // Return first responsibility found, or empty string if none
    return responsibilities.length > 0 ? responsibilities[0] : '';
  }

  // =============================================
  // JOB DESCRIPTION PARSING FUNCTIONS
  // =============================================

  function parseJobDescription(jobText) {
    // Extract requirements
    const requirements = extractJobRequirements(jobText);

    // Extract experience required
    const experienceRequired = extractExperienceRequired(jobText);

    // Extract education required
    const educationRequired = extractEducationRequired(jobText);

    // Extract key skills
    const keySkills = extractJobKeySkills(jobText);

    return {
      rawText: jobText,
      requirements: requirements,
      experienceRequired: experienceRequired,
      educationRequired: educationRequired,
      keySkills: keySkills
    };
  }

  function extractJobRequirements(text) {
    const lines = text.split('\n');
    const requirements = [];

    // Pass 1: find structured "Requirements" / "Qualifications" / "Must Haves" section
    const headingPatterns = [
      /^(requirements|qualifications|must[-\s]?haves|minimum[-\s]?requirements|you must have)\s*[:\-—]?\s*$/i,
    ];
    const endPatterns = [
      /^(responsibilities|what you.ll do|about the (company|team|role)|about us|benefits|perks|equal opportunity|salary|what we offer)\s*[:\-—]?\s*$/i,
    ];

    let inReqSection = false;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (headingPatterns.some(p => p.test(line))) {
        inReqSection = true;
        continue;
      }
      if (endPatterns.some(p => p.test(line)) && inReqSection) {
        inReqSection = false;
        continue;
      }
      if (inReqSection) {
        // Strip bullet markers: -, *, •, ●, o, numbers
        const cleaned = line
          .replace(/^[\s\-\*•●◦o]\s*[\d.]*\s*/i, '')
          .trim();
        if (cleaned.length >= 10 && cleaned.length <= 150) {
          requirements.push(cleaned);
        }
      }
    }

    // Pass 2 (fallback): collect all meaningful bullet lines anywhere in the text
    if (requirements.length === 0) {
      lines.forEach(rawLine => {
        const line = rawLine.trim();
        const isBullet = /^[\-\*•●◦o]\s*\d*[\.)\s]*/i.test(line) || /^\d+[.)\s]+\S/.test(line);
        if (isBullet) {
          const cleaned = line
            .replace(/^[\s\-\*•●◦o]\s*[\d.]*\s*/i, '')
            .trim();
          if (cleaned.length >= 10 && cleaned.length <= 150) {
            requirements.push(cleaned);
          }
        }
      });
    }

    // Pass 3 (fallback): pull requirement-like sentences from flowing text
    if (requirements.length === 0) {
      const cue = /\b(experience|proficien|knowledge|skill|abilit|ability|familiar|capab|expert|minimum|at least|required|must|understanding|working with|hands-on|strong)\b/i;
      const sentences = text
        .replace(/[•●\-\*o]|\n+/g, ' ')
        .split(/[.;]\s+/)
        .map(s => s.trim())
        .filter(s => s.length >= 15 && s.length <= 160 && cue.test(s));
      requirements.push(...sentences);
    }

    // Deduplicate and limit
    return [...new Set(requirements)].slice(0, 8);
  }

  function extractExperienceRequired(text) {
    // Look for experience patterns
    const expPatterns = [
      /(\d+)\s*[\+]?\s*years?\s*(?:of\s+)?experience/i,
      /experience\s*:?\s*(\d+)\s*[\+]?\s*years?/i,
      /minimum\s*(\d+)\s*[\+]?\s*years?/i,
      /at least\s*(\d+)\s*[\+]?\s*years?/i
    ];

    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) {
        return `${match[1]}+ years`;
      }
    }

    return 'Not specified';
  }

  function extractEducationRequired(text) {
    // Look for education patterns
    const eduPatterns = [
      /bachelor['']?\s*degree/i,
      /master['']?\s*degree/i,
      /ph\.?d/i,
      /m\.?b\.?a/i,
      /diploma/i,
      /certificate/i,
      /education\s*:?\s*([^,\n]+)/i
    ];

    for (const pattern of eduPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1]) {
          return match[1].trim();
        } else {
          return match[0].toLowerCase().replace(/['"]?\s*degree\s*/i, '').trim();
        }
      }
    }

    return 'Not specified';
  }

  function extractJobKeySkills(text) {
    // Reuse the skills extraction function but return just the skills array
    const skills = extractSkills(text);
    // Flatten and return all skills
    return Object.values(skills).flat();
  }

  // Heuristic job-title extraction (title is often not the very first line)
  function extractJobTitle(text) {
    if (!text) return 'Job Description';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // 1. Explicit label: "Position:", "Role:", "Job Title:", "We are hiring a X"
    const labeled = lines.find(l => /^(position|role|job\s*title|title)\s*[:\-—]\s*\S/i.test(l));
    if (labeled) return labeled.replace(/^(position|role|job\s*title|title)\s*[:\-—]\s*/i, '').trim().substring(0, 50) || 'Job Description';

    const hiring = text.match(/(?:we\s*are\s*(?:hiring|looking)\s+for|hiring\s+a|role\s*[:\-]\s*)\s*([A-Z][A-Za-z0-9&\- ]{3,40})/i);
    if (hiring) return hiring[1].trim().substring(0, 50);

    // 2. First short line that looks like a title (capitalized, job-like keyword, no punctuation junk)
    const titleKeywords = /analyst|specialist|manager|engineer|consultant|coordinator|associate|officer|director|lead|architect|scientist|developer|designer|executive|representative|admin/;
    for (const l of lines.slice(0, 6)) {
      if (l.length >= 4 && l.length <= 45 && !/[.,;:!?\(\)\[\]]/.test(l) &&
          titleKeywords.test(l.toLowerCase()) && l === l.charAt(0).toUpperCase() + l.slice(1)) {
        return l;
      }
    }

    // 3. Fallback: first non-URL, non-bullet line
    const fallback = lines.find(l => !/http|www\.|linkedin|indeed|naukri|^\d+\b|^[•●\-\*]\s/i.test(l) && l.length >= 4);
    return (fallback || 'Job Description').substring(0, 50);
  }

  // Must-have skills: skills explicitly mentioned in requirements context
  function extractMustHaves(text) {
    if (!text) return [];
    const lower = text.toLowerCase();
    const skills = extractJobKeySkills(text);
    // A skill counts as "must-have" if it appears near a requirement cue
    const mustHave = skills.filter(s => {
      const idx = lower.indexOf(s.toLowerCase());
      if (idx === -1) return false;
      const window = lower.substring(Math.max(0, idx - 40), idx + s.length + 40);
      return /required|must|proficien|experi|knowledge|skill|ability|familiar|capable|expert|minimum|at least/i.test(window);
    });
    return [...new Set(mustHave)].slice(0, 6);
  }

  // =============================================
  // TEXT EXTRACTION FUNCTIONS FOR FILES
  // =============================================

  async function extractTextFromPDF(file) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js failed to load. Check your internet connection and reload the app.');
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => item.str || '')
        .filter(Boolean)
        .join(' ');

      pages.push(pageText);
    }

    const text = pages.join('\n').trim();

    if (!text) {
      throw new Error(
        'No selectable text found in this PDF. It may be scanned or image-only.'
      );
    }

    return text;
  }

  async function extractTextFromDOCX(file) {
    if (!window.mammoth) {
      throw new Error('Mammoth.js failed to load. Check your internet connection and reload the app.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();

    if (!text) {
      throw new Error('No text could be extracted from this Word document.');
    }

    return text;
  }

  async function extractTextFromTXT(file) {
    const text = (await file.text()).trim();

    if (!text) {
      throw new Error('The text file is empty.');
    }

    return text;
  }
  
  function generateStrengthsList(resumeData) {
    const strengths = [];

    if (resumeData.technicalSkills?.length) {
      strengths.push(`Technical skills: ${resumeData.technicalSkills.join(', ')}`);
    }
    if (resumeData.marketplacePlatforms?.length) {
      strengths.push(`Marketplace experience: ${resumeData.marketplacePlatforms.join(', ')}`);
    }
    if (resumeData.tools?.length) {
      strengths.push(`Tools proficiency: ${resumeData.tools.join(', ')}`);
    }
    if (resumeData.analytics?.length) {
      strengths.push(`Analytics exposure: ${resumeData.analytics.join(', ')}`);
    }
    if (resumeData.transferableSkills?.length) {
      strengths.push(`Transferable skills: ${resumeData.transferableSkills.join(', ')}`);
    }

    if (!strengths.length) {
      strengths.push('Review your resume to identify your key strengths.');
    }

    return strengths.map(item => `<li>${item}</li>`).join('');
  }

  function generateWeaknessesList(resumeData) {
    const weaknesses = [];

    if (!resumeData.technicalSkills?.length) {
      weaknesses.push('Add relevant technical or role-specific skills.');
    }
    if (!resumeData.analytics?.length) {
      weaknesses.push('Highlight relevant reporting or analytics experience, if applicable.');
    }
    if (!resumeData.tools?.length) {
      weaknesses.push('List the tools and software you have used professionally.');
    }

    if (!weaknesses.length) {
      weaknesses.push('Compare your resume with a target job description to identify specific skill gaps.');
    }

    return weaknesses.map(item => `<li>${item}</li>`).join('');
  }

  function generateSuggestionsList(resumeData) {
    const suggestions = [
      'Use measurable achievements wherever possible.',
      'Tailor resume keywords to each target job description.',
      'Keep formatting consistent and responsibilities easy to scan.'
    ];

    if (!resumeData.analytics?.length) {
      suggestions.push('Include relevant reporting or analytics experience, if applicable.');
    }
    if (!resumeData.tools?.length) {
      suggestions.push('Add relevant tools and software to your skills section.');
    }

    return suggestions.map(item => `<li>${item}</li>`).join('');
  }

});

