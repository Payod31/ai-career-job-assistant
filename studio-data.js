// ============================================================================
// Resume Studio — local content data (no network, no AI service).
//
// Everything in this file is plain data the UI renders. To add a new
// template, example set or bullet bank, append an entry — the UI discovers
// entries by reading the arrays, so nothing in script.js hardcodes them.
//
// All example wording here is original, written for this app. They are
// starting points to reword, NOT facts to paste into your resume: any line
// you keep must describe something YOU actually did.
// ============================================================================
'use strict';

// ---------- Resume structures (templates) ----------------------------------
// `order` lists the sections a draft is laid out with, in that order.
// `skip` lists sections that never appear for this structure.
// `labels` renames sections in the rendered draft.
window.STUDIO_TEMPLATES = [
  {
    id: 'ats-single-column',
    name: 'ATS-friendly single column',
    bestFor: ['most roles', 'first screening', 'apply via portal'],
    notes: 'One column, plain section headings, no tables or graphics. This is the safest structure for online applications.',
    order: ['contact', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    skip: []
  },
  {
    id: 'traditional',
    name: 'Traditional professional',
    bestFor: ['corporate', 'finance', 'admin roles'],
    notes: 'Reverse-chronological experience first, skills after. Familiar to recruiters in traditional industries.',
    order: ['contact', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    skip: []
  },
  {
    id: 'modern-minimalist',
    name: 'Modern minimalist',
    bestFor: ['experienced professionals', 'one-page resumes'],
    notes: 'Tight sections, no filler. Keep bullets to your strongest 3–4 per role; drop the projects section if space is short.',
    order: ['contact', 'summary', 'skills', 'experience', 'education'],
    skip: ['projects', 'certifications']
  },
  {
    id: 'skills-forward',
    name: 'Skills-forward (career switchers)',
    bestFor: ['career changes', 'transferable skills'],
    notes: 'Leads with the skills the new role needs so relevance is visible before the industry background. Pair with a summary that bridges the switch.',
    order: ['contact', 'summary', 'skills', 'projects', 'experience', 'education'],
    skip: ['certifications']
  },
  {
    id: 'project-focused',
    name: 'Project-focused (fresh graduates)',
    bestFor: ['fresh graduates', 'internship applications'],
    notes: 'Projects and academic work lead, since they are your strongest evidence. Internships count as experience.',
    order: ['contact', 'summary', 'projects', 'skills', 'experience', 'education'],
    skip: ['certifications']
  },
  {
    id: 'experienced',
    name: 'Experienced professional',
    bestFor: ['mid to senior individual contributors'],
    notes: 'Experience dominates; certifications sit next to skills so credentials are easy to spot.',
    order: ['contact', 'summary', 'experience', 'skills', 'certifications', 'education'],
    skip: ['projects']
  },
  {
    id: 'leadership',
    name: 'Leadership / executive',
    bestFor: ['manager and above', 'director roles'],
    notes: 'The summary reads like a track record: scope, team size, measurable outcomes. Team-lead and ownership language up top.',
    order: ['contact', 'summary', 'experience', 'skills', 'education'],
    skip: ['projects', 'certifications']
  },
  {
    id: 'academic',
    name: 'Academic / research',
    bestFor: ['research roles', 'graduate applications'],
    notes: 'Education and research work lead; publications slot in under projects if you have them.',
    order: ['contact', 'summary', 'education', 'projects', 'experience', 'skills'],
    skip: ['certifications']
  }
];

// Honest framing shown next to template pickers:
window.STUDIO_TEMPLATE_NOTE =
  'There is no universally “best” resume structure — the right one depends on the role, your experience level, the country and the employer’s own requirements. Pick the one that fits, keep it single-column for ATS, and tailor per application.';

// ---------- Role-category example banks ------------------------------------
// `bullets` are original example sentences, clearly labeled as examples in the
// UI. `guidance` is short, role-specific advice.
window.STUDIO_EXAMPLES = [
  {
    id: 'ecommerce',
    category: 'Ecommerce & marketplace operations',
    bullets: [
      'Ran daily ops for a marketplace seller account (catalog, orders, returns) for 400+ SKUs, keeping listing errors under 1%',
      'Cut order-to-ship time from 3 days to same-day by reworking the pick-and-pack checklist with two warehouse staff',
      'Rebuilt the returns workflow in the seller portal, reducing repeat customer queries on faulty items by 15%',
      'Tracked weekly P&L per SKU in a spreadsheet model and flagged 6 loss-making products for re-pricing'
    ],
    guidance: [
      'Name the platform you actually worked on (Flipkart, Amazon, Shopify, Walmart) — it is a keyword, not decoration.',
      'Where you have numbers (order volume, error rates, cost saved), lead with them; otherwise state scope (how many SKUs, which markets).'
    ]
  },
  {
    id: 'business-analysis',
    category: 'Business analysis & operations',
    bullets: [
      'Built a weekly ops report in Excel that consolidated 4 data sources, cutting manager review time from 2 hours to 30 minutes',
      'Mapped the invoice-to-payment process end to end and identified a step where approvals duplicated, saving ~5 days of cycle time',
      'Maintained the CRM pipeline for 3 regional sales teams (600+ records) and ran the weekly hygiene review',
      'Wrote the standard operating procedure for onboarding new vendors; onboarding errors dropped from 1 in 5 to 1 in 20'
    ],
    guidance: [
      'Pair every system you mention (CRM, ERP, spreadsheets) with what you did in it — “used SAP” is weak, “reconciled 300 AP line items monthly in SAP” is useful.',
      'Ops language: process, baseline, change, result. “Improved X from A to B” is the strongest pattern available to you.'
    ]
  },
  {
    id: 'data-reporting',
    category: 'Data & reporting analysis',
    bullets: [
      'Built a daily KPI dashboard in Power BI over warehouse data serving 12 regional managers',
      'Wrote SQL queries pulling 18 months of order data to size the churn cohort; findings drove a retention campaign',
      'Automated a monthly forecast in Excel (VBA), replacing a manual 6-hour process with a 40-minute run',
      'Validated a new reporting pipeline against finance records and fixed 3 date-field mismatches before go-live'
    ],
    guidance: [
      'State the tool and the user: who consumed the report and how often.',
      '“Analyzed data” is a placeholder, not a bullet. Say what question the analysis answered.'
    ]
  },
  {
    id: 'marketing-analytics',
    category: 'Marketing analytics & performance marketing',
    bullets: [
      'Ran A/B tests on landing pages (9 tests, 3 significant) that lifted signup conversion from 2.1% to 3.4%',
      'Allocated a ₹80K monthly ad budget across 3 channels using a simple ROI model; blended CPA fell 22% in two quarters',
      'Built the UTM + attribution convention the team still uses, ending two parallel tracking systems',
      'Reported weekly marketing KPIs (CTR, CPC, CVR, ROAS) to leadership in a shared dashboard'
    ],
    guidance: [
      'Marketing analytics is judged on decisions, not dashboards: state what the analysis changed.',
      'Borrowed or team-owned numbers need a qualifier (“supported”, “contributed to”) — never claim a result you did not drive.'
    ]
  },
  {
    id: 'digital-seo',
    category: 'Digital marketing & SEO',
    bullets: [
      'Fixed on-page issues across 200 product URLs (title tags, thin content) after a core update recovery',
      'Built a 30-day content calendar tied to the purchase funnel; organic sessions to the category pages grew 35%',
      'Set up search console + analytics dashboards and ran a monthly technical audit covering crawl errors and index coverage',
      'Coordinated two influencer collaborations and tracked referral traffic in GA4'
    ],
    guidance: [
      'SEO results lag: pair every tactic with its measured outcome and the time window, or say honestly that results were still tracking.',
      'Names you actually used (GA4, Search Console, Ahrefs) beat generic “SEO tools”.'
    ]
  },
  {
    id: 'product-project',
    category: 'Product & project management',
    bullets: [
      'Owned the release calendar for 3 squads (14 people): scope, dates, and the two-week status report leadership still receives',
      'Ran discovery interviews (11 customers) that reshaped the v2 roadmap; the top feature shipped in 3 months',
      'Kept the backlog groomed in Jira (200+ issues, SLA of 5 days to triage) and ran the quarterly planning workshop',
      'Coordinated launch of a pricing change across product, support and sales; churn from the change window stayed flat'
    ],
    guidance: [
      'Lead with scope and outcome, not ceremonies: “ran stand-ups” is not a contribution; “kept a 3-squad release on date” is.',
      'Quantify scope: team size, number of users, budget, or dates.'
    ]
  },
  {
    id: 'supply-chain',
    category: 'Operations & supply chain',
    bullets: [
      'Managed vendor SLAs for 12 logistics partners; escalated 4 chronic misses into replacement or corrective plans',
      'Reduced stockouts on the top-50 SKUs by 22% by resetting reorder points against 90-day sales history',
      'Ran the monthly cost reconciliation with 3 vendors, recovering ₹1.2L in billing errors over two quarters',
      'Led a 4-person ops team; owned their weekly targets and the day-to-day exception queue'
    ],
    guidance: [
      'Supply chain evidence = reliability and money: stockouts, fill rates, cycle time, cost per unit.',
      'Say the size of the world you ran (SKUs, routes, people, rupees) — scope is credibility.'
    ]
  },
  {
    id: 'sales-bd',
    category: 'Sales & business development',
    bullets: [
      'Closed 300+ customer accounts across two years; hit 110% of revenue target in the final year',
      'Ran the full cycle for 40 leads a month: outreach, discovery call, demo, contract',
      'Built the segment list (B2C, high-intent) in spreadsheets that the team still uses for prioritization',
      'Negotiated renewal terms that kept 9 of 11 at-risk accounts through a price increase'
    ],
    guidance: [
      'Numbers come first: quotas, close rates, pipeline size, territory.',
      'If you miss quota some years, say it plainly with the reason — a straight account is better than an inflated one.'
    ]
  },
  {
    id: 'customer-success',
    category: 'Customer success & customer operations',
    bullets: [
      'Owned onboarding for 25 new customers a month; time-to-value dropped from 3 weeks to 10 days',
      'Ran health-score reviews on the top 50 accounts; saved 8 of 10 flagged churn risks over two quarters',
      'Ran the feedback loop: 30 support tickets a week distilled into 4 product requests that shipped',
      'Prepared the renewal briefing pack (usage, value, roadmap) for account managers ahead of every QBR'
    ],
    guidance: [
      'Customer ops = retention numbers: renewal rate, NPS, time-to-value, churn prevented.',
      'Attribute wins carefully — “supported the account team” when the account team closed it.'
    ]
  },
  {
    id: 'finance',
    category: 'Finance & accounting',
    bullets: [
      'Prepared monthly close for 3 entities: reconciled 300+ bank lines and cut close from 6 to 3 days',
      'Built the expense audit trail in Tally; flagged and recovered 12 misposted entries in one quarter',
      'Supported the annual audit: organized 2,000 source documents into the auditor’s checklist with zero follow-up queries',
      'Modeled 12-month cash flow weekly; variance explanations were a standing part of the monthly review'
    ],
    guidance: [
      'Finance bullets need controls vocabulary: reconciliation, variance, audit trail, close cycle.',
      'Never invent certifications you do not hold (CA, CPA, CMA) — list the real ones only.'
    ]
  },
  {
    id: 'hr-recruiting',
    category: 'HR & recruitment',
    bullets: [
      'Ran end-to-end hiring for 20 openings a quarter: shortlists, interviews, offers, background checks',
      'Cut time-to-hire from 45 to 28 days by restructuring the interview loop with hiring managers',
      'Onboarded 60 new joiners in a year — paperwork, systems access, and 90-day check-ins',
      'Built the monthly people report (headcount, attrition, open roles) that leadership reviews'
    ],
    guidance: [
      'Recruiting = throughput and quality: openings filled, time-to-hire, show-up rate, attrition.',
      'Data privacy matters in HR — say how you handled sensitive data, not just that you did.'
    ]
  },
  {
    id: 'software-it',
    category: 'Software & IT',
    bullets: [
      'Built REST APIs serving 40 internal services; added auth and rate limiting after the security review',
      'Automated the CI pipeline, cutting average build time 35% and enabling same-day deploys',
      'Migrated 300+ servers to cloud; worked the cutover across 6 teams over a weekend',
      'Owned the service desk tooling: ticket automation saved the team ~3 hours a day'
    ],
    guidance: [
      'List the stack you actually used — C++, C#, SQL, AWS — as named skills, not “programming languages”.',
      'For IT ops, scope is the metric: how many systems, how many users, how fast.'
    ]
  },
  {
    id: 'engineering',
    category: 'Engineering',
    bullets: [
      'Led a 4-person team building the facility’s preventive-maintenance system in place of paper logs',
      'Redesigned the line-side material flow, reducing changeover time from 40 to 15 minutes',
      'Ran the energy audit that found two compressor inefficiencies; the fixes paid for themselves in 8 months',
      'Trained 12 operators on the new SOPs and ran the first month of exception tracking'
    ],
    guidance: [
      'Engineering impact language: cycle time, yield, downtime, safety, cost per unit.',
      'Name the standard or method only when you used it (Lean, Six Sigma, PDCA).'
    ]
  },
  {
    id: 'consulting',
    category: 'Consulting',
    bullets: [
      'Ran a 10-week pricing study for a 3-market client: interviews, costing, and the recommendation deck leadership approved',
      'Led a 2-person pod on a supplier-diversity project across 12 vendor accounts',
      'Built the weekly client reporting pack (KPIs, risks, next actions) that the partner sent unedited',
      'Ran discovery workshops with 5 client teams and distilled 40 notes into the final workplan'
    ],
    guidance: [
      'Consulting resumes lead with the problem, not the firm: scope, your specific work, the delivered outcome.',
      '“Exposure to” is a red flag — say what you personally delivered.'
    ]
  },
  {
    id: 'administration',
    category: 'General administration',
    bullets: [
      'Managed the office calendar for a 6-person leadership group: 30+ meetings a month, zero double-bookings in a year',
      'Ran monthly office supplies and logistics for 200 staff; negotiated 2 vendor contracts, cutting cost 12%',
      'Maintained the document repository: 4,000+ files re-indexed and searchable in two months',
      'Prepared 50+ travel itineraries a year and coordinated the visa paperwork for 8'
    ],
    guidance: [
      'Admin work looks soft until it carries numbers: scale of what you managed, costs you changed, errors you eliminated.',
      'Tools you own (Excel, scheduling systems, Tally) deserve a named line.'
    ]
  },
  {
    id: 'fresher',
    category: 'Fresh graduate & internships',
    bullets: [
      'Built a Python scraper that cleaned 5,000 product listings into a structured dataset for a class project',
      'Ran A/B tests on a pricing page in an academic project; the winning variant improved click-through by 12%',
      'Wrote SQL queries pulling 3 months of order and refund data to build weekly churn reports (internship)',
      'Designed the poster and managed the volunteer schedule (40 volunteers) for a college drive that reached 1,200 people'
    ],
    guidance: [
      'No jobs yet? Projects, internships and coursework ARE your experience — present them with the same structure, labeled honestly.',
      'Every metric you show now (12%, 5,000 rows) must be one you can explain in an interview.'
    ]
  },
  {
    id: 'career-change',
    category: 'Career changes & transferable skills',
    bullets: [
      'Transferred 4 years of retail operations into analytics: built the weekly KPI dashboards that replaced monthly spreadsheet reviews',
      'Led a small team in my previous role (3 people) — the coordination and delivery discipline moves directly into product work',
      'Completed a structured SQL and Excel course with a portfolio of 3 practice projects while working full-time',
      'Volunteered data support for a non-profit’s donor tracking for 6 months, running the queries behind two campaigns'
    ],
    guidance: [
      'The bridge is your summary: name the old domain, the shared skill, the target role, in two lines.',
      'Transferable bullets say “I did X in domain A, which is the same as Y in your role.” That is the only honest bridge.'
    ]
  },
  {
    id: 'senior-ic',
    category: 'Experienced individual contributors',
    bullets: [
      'Owned the reporting stack end to end (ingest, model, dashboard) for 6 product teams',
      'Mentored 2 junior analysts: code review cadence plus a shared template library they still use',
      'Shipped the quarterly forecast automation in 3 sprints ahead of the target date',
      'Wrote the team’s style guide for SQL and Excel, adopted as the onboarding reference'
    ],
    guidance: [
      'At senior IC level the difference is ownership and leverage: what you made better for others, not just for yourself.',
      'Keep the last 2 roles detailed; compress older roles to 1–2 lines each.'
    ]
  },
  {
    id: 'leaders',
    category: 'Leadership roles',
    bullets: [
      'Scaled the ops team from 4 to 11 in 18 months; built the grading and rotation model that kept attrition under 15%',
      'Owned a ₹40L monthly budget with 96% actual-to-plan variance across the year',
      'Ran cross-functional launches (product + support + sales) with a fixed two-week status cadence leadership relied on',
      'Delegated the reporting cadence to a senior, freeing capacity for the vendor negotiation that saved ₹1.8L a quarter'
    ],
    guidance: [
      'Leadership evidence = the size of what you were accountable for: team, budget, outcomes, tenures.',
      'Show one line of what you built in people (hiring, retention, development), not just the team size.'
    ]
  }
];

// ---------- Labeled external resources --------------------------------------
// Shown in the UI as external reading only — the app never fetches from them
// and never sends resume content to them.
window.STUDIO_RESOURCES = [
  {
    label: 'Harvard — Create a strong resume',
    url: 'https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/',
    note: 'Structure and section guidance (external reading).'
  },
  {
    label: 'Indeed India — Resume examples',
    url: 'https://in.indeed.com/career-advice/resume-examples',
    note: 'Role-specific example resumes (external reading).'
  },
  {
    label: 'Harvard — AI and resumes',
    url: 'https://careerservices.fas.harvard.edu/ai-resumes-and-cover-letters/',
    note: 'How to use (or not use) AI on resume content (external reading).'
  }
];
