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

  // Tab buttons
  const tabButtons = {
    resumeAnalysis: document.getElementById('resume-tab'),
    jobAnalysis: document.getElementById('job-tab'),
    matchCalculation: document.getElementById('match-tab'),
    applicationTracker: document.getElementById('tracker-tab'),
    jobDiscovery: document.getElementById('discovery-tab')
  };

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
      document.getElementById('resume-panel').querySelectorAll('.card:not(:first-child)').forEach(card => {
        card.classList.add('d-none');
      });
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
      document.getElementById('resume-panel').querySelectorAll('.card:not(:first-child)').forEach(card => {
        card.classList.remove('d-none');
      });

      // Switch to resume analysis tab
      tabButtons.resumeAnalysis.click();
    } else {
      alert('Please enter your resume text');
    }
  });

  // Sample resume selection handler
  resumeSample.addEventListener('change', () => {
    const sampleValue = resumeSample.value;
    if (sampleValue) {
      // Load sample resume from sample-data.json
      fetch('./sample-data.json')
        .then(response => response.json())
        .then(data => {
          const sampleResume = data.sampleResumes[sampleValue];
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
            document.getElementById('resume-panel').querySelectorAll('.card:not(:first-child)').forEach(card => {
              card.classList.add('d-none');
            });
            document.getElementById('career-fit-score').textContent = '0%';
            document.getElementById('career-fit-feedback').textContent = 'Analyze your resume to see career fit details.';
            document.getElementById('career-fit-details').innerHTML = '<div class="text-center py-4"><p class="text-muted">Analyze your resume to see specific career fit details.</p></div>';
          }
        })
        .catch(error => {
          console.error('Error loading sample resume:', error);
          // Show error message
          resumeInputMessage.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mb-0" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>Error loading sample resume
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
        });
    }
  });

  // Analyze job description button handler
  analyzeJobBtn.addEventListener('click', () => {
    const jobDescText = jobInput.value.trim();
    if (jobDescText) {
      careerFitData = parseJobDescription(jobDescText);
      updateJobAnalysisUI();
      // Switch to job analysis tab
      tabButtons.jobAnalysis.click();
    } else {
      alert('Please enter a job description');
    }
  });

  // Sample job description selection handler
  jobSample.addEventListener('change', () => {
    const sampleValue = jobSample.value;
    if (sampleValue) {
      // Load sample job description from sample-data.json
      fetch('./sample-data.json')
        .then(response => response.json())
        .then(data => {
          const sampleJob = data.sampleJobs[sampleValue];
          if (sampleJob) {
            jobInput.value = sampleJob;
            // Auto-analyze the job description
            careerFitData = parseJobDescription(sampleJob);
            updateJobAnalysisUI();
            // Switch to job analysis tab
            tabButtons.jobAnalysis.click();
          }
        })
        .catch(error => {
          console.error('Error loading sample job description:', error);
          alert('Error loading sample job description');
        });
    }
  });

  // Calculate match button handler
  calculateMatchBtn.addEventListener('click', () => {
    if (Object.keys(resumeData).length === 0) {
      alert('Please analyze your resume first');
      return;
    }
    if (Object.keys(careerFitData).length === 0) {
      alert('Please analyze a job description first');
      return;
    }
    analyzeCareerFit();
    // Switch to match calculation tab
    tabButtons.matchCalculation.click();
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

    resumeScore.textContent = `${resumeScoreValue.toFixed(0)}%`;

    let feedback = '';
    if (resumeScoreValue >= 80) {
      feedback = 'Strong resume with good skills and experience presentation.';
    } else if (resumeScoreValue >= 60) {
      feedback = 'Good resume with room for improvement in specific areas.';
    } else if (resumeScoreValue >= 40) {
      feedback = 'Fair resume that could benefit from enhancements.';
    } else {
      feedback = 'Resume needs significant improvement to stand out.';
    }

    resumeFeedback.textContent = feedback;

    // Clear and rebuild the resume results with organized sections
    resumeResults.innerHTML = `
      <div class="row mb-4">
        <div class="col-md-3">
          <h6>Resume Score</h6>
          <div id="resume-score" class="display-4 fw-bold text-primary">${resumeScoreValue.toFixed(0)}%</div>
        </div>
        <div class="col-md-9">
          <div id="resume-feedback" class="lead fs-5">${feedback}</div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Summary</small>
            <div id="resume-summary">
              <div class="d-flex justify-content-between">
                <span>Professional Experience:</span>
                <span class="fw-medium">${formatExperienceYears(resumeData.totalExperience)}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Detected Skills:</span>
                <span class="fw-medium">${resumeData.skills.length}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Education:</span>
                <span class="fw-medium">${resumeData.education.length} qualifications</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Contact Info</small>
            <div id="resume-contact">
              ${resumeData.contactInfo.email ? `<div><i class="bi bi-envelope me-1"></i> ${resumeData.contactInfo.email}</div>` : ''}
              ${resumeData.contactInfo.phone ? `<div><i class="bi bi-phone me-1"></i> ${resumeData.contactInfo.phone}</div>` : ''}
              ${!resumeData.contactInfo.email && !resumeData.contactInfo.phone ? '<div class="text-muted">No contact information found</div>' : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Functional Skills</small>
            <div id="functional-skills" class="d-flex flex-wrap">
              ${resumeData.functionalSkills && resumeData.functionalSkills.length > 0
                ? resumeData.functionalSkills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')
                : '<span class="text-muted">No functional skills detected</span>'}
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Technical Skills</small>
            <div id="technical-skills" class="d-flex flex-wrap">
              ${resumeData.technicalSkills && resumeData.technicalSkills.length > 0
                ? resumeData.technicalSkills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')
                : '<span class="text-muted">No technical skills detected</span>'}
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Marketplace Platforms</small>
            <div id="marketplace-platforms" class="d-flex flex-wrap">
              ${resumeData.marketplacePlatforms && resumeData.marketplacePlatforms.length > 0
                ? resumeData.marketplacePlatforms.map(s => `<span class="skill-tag">${s}</span>`).join(' ')
                : '<span class="text-muted">No marketplace platforms detected</span>'}
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Tools</small>
            <div id="tools" class="d-flex flex-wrap">
              ${resumeData.tools && resumeData.tools.length > 0
                ? resumeData.tools.map(s => `<span class="skill-tag">${s}</span>`).join(' ')
                : '<span class="text-muted">No tools detected</span>'}
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Analytics</small>
            <div id="analytics" class="d-flex flex-wrap">
              ${resumeData.analytics && resumeData.analytics.length > 0
                ? resumeData.analytics.map(s => `<span class="skill-tag">${s}</span>`).join(' ')
                : '<span class="text-muted">No analytics skills detected</span>'}
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Transferable Skills</small>
            <div id="transferable-skills" class="d-flex flex-wrap">
              ${resumeData.transferableSkills && resumeData.transferableSkills.length > 0
                ? resumeData.transferableSkills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')
                : '<span class="text-muted">No transferable skills detected</span>'}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <h6>Strengths</h6>
        <div id="resume-strengths">
          ${generateStrengthsList(resumeData)}
        </div>
      </div>

      <div class="mb-3">
        <h6>Areas for Improvement</h6>
        <div id="resume-weaknesses">
          ${generateWeaknessesList(resumeData)}
        </div>
      </div>

      <div class="mb-3">
        <h6>Suggestions for Improvement</h6>
        <div id="resume-suggestions">
          ${generateSuggestionsList(resumeData)}
        </div>
      </div>
    `;

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

  // Update job analysis UI
  function updateJobAnalysisUI() {
    if (Object.keys(careerFitData).length === 0) {
      jobResults.innerHTML = '<p class="text-muted">Analyze the job description to see extracted requirements</p>';
      return;
    }

    // Build HTML for job analysis results
    let html = `
      <div class="row mb-4">
        <div class="col-md-6">
          <h6>Job Requirements</h6>
        </div>
        <div class="col-md-6">
          <h6>Key Details</h6>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-md-6">
          <div id="job-requirements">
            ${careerFitData.requirements && careerFitData.requirements.length > 0
              ? careerFitData.requirements.map(req => `<div class="mb-2"><small>â€¢</small> ${req}</div>`).join('')
              : '<p class="text-muted">No specific requirements found</p>'}
          </div>
        </div>
        <div class="col-md-6">
          <div id="job-details">
            <div class="mb-2">
              <small>Experience Required:</small>
              <span>${careerFitData.experienceRequired || 'Not specified'}</span>
            </div>
            <div class="mb-2">
              <small>Education Required:</small>
              <span>${careerFitData.educationRequired || 'Not specified'}</span>
            </div>
            <div class="mb-2">
              <small>Key Skills:</small>
              <span>${careerFitData.keySkills && careerFitData.keySkills.length > 0
                ? careerFitData.keySkills.join(', ')
                : 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    jobResults.innerHTML = html;
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
        <h6 class="mb-3">Role assessment: ${role.name}</h6>
        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <span>Skills match</span>
            <strong>${Math.round(skillsMatch * 100)}%</strong>
          </div>
          <div class="progress"><div class="progress-bar bg-success" style="width:${skillsMatch * 100}%"></div></div>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <span>Experience match</span>
            <strong>${Math.round(experienceMatch * 100)}%</strong>
          </div>
          <div class="progress"><div class="progress-bar bg-info" style="width:${experienceMatch * 100}%"></div></div>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <span>Education match</span>
            <strong>${Math.round(educationMatch * 100)}%</strong>
          </div>
          <div class="progress"><div class="progress-bar bg-warning" style="width:${educationMatch * 100}%"></div></div>
        </div>
        <p class="text-muted small">This is a preliminary estimate, not a hiring prediction. Skills that the resume parser misses may lower the score.</p>
        ${generateCareerFitRecommendations(
          resumeData, role, skillsMatch, experienceMatch, educationMatch
        )}
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

    // Update career fit score
    careerFitScore.textContent = `${Math.round(matchScore)}%`;

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
        <div class="row mb-4">
          <div class="col-md-6">
            <h6>Skills Match</h6>
            <div class="progress">
              <div class="progress-bar bg-success" style="width: ${skillsMatch * 100}%"></div>
            </div>
            <small class="text-muted">${Math.round(skillsMatch * 100)}% skills match</small>
          </div>
          <div class="col-md-6">
            <h6>Experience Match</h6>
            <div class="progress">
              <div class="progress-bar bg-info" style="width: ${experienceMatch * 100}%"></div>
            </div>
            <small class="text-muted">${Math.round(experienceMatch * 100)}% experience match</small>
          </div>
          <div class="col-md-6">
            <h6>Education Match</h6>
            <div class="progress">
              <div class="progress-bar bg-warning" style="width: ${educationMatch * 100}%"></div>
            </div>
            <small class="text-muted">${Math.round(educationMatch * 100)}% education match</small>
          </div>
          <div class="col-md-6">
            <h6>Recommendations</h6>
            <div id="career-fit-recommendations">
              ${generateCareerFitRecommendations(resumeData, careerFitData, skillsMatch, experienceMatch, educationMatch)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
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
    // Load resume profile on startup
    loadResumeProfileAndUpdateUI();

    // Render applications list
    renderApplicationsList();

    // Hide results panels initially
    document.getElementById('resume-panel').querySelectorAll('.card:not(:first-child)').forEach(card => {
      card.classList.add('d-none');
    });
    document.getElementById('career-fit-score').textContent = '0%';
    document.getElementById('career-fit-feedback').textContent = 'Analyze your resume to see career fit details.';
    document.getElementById('career-fit-details').innerHTML = '<div class="text-center py-4"><p class="text-muted">Analyze your resume to see specific career fit details.</p></div>';

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
    const requirements = [];

    // Look for requirement sections
    const reqSections = [
      /requirements?:?\s*([^#\n]+(?:\n[^#\n]+)*)/i,
      /qualifications?:?\s*([^#\n]+(?:\n[^#\n]+)*)/i,
      /what you.ll do:?\s*([^#\n]+(?:\n[^#\n]+)*)/i,
      /responsibilities?:?\s*([^#\n]+(?:\n[^#\n]+)*)/i
    ];

    reqSections.forEach(sectionRegex => {
      const match = text.match(sectionRegex);
      if (match && match[1]) {
        const sectionText = match[1].trim();
        // Split by lines or bullet points
        const lines = sectionText.split(/[\nâ€¢\-]/);
        lines.forEach(line => {
          const cleaned = line.trim();
          if (cleaned.length > 10 && cleaned.length < 200) {
            requirements.push(cleaned);
          }
        });
      }
    });

    // Also look for bullet points or numbered lists throughout the text
    const bulletMatches = text.match(/[\n\r][\s]*[â€¢\-\*]\s*[^\n\r]+/g) || [];
    bulletMatches.forEach(match => {
      const cleaned = match.trim().replace(/^[\s]*[â€¢\-\*]\s*/, '');
      if (cleaned.length > 10 && cleaned.length < 200) {
        requirements.push(cleaned);
      }
    });

    // Remove duplicates and limit
    return [...new Set(requirements)].slice(0, 10);
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

    return `<ul class="mb-0">${strengths.map(item => `<li>${item}</li>`).join('')}</ul>`;
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

    return `<ul class="mb-0">${weaknesses.map(item => `<li>${item}</li>`).join('')}</ul>`;
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

    return `<ul class="mb-0">${suggestions.map(item => `<li>${item}</li>`).join('')}</ul>`;
  }

});

