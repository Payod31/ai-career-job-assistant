// Embedded sample data to avoid CORS issues when loading from file://
// These are EXAMPLE resumes for testing — selecting one does NOT overwrite your saved profile

// Bullet/list line detection. Resumes mark bullets with a surprising number
// of characters (hyphens, stars, round bullets, middle dots, dashes,
// numbered items) — the vitals meters (impact, verb power) only work when
// every marker style is recognised.
const BULLET_LINE_RE = /^(?:[-–—*•●○◦▪▫‣·]|\d+[.)])/;
const BULLET_MARKER_STRIP_RE = /^(?:[-–—*•●○◦▪▫‣·]|\d+[.)])\s*/;

const sampleData = {
  "sampleResumes": {
    "ecommerce-ops": "E-commerce Operations Specialist\nRetailOps Solutions (sample company), Remote | 2022 - Present\n- Amazon product onboarding, Master ID creation, flat files, ASIN setup, catalog management, and listing compliance for 500+ SKUs monthly\n- PXM / digital asset management, A+ Content, Brand Stories, and Amazon Storefronts management\n- Listing suppression resolution, Amazon case management, promotions, Subscribe & Save, and Buy Box monitoring\n- Marketplace operations across Amazon, Walmart, Target, eBay, and TikTok Shop\n- Performance marketing: Meta Ads, Google Ads, Google Analytics, Excel, KPI reporting, and competitive analysis\n- Education: Bachelor's degree in Business (sample profile)\n- Automation projects: bulk image asset downloading, link-to-PDF conversion, Amazon Brand Store media extraction",
    "marketing-analyst": "Marketing Analyst\nVarious Companies | 2020 - 2022\n- Managed Meta Ads and Google Ads campaigns with monthly budgets of $50K+\n- Analyzed campaign performance using Google Analytics and Excel\n- Created weekly performance reports and optimization recommendations\n- Conducted A/B testing on ad creatives and landing pages\n- Tracked KPIs: ROAS, CTR, CPC, conversion rates\n- Collaborated with design and content teams on campaign assets\n- Education: Bachelor's degree in Business (sample profile)",
    "business-analyst": "Business Analyst\nRetailOps Solutions (sample company) | 2021 - 2023\n- Analyzed marketplace performance data and created actionable insights\n- Built dashboards in Excel and Power BI for stakeholders\n- Documented business processes and identified optimization opportunities\n- Collaborated with tech teams on system requirements\n- Conducted competitive analysis and market research\n- Education: Bachelor's degree in Business (sample profile)",
    "digital-marketer": "Digital Marketing Specialist\nBrightWave Digital Agency, Mumbai | 2021 - 2023\n- Managed multi-channel campaigns across Google Ads, Meta Ads, and email marketing for 12 clients\n- Grew organic traffic 40% through SEO content strategy and keyword optimization\n- Built and maintained landing pages, ran A/B tests, improved conversion rates by 25%\n- Created content calendars and managed social media (Instagram, LinkedIn) for B2B clients\n- Wrote copy for ad creatives, email sequences, and blog posts\n- Tools: Google Analytics, HubSpot, Canva, SEMrush, Mailchimp\n- Education: B.Com, Diploma in Digital Marketing (NIIT)",
    "social-media": "Social Media Manager\nTrendPulse Studios, Bangalore | 2022 - Present\n- Manage social media presence for 8 brand clients across Instagram, Twitter, LinkedIn, and YouTube\n- Plan and execute content calendars producing 40+ posts monthly across platforms\n- Grew combined follower base from 50K to 200K in 14 months through content strategy and engagement\n- Run paid social campaigns (Meta, LinkedIn Ads) with monthly budgets up to ₹5L\n- Analyze engagement metrics and produce monthly performance reports in Excel\n- Collaborate with designers, copywriters, and videographers to produce brand content\n- Education: BA Journalism and Mass Communication, Certificate in Social Media Marketing",
    "seo-specialist": "SEO Specialist\nRankWise Digital, Pune | 2021 - 2024\n- Led SEO strategy for 6 e-commerce and SaaS clients, improving organic traffic by 60-120%\n- Conducted technical SEO audits: fixed 200+ crawl issues, improved Core Web Vitals scores\n- Built content briefs and optimized 150+ pages for target keywords\n- Managed link-building outreach, earning 80+ quality backlinks per quarter\n- Tracked rankings with Ahrefs and SEMrush; produced monthly client reports\n- Tools: Ahrefs, SEMrush, Google Search Console, GA4, Screaming Frog, WordPress\n- Education: BSc Computer Science, SEO Certification (Backlinko Academy)",
    "brand-manager": "Brand Marketing Manager\nNovaCosmetics, Mumbai | 2020 - 2023\n- Owned brand strategy and positioning for 3 product lines generating ₹40Cr+ annual revenue\n- Managed annual brand budgets of ₹25L; allocated spend across TV, digital, and print\n- Led new product launches: conducted consumer research, defined positioning, managed go-to-market\n- Built brand awareness: NPS improved from 32 to 58 over 2 years\n- Directed creative briefs for agencies; managed 5 external agency relationships\n- Tracked brand KPIs: awareness, consideration, loyalty via quarterly tracking studies\n- Education: MBA Marketing (IIM Indore), BBA",
    "content-strategist": "Content Strategy Lead\nWritFlow Media, Bengaluru | 2021 - Present\n- Developed content strategies for 4 SaaS clients, growing their blog traffic 80% YoY\n- Led a team of 6 writers and 2 editors; managed editorial calendars and content workflows\n- Built content frameworks and repurposed assets: whitepapers → blog posts → social → email\n- Conducted audience research and intent mapping to guide content production\n- Improved content-driven pipeline: contributed to 30% of qualified leads via organic\n- Tools: Notion, Ahrefs, HubSpot CMS, Grammarly, Canva, Google Analytics\n- Education: MA English Literature, Professional Certificate in Content Marketing (UC Berkeley)",
    "sales-bde": "Business Development Executive\nCloudScale Solutions, Hyderabad | 2022 - Present\n- Prospected and closed 15+ new enterprise SaaS deals per quarter (average deal size ₹8L)\n- Managed full sales cycle: outbound prospecting, discovery calls, demos, negotiation, and onboarding\n- Achieved 120% of annual target in first year; recognized as top BDE Q3\n- Built and maintained CRM pipeline (Salesforce) with 40+ active opportunities\n- Partnered with marketing on lead scoring, MQL handoff, and co-marketing events\n- Education: BBA, PGDBM (Sales & Marketing)",
    "ops-analyst": "Operations Analyst\nQuickShip Logistics, Pune | 2021 - 2023\n- Analyzed fulfillment and delivery metrics across 4 warehouse hubs, reducing errors by 18%\n- Built process maps and identified bottlenecks in order-to-delivery workflow\n- Created automated Excel dashboards tracking KPIs: on-time delivery, cost per unit, inventory accuracy\n- Led cross-functional process improvement project that saved ₹12L annually in rework costs\n- Coordinated with IT on warehouse management system (WMS) upgrade\n- Education: B.Com, Diploma in Supply Chain Management",
    "customer-success": "Customer Success Manager\nSaaSFlow, Remote | 2022 - Present\n- Managed a portfolio of 40+ mid-market SaaS accounts, achieving 95% net revenue retention\n- Led onboarding programs reducing time-to-value from 6 weeks to 3 weeks\n- Conducted QBRs and health checks; identified churn risk and executed save plays (saved 8 accounts)\n- Built training materials and in-app guides reducing support tickets by 25%\n- Tools: Gainsight, Salesforce, Zendesk, Notion, Google Analytics\n- Education: MBA, BSc Business Administration",
    "hr-analyst": "HR Analytics Specialist\nPeopleFirst HR, Mumbai | 2022 - Present\n- Built HR dashboards tracking attrition, engagement scores, and hiring pipeline metrics\n- Designed and deployed employee pulse surveys reaching 500+ employees quarterly\n- Analyzed workforce data to inform succession planning and internal mobility programs\n- Automated monthly HR reports in Excel/Power BI, saving 10 hours/week of manual work\n- Supported recruitment operations: coordinated 200+ interviews across 3 departments\n- Education: MHRM, BCom, SPHR certification (SHRM)",
    "finance-analyst": "Financial Analyst\nMeridian Capital, Pune | 2021 - 2024\n- Prepared monthly P&L, balance sheet, and cash flow statements for a 3-entity group\n- Built financial models for budgeting, forecasting, and scenario analysis\n- Conducted variance analysis and prepared board-level reports for 4 C-suite executives\n- Supported 2 M&A deals: due diligence, data room management, and post-merger integration\n- Tools: Advanced Excel (VLOOKUP, pivot tables, macros), Power BI, SQL basics, SAP\n- Education: CA (Intermediate), BCom, CMA (pursuing)",
    "project-coordinator": "Project Coordinator\nBuildRight Consulting, Bengaluru | 2022 - Present\n- Coordinated 6 concurrent client projects across IT, manufacturing, and healthcare sectors\n- Managed project timelines, milestones, and deliverables using Jira and Microsoft Project\n- Scheduled cross-functional standups, wrote meeting minutes, tracked action items to closure\n- Coordinated vendor deliverables and managed a ₹50L project budget\n- Created status reports and RAG dashboards for steering committees\n- Education: BSc Project Management, PMP (foundation level)",
    "it-support": "IT Support Specialist\nTechGuard Solutions, Chennai | 2021 - 2023\n- Supported 200+ end users across 3 offices: resolved 15-20 tickets daily (hardware, software, network)\n- Managed active directory, GPO, and license administration (Microsoft 365, Adobe)\n- Assisted with network troubleshooting: VLAN configuration, DNS, DHCP, firewalls\n- Built a knowledge base with 100+ articles, reducing repeat ticket volume by 30%\n- Certified: CompTIA A+, CompTIA Network+",
    "data-analyst": "Data Analyst\nInsightMetrics, Hyderabad | 2022 - Present\n- Built SQL queries and Python scripts to clean and analyze datasets of 500K+ rows\n- Created Power BI dashboards for 5 business units; improved decision speed by reducing data prep from 2 days to 2 hours\n- Designed A/B test frameworks for pricing experiments; 3 tests led to ₹20L revenue uplift\n- Wrote regular analysis reports for product leadership covering retention, churn, and funnel metrics\n- Tools: Python (pandas, matplotlib), SQL (PostgreSQL), Power BI, Excel, Tableau\n- Education: BSc Statistics, Google Data Analytics Certificate",
    "product-marketer": "Product Marketing Manager\nSaaSOrbit, Mumbai | 2021 - 2024\n- Owned product positioning, messaging, and launch strategy for 4 product releases\n- Created sales enablement materials: decks, one-pagers, competitor battlecards, demo scripts\n- Managed product marketing funnel: awareness → consideration → purchase via content and webinars\n- Worked with pricing team on packaging; supported 2 price increases with migration comms\n- Analyzed win/loss data to refine ICP and improve targeting across marketing campaigns\n- Education: BBA, PGDM Marketing",
    "java-developer": "Java Software Engineer\nNovaSoft Systems, Bengaluru | 2022 - Present\n- Built and maintained REST APIs in Java (Spring Boot) serving 40+ microservices; owned payments and catalog domains\n- Wrote JUnit and Mockito test suites; raised unit-test coverage from 45% to 78%\n- Optimized postgres queries, cutting p95 latency 40% for the reporting service\n- Shipped via Docker containers and Jenkins CI/CD pipelines on AWS (EC2, RDS, S3)\n- Worked in Agile sprints with Jira-based backlog tracking; ran code review for 2 juniors\n- Education: B.Tech Computer Science Engineering",
    "fpa-analyst": "Financial Planning & Analysis Analyst\nMeridian Group, Pune | 2022 - Present\n- Own rolling 12-month forecasting and budgeting models; built financial modeling for 5 business units\n- Run monthly variance analysis and own monthly financial reporting to the CFO office\n- Automated quarterly close in Excel (VBA macros), saving 3 person-days per cycle\n- Partnered with business heads on cost-optimization workstreams; delivered ₹15L annual saving\n- Tools: Advanced Excel (modeling, VBA), SAP, Power BI, basic SQL, data analysis\n- Education: B.Com, CMA (pursuing)"
  },
  "sampleJobs": {
    "ecommerce-analyst": "E-commerce Analyst\nCompany: RetailTech Solutions\nLocation: Pune (Hybrid)\nWe are looking for an E-commerce Analyst to join our team and help optimize our clients' online marketplace performance.\n\nRequirements:\n- Bachelor's degree in Business, Marketing, or related field (MBA preferred)\n- 2+ years experience in e-commerce operations or marketplace management\n- Proficiency in Excel for data analysis and reporting\n- Experience with Amazon Seller Central, Walmart Marketplace, or similar platforms\n- Knowledge of performance marketing (Meta Ads, Google Ads)\n- Strong analytical skills with ability to interpret data and make recommendations\n- Experience with SQL or Power BI is a plus\n- Excellent communication and presentation skills\n\nResponsibilities:\n- Analyze sales performance across multiple marketplaces\n- Create weekly/monthly performance reports for clients\n- Identify trends and opportunities for optimization\n- Assist with product listing optimization and compliance\n- Monitor competitor activity and pricing strategies\n- Support clients with advertising campaign analysis and optimization",
    "marketing-analyst-job": "Marketing Analyst\nCompany: DigitalGrowth Agency\nLocation: Mumbai (Remote)\nJoin our team as a Marketing Analyst to help clients optimize their digital marketing performance.\n\nRequirements:\n- Bachelor's degree in Marketing, Business, or Statistics\n- 1-3 years experience in digital marketing analysis\n- Proficiency in Google Analytics and Excel\n- Experience managing Meta Ads and Google Ads campaigns\n- Strong understanding of marketing funnels and attribution models\n- Ability to create actionable insights from marketing data\n- Experience with A/B testing and conversion rate optimization\n- Excellent communication and reporting skills\n\nResponsibilities:\n- Analyze digital marketing campaign performance\n- Create performance reports and optimization recommendations\n- Conduct A/B tests on ad creatives, landing pages, and audiences\n- Monitor and report on key metrics: ROAS, CTR, CPC, conversion rates\n- Stay updated with latest digital marketing trends and platform changes\n- Collaborate with clients to understand business goals and translate to marketing strategies",
    "business-analyst-job": "Business Analyst\nCompany: FinTech Innovations\nLocation: Bangalore (On-site)\nWe are seeking a Business Analyst to bridge the gap between business needs and technical solutions.\n\nRequirements:\n- Bachelor's degree in Computer Science, Business, or Engineering (MBA preferred)\n- 2+ years experience as a Business Analyst or in similar role\n- Experience with requirement gathering and documentation\n- Proficiency in Excel and Power BI for data visualization\n- Knowledge of SDLC and Agile methodologies\n- Strong analytical and problem-solving skills\n- Experience with SQL or database querying is a plus\n- Excellent communication and stakeholder management skills\n\nResponsibilities:\n- Gather and document business requirements from stakeholders\n- Create functional specifications and user stories\n- Analyze current processes and identify improvement opportunities\n- Collaborate with development teams on solution design\n- Conduct user acceptance testing and training\n- Monitor and report on project progress and key metrics",
    "automation-specialist": "Automation Specialist\nCompany: TechFlow Solutions\nLocation: Pune (Hybrid)\nLooking for an Automation Specialist to help streamline business processes through intelligent automation.\n\nRequirements:\n- Bachelor's degree in Computer Science or related field\n- 1-3 years experience with automation or scripting\n- Proficiency in Python for automation tasks\n- Experience with web scraping, data extraction, or API integration\n- Knowledge of Excel automation (VBA or openpyxl)\n- Familiarity with workflow automation tools (Zapier, Power Automate, etc.)\n- Basic understanding of AI/ML concepts for process optimization\n- Strong problem-solving skills and attention to detail\n\nResponsibilities:\n- Develop automation scripts for repetitive business tasks\n- Create data extraction and transformation pipelines\n- Build Excel automation for reporting and analysis\n- Integrate various systems through APIs\n- Monitor and maintain automation solutions\n- Identify opportunities for process improvement through automation\n- Document automation solutions and provide training to users"
  }
};

// ============================================================
// ROLE CATALOGUE — data-driven, organized by career family
// Add new roles here without touching rendering logic
// ============================================================
const ROLE_CATALOGUE = {
  'ecommerce-marketplace': {
    label: 'E-commerce & Marketplace',
    roles: {
      'ecommerce-operations-specialist': { name: 'E-commerce Operations Specialist', skills: ['amazon', 'excel', 'stakeholder management', 'quality assurance', 'data analysis', 'shopify'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'marketplace-analyst': { name: 'Marketplace Analyst', skills: ['amazon', 'excel', 'data analysis', 'google analytics', 'reporting'], exp: { min: 2, preferred: 4 }, edu: { min: 'bachelor' } },
      'ecommerce-analyst': { name: 'E-commerce Analyst', skills: ['amazon', 'excel', 'data analysis', 'google analytics', 'reporting', 'kpi tracking'], exp: { min: 2, preferred: 4 }, edu: { min: 'bachelor' } },
      'ecommerce-manager': { name: 'E-commerce Manager', skills: ['amazon', 'shopify', 'inventory management', 'supply chain', 'stakeholder management', 'p&l management'], exp: { min: 4, preferred: 7 }, edu: { min: 'bachelor', preferred: 'mba' } },
      'marketplace-specialist': { name: 'Marketplace Specialist', skills: ['amazon', 'walmart', 'ebay', 'listing optimization', 'ppc advertising', 'inventory management'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'digital-marketing': {
    label: 'Digital Marketing',
    roles: {
      'digital-marketing-specialist': { name: 'Digital Marketing Specialist', skills: ['seo', 'content marketing', 'social media', 'google analytics', 'email marketing', 'campaign management'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'digital-marketing-manager': { name: 'Digital Marketing Manager', skills: ['seo', 'ppc', 'email marketing', 'content strategy', 'google analytics', 'budget management'], exp: { min: 4, preferred: 7 }, edu: { min: 'bachelor', preferred: 'mba' } },
      'marketing-operations-specialist': { name: 'Marketing Operations Specialist', skills: ['crm', 'automation', 'excel', 'data analysis', 'campaign management', 'reporting'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'growth-marketing-specialist': { name: 'Growth Marketing Specialist', skills: ['seo', 'ppc', 'conversion optimization', 'a/b testing', 'google analytics', 'funnel analysis'], exp: { min: 2, preferred: 4 }, edu: { min: 'bachelor' } }
    }
  },
  'performance-marketing': {
    label: 'Performance Marketing & Paid Ads',
    roles: {
      'performance-marketing-specialist': { name: 'Performance Marketing Specialist', skills: ['meta ads', 'google ads', 'google analytics', 'excel', 'reporting', 'data analysis'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'performance-marketing-manager': { name: 'Performance Marketing Manager', skills: ['meta ads', 'google ads', 'tiktok ads', 'budget management', 'attribution modeling', 'reporting'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor', preferred: 'mba' } },
      'google-ads-specialist': { name: 'Google Ads Specialist', skills: ['google ads', 'google analytics', 'excel', 'search campaigns', 'conversion tracking', 'bid management'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'meta-ads-specialist': { name: 'Meta Ads Specialist', skills: ['meta ads', 'facebook', 'instagram', 'audience targeting', 'creative testing', 'google analytics'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'social-media': {
    label: 'Social Media & Community',
    roles: {
      'social-media-executive': { name: 'Social Media Executive', skills: ['social media', 'content creation', 'community management', 'canva', 'analytics', 'copywriting'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } },
      'social-media-manager': { name: 'Social Media Manager', skills: ['social media', 'content strategy', 'community management', 'google analytics', 'influencer marketing', 'campaign planning'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'community-manager': { name: 'Community Manager', skills: ['community management', 'customer engagement', 'social media', 'content creation', 'moderation', 'user experience'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'brand-marketing': {
    label: 'Brand Marketing & Management',
    roles: {
      'brand-marketing-specialist': { name: 'Brand Marketing Specialist', skills: ['brand strategy', 'market research', 'creative briefs', 'stakeholder management', 'copywriting', 'campaign execution'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'brand-manager': { name: 'Brand Manager', skills: ['brand strategy', 'market research', 'product positioning', 'budget management', 'creative direction', 'cross-functional leadership'], exp: { min: 4, preferred: 8 }, edu: { min: 'bachelor', preferred: 'mba' } },
      'brand-communications-specialist': { name: 'Brand Communications Specialist', skills: ['brand strategy', 'copywriting', 'content strategy', 'media relations', 'campaign execution', 'stakeholder management'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } }
    }
  },
  'content-marketing': {
    label: 'Content Marketing & Strategy',
    roles: {
      'content-marketer': { name: 'Content Marketer', skills: ['content writing', 'seo', 'copywriting', 'content strategy', 'cms', 'editorial planning'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'content-strategist': { name: 'Content Strategist', skills: ['content strategy', 'seo', 'audience research', 'editorial planning', 'analytics', 'storytelling'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'content-writer': { name: 'Content Writer', skills: ['copywriting', 'editorial', 'research', 'seo', 'grammar', 'storytelling'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } }
    }
  },
  'seo-organic': {
    label: 'SEO & Organic Growth',
    roles: {
      'seo-specialist': { name: 'SEO Specialist', skills: ['seo', 'keyword research', 'technical seo', 'on-page seo', 'link building', 'google analytics'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'seo-manager': { name: 'SEO Manager', skills: ['seo strategy', 'technical seo', 'link building', 'content optimization', 'google analytics', 'team leadership'], exp: { min: 4, preferred: 7 }, edu: { min: 'bachelor' } },
      'organic-growth-specialist': { name: 'Organic Growth Specialist', skills: ['seo', 'content marketing', 'social media', 'email marketing', 'analytics', 'conversion optimization'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'product': {
    label: 'Product Marketing & Management',
    roles: {
      'product-marketing-manager': { name: 'Product Marketing Manager', skills: ['product strategy', 'market research', 'positioning', 'launch management', 'sales enablement', 'stakeholder management'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor', preferred: 'mba' } },
      'product-manager': { name: 'Product Manager', skills: ['product strategy', 'user research', 'roadmapping', 'agile', 'stakeholder management', 'data analysis'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor' } },
      'product-operations-specialist': { name: 'Product Operations Specialist', skills: ['process improvement', 'data analysis', 'stakeholder management', 'documentation', 'excel', 'project management'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } }
    }
  },
  'marketing-analytics': {
    label: 'Marketing Analytics & Research',
    roles: {
      'marketing-analytics-analyst': { name: 'Marketing Analytics Analyst', skills: ['google analytics', 'excel', 'data analysis', 'reporting', 'attribution modeling', 'a/b testing'], exp: { min: 2, preferred: 4 }, edu: { min: 'bachelor', preferred: 'master' } },
      'market-research-analyst': { name: 'Market Research Analyst', skills: ['research methodology', 'data analysis', 'excel', 'surveys', 'reporting', 'insights presentation'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor', preferred: 'master' } },
      'marketing-analyst': { name: 'Marketing Analyst', skills: ['google analytics', 'excel', 'data analysis', 'reporting', 'campaign analysis', 'kpi tracking'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'sales-business-development': {
    label: 'Sales & Business Development',
    roles: {
      'business-development-executive': { name: 'Business Development Executive', skills: ['sales', 'client relationships', 'negotiation', 'market research', 'networking', 'crm'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } },
      'business-development-manager': { name: 'Business Development Manager', skills: ['sales strategy', 'client relationships', 'negotiation', 'market research', 'pipeline management', 'crm'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor', preferred: 'mba' } },
      'account-manager': { name: 'Account Manager', skills: ['client relationships', 'crm', 'reporting', 'renewal management', 'upselling', 'communication'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } }
    }
  },
  'business-analysis-consulting': {
    label: 'Business Analysis & Consulting',
    roles: {
      'business-analyst': { name: 'Business Analyst', skills: ['excel', 'data analysis', 'requirements gathering', 'process improvement', 'stakeholder management', 'documentation'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'operations-analyst': { name: 'Operations Analyst', skills: ['excel', 'data analysis', 'process improvement', 'kpi tracking', 'reporting', 'project management'], exp: { min: 2, preferred: 4 }, edu: { min: 'bachelor' } },
      'management-consultant': { name: 'Management Consultant', skills: ['problem solving', 'data analysis', 'presentation', 'strategy', 'stakeholder management', 'process improvement'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor', preferred: 'mba' } }
    }
  },
  'operations-process': {
    label: 'Operations & Process Improvement',
    roles: {
      'operations-manager': { name: 'Operations Manager', skills: ['process improvement', 'team leadership', 'budget management', 'supply chain', 'quality assurance', 'stakeholder management'], exp: { min: 5, preferred: 8 }, edu: { min: 'bachelor' } },
      'program-manager': { name: 'Program Manager', skills: ['project management', 'stakeholder management', 'budget management', 'risk management', 'agile', 'reporting'], exp: { min: 4, preferred: 7 }, edu: { min: 'bachelor' } },
      'process-improvement-specialist': { name: 'Process Improvement Specialist', skills: ['process improvement', 'data analysis', 'excel', 'automation', 'quality assurance', 'documentation'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } }
    }
  },
  'ai-automation': {
    label: 'AI, Automation & Workflows',
    roles: {
      'ai-operations-analyst': { name: 'AI Operations Analyst', skills: ['data analysis', 'automation', 'excel', 'python', 'machine learning concepts', 'workflow design'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'workflow-automation-analyst': { name: 'Workflow Automation Analyst', skills: ['automation', 'python', 'excel', 'api integration', 'process improvement', 'jira'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'ai-workflow-specialist': { name: 'AI Workflow Specialist', skills: ['ai tools', 'automation', 'prompt engineering', 'workflow design', 'data analysis', 'excel'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'data-bi': {
    label: 'Data Analysis & Business Intelligence',
    roles: {
      'junior-data-analyst': { name: 'Junior Data Analyst', skills: ['excel', 'sql', 'data analysis', 'data cleaning', 'reporting', 'python'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } },
      'data-analyst': { name: 'Data Analyst', skills: ['sql', 'excel', 'data analysis', 'data visualization', 'python', 'statistics'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'business-intelligence-analyst': { name: 'Business Intelligence Analyst', skills: ['sql', 'power bi', 'excel', 'data modeling', 'reporting', 'data analysis'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'data-science-intern': { name: 'Data Science Intern', skills: ['python', 'data analysis', 'machine learning', 'statistics', 'jupyter', 'data visualization'], exp: { min: 0, preferred: 1 }, edu: { min: 'bachelor' } }
    }
  },
  'customer-success': {
    label: 'Customer Success & Experience',
    roles: {
      'customer-success-specialist': { name: 'Customer Success Specialist', skills: ['customer relationships', 'crm', 'communication', 'onboarding', 'support', 'renewal management'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } },
      'customer-success-manager': { name: 'Customer Success Manager', skills: ['customer relationships', 'crm', 'churn analysis', 'onboarding', 'account management', 'reporting'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor' } },
      'customer-experience-specialist': { name: 'Customer Experience Specialist', skills: ['customer research', 'ux principles', 'support', 'feedback analysis', 'service design', 'crm'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  },
  'hr-recruitment': {
    label: 'Human Resources & Recruitment',
    roles: {
      'hr-executive': { name: 'HR Executive', skills: ['recruitment', 'onboarding', 'people operations', 'hrms', 'compliance', 'communication'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'hr-analyst': { name: 'HR Analyst', skills: ['data analysis', 'excel', 'hr reporting', 'workforce planning', 'survey design', 'people analytics'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'talent-acquisition-specialist': { name: 'Talent Acquisition Specialist', skills: ['recruitment', 'sourcing', 'interviewing', 'employer branding', 'crm', 'stakeholder management'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } }
    }
  },
  'finance-operations': {
    label: 'Finance & Business Operations',
    roles: {
      'financial-analyst': { name: 'Financial Analyst', skills: ['excel', 'financial modeling', 'data analysis', 'reporting', 'budgeting', 'variance analysis'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor', preferred: 'master' } },
      'finance-operations-specialist': { name: 'Finance Operations Specialist', skills: ['bookkeeping', 'excel', 'reconciliation', 'invoicing', 'reporting', 'erp systems'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'business-operations-analyst': { name: 'Business Operations Analyst', skills: ['data analysis', 'excel', 'process improvement', 'reporting', 'budget tracking', 'kpi tracking'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } }
    }
  },
  'finance-accounting': {
    label: 'Finance, Accounting & Audit',
    roles: {
      'fpa-analyst': { name: 'FP&A Analyst', skills: ['excel', 'financial modeling', 'forecasting', 'variance analysis', 'data analysis'], exp: { min: 2, preferred: 4 }, edu: { min: 'bachelor', preferred: 'master' } },
      'financial-controller': { name: 'Financial Controller', skills: ['financial reporting', 'excel', 'gaap', 'audit', 'sap', 'team leadership'], exp: { min: 5, preferred: 8 }, edu: { min: 'bachelor', preferred: 'master' } },
      'internal-auditor': { name: 'Internal Auditor', skills: ['audit', 'risk management', 'compliance', 'excel', 'internal controls', 'reporting'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor', preferred: 'master' } },
      'treasury-analyst': { name: 'Treasury Analyst', skills: ['cash flow management', 'forex', 'excel', 'banking relationships', 'treasury systems', 'financial reporting'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'accountant': { name: 'Accountant', skills: ['bookkeeping', 'gst', 'reconciliation', 'excel', 'invoicing', 'financial reporting'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'finance-manager': { name: 'Finance Manager', skills: ['financial reporting', 'budget management', 'team leadership', 'excel', 'stakeholder management', 'internal audit'], exp: { min: 6, preferred: 10 }, edu: { min: 'bachelor', preferred: 'mba' } }
    }
  },
  'it-software': {
    label: 'IT & Software Engineering',
    roles: {
      'junior-sde': { name: 'Junior Software Engineer', skills: ['java', 'python', 'git', 'rest api', 'sql', 'agile'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } },
      'sde-java': { name: 'Software Engineer (Java)', skills: ['java', 'spring boot', 'microservices', 'sql', 'git', 'jira'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'sde-python': { name: 'Software Engineer (Python)', skills: ['python', 'flask', 'rest api', 'sql', 'git', 'django'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'frontend-developer': { name: 'Frontend Developer', skills: ['javascript', 'react', 'html', 'css', 'git', 'typescript'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'backend-developer': { name: 'Backend Developer', skills: ['java', 'python', 'kotlin', 'android', 'rest api', 'sql', 'microservices', 'redis'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'fullstack-developer': { name: 'Full-Stack Developer', skills: ['javascript', 'react', 'node', 'sql', 'rest api', 'git'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'qa-engineer': { name: 'QA Engineer', skills: ['test automation', 'selenium', 'jira', 'bug tracking', 'api testing', 'test case design'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'test-automation-engineer': { name: 'Test Automation Engineer', skills: ['test automation', 'selenium', 'java', 'python', 'ci/cd', 'jira'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'devops-engineer': { name: 'DevOps Engineer', skills: ['aws', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'linux'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'cloud-engineer': { name: 'Cloud Engineer', skills: ['aws', 'azure', 'docker', 'kubernetes', 'python', 'linux'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'data-engineer': { name: 'Data Engineer', skills: ['python', 'sql', 'etl', 'apache airflow', 'data pipelines', 'aws'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'ml-engineer': { name: 'Machine Learning Engineer', skills: ['python', 'machine learning', 'data analysis', 'sql', 'deep learning', 'docker'], exp: { min: 2, preferred: 5 }, edu: { min: 'bachelor' } },
      'cybersecurity-analyst': { name: 'Cybersecurity Analyst', skills: ['cybersecurity', 'vulnerability', 'network security', 'siem', 'threat detection', 'incident response', 'penetration testing', 'compliance'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'system-administrator': { name: 'System Administrator', skills: ['windows server', 'active directory', 'networking', 'linux', 'monitoring', 'troubleshooting'], exp: { min: 1, preferred: 4 }, edu: { min: 'bachelor' } },
      'technical-lead': { name: 'Technical Lead / IT Manager', skills: ['project management', 'agile', 'team leadership', 'system design', 'stakeholder management', 'code review'], exp: { min: 5, preferred: 9 }, edu: { min: 'bachelor' } }
    }
  },
  'project-management': {
    label: 'Project Management',
    roles: {
      'project-coordinator': { name: 'Project Coordinator', skills: ['scheduling', 'documentation', 'stakeholder management', 'excel', 'jira', 'communication'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'project-manager': { name: 'Project Manager', skills: ['project management', 'agile', 'stakeholder management', 'budget management', 'risk management', 'reporting'], exp: { min: 3, preferred: 6 }, edu: { min: 'bachelor' } }
    }
  },
  'it-technical-support': {
    label: 'Software, IT & Technical Support',
    roles: {
      'it-support-specialist': { name: 'IT Support Specialist', skills: ['help desk', 'troubleshooting', 'networking basics', 'tickets', 'documentation', 'communication'], exp: { min: 0, preferred: 2 }, edu: { min: 'bachelor' } },
      'technical-support-analyst': { name: 'Technical Support Analyst', skills: ['troubleshooting', 'ticketing systems', 'data analysis', 'documentation', 'customer communication', 'diagnostics'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } },
      'software-support-specialist': { name: 'Software Support Specialist', skills: ['ticket management', 'debugging', 'data analysis', 'user training', 'documentation', 'communication'], exp: { min: 1, preferred: 3 }, edu: { min: 'bachelor' } }
    }
  }
};

// Flat map: key -> role info (for quick lookup)
const ALL_ROLES_FLAT = {};
Object.values(ROLE_CATALOGUE).forEach(family => {
  Object.entries(family.roles).forEach(([key, role]) => {
    ALL_ROLES_FLAT[key] = { ...role, key, family: family.label };
  });
});

// Skill aliases so "Microsoft Excel" counts as "excel" etc.
const SKILL_ALIASES = {
  'microsoft excel': 'excel',
  'google spreadsheets': 'google sheets',
  'google analytics 4': 'google analytics',
  'stakeholder coordination': 'stakeholder management',
  'quality control': 'quality assurance',
  'kpi monitoring': 'kpi tracking'
};

// Global data storage
let resumeData = {};
let careerFitData = {};
let jobApplications = [];
let plannerData = {
  selectedRoles: [], // Array of selected role keys
  customRole: '',    // Custom role entered by user
  plans: {}          // Generated plans for each role
};

// Resume Studio state. Declared HERE (top of the callback) rather than in the
// studio module section: init() may call switchTab('studioAnalysis') — via the
// persisted active tab — before the module's lower consts have been created,
// and renderStudio() must be safe at that moment (no TDZ crash on reload).
const studioState = {
  wf: 'improve',
  improveRole: '',
  improveJd: '',
  suggestions: [],
  accepted: [],
  applied: [],
  snapshot: '',
  draftText: '',
  draftName: '',
  newRole: '',
  newLevel: 'mid',
  newStructure: 'ats-single-column',
  newSections: null,   // null = all sections
  newJd: '',
  newDraftText: '',
  newName: '',
  exCat: '',
  exTpl: 'ats-single-column',
  // OpenAI studio-writing state: chosen operation, free-text instructions, and
  // a monotonic counter so a slower response can't overwrite a newer one.
  aiOp: 'improve',
  aiInstr: '',
  aiSeq: 0,
  aiLast: null   // most recent successful AI result {content, operation} (null until generated)
};
const STUDIO_SECTIONS = ['contact', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications'];
const STUDIO_DRAFTS_KEY = 'studioDrafts'; // localStorage key for the studio's own drafts

// Provenance — where the current resume / JD actually came from, so the UI can
// identify it and the user can tell a freshly-analyzed input apart from a
// saved profile restored from a previous session or an explicitly chosen sample.
// This is the single source of truth for "which resume is the match based on?".
let resumeSource = null;    // 'user' | 'sample' | 'saved'
let resumeSourceLabel = ''; // human label (e.g. sample name, file name)
let jobSource = null;       // 'user' | 'sample' | 'url' | 'file'
let jobSourceLabel = '';
// Cheap signatures of the last ANALYZED input text, used to detect that the
// editors have been changed since the last analysis (stale-result guard, Rule 5).
let analyzedResumeSig = '';
let analyzedJdSig = '';

// A cheap, collision-good-enough signature of an input's text. Not a security
// hash — just enough to tell "editor unchanged since last analysis".
function inputSig(text) {
  const t = String(text || '');
  return t.length + '::' + t.slice(0, 32) + '::' + t.slice(-32);
}

// Are valid, analyzed inputs present? (Rule 2: gate on these, never on empty.)
function resumeAvailable() { return Object.keys(resumeData).length > 0; }
function jobAvailable() { return Object.keys(careerFitData).length > 0; }

// Human-readable provenance for the current inputs (shown in Match / JD UI).
function resumeSourceText() {
  if (!resumeAvailable()) return '';
  if (resumeSource === 'sample') return 'the sample “' + (resumeSourceLabel || 'sample') + '”';
  if (resumeSource === 'saved') return resumeSourceLabel
    ? 'your saved profile (“' + resumeSourceLabel + '”, from a previous session)'
    : 'your saved resume profile (restored from a previous session)';
  return resumeSourceLabel || 'your resume';
}
function jobSourceText() {
  if (!jobAvailable()) return '';
  if (jobSource === 'sample') return 'the sample “' + (jobSourceLabel || 'sample JD') + '”';
  if (jobSource === 'url') return 'a JD imported from ' + (jobSourceLabel || 'a URL');
  if (jobSource === 'file') return 'an uploaded JD' + (jobSourceLabel ? ' (' + jobSourceLabel + ')' : '');
  return 'a job description you provided';
}
// True when the current resume was silently restored from a previous session
// (source stays 'saved' until the user explicitly analyzes or picks a sample
// this session, which switches source to 'user'/'sample').
function resumeIsRestoredSaved() {
  return resumeSource === 'saved';
}

function canonicalSkill(value) {
  const skill = String(value).toLowerCase().trim().replace(/\s+/g, ' ');
  return SKILL_ALIASES[skill] || skill;
}

// Which of the role's key skills are absent from the resume?
function getMissingRoleSkills(resumeSkills, roleSkills) {
  const have = new Set((Array.isArray(resumeSkills) ? resumeSkills : []).map(canonicalSkill));
  const missing = [];
  [...new Set((Array.isArray(roleSkills) ? roleSkills : []).map(canonicalSkill))]
    .forEach(skill => { if (!have.has(skill)) missing.push(skill); });
  return missing;
}

// Per-skill "how to get it" playbook for the 100% Path section.
const SKILL_PLAYBOOK = {
  sql: { how: 'SQL in a weekend: SQLBolt’s free drills + one practice dataset from Kaggle. That’s enough to write “SQL fundamentals” on your resume.', time: '2-3 wks' },
  'power bi': { how: 'Microsoft’s free Power BI course (PY-100). Build one dashboard from data you already have at work — portfolio piece included.', time: '3-4 wks' },
  tableau: { how: 'Tableau Public is free with real datasets. Recreate one published visualization to start, then personalize it with your own data.', time: '3-4 wks' },
  python: { how: 'Start with the Excel tasks you already do — script two of them in Python (openpyxl/pandas). Automation you actually shipped is the strongest proof.', time: '4-6 wks' },
  jira: { how: 'Run one small project on a free Jira board — tickets, sprints, done columns. Then “Jira fundamentals” is a fact, not a claim.', time: '1 wk' },
  'google workspace': { how: 'You likely already use this — just name it in your skills section and it counts.', time: '5 min' },
  'data analysis': { how: 'Add a two-point “Analysis I did” mini-section: the question, the method, the result. Reframing work you’ve already done.', time: '1 hr' },
  'kpi tracking': { how: 'List the KPIs you already monitor as an explicit line (“ROAS, CTR, CPC, conversion rate”) — recruiters and ATS love named metrics.', time: '1 hr' },
  'reporting': { how: 'Build one reusable weekly report (Excel template with auto-updating charts) and screenshot it as a case study.', time: '1-2 wks' },
  'stakeholder management': { how: 'Reframe work you already do: add one line per role describing who you coordinated with and how you kept them updated.', time: '1 hr' },
  'process improvement': { how: 'Pick one process you fixed and write it as before/after with a number. “Reduced X from A to B” is a process-improvement line.', time: '1 hr' },
  'project management': { how: 'Document one project you’ve touched end-to-end: timeline, blockers, outcome. That earns “project management fundamentals”.', time: '1-2 wks' },
  'quality assurance': { how: 'Describe your suppression/compliance or review work as QA process — include the error rate you caught or prevented.', time: '1 hr' },
  shopify: { how: 'Free Shopify trial: take one product from catalog to checkout. “Hands-on Shopify store setup” becomes a fact.', time: '2-3 wks' }
};

function playbookFor(skill) {
  return SKILL_PLAYBOOK[skill] || { how: `Focused 30-day project: pick one ${skill} task you’ve done in real work and turn it into a small written case study.`, time: '~2 wks' };
}

// --- Themes: Ink / One Piece / Wizarding ---
const THEME_META = {
  ink: {
    tagline: 'CareerAI analyzes your resume against job descriptions and turns the gap into a plan you can actually act on.',
    tag: 'Pro tip'
  },
  onepiece: {
    tagline: 'Assemble your crew: Luffy-level ambition, Zoro-sharp focus, Nami’s map. Then set sail for the One Piece of careers — your dream role.',
    tag: "Captain's log"
  },
  wizard: {
    tagline: 'Brew the perfect draft: Felix Felicis confidence, a Patronus of proof, and a spell strong enough to turn “we’ll be in touch” into an offer.',
    tag: 'Owl wisdom'
  }
};

// Named, interactive character sprites per theme.
// Sprites live strictly in the left/right edge columns (x ≤ 8% or ≥ 92%)
// so they never sit on the centered text. i: emoji, n: name tag,
// t: lore tooltip, x/y: position %, s: size, d: float delay, fx: special animation
const THEME_FX = {
  ink: [],
  onepiece: [
    { i: '👒', n: 'Luffy', t: 'Luffy — Gomu Gomu no Mi. “I’m going to be the Pirate King!” Set one bold, clear goal and let it pull everything else behind it.', x: '4%', y: '10%', s: '1.7rem', d: '0s' },
    { i: '🏴‍☠️', n: 'One Piece', t: 'The treasure at the end of the journey. Your dream role — the only one that counts.', x: '92%', y: '28%', s: '1.7rem', d: '-0.6s', fx: 'wave' },
    { i: '🧭', n: 'Nami', t: 'Nami charts the course before the ship moves. Your application tracker is that map.', x: '4%', y: '74%', s: '1.4rem', d: '-3s' },
    { i: '⚓', n: 'Marines', t: 'The gatekeepers of the system. Read the rules, then out-sail them.', x: '92%', y: '78%', s: '1.4rem', d: '-1s' }
  ],
  wizard: [
    { i: '⚡', n: 'Harry', t: 'Harry — “I did it, and I’ll do it again.” Take full ownership of your wins.', x: '4%', y: '8%', s: '1.7rem', d: '0s', fx: 'sparkle' },
    { i: '📚', n: 'Hermione', t: 'Hermione — research beats magic. Read the job description before the interview, not after.', x: '92%', y: '28%', s: '1.5rem', d: '-2s' },
    { i: '🦴', n: 'Hagrid', t: 'Hagrid — “Do you collect bones?” Big heart, bigger roles.', x: '4%', y: '76%', s: '1.4rem', d: '-3.4s' },
    { i: '🧪', n: 'Snape', t: 'The only grade worth aiming for: “Outstanding”. Every bullet, every number.', x: '92%', y: '78%', s: '1.4rem', d: '-1.2s', fx: 'glow' }
  ]
};

// Signature moving piece per theme
const THEME_VIGNETTE = {
  onepiece: { i: '⛵', t: 'Thousand Sunny — the ship that carries the dream. Build yours: a body of real, shipped work.', cls: 'fx-sail' },
  wizard: { i: '🪄', t: 'Wingardium Leviosa — lift what is heavy and dull into something light and impressive.', cls: 'fx-levitate' }
};

function buildThemeFx(name) {
  const fx = document.getElementById('themeFx');
  if (!fx) return;
  fx.innerHTML = '';
  (THEME_FX[name] || []).forEach(item => {
    const el = document.createElement('span');
    el.className = 'theme-fx-item' + (item.fx ? ' fx-' + item.fx : '');
    el.style.left = item.x;
    el.style.top = item.y;
    el.style.fontSize = item.s;
    el.style.animationDelay = item.d;
    el.title = item.t;
    el.innerHTML = `<span class="fx-emoji">${item.i}</span><span class="fx-name">${item.n}</span>`;
    fx.appendChild(el);
  });
  const v = THEME_VIGNETTE[name];
  if (v) {
    const el = document.createElement('span');
    el.className = 'theme-fx-item ' + v.cls;
    el.title = v.t;
    el.textContent = v.i;
    fx.appendChild(el);
  }
}

function applyTheme(name) {
  const meta = THEME_META[name] || THEME_META.ink;
  if (document.documentElement.getAttribute('data-theme') === name) return;
  document.documentElement.setAttribute('data-theme', name);
  try { localStorage.setItem('appTheme', name); } catch (e) { /* private mode */ }
  const tagline = document.getElementById('heroTagline');
  if (tagline) tagline.textContent = meta.tagline;
  const quoteTag = document.getElementById('quoteTag');
  if (quoteTag) quoteTag.textContent = meta.tag;
  document.querySelectorAll('.theme-chip').forEach(chip =>
    chip.classList.toggle('active', chip.dataset.theme === name));
  buildThemeFx(name);

  // Swap the quote text immediately with the new theme (with the fade),
  // so a stale quote never lingers after a theme switch.
  const qHost = document.getElementById('rotatingQuote');
  const qText = document.getElementById('rotatingQuoteText');
  const qDots = document.getElementById('rotatingQuoteDots');
  if (qHost && qText && qDots) {
    const pool = THEME_QUOTES[name] || THEME_QUOTES.ink;
    qHost.classList.add('is-out');
    setTimeout(() => {
      qText.textContent = pool[0];
      qDots.innerHTML = pool.map((_, i) => `<span class="${i === 0 ? 'on' : ''}"></span>`).join('');
      qHost.classList.remove('is-out');
    }, 450);
  }
}

// Quotes that change with the active theme
const THEME_QUOTES = {
  ink: [
    'Recruiters spend 7 seconds on your resume’s first screen. Make the top third earn the next 2 minutes.',
    'Numbers beat adjectives. “Cut processing time 30%” outshines “hard-working” every single time.',
    'One tailored resume beats ten generic ones — tailor the top third to each JD you apply to.',
    'Rejection is feedback, not a verdict. Ask for it — most candidates never do.',
    'Your dream role is already waiting. The only thing standing between you and it is consistency.'
  ],
  onepiece: [
    '“I’m going to be the Pirate King!” — Set your sights like Luffy: one clear, bold goal, and the whole crew of skills follows.',
    'The Grand Line is not for cowards. Nor is your dream role — that’s exactly why it’s worth it.',
    'Every Devil Fruit has a price. Pick your career trade-offs the way a captain picks a ship: knowingly.',
    'Nami charts the course before the ship ever moves. Your tracker is that map — fill it in weekly.',
    'The Marines check documents at the gate. Dress your resume so they’re smiling by the time you board.'
  ],
  wizard: [
    '“It is not our abilities that show what we truly are, it is our choices.” — Your resume is the record of your choices.',
    'Snape has exactly one grade worth aiming for: “Outstanding”. Every bullet, every number.',
    'Summon a Patronus: take the one win you’re proudest of and let it be the light that chases the doubt away.',
    'Felix Felicis doesn’t exist yet — but a tailored resume plus twenty targeted applications comes close.',
    'The O.W.L.s are just practice exams. The interview is the real test — rehearse in the easier dungeons first.'
  ]
};

// Count-up number animation (score rings / readiness numbers).
// Uses setInterval instead of rAF so it still completes in background tabs.
function animateNumber(el, to, suffix) {
  if (!el) return;
  suffix = suffix || '%';
  const from = parseInt(String(el.textContent).replace(/[^0-9]/g, ''), 10) || 0;
  if (from === to) { el.textContent = to + suffix; return; }
  const dur = 900;
  const start = performance.now();
  const id = setInterval(() => {
    const p = Math.min((performance.now() - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (p >= 1) clearInterval(id);
  }, 50);
}

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
  const resumeResults = document.getElementById('resumeResults');

  // --- Vitals "fix these" suggestions: apply straight into the resume editor ---
  // The analyze render fills vitalsCtx with the current Impact/Verb fix lists;
  // one delegated click handler on #resumeResults drives the Apply/Copy
  // buttons so re-rendering the results never orphans the listeners.
  let vitalsCtx = null;
  // The raw text of the last analyzed resume — what the AI coach sends.
  let lastAnalyzedRaw = '';
  // Monotonic counter so a slower AI response can never overwrite a newer
  // one: each request bumps it, and only the latest response is rendered.
  let aiAnalyzeSeq = 0;
  // Active provider/model info (fetched once at startup from the EXISTING
  // /api/health endpoint) so UI labels reflect the real provider instead of
  // hard-coding "OpenAI". Null when the server isn't reachable — labels then
  // fall back to neutral "AI" wording. Never contains credentials.
  let aiProviderInfo = null;
  async function refreshAiProviderInfo() {
    try {
      const res = await fetch('/api/health');
      const data = await res.json().catch(() => ({}));
      if (data && data.ok) {
        aiProviderInfo = { provider: data.provider || '', model: data.model || '' };
      }
    } catch (e) { /* server not running — labels stay neutral */ }
  }
  function aiProviderWord() {
    return aiProviderInfo
      ? (aiProviderInfo.provider === 'gemini' ? 'Gemini' : 'OpenAI')
      : '';
  }
  // e.g. "Gemini · gemini-3.8-flash" / "OpenAI · gpt-5.5" / "" when unknown.
  function aiProviderTag() {
    const p = aiProviderWord();
    if (!p) return '';
    return aiProviderInfo.model ? p + ' · ' + aiProviderInfo.model : p;
  }
  function flashInputMessage(text) {
    if (!resumeInputMessage) return;
    resumeInputMessage.innerHTML = `<div class="alert alert-info mb-0">${text}</div>`;
    clearTimeout(flashInputMessage._t);
    flashInputMessage._t = setTimeout(() => { resumeInputMessage.innerHTML = ''; }, 6000);
  }
  function applyVitalsFix(kind, idx, btn) {
    const fix = vitalsCtx && vitalsCtx[kind] && vitalsCtx[kind][idx];
    if (!fix || !resumeInput) return;
    const input = btn.closest('.rf-fix') && btn.closest('.rf-fix').querySelector('.rf-fix-input');
    const text = (input && input.value.trim()) ? input.value.trim() : fix.suggested;
    // Find the editor line this suggestion was built from (its first 5 words)
    // and replace that whole line with marker + the (possibly edited) text.
    const needle = fix.orig.split(/\s+/).slice(0, 5).join(' ');
    const lines = resumeInput.value.split(/\r?\n/);
    const hit = lines.findIndex(l => l.includes(needle));
    if (hit >= 0) {
      // Keep the editor line's own marker (AI-sourced fixes don't carry one).
      const lineMarker = (lines[hit].match(BULLET_MARKER_STRIP_RE) || [''])[0];
      lines[hit] = (lineMarker || fix.marker) + text;
      resumeInput.value = lines.join('\n');
      resumeInput.dispatchEvent(new Event('input', { bubbles: true }));
      btn.textContent = 'Applied ✓';
      btn.classList.add('is-applied');
      if (input) input.classList.add('is-applied');
      flashInputMessage('<strong>Bullet updated in the editor.</strong> Run Analyze again to watch the meter move.');
    } else {
      if (navigator.clipboard) navigator.clipboard.writeText(fix.marker + text).catch(() => {});
      btn.textContent = 'Copied';
      flashInputMessage(`Couldn't locate that bullet in the editor — the rewrite was <strong>copied</strong> instead. Paste it over the bullet, or edit the text above before applying.`);
    }
  }
  function copyVitalsFix(kind, idx, btn) {
    const fix = vitalsCtx && vitalsCtx[kind] && vitalsCtx[kind][idx];
    if (!fix) return;
    const input = btn.closest('.rf-fix') && btn.closest('.rf-fix').querySelector('.rf-fix-input');
    const text = (input && input.value.trim()) ? input.value.trim() : fix.suggested;
    if (navigator.clipboard) navigator.clipboard.writeText(fix.marker + text).catch(() => {});
    btn.textContent = 'Copied ✓';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  }
  // --- AI coach: full rewrites from the local node server.js /api/coach ---
  // The static app works without it (the template fix lists above are the
  // fallback); when server.js is running with ANTHROPIC_API_KEY, the model
  // returns personalized rewrites of the weakest bullets and the same
  // Apply/Copy machinery puts them into the editor.
  function renderAiSuggestions(suggestions, notes, host) {
    if (!host) return;
    const ai = suggestions.map(s => ({ marker: '', orig: s.original, suggested: s.suggested }));
    vitalsCtx = vitalsCtx ? Object.assign(vitalsCtx, { ai }) : { impact: [], verb: [], ai };
    host.innerHTML = (notes ? `<p class="rf-ai-notes">${escAttr(notes)}</p>` : '') +
      (ai.length
        ? ai.map((f, i) => `
          <div class="rf-fix">
            <div class="rf-fix-orig">• “${escAttr(f.orig)}”</div>
            <div class="rf-fix-row">
              <input type="text" class="rf-fix-input" data-kind="ai" data-fix="${i}" value="${escAttr(f.suggested)}" aria-label="AI rewrite">
              <button type="button" class="rf-fix-btn" data-kind="ai" data-apply-fix="${i}">Apply</button>
              <button type="button" class="rf-fix-btn" data-kind="ai" data-copy-fix="${i}">Copy</button>
            </div>
          </div>`).join('')
        : '<span class="text-muted">No rewrites came back — try again.</span>');
  }
  // Show which coach routes are live (free ones first) from the dev server.
  async function refreshAiCoachProviders() {
    const host = document.getElementById('aiCoachProviders');
    if (!host) return;
    try {
      const data = await (await fetch('/api/coach/providers')).json();
      const ready = (data.providers || []).filter(p => p.ready);
      host.innerHTML = ready.length
        ? '⚡ via ' + ready.slice(0, 2).map(p => escAttr(p.label + (p.free ? ' · free' : ''))).join(' / ')
        : 'no route yet — ' + (ready.length ? '' : escAttr((data.providers || []).map(p => p.hint).join(' or ')));
    } catch {
      host.innerHTML = 'AI coach needs <code>node server.js</code> — free keys: Groq (console.groq.com) / Gemini (aistudio.google.com), or Ollama locally (no key, no cloud).';
    }
  }

  async function runAiCoach() {
    const raw = lastAnalyzedRaw;
    const statusEl = document.getElementById('aiCoachStatus');
    const btn = document.getElementById('aiCoachBtn');
    const host = document.getElementById('aiCoachResults');
    if (!raw) { if (statusEl) statusEl.textContent = 'Analyze your resume first.'; return; }
    if (btn) { btn.disabled = true; btn.textContent = 'Thinking…'; }
    if (statusEl) statusEl.textContent = '';
    try {
      const targetRole = (document.getElementById('targetRoleSelect') || {}).value || '';
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: raw, targetRole })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status);
      renderAiSuggestions(data.suggestions || [], data.notes || '', host);
      const via = data.provider ? ' via ' + data.provider : '';
      if (statusEl) statusEl.textContent =
        (data.suggestions || []).length + ' rewrites ready' + via + ' — edit any line, then Apply or Copy.';
    } catch (e) {
      if (statusEl) statusEl.textContent =
        'AI coach unavailable (' + e.message + '). The template suggestions above still work — ' +
        'enable AI rewrites free with Groq/Gemini keys or Ollama, then run `node server.js`.';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '✨ Get AI rewrites'; }
    }
  }
  // --- AI analysis: a FRESH OpenAI read of the currently-selected resume ---
  // Reads the last analyzed resume text + the current JD (when present), calls
  // the local Python server, and renders the structured result. A failed
  // request clears the region and reports the error — it never falls back to a
  // previous result, and a slower response can't overwrite a newer one.
  async function runAiAnalyze() {
    const raw = lastAnalyzedRaw;
    const btn = document.getElementById('aiAnalyzeBtn');
    const statusEl = document.getElementById('aiAnalyzeStatus');
    const host = document.getElementById('aiAnalyzeResults');
    if (!raw) { if (statusEl) statusEl.textContent = 'Analyze your resume first, then run AI analysis.'; return; }
    const jd = ((document.getElementById('jobInput') || {}).value || '').trim();
    const targetRole = ((document.getElementById('targetRoleSelect') || {}).value || '');
    aiAnalyzeSeq += 1;
    const seq = aiAnalyzeSeq;
    if (btn) { btn.disabled = true; btn.textContent = 'Analyzing…'; }
    if (host) host.innerHTML = '';
    if (statusEl) statusEl.textContent = 'Contacting ' + (aiProviderWord() || 'the AI provider') + '…';
    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: raw, jobDescription: jd, targetRole, requestId: 'a' + seq })
      });
      const data = await res.json().catch(() => ({}));
      if (seq !== aiAnalyzeSeq) return; // superseded by a newer request
      if (!res.ok || !data.ok) {
        // data.error is provider-specific (names the right key/model); no
        // hard-coded provider hint here.
        throw new Error(data.error || ('HTTP ' + res.status));
      }
      renderAiAnalysis(data, host, data.model);
      const prov = data.provider === 'gemini' ? 'Gemini' : 'OpenAI';
      if (statusEl) statusEl.textContent = 'Fresh ' + prov + ' analysis ready' + (data.model ? ' (model ' + data.model + ')' : '') + '.';
    } catch (e) {
      if (seq !== aiAnalyzeSeq) return;
      let msg = e && e.message ? e.message : String(e);
      // No response at all (fetch rejected or HTTP 404/405) means the local
      // server isn't being served — point the user at the exact command.
      if (/\bFailed to fetch\b|NetworkError|HTTP (404|405)\b/i.test(msg) || !msg) {
        msg = 'The AI server is not available. Start it with `python server.py` ' +
          '(see .env for your key and model), then open the app from that server.';
      }
      if (statusEl) statusEl.textContent = 'AI analysis failed: ' + msg + ' No stale result is shown — try again.';
      if (host) host.innerHTML = '<div class="rf-ai-err text-danger" style="font-size:0.8rem">' + escAttr(msg) + '</div>';
    } finally {
      if (seq === aiAnalyzeSeq && btn) { btn.disabled = false; btn.textContent = '🧠 Analyze with AI'; }
    }
  }

  function _aiList(items) {
    items = (Array.isArray(items) ? items : []).filter(s => s && String(s).trim());
    return items.length ? '<ul class="rf-ai-list">' + items.map(x => '<li>' + escAttr(x) + '</li>').join('') + '</ul>'
      : '<p class="text-muted rf-ai-none">None noted.</p>';
  }
  function _aiObjList(items, keys) {
    items = (Array.isArray(items) ? items : []).filter(o => o && keys.some(k => String(o[k] || '').trim()));
    if (!items.length) return '<p class="text-muted rf-ai-none">None noted.</p>';
    return '<ul class="rf-ai-list">' + items.map(o => {
      const main = keys.map(k => o[k]).map(String).join(' · ').trim();
      const conf = o.confidence === 'inferred' ? ' <span class="rf-ai-inferred">(inferred)</span>' : '';
      return '<li>' + escAttr(main) + conf + '</li>';
    }).join('') + '</ul>';
  }
  function renderAiAnalysis(data, host, model) {
    if (!host) return;
    const a = data.analysis || {};
    const sec = (title, body) => body ? `<div class="rf-ai-sec"><h6>${escAttr(title)}</h6>${body}</div>` : '';
    host.innerHTML =
      (a.candidate_summary ? `<div class="rf-ai-sec"><h6>Candidate summary</h6><p class="rf-ai-summary">${escAttr(a.candidate_summary)}</p></div>` : '') +
      sec('Employment history', _aiObjList(a.employment_history, ['role', 'employer', 'dates', 'notes'])) +
      sec('Experience & skills (with evidence)', _aiObjList(a.experience_and_skills, ['item', 'evidence'])) +
      sec('Education & certifications', _aiList(a.education_and_certifications)) +
      sec('Achievements (as stated)', _aiObjList(a.achievements, ['achievement', 'evidence'])) +
      sec('Strengths', _aiList(a.strengths)) +
      sec('Transferable skills', _aiList(a.transferable_skills)) +
      sec('Gaps vs. the job description', _aiList(a.missing_relative_to_jd)) +
      sec('ATS & formatting concerns', _aiList(a.ats_concerns)) +
      sec('Missing / ambiguous information', _aiList(a.missing_or_ambiguous)) +
      sec('Recommendations', _aiList(a.recommendations));
    host.insertAdjacentHTML('beforeend',
      `<p class="rf-ai-model text-muted" style="font-size:0.7rem">Generated by ${escAttr(model || 'AI')} — estimates are labeled; nothing is invented.</p>`);
  }

  resumeResults.addEventListener('click', e => {
    if (e.target.closest('#aiCoachBtn')) { runAiCoach(); return; }
    if (e.target.closest('#aiAnalyzeBtn')) { runAiAnalyze(); return; }
    const applyBtn = e.target.closest('[data-apply-fix]');
    const copyBtn = e.target.closest('[data-copy-fix]');
    if (applyBtn) applyVitalsFix(applyBtn.dataset.kind, +applyBtn.dataset.applyFix, applyBtn);
    else if (copyBtn) copyVitalsFix(copyBtn.dataset.kind, +copyBtn.dataset.copyFix, copyBtn);
  });

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
  const discoveryClearProfileBtn = document.getElementById('discoveryClearProfileBtn');
  const jobInputMessage = document.getElementById('jobInputMessage');

  // Application Tracker element references (previously relied on implicit
  // window.<id> globals — now declared explicitly)
  const cancelAppBtn = document.getElementById('cancelAppBtn');
  const appForm = document.getElementById('appForm');
  const appCompany = document.getElementById('appCompany');
  const appRole = document.getElementById('appRole');
  const appDate = document.getElementById('appDate');
  const appLink = document.getElementById('appLink');
  const appStatus = document.getElementById('appStatus');
  const appNotes = document.getElementById('appNotes');
  const applicationsList = document.getElementById('applicationsList');

  // Tab buttons
  const tabButtons = {
    resumeAnalysis: document.getElementById('resume-tab'),
    jobAnalysis: document.getElementById('job-tab'),
    matchCalculation: document.getElementById('match-tab'),
    applicationTracker: document.getElementById('tracker-tab'),
    jobDiscovery: document.getElementById('discovery-tab'),
    plannerAnalysis: document.getElementById('planner-tab'),
    studioAnalysis: document.getElementById('studio-tab')
  };

  const tabPanes = {
    resumeAnalysis: document.getElementById('resume-panel'),
    jobAnalysis: document.getElementById('job-panel'),
    matchCalculation: document.getElementById('match-panel'),
    applicationTracker: document.getElementById('tracker-panel'),
    jobDiscovery: document.getElementById('discovery-panel'),
    plannerAnalysis: document.getElementById('planner-panel'),
    studioAnalysis: document.getElementById('studio-panel')
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
    // Persist active tab so page refresh restores it
    try { localStorage.setItem('careeraiActiveTab', tabName); } catch (e) { /* storage unavailable */ }
    // Studio re-renders on activation so drafts/profile changes are fresh.
    if (tabName === 'studioAnalysis' && typeof renderStudio === 'function') renderStudio();
  }

  // Attach direct click handlers to every tab button
  Object.keys(tabButtons).forEach(key => {
    tabButtons[key].addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      switchTab(key);
    });
  });

  // Load applications from localStorage on startup.
  // Keeps every valid entry; drops (never blanks) malformed ones.
  function loadApplications() {
    try {
      const data = localStorage.getItem('jobApplications');
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed.filter(a => a && typeof a === 'object') : [];
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
      // An uploaded file is the user's own resume (Rule 3 provenance).
      resumeSource = 'user';
      resumeSourceLabel = file.name;

      // Show success message with filename
      resumeInputMessage.innerHTML = `<div class="alert alert-success alert-dismissible fade show mb-0" role="alert">
        <i class="bi bi-check-circle me-2"></i>Resume text loaded from <strong>${file.name}</strong> — this is the same profile used by all features.
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
    console.log('[Analyze Resume] Handler started');
    const resumeText = resumeInput.value.trim();
    console.log('[Analyze Resume] resumeText length:', resumeText.length);
    if (resumeText) {
      console.log('[Analyze Resume] resumeText not empty');
      resumeData = parseResume(resumeText);
      analyzedResumeSig = inputSig(resumeText);
      console.log('[Analyze Resume] resumeData keys length:', Object.keys(resumeData).length);
      console.log('[Analyze Resume] resumeSource:', resumeSource);
      // Rule 3: choosing a sample must not silently replace the user's own
      // saved resume. If this text came from a sample AND a real (user)
      // profile is already saved, ask before overwriting it.
      if (resumeSource === 'sample') {
        const prior = loadResumeMeta();
        if (prior && prior.source === 'user') {
          const keepGoing = confirm(
            'You previously saved your own resume on this device. Analyzing the sample "' +
            (resumeSourceLabel || 'sample') + '" will replace that saved profile. Continue?');
          if (!keepGoing) {
            console.log('[Analyze Resume] Sample branch: user declined to replace profile');
            // Keep the sample in memory for this session only; do not overwrite
            // the saved user profile.
            console.log('[Analyze Resume] About to call updateResumeAnalysisUI');
            updateResumeAnalysisUI();
            console.log('[Analyze Resume] After updateResumeAnalysisUI');
            console.log('[Analyze Resume] resumeResultsCard has d-none:', document.getElementById('resumeResultsCard')?.classList.contains('d-none'));
            console.log('[Analyze Resume] careerFitCard has d-none:', document.getElementById('careerFitCard')?.classList.contains('d-none'));
            document.getElementById('resumeResultsCard').classList.remove('d-none');
            document.getElementById('careerFitCard').classList.remove('d-none');
            repopulateMatchRoleFilter(); // relevance-filter target roles for this resume
            if (document.getElementById('targetRoleSelect')?.value) assessTargetRole(); // only a role the user explicitly chose
            console.log('[Analyze Resume] After removing d-none');
            resumeInputMessage.innerHTML =
              '<div class="alert alert-info mb-0"><strong>Sample analyzed for this session only.</strong> ' +
              'Your saved resume was NOT replaced. To make the sample your profile, click Analyze again and confirm.</div>';
            switchTab('resumeAnalysis');
            console.log('[Analyze Resume] After switchTab');
            return;
          }
        }
      }

      saveResumeProfile(resumeData);
      updateResumeAnalysisUI();
      // A fresh resume profile changes who we're matching: drop any targets
      // that were auto-picked for a previous profile (user choices survive).
      discPruneStaleAutoTargets();
      renderDiscoveryUI();
      // Show results panels after analysis
      console.log('[Analyze Resume] Before removing d-none: resumeResultsCard d-none:', document.getElementById('resumeResultsCard')?.classList.contains('d-none'));
      console.log('[Analyze Resume] Before removing d-none: careerFitCard d-none:', document.getElementById('careerFitCard')?.classList.contains('d-none'));
      document.getElementById('resumeResultsCard').classList.remove('d-none');
      document.getElementById('careerFitCard').classList.remove('d-none');
      repopulateMatchRoleFilter(); // relevance-filter target roles for this resume
      if (document.getElementById('targetRoleSelect')?.value) assessTargetRole(); // only a role the user explicitly chose
      console.log('[Analyze Resume] After removing d-none: resumeResultsCard d-none:', document.getElementById('resumeResultsCard')?.classList.contains('d-none'));
      console.log('[Analyze Resume] After removing d-none: careerFitCard d-none:', document.getElementById('careerFitCard')?.classList.contains('d-none'));

      // Switch to resume analysis tab
      console.log('[Analyze Resume] About to call switchTab');
      switchTab('resumeAnalysis');
      console.log('[Analyze Resume] After switchTab');
      console.log('[Analyze Resume] Final resumeResultsCard d-none:', document.getElementById('resumeResultsCard')?.classList.contains('d-none'));
      console.log('[Analyze Resume] Final careerFitCard d-none:', document.getElementById('careerFitCard')?.classList.contains('d-none'));
    } else {
      console.log('[Analyze Resume] resumeText empty');
      alert('Please enter your resume text');
    }
  });

  // Keep in-progress editor text refresh-safe: if the user is typing
  // something different from the last analyzed profile, save it as a draft
  // so an accidental refresh doesn't hand them the old text back.
  let resumeDraftTimer = null;
  resumeInput.addEventListener('input', () => {
    clearTimeout(resumeDraftTimer);
    resumeDraftTimer = setTimeout(() => {
      const text = resumeInput.value;
      const saved = getSavedResumeProfile();
      const savedRaw = saved ? (saved.rawText || '') : '';
      if (!text.trim()) {
        // Editor emptied: nothing to keep — a refresh leaves the box empty and
        // the saved profile (if any) is offered via "Restore into editor".
        clearResumeDraft();
        return;
      }
      if (text !== savedRaw) saveResumeDraft(text);
      else clearResumeDraft();
      // After a "Clear saved profile" the button was disabled — any new text
      // makes Analyze usable again.
      document.getElementById('analyzeResumeBtn').disabled = false;
    }, 500);
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
        // Explicitly identify this as a deliberate sample choice (Rule 3).
        resumeSource = 'sample';
        resumeSourceLabel = resumeSample.options[resumeSample.selectedIndex].text;

        // Show success message
        resumeInputMessage.innerHTML = `<div class="alert alert-success alert-dismissible fade show mb-0" role="alert">
          <i class="bi bi-check-circle me-2"></i>Sample resume loaded: <strong>${resumeSample.options[resumeSample.selectedIndex].text}</strong>
          <small class="d-block mt-1">This is a sample, not your resume. When you analyze it, every result will be clearly labelled as using this sample.</small>
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

  // Manually typing into the resume editor means it's the user's own text,
  // not a sample (Rule 3: distinguish sample vs. user-supplied).
  resumeInput.addEventListener('input', () => {
    resumeSource = 'user';
    resumeSourceLabel = '';
  });

  // Analyze job description button handler
  analyzeJobBtn.addEventListener('click', () => {
    const jobDescText = jobInput.value.trim();
    if (jobDescText) {
      careerFitData = parseJobDescription(jobDescText);
      analyzedJdSig = inputSig(jobDescText);
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
        // Explicitly identify this as a deliberate sample JD choice (Rule 3).
        jobSource = 'sample';
        jobSourceLabel = jobSample.options[jobSample.selectedIndex].text;

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

  // Pasting/typing into the JD editor marks it as user-supplied (Rule 3).
  jobInput.addEventListener('input', () => {
    jobSource = 'user';
    jobSourceLabel = '';
  });

  // --- Job Description: unified input handlers (URL import up top + source pills) ---
  const jdUploadBtn = document.getElementById('jdUploadBtn');
  const jdSampleToggleBtn = document.getElementById('jdSampleToggleBtn');
  const jdSampleRow = document.getElementById('jdSampleRow');
  const jobUrlInput = document.getElementById('jobUrlInput');
  const fetchJobUrlBtn = document.getElementById('fetchJobUrlBtn');
  const jdFileUpload = document.getElementById('jdFileUpload');
  const copyJobBtn = document.getElementById('copyJobBtn');

  // Upload pill → open the file dialog
  jdUploadBtn.addEventListener('click', () => jdFileUpload.click());

  // Sample pill → reveal the inline sample row
  jdSampleToggleBtn.addEventListener('click', () => {
    jdSampleRow.classList.toggle('d-none');
  });

  // Small helper to render feedback in the unified area
  function showJdMessage(type, html) {
    const cls = { success: 'alert-success', danger: 'alert-danger', info: 'alert-info' }[type] || 'alert-info';
    document.getElementById('jobInputMessage').innerHTML =
      `<div class="alert ${cls} alert-dismissible fade show mb-0" role="alert">${html}` +
      `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  }

  // --- Robust JD fetch pipeline: direct → reader service → HTML mirrors,
  //     each with per-attempt timeouts and anti-bot-page detection ---

  function fetchWithTimeout(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
  }

  // Turn raw HTML into clean, job-relevant text (density-aware extraction)
  function htmlToJobText(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style, noscript, template, iframe, svg, nav, footer, aside, button, form, [hidden], [aria-hidden="true"], [class*="cookie"], [id*="cookie"], [class*="modal"]').forEach(el => el.remove());

    let title = '';
    const og = doc.querySelector('meta[property="og:title"]');
    if (og && og.content) title = og.content.trim();
    else {
      const h1 = doc.querySelector('h1');
      if (h1) title = h1.textContent.trim();
    }

    // Job-page-specific containers first, then fall back to the largest text block
    const jobSelectors = 'main, article, [itemprop="description"], [itemprop="additionalDescription"], .s-description, .job-content, [class*="job-description"], [id*="job-description"], [class*="jobDescription"], [class*="job_details"], [class*="job-v2"], [class*="description"]';
    const candidates = [...doc.querySelectorAll(jobSelectors)]
      .map(el => ({ el, len: (el.innerText || '').length }))
      .filter(c => c.len > 200)
      .sort((a, b) => b.len - a.len);

    let body = candidates.length ? candidates[0].el.innerText : (doc.body ? doc.body.innerText : '');
    body = body.replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();

    if (title && body.toLowerCase().indexOf(title.toLowerCase().slice(0, 24)) !== 0) {
      body = title + '\n\n' + body;
    }
    return body;
  }

  // Cheap detection of anti-bot / block pages before we trust the content
  function looksLikeBlockPage(page) {
    const probe = String(page).slice(0, 4000).toLowerCase();
    return /access to this page has been denied|unusual traffic|verify you are human|are you a robot|attention required|just a moment|enable javascript and cookies/i.test(probe);
  }

  // Reject login shells / generic pages that are not actually a job description
  function looksLikeJobText(text) {
    const probe = text.toLowerCase().slice(0, 5000);
    const keywords = ['responsibilities', 'requirements', 'qualifications', 'experience',
      'salary', 'benefits', 'apply', 'candidate', 'skills', 'duties', 'about the role',
      'what you', 'you will', 'we are looking', 'job', 'position'];
    let hits = 0;
    keywords.forEach(k => { if (probe.includes(k)) hits++; });
    return hits >= 4;
  }

  // Strip Reader-service metadata lines so only the real text reaches the box
  function stripReaderHeaders(text) {
    return text
      .split('\n')
      .filter(line => !/^(title|url source|published time|markdown content|author|description)\s*:/i.test(line.trim()))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  fetchJobUrlBtn.addEventListener('click', async () => {
    let url = jobUrlInput.value.trim();
    if (!url) {
      showJdMessage('danger', '<i class="bi bi-exclamation-triangle me-2"></i>Please paste a valid job posting URL.');
      return;
    }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    let host = 'the page';
    try { host = new URL(url).hostname; } catch (e) {
      showJdMessage('danger', '<i class="bi bi-exclamation-triangle me-2"></i>That URL does not look valid — check for typos.');
      return;
    }

    const setStatus = msg => {
      document.getElementById('jobInputMessage').innerHTML =
        `<div class="alert alert-info mb-0"><span class="spinner-border spinner-border-sm me-2"></span>${msg}</div>`;
    };

    let gotText = false;

    // Step 1: direct fetch (free when the site sends CORS headers — many career pages do)
    setStatus(`Fetching from ${host}…`);
    try {
      const resp = await fetchWithTimeout(url, 12000);
      if (resp.ok) {
        const type = (resp.headers.get('content-type') || '').toLowerCase();
        const raw = await resp.text();
        if (type.includes('text/html') || /<html[\s>]/i.test(raw)) {
          const text = htmlToJobText(raw).trim();
          if (text.length >= 120 && !looksLikeBlockPage(raw) && looksLikeJobText(text)) {
            jobInput.value = text;
            showJdMessage('success', `<i class="bi bi-check-circle me-2"></i><strong>JD loaded from ${host}</strong> — ${text.length} characters. Click <strong>Analyze</strong> when ready.`);
            afterJdImport(url);
            gotText = true;
          }
        } else {
          const text = raw.trim();
          if (text.length >= 100) {
            jobInput.value = text;
            showJdMessage('success', `<i class="bi bi-check-circle me-2"></i><strong>JD loaded from ${host}</strong> (${text.length} characters, plain text). Click <strong>Analyze</strong> when ready.`);
            afterJdImport(url);
            gotText = true;
          }
        }
      }
    } catch (e) {
      /* most job sites block cross-origin direct fetches — fall through to mirrors */
    }
    if (gotText) return;

    // Step 2: Reader service (purpose-built for JS-heavy pages, often gets LinkedIn)
    setStatus(`Direct fetch blocked — trying the Reader service…`);
    try {
      const resp = await fetchWithTimeout(`https://r.jina.ai/${url}`, 25000);
      if (resp.ok) {
        let text = stripReaderHeaders((await resp.text()).trim());
        if (text.length >= 150 && looksLikeJobText(text) && !(/linkedin\.com/i.test(host) && /log in or sign up/i.test(text))) {
          jobInput.value = text;
          showJdMessage('success', `<i class="bi bi-check-circle me-2"></i><strong>JD loaded from ${host} via Reader</strong> — ${text.length} characters. Click <strong>Analyze</strong> when ready.`);
          afterJdImport(url);
          gotText = true;
        }
      }
    } catch (e) { /* fall through to mirrors */ }
    if (gotText) return;

    // Step 3: HTML mirrors, in order, with per-attempt timeouts
    const mirrors = [
      ['mirror 1', `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`],
      ['mirror 2', `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`],
      ['mirror 3', `https://corsproxy.io/?url=${encodeURIComponent(url)}`],
      ['mirror 4', `https://cors.eu.org/${encodeURIComponent(url)}`]
    ];
    for (const [label, proxyUrl] of mirrors) {
      setStatus(`Trying ${label}…`);
      try {
        const resp = await fetchWithTimeout(proxyUrl, 15000);
        if (!resp.ok) continue;
        const page = await resp.text();
        if (!page || page.length < 400) continue;
        if (looksLikeBlockPage(page)) continue;
        const text = htmlToJobText(page).trim();
        if (text.length >= 120 && looksLikeJobText(text)) {
          jobInput.value = text;
          showJdMessage('success', `<i class="bi bi-check-circle me-2"></i><strong>JD loaded from ${host}</strong> via ${label} — ${text.length} characters. Click <strong>Analyze</strong> when ready.`);
          afterJdImport(url);
          gotText = true;
          break;
        }
      } catch (e) { /* next mirror */ }
    }

    if (!gotText) {
      const source = detectJobSource(url);
      const isSearchPage = source === 'linkedin' && !/jobs\/view\//i.test(url);
      showJdMessage('danger',
        `<i class="bi bi-exclamation-triangle me-2"></i><strong>${host} didn't allow automatic import.</strong><br>` +
        `<small>${source.adviceHtml}${isSearchPage
          ? ' Also: LinkedIn <i>search</i> pages need a sign-in — a specific job link (…/jobs/view/…) usually imports fine. Try that instead.'
          : ''} Your link is kept in the field above; nothing you've entered is lost.</small>`);
    }
  });

  // Per-source import advice shown when automatic retrieval is blocked.
  // No bypassing — always a legitimate copy-paste fallback.
  function detectJobSource(url) {
    const u = (url || '').toLowerCase();
    if (u.includes('linkedin.com')) {
      return { name: 'linkedin', host: 'LinkedIn', adviceHtml:
        'Open the listing in your browser → press <b>Ctrl+A</b> then <b>Ctrl+C</b> (select the job text, not the whole page) → paste it into the job description box below. Specific job pages (…/jobs/view/…) can also be re-tried — they import more often than search results.' };
    }
    if (u.includes('indeed')) {
      return { name: 'indeed', host: 'Indeed', adviceHtml:
        'Indeed hides its listings behind scripts. Open the job → <b>Ctrl+A → Ctrl+C</b> on the job text → paste into the box below.' };
    }
    if (u.includes('naukri')) {
      return { name: 'naukri', host: 'Naukri', adviceHtml:
        'Naukri blocks automated access. Open the job in a new tab, select the description text, copy it and paste into the box below — it takes about 10 seconds.' };
    }
    if (u.includes('monster')) {
      return { name: 'monster', host: 'Monster', adviceHtml:
        'Monster pages resisted automatic import. Open the listing → copy the job text → paste into the box below.' };
    }
    return { name: 'other', host: 'this site', adviceHtml:
      'This site blocks automated imports. The simple path: open the job listing → select the description text (<b>Ctrl+A → Ctrl+C</b>) → paste it into the box below.' };
  }

  // --- JD importer: review state + "analyze against my resume" workflow ---
  let jdSourceMeta = null; // { url, host, sourceName }

  function afterJdImport(url) {
    try {
      const host = new URL(/^https?:\/\//i.test(url) ? url : 'https://' + url).hostname;
      jdSourceMeta = { url, host, sourceName: detectJobSource(url).host };
      jobSource = 'url';
      jobSourceLabel = host;
    } catch (e) {
      jdSourceMeta = null;
      jobSource = 'user';
      jobSourceLabel = '';
    }
    openJdReview();
  }

  function escAttr(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Show the extracted details for review/correction. Runs on successful import
  // and on "Analyze Job Description"; reuses the app's own parsers.
  function openJdReview() {
    const text = jobInput.value.trim();
    if (!text) return;
    careerFitData = parseJobDescription(text);
    analyzedJdSig = inputSig(text);
    updateJobAnalysisUI();

    const title = extractJobTitle(text);
    let company = '';
    const coLine = text.match(/^(?:company|employer|organization)[:\s]\s*(.+)$/im);
    if (coLine) company = coLine[1].trim().slice(0, 60);
    if (!company) {
      // "<Role> at <Company>" first-line pattern (common in reader output, e.g. "Data Analyst I at Honeywell")
      const firstLine = (text.split('\n').map(s => s.trim()).find(s => s.length > 3)) || '';
      const atMatch = firstLine.match(/^(?:title:\s*)?(?:[A-Za-z0-9&.,/' -]{2,60})?\s+at\s+([A-Z][A-Za-z0-9&.'-]+(?:\s+[A-Z][A-Za-z0-9&.'-]+)*?)(?:\s+—|,|$)/i);
      if (atMatch && atMatch[1] && atMatch[1].length <= 60) company = atMatch[1].trim();
    }
    let location = '';
    const locLine = text.match(/^(?:location|workplace|base)[:\s]\s*(.+)$/im);
    if (locLine) location = locLine[1].trim().slice(0, 80);
    else {
      const locMatch = text.toLowerCase().match(/\b(pune|bengaluru|bangalore|mumbai|hyderabad|delhi|gurgaon|noida|chennai|kolkata|ahmedabad|work from home|remote)\b/);
      if (locMatch) location = locMatch[0].replace(/\b\w/g, c => c.toUpperCase());
    }
    const clean = v => (v && v !== 'Not specified') ? v : '';
    const expReq = clean(careerFitData.experienceRequired);
    const eduReq = clean(careerFitData.educationRequired);
    const keySkills = [...new Set((careerFitData.keySkills || []).map(s => s.trim()).filter(Boolean))];
    const mustHaves = extractMustHaves(text);
    const respMatch = text.match(/(?:Responsibilities|What you.ll do|What you will do)[:\s]*\n?([\s\S]{0,1200})/i);
    const respLines = respMatch
      ? respMatch[1].split('\n').map(s => s.trim().replace(/^[\-\*•●\d+[)\.]\s*/, '')).filter(s => s.length > 12).slice(0, 5)
      : [];
    const quals = (careerFitData.requirements || []).slice(0, 5);
    const jdKeywords = [...new Set((mustHaves.concat(keySkills)).map(s => s.trim()).filter(Boolean))].slice(0, 12);

    const chip = s => `<span class="chip" style="background:rgba(139,123,255,.12);border:1px solid rgba(139,123,255,.3);color:var(--ai-text);font-size:.75rem">${escAttr(s)}</span>`;
    const warnChip = s => `<span class="chip" style="background:rgba(255,180,84,.12);border:1px solid rgba(255,180,84,.3);color:var(--warn);font-size:.75rem">${escAttr(s)}</span>`;
    const listBlock = (head, items) => items.length
      ? `<div class="jd-review-list"><h6>${head} <span class="text-muted" style="font-weight:400;font-size:.7rem">(${items.length})</span></h6><ul>${items.map(l => `<li>${escAttr(l).slice(0, 140)}</li>`).join('')}</ul></div>`
      : '';

    const review = document.getElementById('jdReview');
    review.classList.remove('d-none');
    review.innerHTML = `
      <div class="jd-review-head">
        <h5>Extracted details</h5>
        <span class="jd-review-hint">Click any field to correct it before you analyze</span>
      </div>
      ${jdSourceMeta ? `<div class="jd-source-chip">Imported from ${escAttr(jdSourceMeta.sourceName)} · <a href="${escAttr(jdSourceMeta.url)}" target="_blank" rel="noopener noreferrer">${escAttr(jdSourceMeta.host)}</a></div>` : ''}
      <div class="jd-review-grid">
        <label>Job title<input id="jdReviewTitle" value="${escAttr(title)}"></label>
        <label>Company<input id="jdReviewCompany" value="${escAttr(company)}"></label>
        <label>Location<input id="jdReviewLocation" value="${escAttr(location)}"></label>
        <label>Experience required<input id="jdReviewExp" value="${escAttr(expReq)}" placeholder="e.g. 2+ years"></label>
        <label>Education required<input id="jdReviewEdu" value="${escAttr(eduReq)}" placeholder="e.g. Bachelor's degree"></label>
      </div>
      ${mustHaves.length ? `<div class="jd-chip-row"><span class="jd-chip-label">Must-have skills</span><div class="skill-chips">${mustHaves.map(warnChip).join('')}</div></div>` : ''}
      ${keySkills.length ? `<div class="jd-chip-row"><span class="jd-chip-label">All detected skills (${keySkills.length})</span><div class="skill-chips">${keySkills.slice(0, 18).map(chip).join('')}</div></div>` : ''}
      ${listBlock('Key responsibilities', respLines)}
      ${listBlock('Qualifications / requirements', quals)}
      ${jdKeywords.length ? `<div class="jd-chip-row"><span class="jd-chip-label">Important keywords</span><div class="skill-chips">${jdKeywords.map(chip).join('')}</div></div>` : ''}
    `;
    review.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Outcome card inside the JD panel — reuses the same match functions as
  // Match Analysis (no duplicate scoring logic).
  function renderJdOutcome() {
    const skills = (careerFitData.keySkills || []).map(s => s.trim()).filter(Boolean);
    const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase().trim());
    const matched = [], missing = [];
    skills.forEach(s => {
      const j = s.toLowerCase().trim();
      const hit = j.length > 2 && resumeSkills.some(r => r.includes(j) || j.includes(r));
      (hit ? matched : missing).push(s);
    });

    const skillsMatch = calculateSkillsMatch(resumeData.skills, skills);
    const expMatch = calculateExperienceMatch(effectiveExperience(resumeData).years, careerFitData.experienceRequired);
    const eduMatch = calculateEducationMatch(resumeData.education, careerFitData.educationRequired);
    const overall = Math.round(skillsMatch * 40 + expMatch * 40 + eduMatch * 20);
    const verdict = overall >= 80 ? 'Strong match' : overall >= 60 ? 'Good match' : overall >= 40 ? 'Fair match' : 'Early match';
    const barColor = overall >= 80 ? 'var(--accent)' : overall >= 60 ? 'var(--warn)' : '#FF6B6B';
    const chip = s => `<span class="chip" style="background:rgba(200,245,74,.08);border:1px solid rgba(200,245,74,.3);color:var(--text);font-size:.75rem">${escAttr(s)}</span>`;
    const missChip = s => `<span class="chip" style="background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.35);color:#FF9999;font-size:.75rem">${escAttr(s)}</span>`;

    // Honest, no-invention tailoring guidance
    const tailoring = [];
    missing.slice(0, 4).forEach(s => tailoring.push(`If you've used or learned “${s}” anywhere — work, projects, coursework — add it to your skills section; this JD names it explicitly.`));
    if (expMatch < 0.7 && careerFitData.experienceRequired && careerFitData.experienceRequired !== 'Not specified') {
      tailoring.push(`The role asks for ${careerFitData.experienceRequired}; you show ${displayExperience(resumeData).text} overall. Frame your most relevant work with this JD's own wording — no invented years, just sharper relevance.`);
    }
    if (eduMatch < 0.7 && careerFitData.educationRequired && careerFitData.educationRequired !== 'Not specified') {
      tailoring.push(`Make your ${careerFitData.educationRequired} credential visible near the top of your resume where it can't be missed.`);
    }
    if (!tailoring.length) tailoring.push('No material gaps detected — tailor the top third of your resume to this JD’s wording before applying.');

    const outcome = document.getElementById('jdOutcome');
    outcome.classList.remove('d-none');
    // Rule 1/3: make clear exactly which resume this outcome is against.
    const provFlag = resumeIsRestoredSaved()
      ? '<div class="alert alert-info mb-2" style="font-size:.8rem"><strong>Note:</strong> using your <strong>saved resume profile from a previous session</strong>. Open <a href="#" id="jdGoResumeProv">Resume</a> to replace it before trusting this match.</div>'
      : '';
    outcome.innerHTML = `
      ${provFlag}
      <div class="jd-out-prov" style="font-size:.78rem;color:var(--muted);margin-bottom:10px">Matching <strong style="color:var(--text)">${escAttr(resumeSourceText())}</strong> against <strong style="color:var(--text)">${escAttr(jobSourceText())}</strong></div>
      <div class="jd-out-score" style="color:${barColor}">
        <span class="jd-out-num">${overall}%</span>
        <div>
          <div class="jd-out-verdict">${verdict}</div>
          <div class="text-muted" style="font-size:.75rem">Skills ${Math.round(skillsMatch * 100)}% · Experience ${Math.round(expMatch * 100)}% · Education ${Math.round(eduMatch * 100)}% — same weights as Match Analysis</div>
        </div>
      </div>
      <div class="jd-out-bars">
        <div class="jd-out-bar-row"><span>Skills</span><div class="jd-out-bar"><div style="width:${skillsMatch * 100}%;background:var(--accent)"></div></div><b>${Math.round(skillsMatch * 100)}%</b></div>
        <div class="jd-out-bar-row"><span>Experience</span><div class="jd-out-bar"><div style="width:${expMatch * 100}%;background:var(--ai)"></div></div><b>${Math.round(expMatch * 100)}%</b></div>
        <div class="jd-out-bar-row"><span>Education</span><div class="jd-out-bar"><div style="width:${eduMatch * 100}%;background:var(--warn)"></div></div><b>${Math.round(eduMatch * 100)}%</b></div>
      </div>
      ${matched.length ? `<div class="jd-chip-row"><span class="jd-chip-label">Matching skills (${matched.length})</span><div class="skill-chips">${matched.slice(0, 12).map(chip).join('')}</div></div>` : ''}
      ${missing.length ? `<div class="jd-chip-row"><span class="jd-chip-label" style="color:#FF9999">Missing or weak skills (${missing.length})</span><div class="skill-chips">${missing.slice(0, 12).map(missChip).join('')}</div></div>` : ''}
      ${missing.length ? `<p class="jd-out-note">Gap check: you don't currently list ${missing.slice(0, 3).map(s => '“' + escAttr(s) + '”').join(', ')}${missing.length > 3 ? ' and more' : ''}. You don't need all of them — lead with the closest ones and say so honestly.</p>` : '<p class="jd-out-note">No material skill gaps against this JD.</p>'}
      <div class="jd-tailor">
        <h6>How to tailor your resume for this role</h6>
        <ul>${tailoring.map(t => `<li>${escAttr(t)}</li>`).join('')}</ul>
        <small>No experience or achievements have been invented — every suggestion works from what's already in your resume.</small>
      </div>
      <button class="btn btn-outline-secondary w-100 jd-out-more" id="jdOpenFullMatchBtn">Open the full breakdown in Match Analysis</button>
    `;
    // Rule 4: open the canonical Match Analysis result (the match tab), not the
    // Resume tab. "Full breakdown" belongs with Match, not with resume UI.
    document.getElementById('jdOpenFullMatchBtn').addEventListener('click', () => {
      analyzeCareerFit();
      renderMatchResults();
      switchTab('matchCalculation');
      setTimeout(() => document.getElementById('matchResults')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    });
    document.getElementById('jdGoResumeProv')?.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('resumeAnalysis');
    });
  }

  const analyzeAgainstResumeBtn = document.getElementById('analyzeAgainstResumeBtn');
  analyzeAgainstResumeBtn.addEventListener('click', () => {
    // Rule 2: validate the JD prerequisite first.
    if (!jobInput.value.trim()) {
      showJdMessage('danger',
        '<strong>No job description yet.</strong> Analyze or select a job description before running this match. Use the sample picker, paste text, import a URL, or upload a file above.');
      return;
    }
    // Rule 2: validate the resume prerequisite.
    if (!resumeAvailable()) {
      switchTab('resumeAnalysis');
      showJdMessage('info',
        '<strong>To calculate your resume match, first upload, paste, or explicitly select a sample resume and analyze it</strong> on the Resume tab, then come back here.');
      return;
    }
    // Fold user corrections from the review state into the shared JD data
    careerFitData = parseJobDescription(jobInput.value.trim());
    analyzedJdSig = inputSig(jobInput.value.trim());
    const expFix = (document.getElementById('jdReviewExp') || {}).value || '';
    const eduFix = (document.getElementById('jdReviewEdu') || {}).value || '';
    if (expFix.trim()) careerFitData.experienceRequired = expFix.trim();
    if (eduFix.trim()) careerFitData.educationRequired = eduFix.trim();

    analyzeCareerFit();      // existing: updates Career Fit card + Match Analysis panel
    renderJdOutcome();       // new compact outcome inside the JD panel
    document.getElementById('jdOutcome').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // "Analyze Job Description" (existing button) now also surfaces the review state
  analyzeJobBtn.addEventListener('click', () => {
    const jobDescText = jobInput.value.trim();
    if (jobDescText) openJdReview();
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
      jobSource = 'file';
      jobSourceLabel = file.name;
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
    // Rule 2: validate prerequisites before computing anything. Never generate a
    // personalized score from a missing (or empty) input.
    if (!resumeAvailable() || !jobAvailable()) {
      renderMatchResults();   // renders the "what's missing + one action" guidance
      switchTab('matchCalculation');
      return;
    }
    analyzeCareerFit();
    renderMatchResults();
    switchTab('matchCalculation');
  });

  // --- Application tracker: add / edit / delete / quick status, one source of truth ---
  const APP_STATUSES = { applied: 'Applied', interviewing: 'Interviewing', offer: 'Offer Received', rejected: 'Rejected', withdrawn: 'Withdrawn' };

  function newAppId() {
    return 'app-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  }

  let editingAppId = null;

  function resetAppFormLabels() {
    editingAppId = null;
    const t = document.getElementById('appFormTitle');
    if (t) t.textContent = 'Add Application';
    const s = document.getElementById('saveAppLabel');
    if (s) s.textContent = 'Save Application';
    const c = document.getElementById('cancelAppLabel');
    if (c) c.textContent = 'Cancel';
  }

  addApplicationBtn.addEventListener('click', () => {
    if (appForm) appForm.reset();
    resetAppFormLabels();
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) applicationForm.classList.remove('d-none');
    addApplicationBtn.classList.add('d-none');
  });

  // Cancel never touches saved data — it just hides the form and resets fields
  if (cancelAppBtn) cancelAppBtn.addEventListener('click', () => {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) applicationForm.classList.add('d-none');
    addApplicationBtn.classList.remove('d-none');
    if (appForm) appForm.reset();
    resetAppFormLabels();
  });

  // Fill the form for an existing entry (Edit action)
  function startEditApp(app) {
    if (!app || !app.id) return;
    editingAppId = app.id;
    if (appCompany) appCompany.value = app.company || '';
    if (appRole) appRole.value = app.role || '';
    if (appDate) appDate.value = app.date || '';
    if (appLink) appLink.value = app.link || '';
    if (appStatus) appStatus.value = APP_STATUSES[app.status] ? app.status : 'applied';
    if (appNotes) appNotes.value = app.notes || '';
    const t = document.getElementById('appFormTitle');
    if (t) t.textContent = 'Edit Application — ' + (app.role || '') + ' @ ' + (app.company || '');
    const s = document.getElementById('saveAppLabel');
    if (s) s.textContent = 'Save Changes';
    const c = document.getElementById('cancelAppLabel');
    if (c) c.textContent = 'Cancel (keep saved data)';
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) applicationForm.classList.remove('d-none');
    addApplicationBtn.classList.add('d-none');
  }

  if (appForm) appForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const application = {
      company: (appCompany.value || '').trim(),
      role: (appRole.value || '').trim(),
      date: appDate.value,
      link: (appLink.value || '').trim(),
      status: appStatus.value,
      notes: (appNotes.value || '').trim()
    };

    // Validate required fields
    if (!application.company || !application.role || !application.date) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate date is reasonable (not too far in past/future)
    if (application.date) {
      const today = new Date();
      const inputDate = new Date(application.date);
      const timeDiff = Math.abs(inputDate.getTime() - today.getTime());
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      const maxDays = 5 * 365; // 5 years
      
      if (dayDiff > maxDays) {
        alert('Please enter a reasonable date (within 5 years of today)');
        return;
      }
    }

    // Validate URL format if provided
    if (application.link && application.link.trim() !== '') {
      try {
        new URL(application.link);
      } catch (e) {
        alert('Please enter a valid URL for the job link (including http:// or https://)');
        return;
      }
    }

    if (editingAppId) {
      // Update the existing entry in place — never create a duplicate
      const idx = jobApplications.findIndex(a => a && a.id === editingAppId);
      if (idx !== -1) {
        jobApplications[idx] = Object.assign({}, jobApplications[idx], application, { id: editingAppId });
      } else {
        application.id = editingAppId; // entry somehow lost — keep the same id, no new one
        jobApplications.push(application);
      }
    } else {
      application.id = newAppId();
      jobApplications.push(application);
    }

    saveApplications(jobApplications);
    renderApplicationsList();

    if (appForm) appForm.reset();
    resetAppFormLabels();
    const applicationFormDiv = document.getElementById('applicationForm');
    if (applicationFormDiv) applicationFormDiv.classList.add('d-none');
    addApplicationBtn.classList.remove('d-none');
  });

  // Quick status change from the list — persists immediately, survives refresh
  function setAppStatus(appId, value) {
    const app = jobApplications.find(a => a && a.id === appId);
    if (!app || !APP_STATUSES[value]) return;
    app.status = value;
    saveApplications(jobApplications);
    renderApplicationsList();
  }

  function deleteApp(appId) {
    const app = jobApplications.find(a => a && a.id === appId);
    if (!app) return;
    if (!confirm('Delete application: ' + (app.role || '') + ' at ' + (app.company || '') + '? This cannot be undone.')) return;
    jobApplications = jobApplications.filter(a => !(a && a.id === appId));
    saveApplications(jobApplications);
    renderApplicationsList();
  }

  // Discovery panel handlers — shared with the main profile (one source of truth)
  discoveryClearProfileBtn.addEventListener('click', () => {
    clearSavedProfile();
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

      // Save into the app-wide shared profile (same key Resume Analysis uses)
      const parsed = parseResume(text);
      resumeData = parsed;
      resumeSource = 'user';
      resumeSourceLabel = file.name;
      analyzedResumeSig = inputSig(text);
      saveResumeProfile(parsed);
      localStorage.removeItem('discoveryResumeProfile');
      discoveryResumeStatus.innerHTML =
        '<p class="text-success">Resume profile saved — same profile used by Resume Analysis, Match, and Discovery.</p>';

      // The resume now drives Discovery: drop stale auto-targets, refresh
      // recommendations, and build personalized search links immediately.
      discPruneStaleAutoTargets();
      renderDiscoveryUI();
      findRelevantJobs();
    } catch (error) {
      discoveryResumeStatus.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
      console.error('Discovery resume upload error:', error);
    }
  });

  clearFiltersBtn.addEventListener('click', () => {
    document.getElementById('discLocationFilter').value = '';
    document.getElementById('discSalaryMin').value = '';
    document.getElementById('discSalaryMax').value = '';
    document.getElementById('discExperience').value = '';
    findRelevantJobs();
  });

  findJobsBtn.addEventListener('click', () => {
    findRelevantJobs();
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
      // Persist provenance so the next startup can identify this profile
      // (a sample chosen before, or the user's own resume) instead of being
      // silent about it.
      localStorage.setItem('resumeProfileMeta', JSON.stringify({
        source: resumeSource || 'user',
        label: resumeSourceLabel || '',
        savedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to save resume profile:', e);
      return;
    }
    // The editor now matches the profile again — no stale draft to keep.
    clearResumeDraft();
    // In-session notification only: the user just created/replaced a profile,
    // so it's useful to tell them once. It does NOT re-appear on refresh.
    showProfileBanner();
  }

  // --- Unanalyzed editor draft (separate from the saved/analyzed profile) ---
  // The draft keeps text the user typed but hasn't analyzed yet, so an
  // accidental refresh never silently swaps it back to the last saved
  // profile. Cleared whenever a profile is saved, the saved profile is
  // restored into the editor, or the user manually clears storage.
  const RESUME_DRAFT_KEY = 'resumeEditorDraft';
  function saveResumeDraft(text) {
    try {
      const t = (text || '').trim();
      if (t) localStorage.setItem(RESUME_DRAFT_KEY, t);
      else localStorage.removeItem(RESUME_DRAFT_KEY);
    } catch (e) { /* storage unavailable */ }
  }
  function loadResumeDraft() {
    try { return localStorage.getItem(RESUME_DRAFT_KEY) || ''; } catch (e) { return ''; }
  }
  function clearResumeDraft() {
    try { localStorage.removeItem(RESUME_DRAFT_KEY); } catch (e) { /* ignore */ }
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

  // Load the provenance metadata saved alongside the profile.
  function loadResumeMeta() {
    try {
      const m = JSON.parse(localStorage.getItem('resumeProfileMeta') || 'null');
      return (m && typeof m === 'object') ? m : null;
    } catch (e) { return null; }
  }

  // The one saved-profile source of truth. Validated so corrupt/legacy data
  // degrades to "no profile" instead of crashing dependent features.
  function getSavedResumeProfile() {
    try {
      const data = JSON.parse(localStorage.getItem('resumeProfile') || 'null');
      if (data && typeof data === 'object' && !Array.isArray(data) &&
          (Array.isArray(data.skills) || typeof data.totalExperience === 'number')) {
        return data;
      }
    } catch (e) { /* corrupt stored data — treat as absent */ }
    return null;
  }

  // Discovery's minimal view ({skills, experience, education, contactInfo})
  // derived from the shared profile; falls back to the legacy key once.
  function getDiscoveryProfile() {
    const full = getSavedResumeProfile();
    if (full) {
      return {
        skills: Array.isArray(full.skills) ? full.skills : [],
        experience: effectiveExperience(full).years,
        education: Array.isArray(full.education) ? full.education.length : 0,
        contactInfo: full.contactInfo || {}
      };
    }
    try {
      const legacy = JSON.parse(localStorage.getItem('discoveryResumeProfile') || 'null');
      if (legacy && typeof legacy === 'object') {
        return {
          skills: Array.isArray(legacy.skills) ? legacy.skills : [],
          experience: Number(legacy.experience) || 0,
          education: Array.isArray(legacy.education) ? legacy.education : Number(legacy.education) || 0,
          contactInfo: legacy.contactInfo || {}
        };
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  // Clear the shared saved profile everywhere (editor re-save replaces it later)
  function clearSavedProfile() {
    // A draft that is the SAME text as the profile being cleared is stale
    // residue — it must go with it, or a refresh would bring the "cleared"
    // profile back from the draft layer. A genuinely newer draft (different
    // text the user was still working on) is kept.
    const staleRaw = (getSavedResumeProfile() || {}).rawText || '';
    const draftNow = loadResumeDraft();
    if (!draftNow || draftNow === staleRaw) clearResumeDraft();
    localStorage.removeItem('resumeProfile');
    localStorage.removeItem('resumeProfileMeta');
    localStorage.removeItem('discoveryResumeProfile');
    resumeData = {};
    resumeSource = null;
    resumeSourceLabel = '';
    analyzedResumeSig = '';
    const banner = document.getElementById('profileBanner');
    if (banner) banner.classList.add('d-none');
    document.getElementById('resumeResultsCard').classList.add('d-none');
    document.getElementById('careerFitCard').classList.add('d-none');
    document.getElementById('career-fit-score').textContent = '0%';
    document.getElementById('career-fit-feedback').textContent = 'Analyze a job description to see how well your resume matches.';
    document.getElementById('career-fit-details').innerHTML =
      '<div class="text-center py-4"><p class="text-muted">Analyze your resume to see specific career fit details.</p></div>';
    const discStatus = document.getElementById('discoveryResumeStatus');
    if (discStatus) discStatus.innerHTML = '<p class="text-muted">No resume profile loaded</p>';
    repopulateMatchRoleFilter(); // no resume in memory → back to the full catalogue
    if (typeof targetRoleSelect !== 'undefined' && targetRoleSelect) targetRoleSelect.value = '';
    const roleSearchEl = document.getElementById('targetRoleSearch');
    if (roleSearchEl) roleSearchEl.value = '';
    // An explicit clear is a clean slate: empty the editor and disable Analyze
    // until new text is provided (a kept NEWER draft survives in storage and
    // reappears on refresh if the user had one).
    const inputEl = document.getElementById('resumeInput');
    if (inputEl) {
      inputEl.value = '';
      inputEl.disabled = false;
      document.getElementById('analyzeResumeBtn').disabled = true;
    }
    discTargets = new Set(); discCustomRole = '';
    discTargetsSave();
    renderDiscoveryUI();
  }

  // Show/hide the saved-profile banner (restore / clear / summary)
  function showProfileBanner() {
    const banner = document.getElementById('profileBanner');
    if (!banner) return;
    const saved = getSavedResumeProfile();
    if (!saved) { banner.classList.add('d-none'); return; }
    banner.classList.remove('d-none');

    const skillsCount = Array.isArray(saved.skills) ? saved.skills.length : 0;
    const years = Number(saved.totalExperience) || 0;
    const eduCount = Array.isArray(saved.education) ? saved.education.length : 0;
    document.getElementById('profileBannerSummary').textContent =
      `${skillsCount} skills · ${formatExperienceYears(years)} experience · ${eduCount} education entr${eduCount === 1 ? 'y' : 'ies'} — kept only in this browser`;

    const restoreBtn = document.getElementById('profileRestoreBtn');
    if (restoreBtn) restoreBtn.onclick = () => {
      const inputEl = document.getElementById('resumeInput');
      const raw = (saved && saved.rawText) ? saved.rawText : '';
      inputEl.value = raw;
      inputEl.disabled = false;
      document.getElementById('analyzeResumeBtn').disabled = false;
      document.getElementById('resumeInputMessage').innerHTML =
        `<div class="alert alert-info mb-0"><strong>Saved profile restored into the editor.</strong> ` +
        (raw
          ? 'Click <strong>Analyze Resume</strong> to refresh results and re-save the profile.'
          : 'The source text was not stored — paste your resume and click <strong>Analyze Resume</strong> to replace the profile.') +
        `</div>`;
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      clearResumeDraft(); // explicit restore wins over any pending draft
    };

    const clearBtn = document.getElementById('profileClearBtn');
    if (clearBtn) clearBtn.onclick = () => {
      clearSavedProfile();
      const msg = document.getElementById('resumeInputMessage');
      if (msg) msg.innerHTML = '<div class="alert alert-success mb-0">Saved profile cleared from this device — it will not come back on refresh. If you had unsaved draft text, it\'s still there. Analyzing a resume saves a fresh profile.</div>';
    };
  }

  // Load the saved profile on startup so Match / Career Fit / Discovery can
  // reuse it without re-uploading. Deliberately does NOT auto-run analysis —
  // results stay hidden until the user explicitly clicks "Analyze Resume".
  function loadResumeProfileAndUpdateUI() {
    const saved = getSavedResumeProfile();
    if (saved) {
      resumeData = saved;
      // This profile was NOT analyzed this session — mark it as a restored
      // saved profile so Match / Discovery can identify it (Rule 1). Keep the
      // original label if we recorded one (e.g. it was a saved sample).
      const meta = loadResumeMeta();
      resumeSource = 'saved';
      resumeSourceLabel = (meta && meta.label) ? meta.label : '';
      analyzedResumeSig = inputSig(saved.rawText || '');
    }
    // What lands in the editor on a refresh:
    //  · an unanalyzed DRAFT (your own work-in-progress) is restored — that's
    //    "where you left it";
    //  · a SAVED PROFILE is NOT re-filled silently: the editor stays empty and
    //    the profile banner offers "Restore into editor", so pasting a new
    //    resume and restoring the old one are both the user's choice.
    const inputEl = document.getElementById('resumeInput');
    const note = document.getElementById('resumeInputMessage');
    const raw = saved ? (saved.rawText || '') : '';
    const draft = loadResumeDraft();
    if (inputEl && !inputEl.value.trim()) {
      if (draft) {
        inputEl.value = draft;
        note.innerHTML =
          '<div class="text-muted" style="font-size:.85rem">Your unanalyzed draft is back — exactly where you left it. ' +
          'Click <strong>Analyze Resume</strong> to make it your profile, or paste a new resume to replace it.</div>';
        inputEl.disabled = false;
        document.getElementById('analyzeResumeBtn').disabled = false;
      } else if (raw) {
        note.innerHTML =
          '<div class="text-muted" style="font-size:.85rem">A saved profile is on this device — click <strong>Restore into editor</strong> to bring it back, or paste a new resume directly.</div>';
        inputEl.disabled = false;
        document.getElementById('analyzeResumeBtn').disabled = false;
        showProfileBanner(); // "Restore into editor" / "Clear saved profile"
      }
    }
    // No banner on startup: a saved profile should not nag the user on every
    // refresh. The banner is shown only when a profile is saved in THIS
    // session (see saveResumeProfile), or when the user restores one.
  }

  // Update resume analysis UI
  function updateResumeAnalysisUI() {
    if (Object.keys(resumeData).length === 0) return;

    // Calculate a resume quality score (simplified)
    const skillScore = Math.min(resumeData.skills.length * 5, 30); // Up to 30 points for skills
    const expScore = Math.min(effectiveExperience(resumeData).years * 3, 30); // Up to 30 points for experience
    const eduScore = resumeData.education.length > 0 ? 20 : 0; // 20 points for education
    const contactScore = (resumeData.contactInfo.email || resumeData.contactInfo.phone) ? 10 : 0; // 10 points for contact
    const resumeScoreValue = skillScore + expScore + eduScore + contactScore;

    const score = Math.round(resumeScoreValue);
    let feedback = '';
    let scoreColor = '';
    let scoreLabel = '';
    const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#C8F54A';
    if (score >= 80) {
      feedback = 'Strong resume with well-presented skills and experience. You are competitive in your target roles.';
      scoreColor = accentHex;
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

    // --- Vitals: what a recruiter actually scans for ---
    // One-line pastes use " / " or " · " as separators — split those into
    // lines. SPACE-only around the separator, deliberately: "\n· " must keep
    // its leading bullet marker, or real bullets lose their "·" prefix.
    const rawText0 = resumeData.rawText || '';
    const bulletLines = rawText0
      .replace(/ +\/ +/g, '\n')
      .replace(/ +· +/g, '\n')
      .replace(/ +• +/g, '\n')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
    let bullets = bulletLines.filter(line => BULLET_LINE_RE.test(line));
    let bulletSource = bullets.length > 0 ? 'markers' : 'none';
    // One-line pastes carry no explicit bullet markers: the phrases between
    // the "•"/"·" separators ARE the bullets. Skip sections that are clearly
    // headers (EDUCATION / SKILLS / …) so the meter only counts real bullets.
    if (bullets.length === 0 && (rawText0.match(/\n/g) || []).length < 3) {
      const segments = (/ +[•·] +/.test(rawText0)
        ? rawText0.replace(/ +[•·] +/g, '\n')
        : bulletLines.join('\n'))
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);
      bullets = segments.filter(l =>
        l.split(/\s+/).length >= 3 && l.length >= 12 &&
        !/\b(EDUCATION|EXPERIENCE|SKILLS|SUMMARY|OBJECTIVE|PROJECTS)\b/.test(l));
      if (bullets.length > 0) bulletSource = 'pasted';
    }
    // No marker lines at all (common after multi-line PDF/DOCX extraction):
    // fall back to the responsibilities parsed from employment entries, so
    // the meters reflect real work instead of a silent 0. Labeled, not hidden.
    if (bullets.length === 0) {
      bullets = ((resumeData.experience && resumeData.experience.dateRanges) || [])
        .map(range => (range.responsibilities || '').trim())
        .filter(Boolean)
        .map(text => text.replace(/\.+$/, ''));
      if (bullets.length > 0) bulletSource = 'parsed';
    }
    const quantified = bullets.filter(line => /\d/.test(line));
    const impactPct = bullets.length ? Math.round(quantified.length / bullets.length * 100) : 0;

    const actionVerbs = ['led', 'built', 'launched', 'drove', 'reduced', 'increased', 'improved',
      'automated', 'managed', 'created', 'delivered', 'optimized', 'identified', 'spearheaded',
      'streamlined', 'negotiated', 'secured', 'designed', 'implemented', 'owned', 'developed',
      'grew', 'cut', 'shipped', 'migrated', 'scaled', 'resolved', 'monitored', 'executed'];
    const strippedBullets = bullets.map(line => line.replace(BULLET_MARKER_STRIP_RE, '').trim());
    const startsWithVerb = s => actionVerbs.some(v => new RegExp('^' + v, 'i').test(s));
    const verbHits = strippedBullets.filter(startsWithVerb).length;
    const verbPct = bullets.length ? Math.round(verbHits / bullets.length * 100) : 0;
    // The full fix lists (every weak bullet, not just a few) are built right
    // after suggestVerb/verbSuggestions below, so each gets a content-matched
    // rewrite the user can edit and apply back into the editor.
    // Pick the verb that actually fits the bullet's own content.
    function suggestVerb(bullet) {
      const t = bullet.toLowerCase();
      if (/\b(managed|oversaw|supervised|led|ran|directed|headed)\b/.test(t)) return 'Led';
      if (/\b(built|created|developed|designed|developed)\b/.test(t)) return 'Built';
      if (/\b(tested|validated|reviewed|verified|audited|monitored)\b/.test(t)) return 'Validated';
      if (/\b(performed|conducted|executed|carried out)\b/.test(t)) return 'Executed';
      if (/\b(supported|assisted|helped|contributed|participated)\b/.test(t)) return 'Delivered';
      if (/\b(resolved|fixed|troubleshoot|debugged)\b/.test(t)) return 'Resolved';
      if (/\b(improved|optimi[sz]ed|increased|reduced|cut)\b/.test(t)) return 'Improved';
      if (/\b(automated|streamlined|integrated)\b/.test(t)) return 'Automated';
      if (/\b(report|document|analyz|analys)\w*/.test(t)) return 'Analysed';
      if (/\b(plan|schedul|coordinat)\w*/.test(t)) return 'Owned';
      return null;
    }
    const verbSuggestions = ['Led', 'Built', 'Automated', 'Reduced', 'Delivered', 'Owned', 'Executed', 'Improved'];

    // Full Impact fix list: EVERY numberless bullet, each with an editable
    // suggested rewrite. metricClauses rotate so the scaffold reads varied.
    const metricClauses = [
      'cutting cycle time by 30%',
      'saving ₹2L per month',
      'serving 12 clients with 40% fewer errors',
      'reducing turnaround by 45%'
    ];
    const impactFixes = bullets.map((line, i) => {
      if (/\d/.test(line)) return null;
      const marker = (line.match(BULLET_MARKER_STRIP_RE) || [''])[0] || '• ';
      const orig = line.replace(BULLET_MARKER_STRIP_RE, '').trim();
      return {
        marker,
        orig,
        suggested: orig.replace(/[.,;]\s*$/, '') + ', ' + metricClauses[i % metricClauses.length]
      };
    }).filter(Boolean);

    // Full Verb fix list: EVERY weak-opener bullet. The suggested verb is
    // chosen from the bullet's own content (suggestVerb), swapping only the
    // opening word — the user edits the rest before applying.
    const verbFixes = bullets.map((line, i) => {
      const marker = (line.match(BULLET_MARKER_STRIP_RE) || [''])[0] || '• ';
      const orig = line.replace(BULLET_MARKER_STRIP_RE, '').trim();
      if (orig.length < 4 || startsWithVerb(orig)) return null;
      const verb = (suggestVerb(orig) || verbSuggestions[i % verbSuggestions.length]).toLowerCase();
      const rest = orig.slice(orig.search(/\s/)).replace(/^\s+/, '');
      return { marker, orig, suggested: rest ? verb + ' ' + rest : verb };
    }).filter(Boolean);

    // Current fix lists for the delegated Apply/Copy handlers on #resumeResults.
    vitalsCtx = { impact: impactFixes, verb: verbFixes, ai: [] };
    lastAnalyzedRaw = resumeData.rawText || '';

    // Keyword coverage: against the TARGET ROLE when one is selected
    // (Match tab "Target Role" or first Planner role); otherwise a broad,
    // clearly-generic vocabulary — never presented as mandatory.
    let inDemandSkills;
    let atsVocabSource = 'generic';
    const matchRoleKey = targetRoleSelect ? targetRoleSelect.value : '';
    const targetRoleKey = matchRoleKey || (plannerData.selectedRoles && plannerData.selectedRoles[0]) || '';
    const atsRoleLabel = (targetRoleKey && ALL_ROLES_FLAT[targetRoleKey])
      ? (ALL_ROLES_FLAT[targetRoleKey].name || targetRoleKey) : '';
    if (targetRoleKey && ALL_ROLES_FLAT[targetRoleKey]) {
      inDemandSkills = [...new Set((ALL_ROLES_FLAT[targetRoleKey].skills || []).map(canonicalSkill))];
      atsVocabSource = 'target:' + targetRoleKey;
    }
    if (!inDemandSkills || inDemandSkills.length === 0) {
      inDemandSkills = ['excel', 'sql', 'python', 'power bi', 'tableau', 'google analytics',
        'data analysis', 'reporting', 'project management', 'stakeholder management',
        'process improvement', 'communication'];
    }
    const haveSet = new Set((resumeData.skills || []).map(canonicalSkill));
    const atsMissing = inDemandSkills.filter(s => !haveSet.has(s));
    const atsScore = Math.round((inDemandSkills.length - atsMissing.length) / inDemandSkills.length * 100);

    const impactCopy = bulletSource === 'none'
      ? 'No bullet lines detected yet — write 2–3 short bullets per role with measurable results.'
      : impactPct >= 70
        ? 'Strong — most of your bullets carry hard numbers. That\'s rare and recruiters notice it immediately.'
        : impactPct >= 40
          ? 'Decent base. A few more numbers on your top roles would make impact obvious at a glance.'
          : 'Low. Recruiters scan numbers first — add before/after figures to your top 3 bullets this week.' +
            (bulletSource === 'parsed' ? ' (These bullets were parsed from your job entries — visible in the editor, scored here.)' : '');

    const verbCopy = bulletSource === 'none'
      ? 'No bullets found to score. Once you add them, open each with a verb: "Led X", "Automated Y".'
      : verbPct >= 60
        ? 'Punchy openings throughout. Your bullets read like achievements, not job descriptions.'
        : verbPct >= 30
          ? 'Good start. Swap "responsible for…" openers for "led…", "built…", "reduced…" — same work, stronger read.'
          : 'Most bullets open weakly. Start with a verb: "Led X", "Automated Y" — instant credibility.';

    // Auto-detected standout tiles (top 3)
    const superpowers = [];
    if (resumeData.marketplacePlatforms.length >= 3) {
      superpowers.push({ icon: '🛒', title: `${resumeData.marketplacePlatforms.length}-marketplace operator`, desc: `Hands-on across ${resumeData.marketplacePlatforms.slice(0, 3).join(', ')} — a rare multi-platform profile.` });
    }
    if (resumeData.analytics.length >= 2) {
      superpowers.push({ icon: '📊', title: 'Analytics-ready', desc: `${resumeData.analytics.length} analytics skills detected (${resumeData.analytics.slice(0, 3).join(', ')}) — that's what analyst JDs actually ask for.` });
    }
    if (resumeData.technicalSkills.some(s => ['python', 'sql', 'etl', 'r'].includes(s))) {
      superpowers.push({ icon: '⚡', title: 'Automation edge', desc: 'You can code — one of the strongest differentiators at your level. Lead with it.' });
    }
    if (impactPct >= 60) {
      superpowers.push({ icon: '📈', title: 'You talk in numbers', desc: `${impactPct}% of your bullets carry a quantified result. Most resumes don't.` });
    }
    if (resumeData.totalExperience >= 2) {
      superpowers.push({ icon: '⏱', title: `${formatExperienceYears(resumeData.totalExperience)} of real ops`, desc: 'You clear the experience minimum for every analyst role in this tool.' });
    }
    if (resumeData.contactInfo.linkedin || resumeData.contactInfo.github) {
      superpowers.push({ icon: '🔗', title: 'Easy to verify', desc: 'Your profile links are present — hiring managers click these before shortlisting.' });
    }
    if (superpowers.length === 0) {
      superpowers.push({ icon: '🌱', title: 'Building your edge', desc: 'Few standout signals detected yet — each quick win below adds one.' });
    }

    // Ranked quick wins
    const quickWins = [];
    if (bulletSource === 'none') quickWins.push({ prio: 'high', action: 'Write 2–3 short bullets per role with measurable outcomes', payoff: 'Bullets are where recruiters see impact' });
    else if (impactPct < 60) quickWins.push({ prio: 'high', action: `Add numbers to your top 3 bullets (before → after, $ saved, % improved)`, payoff: 'Recruiters read numbers first — instant credibility lift' });
    const gapSkills = ['sql', 'power bi', 'tableau', 'excel', 'python'].filter(s => atsMissing.includes(s));
    if (gapSkills.length) quickWins.push({ prio: 'high', action: `Sprint on ${gapSkills.slice(0, 2).map(s => ({ sql: 'SQL', 'power bi': 'Power BI', 'kpi tracking': 'KPI tracking' }[s] || s.charAt(0).toUpperCase() + s.slice(1))).join(' + ')} (${playbookFor(gapSkills[0]).time})`,
      payoff: atsVocabSource === 'generic' ? 'Closes your biggest ATS gap — most analyst JDs list it'
        : `Closes the biggest gap against your target role (${atsRoleLabel})` });
    if (!haveSet.has('stakeholder management') && !haveSet.has('process improvement')) quickWins.push({ prio: 'med', action: 'Name the soft skills you already use: stakeholder management, process improvement', payoff: 'One line each — they are ATS keywords, not fluff' });
    if (verbPct < 50) quickWins.push({ prio: 'med', action: 'Rewrite bullet openers as action verbs (led, built, automated)', payoff: 'Turns duty-lists into achievements' });
    if (quickWins.length === 0) quickWins.push({ prio: 'low', action: 'Your resume is in strong shape — tailor the top third to each application', payoff: 'Keeps every submission JD-specific' });

    // --- ATS & HR norms: what an automated screener and an HR manager actually check ---
    const rawText = resumeData.rawText || '';
    const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
    const responsibleHits = (rawText.match(/responsible for/gi) || []).length;
    const firstPersonHits = (rawText.match(/\b(I|we|our|my|us)\b/gi) || []).length;

    const normChecks = [
      { ok: !!(resumeData.contactInfo && resumeData.contactInfo.email), label: 'Reachable', tip: 'No email detected — add a professional one; recruiters need a way to reach you' },
      { ok: wordCount >= 250 && wordCount <= 1500, label: wordCount ? `Length in sweet spot · ${wordCount} words` : 'Length in sweet spot', tip: wordCount < 250 ? 'Too thin — 400-800 words is the recruiter sweet spot' : 'Very long — trim to what a recruiter can scan in 15 seconds' },
      { ok: bulletSource === 'none' ? false : impactPct >= 50, label: bulletSource === 'none' ? 'No bullets detected' : 'Quantified impact', tip: bulletSource === 'none' ? 'No bullet lines were found — write 2–3 short bullets per role with measurable outcomes' : 'Fewer than half your bullets carry numbers — add before/after figures' },
      { ok: bulletSource === 'none' ? false : verbPct >= 50, label: bulletSource === 'none' ? 'No bullet openers to score' : 'Action-verb openers', tip: bulletSource === 'none' ? 'Once bullets exist, start them with led / built / automated' : 'Start bullets with led / built / automated, not "responsible for"' },
      { ok: responsibleHits === 0, label: 'No weak phrasing', tip: `${responsibleHits}× "responsible for" found — rewrite as owned outcomes` },
      { ok: firstPersonHits === 0, label: 'No first-person pronouns', tip: 'HR norm: a resume reads as fact, not as a letter to someone' },
      { ok: (resumeData.skills || []).length >= 10, label: 'Skill depth', tip: 'Add the tools you used in each role — depth is what an ATS ranks on' },
      {
        ok: atsScore >= 60,
        label: atsVocabSource === 'generic' ? 'Generic keyword coverage' : 'Target-role keywords',
        tip: atsVocabSource === 'generic'
          ? (atsMissing.length
            ? `Not detected: ${atsMissing.slice(0, 3).join(', ')} — coverage across a broad in-demand vocabulary; set a target role in the Match tab for a role-specific list`
            : 'Good coverage across a broad in-demand vocabulary')
          : `Against ${atsRoleLabel}: ${atsMissing.length ? 'missing ' + atsMissing.slice(0, 3).join(', ') + (atsMissing.length > 3 ? ', …' : '') : 'all detected'}`
      },
      { ok: (resumeData.education || []).length > 0, label: 'Education present', tip: 'List your degree(s) — many ATS filters require a match' },
      {
        ok: displayExperience(resumeData).label !== 'No dates found',
        label: 'Experience evidence',
        tip: displayExperience(resumeData).label === 'No dates found'
          ? 'Add date ranges (e.g., Jan 2019 – Present) or state total years of experience'
          : displayExperience(resumeData).label === 'Stated exp.'
            ? 'Your stated figure is used — add parseable date ranges (e.g., Mar 2019 – Present) so an ATS can verify it'
            : displayExperience(resumeData).label === 'Experience (<0.5y dated)'
              ? 'Less than half a year of parseable dates — add MM/YYYY ranges to make tenure machine-checkable'
              : 'Employment dates parsed — an ATS can compute your tenure'
      }
    ];
    const atsPass = normChecks.filter(c => c.ok).length;
    const atsReadiness = Math.round(atsPass / normChecks.length * 100);
    const atsVerdict = atsReadiness >= 80 ? 'HR-ready' : atsReadiness >= 60 ? 'Almost there' : 'Needs work';

    const levelWord = score >= 80 ? 'sharp' : score >= 60 ? 'solid' : score >= 40 ? 'developing' : 'early-stage';

    // Experience display label (Commit B item 1): presentation mapping only —
    // reads the profile-level experienceSource so sub-0.5y values show as
    // "dated but thin", never "no dates" and never a stated claim.
    const expStat = displayExperience(resumeData);

    // Skills the candidate stated (SKILLS/TOOLS sections) that keyword
    // detection did not already catch — shown as their own group, never
    // concatenated or folded silently into another category.
    const detectedSkills = new Set([...(resumeData.functionalSkills || []), ...(resumeData.technicalSkills || []),
      ...(resumeData.marketplacePlatforms || []), ...(resumeData.tools || []),
      ...(resumeData.analytics || []), ...(resumeData.transferableSkills || [])].map(canonicalSkill));
    const statedOnly = (resumeData.statedSkills || []).filter(s => !detectedSkills.has(canonicalSkill(s)));

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
              <span class="score-stat-val">${expStat.text}${expStat.label !== 'Experience' ? ' ' + expStat.label.toLowerCase() : ''}</span>
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

      <!-- Skill Sections Grid — only categories that actually detected
           something are shown; empty categories are dropped so an IT resume
           doesn't get "Marketplace: Not detected" noise. -->
      <div class="skill-grid">
        ${(function () {
          const sections = [
            { color: '#8B7BFF', name: 'Functional', skills: resumeData.functionalSkills },
            { color: '#C8F54A', name: 'Technical', skills: resumeData.technicalSkills },
            { color: '#FFB454', name: 'Marketplace', skills: resumeData.marketplacePlatforms },
            { color: '#5ECFE8', name: 'Tools', skills: resumeData.tools },
            { color: '#FF6B9D', name: 'Analytics', skills: resumeData.analytics },
            { color: '#A3A9B8', name: 'Transferable', skills: resumeData.transferableSkills },
            // Only when the candidate lists skills keyword-detection missed —
            // always its own labeled group, merged into nothing else.
            ...(statedOnly.length
              ? [{ color: '#7dd3a0', name: 'As listed by you', skills: statedOnly }]
              : [])
          ];
          const present = sections.filter(s => s.skills && s.skills.length > 0);
          if (!present.length) return '<div class="p-4"><span class="text-muted">No skills detected yet — add a skills section with concrete tools and technologies.</span></div>';
          return present.map(s => `
        <div class="skill-section">
          <div class="skill-section-header">
            <span class="skill-dot" style="background:${s.color}"></span>
            <span>${s.name}</span>
          </div>
          ${skillChips(s.skills)}
        </div>`).join('');
        })()}
      </div>

      <!-- ATS & HR norms -->
      <div class="ats-norms">
        <div class="ats-norms-head">
          <div class="ats-norms-score"><strong>${atsReadiness}%</strong><span>ATS &amp; HR (estimate)</span></div>
          <div>
            <h6>${atsVerdict} — ${atsPass} of ${normChecks.length} checks pass</h6>
            <p>${atsPass === normChecks.length
              ? 'A clean read for both the machine and the human. Keep it tailored per application and you’re in a strong spot.'
              : `Fix the ${normChecks.length - atsPass} flagged items below — each one is a filter an ATS or HR applies before a human sees your resume.`}</p>
          </div>
        </div>
        <div class="ats-checks">
          ${normChecks.map(c => `
            <div class="ats-check ${c.ok ? 'ok' : 'warn'}">
              <span class="ats-check-icon">${c.ok ? '✓' : '!'}</span>
              <div><strong>${c.label}</strong>${c.ok ? '' : `<span class="tip">${c.tip}</span>`}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- What a recruiter sees in 5 seconds -->
      <div class="rf-pitch">
        <span class="rf-pitch-label">What a recruiter sees in 5 seconds</span>
        <div>${levelWord} profile · ${expStat.text} · ${resumeData.skills.length} skills · ${bulletSource === 'none'
          ? 'no bullets detected'
          : quantified.length + '/' + bullets.length + ' quantified bullets' + (bulletSource === 'parsed' ? ' (parsed from your job entries)' : '')}</div>
      </div>

      <!-- Vitals band -->
      <div class="rf-band">
        <div class="rf-card">
          <h6>Impact Meter</h6>
          <div class="rf-meter"><div class="rf-meter-fill" style="width:${impactPct}%;background:${impactPct >= 60 ? 'var(--accent)' : 'var(--warn)'}"></div></div>
          <div class="rf-meter-row"><strong>${impactPct}%</strong> of bullets carry a number</div>
          <p>${impactCopy}</p>
          ${impactFixes.length ? `
            <div class="rf-fixes">
              <strong>Add a number to all ${impactFixes.length} of these</strong><br>
              <span class="text-muted">Edit any line, then <em>Apply</em> it into your resume or <em>Copy</em> it.</span>
              ${impactFixes.map((f, i) => `
                <div class="rf-fix">
                  <div class="rf-fix-orig">• “${escAttr(f.orig)}”</div>
                  <div class="rf-fix-row">
                    <input type="text" class="rf-fix-input" data-kind="impact" data-fix="${i}" value="${escAttr(f.suggested)}" aria-label="Suggested rewrite">
                    <button type="button" class="rf-fix-btn" data-kind="impact" data-apply-fix="${i}">Apply</button>
                    <button type="button" class="rf-fix-btn" data-kind="impact" data-copy-fix="${i}">Copy</button>
                  </div>
                </div>`).join('')}
            </div>` : ''}
        </div>
        <div class="rf-card">
          <h6>Verb Power</h6>
          <div class="rf-meter"><div class="rf-meter-fill" style="width:${verbPct}%;background:${verbPct >= 50 ? 'var(--accent)' : 'var(--warn)'}"></div></div>
          <div class="rf-meter-row"><strong>${verbPct}%</strong> open with an action verb</div>
          <p>${verbCopy}</p>
          ${verbFixes.length ? `
            <div class="rf-fixes">
              <strong>Reopen all ${verbFixes.length} weak bullets</strong><br>
              <span class="text-muted">Suggested verb is picked from the bullet's own words — edit the line, then <em>Apply</em> or <em>Copy</em>.</span>
              ${verbFixes.map((f, i) => `
                <div class="rf-fix">
                  <div class="rf-fix-orig">• “${escAttr(f.orig)}” → start with <em class="rf-fix-verb">${escAttr(f.suggested.split(' ')[0])}</em></div>
                  <div class="rf-fix-row">
                    <input type="text" class="rf-fix-input" data-kind="verb" data-fix="${i}" value="${escAttr(f.suggested)}" aria-label="Suggested rewrite">
                    <button type="button" class="rf-fix-btn" data-kind="verb" data-apply-fix="${i}">Apply</button>
                    <button type="button" class="rf-fix-btn" data-kind="verb" data-copy-fix="${i}">Copy</button>
                  </div>
                </div>`).join('')}
            </div>` : ''}
        </div>
        <div class="rf-card">
          <h6>ATS Keyword Radar <span class="text-muted" style="font-weight:400;font-size:0.72rem">${atsVocabSource === 'generic' ? '· in-demand set' : '· ' + escAttr(atsRoleLabel)}</span></h6>
          <div class="rf-dots">
            ${inDemandSkills.map(s => `<span class="rf-dot ${haveSet.has(s) ? 'on' : ''}">${({ sql: 'SQL', 'power bi': 'Power BI' }[s] || s.charAt(0).toUpperCase() + s.slice(1))}</span>`).join('')}
          </div>
          <p>${atsMissing.length
            ? atsVocabSource === 'generic'
              ? `Not detected: ${atsMissing.slice(0, 4).join(', ')}${atsMissing.length > 4 ? '…' : ''} — coverage across a broad in-demand vocabulary. Pick a target role in the Match tab for a role-specific list.`
              : `Against ${atsRoleLabel} — missing: ${atsMissing.slice(0, 4).join(', ')}${atsMissing.length > 4 ? '…' : ''}. Add these to stay aligned with your target role.`
            : atsVocabSource === 'generic'
              ? 'Full coverage of the in-demand set — you\'ll pass the keyword screen.'
              : `Full coverage of the ${atsRoleLabel} keyword set — you\'ll pass the keyword screen.`}</p>
        </div>
        <div class="rf-card">
          <h6>Your Superpowers</h6>
          <ul class="rf-pows">
            ${superpowers.slice(0, 3).map(p => `<li><span class="rf-pow-icon">${p.icon}</span><div><strong>${p.title}</strong><span>${p.desc}</span></div></li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- AI coach: optional full rewrites via local node server.js -->
      <div class="rf-ai">
        <div class="rf-ai-head">
          <h6>AI coach</h6>
          <span class="text-muted" style="font-size:0.7rem">Full, personalized rewrites — <code>node server.js</code> with a free key (Groq / Gemini) or local Ollama</span>
          <button type="button" class="rf-fix-btn" id="aiCoachBtn">✨ Get AI rewrites</button>
          <span class="rf-ai-providers text-muted" id="aiCoachProviders" style="font-size:0.72rem"></span>
          <span class="rf-ai-status text-muted" id="aiCoachStatus" style="font-size:0.72rem"></span>
        </div>
        <div id="aiCoachResults"></div>
      </div>

      <!-- AI analysis: fresh read via the local Python server.py (OpenAI or Gemini) -->
      <div class="rf-ai rf-ai-openai">
        <div class="rf-ai-head">
          <h6>AI analysis${aiProviderTag() ? ' (' + aiProviderTag() + ')' : ''}</h6>
          <span class="text-muted" style="font-size:0.7rem">A fresh AI read of this resume — needs <code>python server.py</code></span>
          <button type="button" class="rf-fix-btn" id="aiAnalyzeBtn">🧠 Analyze with AI</button>
          <span class="rf-ai-status text-muted" id="aiAnalyzeStatus" style="font-size:0.72rem"></span>
        </div>
        <p class="rf-ai-privacy text-muted" style="font-size:0.72rem">
          Running this sends <strong>your resume text</strong> (and the job description if present)
          to your configured AI provider for analysis. Nothing is stored by the app; each click makes a fresh request,
          and a failed request never shows an old result as new.
        </p>
        <div id="aiAnalyzeResults"></div>
      </div>

      <!-- Quick wins -->
      <div class="rf-quickwins">
        <h6>Quick Wins, Ranked by Payoff</h6>
        ${quickWins.slice(0, 3).map(w => `
        <div class="rf-win">
          <span class="rf-prio ${w.prio}">${w.prio === 'high' ? 'High' : w.prio === 'med' ? 'Med' : 'Low'}</span>
          <div><strong>${w.action}</strong><span>${w.payoff}</span></div>
        </div>`).join('')}
      </div>
    `;

    refreshAiCoachProviders(); // which free routes are live on the dev server

    // Animate the score ring + count-up number after DOM render
    const resumeScoreEl = document.getElementById('resume-score');
    if (resumeScoreEl) resumeScoreEl.textContent = '0%';
    setTimeout(() => {
      const resumeRing = document.getElementById('resumeScoreRing');
      if (resumeRing) {
        const circumference = 326.73;
        resumeRing.style.stroke = scoreColor;
        resumeRing.style.strokeDashoffset = circumference - (circumference * score / 100);
      }
      animateNumber(resumeScoreEl, score);
    }, 50);

    // Also update Career Fit experience fields when resume is analyzed
    if (totalExperience && relevantExperience && seniorityLevel) {
      totalExperience.textContent = expStat.label === 'Experience'
        ? expStat.text : expStat.text + ' ' + expStat.label.toLowerCase();
      relevantExperience.textContent = formatExperienceYears(resumeData.relevantExperience);

      // Determine seniority level (evidence-aware years; ladder thresholds unchanged)
      const seniorYears = effectiveExperience(resumeData).years;
      let level = 'Entry Level';
      if (seniorYears >= 8) level = 'Senior';
      else if (seniorYears >= 5) level = 'Mid-Senior';
      else if (seniorYears >= 2) level = 'Mid Level';
      seniorityLevel.textContent = level;
    }

    // Update Career Fit score and feedback when no job description is analyzed yet
    // Show appropriate empty state instead of fake scores
    if (careerFitScore && careerFitFeedback && Object.keys(careerFitData).length === 0) {
      // Show empty state - nothing has been assessed yet (no target role
      // chosen, no job description analyzed). Offer the two explicit paths
      // instead of forcing either.
      careerFitScore.textContent = '0%';
      careerFitFeedback.textContent = 'Pick a target role to see your career fit, or analyze a job description instead — nothing is assumed.';

      // Clear experience fields (evidence-aware label — a fresh hire's short
      // dated history is shown as such, never as "no dates found")
      if (totalExperience) totalExperience.textContent = expStat.label === 'Experience'
        ? expStat.text : expStat.text + ' ' + expStat.label.toLowerCase();
      if (relevantExperience) relevantExperience.textContent = '0 years';
      if (seniorityLevel) seniorityLevel.textContent = 'Entry Level';
      if (poorFitExplanation) poorFitExplanation.textContent = '';

      // Clear the detailed breakdown
      if (careerFitDetails) {
        careerFitDetails.innerHTML = `
          <div class="text-center py-4">
            <p class="text-muted">Career fit details appear when you pick a target role above, or analyze a job description against your resume.</p>
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
      // Rule 2/4: name exactly what is missing and give one clear action for each.
      // No score, no gap chips — nothing personalized is computed from a missing
      // (or empty) input.
      const resumeNote = hasResume
        ? `<div class="match-prov">Resume: ${escAttr(resumeSourceText())}${resumeIsRestoredSaved() ? ' <span class="match-prov-flag">— restored from a previous session; open Resume to replace or clear it</span>' : ''}</div>`
        : '';
      const jobNote = hasJob
        ? `<div class="match-prov">Job description: ${escAttr(jobSourceText())}</div>`
        : '';
      matchResults.innerHTML = `
        <div class="match-empty">
          <div class="match-empty-icon">🎯</div>
          <h5>Let's compute your match</h5>
          <p class="text-muted" style="font-size:.9rem">A match needs <strong>both</strong> a resume and a job description. Currently missing:</p>
          <ul class="match-missing-list" style="margin:0 0 1rem; padding-left:1.1rem; font-size:.9rem">
            ${!hasResume ? '<li><strong>Resume</strong> — upload, paste, or explicitly select a sample resume and analyze it.</li>' : ''}
            ${!hasJob ? '<li><strong>Job description</strong> — analyze or select one before running the match.</li>' : ''}
          </ul>
          ${resumeNote}${jobNote}
          <div class="match-empty-actions">
            ${!hasResume ? `<button class="btn btn-outline-primary" id="matchGoResume">Go to Resume Analysis</button>` : ''}
            ${!hasJob ? `<button class="btn btn-outline-primary" id="matchGoJob">Go to Job Description</button>` : ''}
            <button class="btn btn-primary" id="matchCalcBtn2">Run Match Analysis</button>
          </div>
        </div>`;
      document.getElementById('matchGoResume')?.addEventListener('click', () => switchTab('resumeAnalysis'));
      document.getElementById('matchGoJob')?.addEventListener('click', () => switchTab('jobAnalysis'));
      document.getElementById('matchCalcBtn2')?.addEventListener('click', () => {
        if (resumeAvailable() && jobAvailable()) { analyzeCareerFit(); renderMatchResults(); }
        else { calculateMatchBtn.click(); }
      });
      return;
    }

    // Both analyzed — compute the match breakdown
    const skillsMatch = calculateSkillsMatch(resumeData.skills, careerFitData.keySkills || []);
    const expMatch = calculateExperienceMatch(effectiveExperience(resumeData).years, careerFitData.experienceRequired);
    const eduMatch = calculateEducationMatch(resumeData.education, careerFitData.educationRequired);
    const overall = Math.round((skillsMatch * 0.4 + expMatch * 0.4 + eduMatch * 0.2) * 100);

    const matchAccentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#C8F54A';
    const overallColor = overall >= 80 ? matchAccentHex : overall >= 60 ? '#FFB454' : '#FF6B6B';
    const verdict = overall >= 80 ? 'Strong match' : overall >= 60 ? 'Good match' : overall >= 40 ? 'Fair match' : 'Weak match';
    const ringOffset = 326.73 - (326.73 * overall / 100);

    // Identify the top gap skills
    const resumeSet = new Set((resumeData.skills || []).map(s => s.toLowerCase().trim()));
    const gapSkills = (careerFitData.keySkills || [])
      .filter(s => !resumeSet.has(s.toLowerCase().trim()))
      .slice(0, 5);

    // Rule 5: the score reflects the LAST ANALYZED inputs. If the editors have
    // changed since then, say so instead of presenting stale numbers as current.
    const resumeEditor = (document.getElementById('resumeInput') || {}).value || '';
    const jdEditor = (document.getElementById('jobInput') || {}).value || '';
    const resumeStale = resumeAvailable() && resumeEditor.trim() && inputSig(resumeEditor.trim()) !== analyzedResumeSig;
    const jdStale = jobAvailable() && jdEditor.trim() && inputSig(jdEditor.trim()) !== analyzedJdSig;
    const staleNote = (resumeStale || jdStale)
      ? `<div class="alert alert-warning mb-3" style="font-size:.85rem"><strong>Inputs changed since last analysis.</strong> This score uses the last analyzed ${resumeStale && jdStale ? 'resume and JD' : resumeStale ? 'resume' : 'JD'}. Re-analyze ${resumeStale ? 'your resume' : 'the job description'} on its tab to update the numbers.</div>`
      : '';
    // Rule 1/3: identify exactly which resume and which JD this score is based on.
    const savedFlag = resumeIsRestoredSaved()
      ? `<div class="alert alert-info mb-3" style="font-size:.85rem"><strong>Heads up:</strong> this match uses your <strong>saved resume profile restored from a previous session</strong>, not one you analyzed just now. Open <a href="#" id="matchGoResumeProv">Resume Analysis</a> to replace or clear it.</div>`
      : '';

    matchResults.innerHTML = `
      <div class="match-provenance" style="font-size:.82rem;color:var(--muted);margin-bottom:14px;line-height:1.6">
        <div><strong style="color:var(--text)">Resume:</strong> ${escAttr(resumeSourceText())}</div>
        <div><strong style="color:var(--text)">Job:</strong> ${escAttr(jobSourceText())}</div>
      </div>
      ${savedFlag}
      ${staleNote}
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

    // "Open Resume Analysis" link inside the saved-profile notice.
    document.getElementById('matchGoResumeProv')?.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('resumeAnalysis');
    });
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

    // Read the target role from the single source of truth (ROLE_CATALOGUE).
    // Each catalogue role carries skills / exp {min,preferred} / edu {min,preferred},
    // mapped here onto the shape the match calculators expect.
    const catRole = ALL_ROLES_FLAT[targetRoleSelect.value];
    if (!catRole) return;
    const role = {
      name: catRole.name,
      keySkills: catRole.skills || [],
      experience: catRole.exp || { min: 0 },
      education: catRole.edu || {}
    };

    const skillsMatch = calculateTargetRoleSkillsMatch(
  resumeData.skills,
  role.keySkills
);
    const experienceMatch = calculateTieredExperienceMatch(
      effectiveExperience(resumeData).years,
      role.experience
    );
    const educationMatch = calculateTieredEducationMatch(
      resumeData.education || [],
      role.education
    );

    const yrsLabel = n => (n == null ? '' : n + ' ' + (n === 1 ? 'yr' : 'yrs'));
    const eduLabel = tier => {
      if (!tier) return 'any degree';
      return tier.toLowerCase() === 'mba' ? 'MBA' : tier.charAt(0).toUpperCase() + tier.slice(1);
    };
    const expMin = role.experience && role.experience.min;
    const expNote = role.experience && role.experience.preferred
      ? `min ${yrsLabel(expMin)} · preferred ${yrsLabel(role.experience.preferred)}`
      : expMin
        ? `min ${yrsLabel(expMin)}`
        : 'no experience requirement';
    const eduMin = role.education && role.education.min;
    const eduNote = role.education && role.education.preferred
      ? `${eduLabel(eduMin)} required · ${eduLabel(role.education.preferred)} preferred`
      : eduMin
        ? `${eduLabel(eduMin)} required`
        : 'no education requirement';

    const score = Math.round(
      skillsMatch * 40 +
      experienceMatch * 40 +
      educationMatch * 20
    );

    if (careerFitScore) {
      animateNumber(careerFitScore, score);
      careerFitScore.classList.remove('career-score-pop');
      void careerFitScore.offsetWidth;
      careerFitScore.classList.add('career-score-pop');
    }

    // Animate the score ring
    const ring = document.getElementById('careerFitRing');
    if (ring) {
      const circumference = 326.73;
      ring.style.strokeDashoffset = circumference - (circumference * score / 100);
      // Set ring color based on score (top tier follows the active theme accent)
      const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#C8F54A';
      ring.style.stroke = score >= 80 ? accentHex : score >= 60 ? '#FFB454' : '#FF6B6B';
    }

    if (careerFitFeedback) {
      careerFitFeedback.textContent =
        `Estimated fit for ${role.name}, based on the skills and experience detected in your resume.`;
    }

    const expDisp = displayExperience(resumeData);

    if (totalExperience) {
      totalExperience.textContent = expDisp.label === 'Experience'
        ? expDisp.text : expDisp.text + ' ' + expDisp.label.toLowerCase();
    }

    if (relevantExperience) {
      relevantExperience.textContent = formatExperienceYears(
        effectiveExperience(resumeData).years * experienceMatch
      );
    }

    if (seniorityLevel) {
      const years = effectiveExperience(resumeData).years;
      seniorityLevel.textContent =
        years >= 8 ? 'Senior' :
        years >= 5 ? 'Mid-Senior' :
        years >= 2 ? 'Mid Level' : 'Entry Level';
    }

    // --- Your 100% Path: concrete actions to close every remaining gap ---
    const missingSkills = getMissingRoleSkills(resumeData.skills, role.keySkills);
    const skillPct = Math.round(skillsMatch * 100);
    const expPct = Math.round(experienceMatch * 100);
    const eduPct = Math.round(educationMatch * 100);
    const capWord = v => ({ sql: 'SQL', 'power bi': 'Power BI', 'kpi tracking': 'KPI tracking' }[v]
      || v.charAt(0).toUpperCase() + v.slice(1));
    const years = effectiveExperience(resumeData).years;

    const skillRows = missingSkills.slice(0, 4).map(skill => {
      const pb = playbookFor(skill);
      return `<div class="path-item">
        <div class="path-item-main"><strong>${capWord(skill)}</strong><span>${pb.how}</span></div>
        <span class="path-time">${pb.time}</span>
      </div>`;
    }).join('');

    const expGap = experienceMatch < 1;
    const expBridgeText = `You're at ${formatExperienceYears(years)}; this role wants ${yrsLabel(role.experience.min)}${role.experience.preferred ? ` (${yrsLabel(role.experience.preferred)} preferred)` : ''}. Recruiters treat two well-documented projects as experience: pick problems a ${role.name} actually solves (a messy dataset, a slow process, a KPI that moved) and write up before/after with numbers.`;

    const eduGap = educationMatch < 1 && role.education && role.education.preferred;
    const eduGapText = eduGap
      ? `You meet the minimum; the preferred credential (${role.education.preferred}) is the only thing between you and 100%. Fastest signals: a certification in that area (Google, Microsoft or NPTEL all work) plus one project piece in that domain.`
      : '';

    const allCleared = missingSkills.length === 0 && !expGap && !eduGap;

    // Score math for the quick-win banner
    const skillsFixed = missingSkills.length ? 1.0 : skillsMatch;
    const eduFixed = eduGap ? 1.0 : educationMatch;
    const newScore = Math.round(skillsFixed * 40 + experienceMatch * 40 + eduFixed * 20);
    const canHit100 = newScore === 100;
    const topGains = missingSkills.slice(0, 3).map(capWord).join(' + ');

    let bannerHtml = '';
    if (missingSkills.length > 0) {
      bannerHtml = `
        <div class="quick-win-banner">
          <span class="bw-label">Quick win</span>
          Learn <strong>${topGains}</strong> and your skills match jumps ${skillPct}% → 100%, lifting overall fit ${score}% → <strong>${newScore}%</strong>${canHit100 ? ' — a full 100% is genuinely reachable' : `; closing the experience gap earns the last ${100 - newScore} point${100 - newScore === 1 ? '' : 's'}`}.
        </div>`;
    } else if (eduGap) {
      bannerHtml = `
        <div class="quick-win-banner">
          <span class="bw-label">Quick win</span>
          One credential — <strong>${role.education.preferred}</strong> — and your education match goes ${eduPct}% → 100%, pushing overall fit to <strong>${newScore}%</strong>.
        </div>`;
    }

    if (careerFitDetails) {
      careerFitDetails.innerHTML = `
        <div class="match-result-card">
          <h5>Role Assessment: ${role.name}</h5>
          <div class="mb-4">
            <div class="match-label-row"><span>Skills Match</span><strong>${skillPct}%</strong></div>
            <div class="progress"><div class="progress-bar bg-success" style="width:${skillsMatch * 100}%"></div></div>
          </div>
          <div class="mb-4">
            <div class="match-label-row"><span>Experience Match</span><strong>${expPct}%</strong></div>
            <div class="progress"><div class="progress-bar bg-info" style="width:${experienceMatch * 100}%"></div></div>
            <div class="tier-note">${expNote}</div>
          </div>
          <div class="mb-4">
            <div class="match-label-row"><span>Education Match</span><strong>${eduPct}%</strong></div>
            <div class="progress"><div class="progress-bar bg-warning" style="width:${educationMatch * 100}%"></div></div>
            <div class="tier-note">${eduNote}</div>
          </div>
          ${bannerHtml}
          <p class="text-muted small mb-0">Preliminary estimate — not a hiring prediction. Skills the parser misses may affect the score.</p>
        </div>

        <div class="path-card">
          <div class="path-head">
            <span class="path-icon">${allCleared ? '🏆' : '🚀'}</span>
            <div>
              <h6>${allCleared ? `You're gap-free for ${role.name}` : `Your 100% Path to ${role.name}`}</h6>
              <p>${allCleared
                ? 'No gaps to close. Put this energy where it pays off: a 30-second pitch and one STAR story for each of your top skills — that\'s what converts a full match into an offer.'
                : 'Exactly what stands between you and a full match — and how to close each piece.'}</p>
            </div>
          </div>
          ${missingSkills.length > 0 ? `
          <div class="path-section">
            <div class="path-section-label">Skills · ${skillPct}% → 100%</div>
            ${skillRows}
          </div>` : ''}
          ${expGap ? `
          <div class="path-section">
            <div class="path-section-label">Experience · ${expPct}% → 100%</div>
            <div class="path-item"><div class="path-item-main"><strong>Bridge the gap without waiting</strong><span>${expBridgeText}</span></div></div>
          </div>` : ''}
          ${eduGap ? `
          <div class="path-section">
            <div class="path-section-label">Education · ${eduPct}% → 100%</div>
            <div class="path-item"><div class="path-item-main"><strong>Signal the preferred credential</strong><span>${eduGapText}</span></div></div>
          </div>` : ''}
        </div>
      `;
    }
  }

  // Reassess whenever the selected role changes.
  if (targetRoleSelect) {
    targetRoleSelect.addEventListener('change', assessTargetRole);
  }

  // --- Type-to-search target roles (career fit) ---
  // The datalist offers every catalogue role; typing an unknown title assesses
  // it as a CUSTOM role against the detected skills (honest, evidence-only).
  const targetRoleSearch = document.getElementById('targetRoleSearch');
  const targetRoleOptions = document.getElementById('targetRoleOptions');
  if (targetRoleOptions) {
    targetRoleOptions.innerHTML = Object.values(ALL_ROLES_FLAT)
      .map(r => `<option value="${escAttr(r.name)}"></option>`).join('');
  }

  // Find a catalogue role by name (case- and space-insensitive, substring OK:
  // "Cyber Security Analyst" matches the catalogue's "Cybersecurity Analyst").
  function findRoleByName(label) {
    const norm = s => String(s || '').trim().toLowerCase().replace(/[\s\-]+/g, '');
    const q = norm(label);
    if (!q) return null;
    for (const key in ALL_ROLES_FLAT) {
      const r = ALL_ROLES_FLAT[key];
      const name = norm(r.name);
      if (name === q || name.includes(q) || q.includes(name)) return key;
    }
    return null;
  }

  // Assess a title that is NOT in the catalogue: relevance = how much of the
  // detected skill set the title's words actually point at. No invented match.
  function assessCustomRole(label) {
    if (!careerFitScore || !careerFitFeedback || !careerFitDetails) return;
    if (!resumeData || !Array.isArray(resumeData.skills) || resumeData.skills.length === 0) {
      careerFitScore.textContent = '--';
      careerFitFeedback.textContent = 'Analyze your resume first, then type the role you want to target.';
      careerFitDetails.innerHTML = '<p class="text-muted">No resume analyzed yet.</p>';
      return;
    }
    const words = String(label).toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const have = resumeData.skills;
    const matched = have.filter(s => words.some(w => s.includes(w) || w.includes(s)));
    const pct = Math.round((matched.length / have.length) * 100);
    careerFitScore.textContent = pct + '%';
    careerFitScore.classList.remove('career-score-pop');
    void careerFitScore.offsetWidth;
    careerFitScore.classList.add('career-score-pop');
    careerFitFeedback.textContent =
      `Relevance of your detected skills to “${label}” (custom target — not a catalogue role). ` +
      `${matched.length} of ${have.length} detected skills point that way.`;
    const ring = document.getElementById('careerFitRing');
    if (ring) {
      ring.style.strokeDashoffset = 326.73 - (326.73 * pct / 100);
      ring.style.stroke = pct >= 60 ? '#C8F54A' : pct >= 30 ? '#FFB454' : '#FF6B6B';
    }
    careerFitDetails.innerHTML = `
      <div style="font-size:.85rem;line-height:1.7">
        <strong style="color:var(--text)">Skills that fit “${escAttr(label)}”:</strong><br>
        ${matched.length
          ? matched.map(s => `<span class="chip chip-accent" style="margin:3px 4px 3px 0">${escAttr(s)}</span>`).join('')
          : '<span class="text-muted">None of the detected skills match this title\'s words yet.</span>'}<br><br>
        <strong style="color:var(--text)">What to do next:</strong> write the missing skills for this role
        explicitly into your resume (tools, domains, outcomes) — detection is evidence-only,
        nothing is assumed. Then re-analyze and the match becomes measurable.
        <span style="color:var(--muted);display:block;margin-top:6px;font-size:.78rem">Preliminary estimate, not a hiring prediction.</span>
      </div>`;
    document.getElementById('careerFitCard')?.classList.remove('d-none');
  }

  if (targetRoleSearch) {
    targetRoleSearch.addEventListener('change', () => {
      const label = targetRoleSearch.value.trim();
      if (!label) return;
      const key = findRoleByName(label);
      if (key && targetRoleSelect) {
        targetRoleSelect.value = key;
        assessTargetRole();
      } else {
        assessCustomRole(label);
      }
    });
  }

  // Analyze career fit between resume and job description
  function analyzeCareerFit() {
    if (Object.keys(resumeData).length === 0 || Object.keys(careerFitData).length === 0) {
      return;
    }

    // Calculate match score based on skills, experience, and education
    const skillsMatch = calculateSkillsMatch(resumeData.skills, careerFitData.keySkills || []);
    const experienceMatch = calculateExperienceMatch(effectiveExperience(resumeData).years, careerFitData.experienceRequired);
    const educationMatch = calculateEducationMatch(resumeData.education, careerFitData.educationRequired);

    // Weighted average (skills: 40%, experience: 40%, education: 20%)
    const matchScore = (skillsMatch * 0.4) + (experienceMatch * 0.4) + (educationMatch * 0.2);

    const scorePct = Math.round(matchScore * 100);
    // Update career fit score (count-up + pop)
    if (careerFitScore) {
      animateNumber(careerFitScore, scorePct);
      careerFitScore.classList.remove('career-score-pop');
      void careerFitScore.offsetWidth;
      careerFitScore.classList.add('career-score-pop');
    }

    // Animate the score ring
    const ring = document.getElementById('careerFitRing');
    if (ring) {
      const circumference = 326.73;
      const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#C8F54A';
      ring.style.strokeDashoffset = circumference - (circumference * scorePct / 100);
      ring.style.stroke = scorePct >= 80 ? accentHex : scorePct >= 60 ? '#FFB454' : '#FF6B6B';
    }

    // Update career fit feedback — thresholds are percentages, so compare
    // scorePct, not the 0–1 matchScore (comparing the fraction to 80/60/40
    // made "Limited match" the only reachable verdict, contradicting a ring
    // that could show 92%).
    let feedback = '';
    if (scorePct >= 80) {
      feedback = 'Excellent match! Your resume strongly aligns with this job description.';
    } else if (scorePct >= 60) {
      feedback = 'Good match! Your resume shows strong alignment with this job description.';
    } else if (scorePct >= 40) {
      feedback = 'Fair match. Consider highlighting more relevant skills and experience.';
    } else {
      feedback = 'Limited match. You may need to gain more relevant experience or skills for this role.';
    }
    careerFitFeedback.textContent = feedback;

    // Update experience fields — the stated-vs-dated label must stay
    // consistent with the resume tab (Commit B displayExperience wording).
    if (totalExperience && relevantExperience && seniorityLevel) {
      const expDisp = displayExperience(resumeData);
      totalExperience.textContent = expDisp.label === 'Experience'
        ? expDisp.text : expDisp.text + ' ' + expDisp.label.toLowerCase();
      const effectiveYears = effectiveExperience(resumeData).years;
      relevantExperience.textContent = formatExperienceYears(Math.round(effectiveYears * experienceMatch));

      // Determine seniority level based on matched experience
      const matchedExperience = effectiveYears * experienceMatch;
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
      // A 1-character "skill" (e.g. "R" from a JD) can substring-match
      // almost any resume skill ("reporting" contains "r"), so it can never
      // be reliably matched or counted as missing-evidence. Skip it.
      if (jobSkill.length < 2 || !resumeSkillsLower.some(resumeSkill =>
        resumeSkill.length >= 2 && jobSkill.includes(resumeSkill) ||
        resumeSkill.length >= 2 && resumeSkill.includes(jobSkill))) {
        return;
      }
      matches++;
    });

    return Math.min(matches / jobSkills.length, 1.0);
  }

function calculateTargetRoleSkillsMatch(resumeSkills, jobSkills) {
  if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
    return 0;
  }

  const resumeSkillSet = new Set(
    (Array.isArray(resumeSkills) ? resumeSkills : []).map(canonicalSkill)
  );

  const matches = jobSkills.filter(skill =>
    resumeSkillSet.has(canonicalSkill(skill))
  ).length;

  return matches / jobSkills.length;
}

  // Tiered experience match for target roles: blend of min and preferred years
  function calculateTieredExperienceMatch(totalYears, tier) {
    if (!tier || !tier.min) return 1.0;
    const years = Number(totalYears) || 0;
    const minScore = Math.min(years / tier.min, 1);
    if (!tier.preferred) return minScore;
    return minScore * 0.5 + Math.min(years / tier.preferred, 1) * 0.5;
  }

  // Whether a single education tier (e.g. 'bachelor', 'master', 'mba') is met
  function educationTierMet(educationText, tier) {
    const t = String(tier).toLowerCase();
    if (t === 'bachelor') {
      return /\bbachelor\b|\bb\.?\s?(tech|e|sc|com|ca|ba)\b/i.test(educationText);
    }
    if (t === 'master') {
      return /\bmba\b|\bm\.(tech|e|sc|com|a)\b|\bmaster\b/i.test(educationText);
    }
    return educationText.includes(t);
  }

  // Tiered education match: full marks for the preferred tier,
  // partial marks (70%) when only the minimum tier is met.
  function calculateTieredEducationMatch(resumeEducation, tier) {
    if (!tier || !tier.min) return 1.0;
    const educationText = (resumeEducation || [])
      .map(edu => `${edu.degree || ''} ${edu.field || ''} ${edu.institution || ''}`)
      .join(' ')
      .toLowerCase();
    if (!educationTierMet(educationText, tier.min)) return 0.0;
    if (!tier.preferred) return 1.0;
    return educationTierMet(educationText, tier.preferred) ? 1.0 : 0.7;
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

    if (educationMatch < 0.8) {
      const neededEducation = careerFitData.educationRequired || 'relevant educational qualifications';
      recommendations.push(`<div>This role expects: ${neededEducation}. Consider highlighting or pursuing it to strengthen your application.</div>`);
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

  // ============================================================
  // Job Discovery — resume-based target roles + honest external links
  // Nothing here scrapes or fabricates listings. Recommendations are
  // computed from the user's actual resume (skills + experience only).
  // ============================================================
  let discTargets = new Set();   // catalogue role keys the user chose to search
  let discCustomRole = '';        // free-text target title
  // True when the current target set was filled by auto-pick (no explicit user
  // choice yet). A newer resume profile should then drop the stale auto targets
  // rather than keep searching the previous person's roles.
  let discTargetsAuto = false;

  function discTargetsLoad() {
    try {
      const t = JSON.parse(localStorage.getItem('discTargets') || '[]');
      discTargets = new Set((Array.isArray(t) ? t : []).filter(k => ALL_ROLES_FLAT[k]));
      discCustomRole = localStorage.getItem('discCustomRole') || '';
      discTargetsAuto = localStorage.getItem('discTargetsAuto') === '1';
    } catch (e) { discTargets = new Set(); discCustomRole = ''; discTargetsAuto = false; }
  }
  function discTargetsSave() {
    try {
      localStorage.setItem('discTargets', JSON.stringify([...discTargets]));
      localStorage.setItem('discCustomRole', discCustomRole);
      localStorage.setItem('discTargetsAuto', discTargetsAuto ? '1' : '0');
    } catch (e) { /* non-persisting is fine */ }
  }
  // A new resume profile just arrived: if the targets were auto-picked for the
  // previous profile, clear them so the user isn't silently searching roles
  // that no longer fit. Explicit user choices always survive.
  function discPruneStaleAutoTargets() {
    if (discTargetsAuto) {
      discTargets = new Set();
      discTargetsAuto = false;
      discCustomRole = '';
      discTargetsSave();
    }
  }

  // Rank every catalogue role against the discovery profile using ONLY evidence
  // present in the resume. No skills are invented.
  function recommendDiscoveryRoles(limit) {
    const profile = getDiscoveryProfile();
    if (!profile) return { recommendations: [], profile: null };
    limit = limit || 6;
    const have = new Set((profile.skills || []).map(canonicalSkill));
    const exp = profile.experience || 0;
    const scored = Object.entries(ALL_ROLES_FLAT).map(([key, role]) => {
      const roleSkills = (role.skills || []).map(canonicalSkill);
      const matchedNames = (role.skills || []).filter(s => have.has(canonicalSkill(s)));
      const coverage = roleSkills.length ? matchedNames.length / roleSkills.length : 0;
      const min = (role.exp && role.exp.min) || 0;
      const pref = (role.exp && role.exp.preferred) || min;
      let expNote;
      if (!min && !pref) expNote = 'no experience requirement';
      else if (exp >= pref) expNote = 'experience meets the preferred band (' + pref + '+ yrs)';
      else if (exp >= min) expNote = 'experience is in range (' + min + '–' + pref + ' yrs)';
      else expNote = 'below the typical minimum (' + min + ' yrs)';
      const missing = getMissingRoleSkills(profile.skills, role.skills).slice(0, 3);
      return {
        key, role, matchedNames, missing, coverage, expNote,
        score: coverage * 100 + (exp >= min ? 15 : 0) + (exp >= pref ? 10 : 0) + (matchedNames.length ? 5 : 0)
      };
    });
    scored.sort((a, b) => b.score - a.score);
    return { recommendations: scored.slice(0, limit), profile };
  }

  // Evidence-based "why this role is relevant" line for a recommendation.
  function discWhyLine(rec) {
    const bits = [];
    if (rec.matchedNames.length) bits.push('You already list ' + rec.matchedNames.length + ' of its ' +
      (rec.role.skills || []).length + ' key skills (' + rec.matchedNames.slice(0, 4).join(', ') + ').');
    else bits.push('No direct skill overlap yet — adjacent/adjacent-opportunity match, not a 1:1 fit.');
    if (rec.expNote) bits.push(rec.expNote.charAt(0).toUpperCase() + rec.expNote.slice(1) + '.');
    if (rec.missing.length) bits.push('Gaps: ' + rec.missing.join(', ') + '.');
    return bits.join(' ');
  }

  // Every role title the user is searching for: chosen catalogue roles + custom.
  function discoveryTargetNames() {
    const names = [];
    discTargets.forEach(k => {
      const r = ALL_ROLES_FLAT[k];
      if (r && !names.includes(r.name)) names.push(r.name);
    });
    if (discCustomRole.trim() && !names.includes(discCustomRole.trim())) names.push(discCustomRole.trim());
    return names;
  }

  // Fill the "browse any role" select from the full catalogue (data-driven,
  // so new families appear here and in the Planner without touching markup).
  function repopulateDiscoveryRoleFilter() {
    const dd = document.getElementById('discRoleBrowse');
    if (!dd) return;
    let html = '<option value="">Browse all ' + Object.keys(ALL_ROLES_FLAT).length + ' roles…</option>';
    html += roleCatalogueOptionGroups();
    dd.innerHTML = html;
  }

  // Shared: the full catalogue as <optgroup> blocks, grouped by career family.
  function roleCatalogueOptionGroups() {
    let html = '';
    Object.values(ROLE_CATALOGUE).forEach(fam => {
      html += '<optgroup label="' + escAttr(fam.label) + '">';
      Object.entries(fam.roles).forEach(([k, r]) => {
        html += '<option value="' + k + '">' + escAttr(r.name) + '</option>';
      });
      html += '</optgroup>';
    });
    return html;
  }

  // Match tab "Target Role" select — same single source of truth as Discovery,
  // so every catalogue role (incl. finance & IT) is assessable there too.
  // Rank every catalogue role against the analyzed resume using ONLY skills
  // actually detected in it (same evidence-only scoring as Discovery).
  function rankRolesForResume(resumeSkills, yearsExp) {
    const have = new Set((Array.isArray(resumeSkills) ? resumeSkills : []).map(canonicalSkill));
    const exp = Number(yearsExp) || 0;
    return Object.entries(ALL_ROLES_FLAT).map(([key, role]) => {
      const matched = (role.skills || []).filter(s => have.has(canonicalSkill(s)));
      const coverage = (role.skills || []).length ? matched.length / role.skills.length : 0;
      const min = (role.exp && role.exp.min) || 0;
      const pref = (role.exp && role.exp.preferred) || min;
      return {
        key, role, matched, coverage,
        score: coverage * 100 + (exp >= min ? 15 : 0) + (exp >= pref ? 10 : 0) + (matched.length ? 5 : 0)
      };
    }).sort((a, b) => b.score - a.score);
  }

  function repopulateMatchRoleFilter() {
    const dd = document.getElementById('targetRoleSelect');
    if (!dd) return;
    const current = dd.value;

    const hasSkills = resumeData && Array.isArray(resumeData.skills) && resumeData.skills.length > 0;
    let html = '<option value="">-- Select a target role --</option>';
    let recommended = [];

    if (hasSkills) {
      // Relevance-aware: only roles with real signal for THIS resume lead —
      // at least 2 shared core skills, or 50%+ coverage of a role's short
      // skill list — grouped into the top 3 career families. Everything else
      // stays reachable under a single "other fields" group so no role is lost.
      const ranked = rankRolesForResume(resumeData.skills, resumeData.totalExperience);
      const eligible = ranked.filter(r =>
        r.matched.length >= 2 || ((r.role.skills || []).length > 0 && r.coverage >= 0.5));

      if (eligible.length) {
        const famScore = {};
        eligible.forEach(r => { famScore[r.role.family] = Math.max(famScore[r.role.family] || 0, r.score); });
        const topFamilies = Object.entries(famScore)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(e => e[0]);
        recommended = eligible.filter(r => topFamilies.includes(r.role.family));
        // Group per family (families ordered by their best-scoring role) so the
        // same family never appears as two separate optgroups.
        const familyOrder = [];
        recommended.forEach(r => { if (!familyOrder.includes(r.role.family)) familyOrder.push(r.role.family); });
        const grouped = recommended.slice().sort((a, b) =>
          (familyOrder.indexOf(a.role.family) - familyOrder.indexOf(b.role.family)) || (b.score - a.score));
        let lastFamily = null;
        let shownInFamily = 0;
        grouped.forEach(r => {
          if (r.role.family !== lastFamily) {
            if (lastFamily !== null) html += '</optgroup>';
            html += '<optgroup label="' + escAttr('For your resume · ' + r.role.family) + '">';
            lastFamily = r.role.family;
            shownInFamily = 0;
          }
          shownInFamily++;
          // Enough room per family that a strong-but-7th role (e.g. a
          // cybersecurity role on a security resume) is not cut off.
          if (shownInFamily <= 8) html += '<option value="' + r.key + '">' + escAttr(r.role.name) + '</option>';
        });
        html += '</optgroup>';
      }

      if (recommended.length) {
        const recKeys = new Set(recommended.map(r => r.key));
        const others = ranked.filter(r => !recKeys.has(r.key));
        if (others.length) {
          html += '<optgroup label="Other fields — ' + others.length + ' roles">';
          others.forEach(r => {
            html += '<option value="' + r.key + '">' + escAttr(r.role.name) + ' (' + escAttr(r.role.family) + ')</option>';
          });
          html += '</optgroup>';
        }
      } else {
        // No catalogue role has real overlap with this resume's field —
        // don't guess: show the full catalogue without a leading guess.
        html += roleCatalogueOptionGroups();
      }
    } else {
      html += roleCatalogueOptionGroups();
    }

    dd.innerHTML = html;
    // Never auto-pick and never auto-assess here: the career-fit card stays
    // neutral until the user explicitly selects a target role (its change
    // listener runs the assessment) or analyzes a job description. We only
    // keep the option the user already chose, so nothing is forced on them.
    if (current && ALL_ROLES_FLAT[current]) dd.value = current;
  }

  // Render the whole interactive Discovery UI: profile strip, the active
  // target chips, resume-recommended role chips, and the target-input wiring.
  // Re-entrantly safe — called after every state change (upload, clear, add, remove).
  function renderDiscoveryUI() {
    const profile = getDiscoveryProfile();

    // 1 · Profile strip
    const info = document.getElementById('discProfileInfo');
    if (info) {
      if (profile) {
        const provenance = resumeIsRestoredSaved() ? ' · restored from a previous session'
          : (resumeSource && resumeSource === 'sample') ? ' · sample ' + (resumeSourceLabel || '')
          : (resumeSourceLabel ? ' · from ' + resumeSourceLabel : '');
        info.innerHTML = '<span class="disc-dot"></span><strong>Profile ready</strong> · '
          + profile.skills.length + ' skills · ' + formatExperienceYears(profile.experience)
          + provenance;
      } else {
        info.innerHTML = '<span class="disc-dot off"></span><strong>No resume profile yet</strong> — upload one here, '
          + 'or analyze one on the Resume tab. Without a profile, role recommendations are off.';
      }
    }

    // 2 · Recommended role chips (evidence-based, top 6 only — no noise)
    const recHost = document.getElementById('discRecommended');
    if (recHost) {
      const { recommendations, profile: p } = recommendDiscoveryRoles(6);
      if (p && recommendations.length) {
        recHost.innerHTML = '<span class="disc-rec-label">For your profile:</span>' + recommendations.map(rec => {
          const on = discTargets.has(rec.key);
          const pct = Math.round(rec.coverage * 100);
          return `<button class="disc-rec-chip ${on ? 'on' : ''}" data-key="${rec.key}" type="button"
                     title="${escAttr(discWhyLine(rec))}">${on ? '✓ ' : ''}${escAttr(rec.role.name)}
                     <span class="disc-rec-pct">${pct}%</span></button>`;
        }).join('');
      } else {
        recHost.innerHTML = '';
      }
    }

    // 3 · Active target chips
    renderDiscoveryTargets();

    wireDiscoveryControls();
  }

  function renderDiscoveryTargets() {
    const host = document.getElementById('discTargets');
    if (!host) return;
    const names = discoveryTargetNames();
    if (names.length === 0) {
      host.innerHTML = '<span class="disc-hint">No targets yet — pick a suggested role, browse the catalogue, or add a custom title.</span>';
      return;
    }
    host.innerHTML = names.map(n =>
      `<span class="disc-target-chip">${escAttr(n)} <button class="disc-target-x" data-name="${escAttr(n)}" type="button" aria-label="Remove ${escAttr(n)}">×</button></span>`
    ).join('');
  }

  function wireDiscoveryControls() {
    // Rec chips + target-x are freshly-rendered nodes, so re-wiring each time
    // is safe (old nodes are gone). The static controls below are wired ONCE.
    document.querySelectorAll('.disc-rec-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const k = chip.dataset.key;
        if (discTargets.has(k)) discTargets.delete(k); else discTargets.add(k);
        discTargetsAuto = false; // explicit user choice survives future resumes
        discTargetsSave();
        renderDiscoveryUI();
        findRelevantJobs();
      });
    });
    const addCustom = document.getElementById('discAddCustomBtn');
    if (addCustom && !addCustom.dataset.wired) {
      addCustom.dataset.wired = '1';
      addCustom.addEventListener('click', addCustomRoleTarget);
    }
    const customInput = document.getElementById('discCustomRoleInput');
    if (customInput && !customInput.dataset.wired) {
      customInput.dataset.wired = '1';
      customInput.value = discCustomRole; // sync once; do not clobber on re-render
      customInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); addCustomRoleTarget(); }
      });
    }
    const browse = document.getElementById('discRoleBrowse');
    if (browse && !browse.dataset.wired) {
      browse.dataset.wired = '1';
      browse.addEventListener('change', () => {
        if (browse.value && ALL_ROLES_FLAT[browse.value]) {
          discTargets.add(browse.value);
          discTargetsAuto = false;
          discTargetsSave();
          renderDiscoveryUI();
          findRelevantJobs();
        }
        browse.value = '';
      });
    }
    document.querySelectorAll('.disc-target-x').forEach(x => {
      x.addEventListener('click', () => {
        const name = x.dataset.name;
        if (name === discCustomRole.trim()) { discCustomRole = ''; }
        else discTargets = new Set([...discTargets].filter(k => (ALL_ROLES_FLAT[k] || {}).name !== name));
        discTargetsAuto = false;
        discTargetsSave();
        renderDiscoveryUI();
        findRelevantJobs();
      });
    });
  }

  function addCustomRoleTarget() {
    const inp = document.getElementById('discCustomRoleInput');
    discCustomRole = (inp && inp.value || '').trim();
    discTargetsAuto = false;
    discTargetsSave();
    renderDiscoveryUI();
    findRelevantJobs();
  }

  // ------------------------------------------------------------
  // Per-board search links.
  // Job boards accept DIFFERENT filters in their URLs — we do not assume
  // they all behave like Indeed. Each board below declares exactly what
  // goes into its link, and the result cards say so out loud.
  // Salary is never encoded anywhere: it is a page-level filter on all
  // four boards, not a URL parameter.
  // ------------------------------------------------------------
  function discReadFilters() {
    const location = document.getElementById('discLocationFilter').value || '';
    const experience = Number(document.getElementById('discExperience').value) || 0;
    const salaryMin = document.getElementById('discSalaryMin').value || '';
    const salaryMax = document.getElementById('discSalaryMax').value || '';
    return {
      location, experience, remote: location === 'Remote',
      salaryText: (salaryMin || salaryMax)
        ? '₹' + (salaryMin || '0') + (salaryMax ? '–' + salaryMax : '+') + ' LPA'
        : ''
    };
  }

  // LinkedIn experience filter f_E: 1 = 0-1y, 2 = 1+, 3 = 2+, 4 = 3+, 5 = 5+
  function discLinkedInExpParam(minYears) {
    if (minYears >= 5) return '5';
    if (minYears >= 3) return '4';
    if (minYears >= 2) return '3';
    if (minYears >= 1) return '2';
    return '1';
  }

  const DISC_BOARDS = [
    {
      name: 'LinkedIn',
      build(title, f) {
        const p = new URLSearchParams();
        p.set('keywords', title);
        if (f.remote) p.set('f_WT', '2'); // remote work filter
        else if (f.location) p.set('location', f.location + ', India');
        if (f.experience) p.set('f_E', discLinkedInExpParam(f.experience));
        return 'https://www.linkedin.com/jobs/search/?' + p.toString();
      },
      legend(f) {
        const passed = ['keywords'];
        if (f.remote) passed.push('remote work');
        else if (f.location) passed.push('location (' + f.location + ')');
        if (f.experience) passed.push('experience (' + f.experience + '+ yrs)');
        return { passed, notPassed: f.salaryText ? ['salary ' + f.salaryText + ' (filter on the page)'] : [] };
      }
    },
    {
      name: 'Indeed',
      build(title, f) {
        const p = new URLSearchParams();
        p.set('q', title);
        p.set('sort', 'date'); // newest first — job search, not company search
        if (f.remote) p.set('wtrm', 'on');
        else if (f.location) p.set('l', f.location + ', India');
        if (f.experience) p.set('sc', f.experience + ',40'); // min years, open top
        return 'https://in.indeed.com/jobs?' + p.toString();
      },
      legend(f) {
        const passed = ['keywords'];
        if (f.remote) passed.push('remote only');
        else if (f.location) passed.push('location (' + f.location + ')');
        if (f.experience) passed.push('experience (' + f.experience + '+ yrs)');
        return { passed, notPassed: f.salaryText ? ['salary ' + f.salaryText + ' (not an Indeed URL filter — apply on the page)'] : [] };
      }
    },
    {
      name: 'Naukri',
      // Naukri has no location URL parameter: the city goes into the keyword
      // text (its keyword field matches titles, skills and locations).
      build(title, f) {
        const p = new URLSearchParams();
        const keyword = title + (f.remote ? ' remote' : (f.location ? ' ' + f.location : ''));
        p.set('q', keyword);
        p.set('key', keyword);
        p.set('fcs', 'off');
        if (f.experience) p.set('fexl', String(f.experience)); // min experience, years
        return 'https://www.naukri.com/search?' + p.toString();
      },
      legend(f) {
        const passed = ['keywords'];
        if (f.remote || f.location) passed.push((f.remote ? 'remote' : f.location) + ' (folded into keywords)');
        if (f.experience) passed.push('experience (' + f.experience + '+ yrs)');
        return { passed, notPassed: f.salaryText ? ['salary ' + f.salaryText + ' (filter on the page)'] : [] };
      }
    },
    {
      name: 'Monster India',
      // Only keyword + location are stable URL params here; experience and
      // salary are page-level filters on Monster India.
      build(title, f) {
        const p = new URLSearchParams();
        p.set('q', title);
        if (f.location) p.set('location', f.location);
        return 'https://www.monsterindia.com/jobs/search/?' + p.toString();
      },
      legend(f) {
        const passed = ['keywords'];
        if (f.location) passed.push('location (' + f.location + ')');
        const skipped = [];
        if (f.experience) skipped.push('experience (' + f.experience + '+ yrs)');
        if (f.salaryText) skipped.push('salary ' + f.salaryText);
        return { passed, notPassed: skipped.map(s => s + ' (filter on the page)') };
      }
    }
  ];

  // Build the per-board result cards. One link per target role; if there are
  // more than 4 targets, a single "all roles" link instead of a wall of buttons.
  function findRelevantJobs() {
    const profile = getDiscoveryProfile();

    // The resume should do real work here: with a profile but no explicit
    // targets, seed the search with the top recommendations.
    let autoPicked = false;
    if (discoveryTargetNames().length === 0 && profile) {
      recommendDiscoveryRoles(3).recommendations.forEach(r => discTargets.add(r.key));
      discTargetsAuto = true;
      discTargetsSave();
      autoPicked = true;
    }
    const targetNames = discoveryTargetNames();

    if (targetNames.length === 0) {
      discoveryResults.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">🔎</div><p>Add a target role above — a suggested role, a catalogue pick, or a custom title — then click <strong>Build my search links</strong> again.</p></div>';
      return;
    }

    const f = discReadFilters();
    const MAX_LINKS_PER_CARD = 4;
    const shown = targetNames.slice(0, MAX_LINKS_PER_CARD);
    const restCount = targetNames.length - shown.length;

    let cardsHtml = '<div class="disc-boards-grid">';
    DISC_BOARDS.forEach(board => {
      const legend = board.legend(f);
      const links = shown.map(t =>
        `<a class="disc-board-link" href="${board.build(t, f)}" target="_blank" rel="noopener noreferrer">${escAttr(t)}${f.location ? ' · ' + escAttr(f.location) : ''}</a>`
      ).join('');
      const allLink = restCount > 0
        ? `<a class="disc-board-link muted" href="${board.build(targetNames.join(' '), f)}" target="_blank" rel="noopener noreferrer">All ${targetNames.length} roles together</a>`
        : '';
      cardsHtml += `
        <div class="disc-board-card">
          <div class="disc-board-head"><span class="disc-board-name">${board.name}</span></div>
          <div class="disc-board-legend">
            <span class="disc-legend-passed">${legend.passed.map(escAttr).join(' · ')}</span>
            ${legend.notPassed.length ? `<span class="disc-legend-skip">${legend.notPassed.map(escAttr).join(' · ')}</span>` : ''}
          </div>
          <div class="disc-board-links">${links}${allLink}</div>
        </div>`;
    });
    cardsHtml += '</div>';

    let html = '';
    if (autoPicked) {
      html += '<div class="alert alert-success disc-auto-note" style="font-size:.82rem"><strong>Auto-picked your top ' +
        targetNames.length + ' role match' + (targetNames.length === 1 ? '' : 'es') + '</strong> from your resume (' +
        (profile.skills.length) + ' skills, ' + formatExperienceYears(profile.experience) +
        ') so the search is personalized — tune the targets above anytime.</div>';
    }
    html += cardsHtml;
    html += '<div class="disc-results-foot">Pre-filled external searches, not listings fetched by this app. Open one, then copy any JD into the <strong>Job Description</strong> tab to run a Match Analysis.</div>';

    discoveryResults.innerHTML = html;
    renderDiscoveryUI(); // reflect any auto-picked targets in the chips
  }

  // Render applications list
  function renderApplicationsList() {
    if (!applicationsList) return;

    // Malformed saved entries are skipped, never crash the render
    const apps = (Array.isArray(jobApplications) ? jobApplications : []).filter(a => a && typeof a === 'object');
    if (apps.length === 0) {
      applicationsList.innerHTML = '<p class="text-muted">No applications recorded yet. Click "Add Application" to get started.</p>';
      return;
    }

    // Stable id for every entry; legacy entries get one at runtime
    // (persisted on the next save — existing data is otherwise untouched)
    apps.forEach((a, i) => { if (!a.id) a.id = newAppId(); });

    const esc = v => String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    let html = '';
    apps.forEach(app => {
      const statusKey = APP_STATUSES[app.status] ? app.status : 'applied';
      const d = new Date(app.date);
      const dateStr = isNaN(d) ? (app.date || '—') : d.toLocaleDateString();
      html += `
        <div class="card mb-3">
          <div class="card-body">
            <h6>${esc(app.role)} at ${esc(app.company)}</h6>
            <div class="mb-2">
              <small class="text-muted">Applied on: ${esc(dateStr)}</small>
            </div>
            <div class="mb-2 app-status-row">
              <small class="text-muted me-2">Status:</small>
              <select class="form-select form-select-sm app-status-select" data-app-id="${esc(app.id)}">
                ${Object.keys(APP_STATUSES).map(k => `<option value="${k}"${k === statusKey ? ' selected' : ''}>${APP_STATUSES[k]}</option>`).join('')}
              </select>
            </div>
            ${app.link ? `<div class="mb-2"><a href="${esc(app.link)}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">View Job Link</a></div>` : ''}
            ${app.notes ? `<div class="mb-2"><small>Notes:</small> ${esc(app.notes)}</div>` : ''}
            <div class="app-card-actions">
              <button class="btn btn-sm btn-outline-secondary app-edit-btn" data-app-id="${esc(app.id)}">Edit</button>
              <button class="btn btn-sm btn-outline-danger app-delete-btn" data-app-id="${esc(app.id)}">Delete</button>
            </div>
          </div>
        </div>
      `;
    });

    applicationsList.innerHTML = html;

    // Wire per-entry actions
    applicationsList.querySelectorAll('.app-edit-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        const app = apps.find(a => a.id === btn.dataset.appId);
        if (app) startEditApp(app);
      }));
    applicationsList.querySelectorAll('.app-delete-btn').forEach(btn =>
      btn.addEventListener('click', () => deleteApp(btn.dataset.appId)));
    applicationsList.querySelectorAll('.app-status-select').forEach(sel =>
      sel.addEventListener('change', () => setAppStatus(sel.dataset.appId, sel.value)));
  }

  // Initialize the application
  function init() {
    // Restore the last active tab (or fall back to Resume)
    let lastTab = 'resumeAnalysis';
    try {
      const saved = localStorage.getItem('careeraiActiveTab');
      if (saved && tabPanes[saved]) lastTab = saved;
    } catch (e) { /* default to resume */ }
    switchTab(lastTab);

    // Theme system — chips switch Ink / One Piece / Wizarding, persisted
    document.querySelectorAll('.theme-chip').forEach(chip =>
      chip.addEventListener('click', () => applyTheme(chip.dataset.theme)));
    let startTheme = 'ink';
    try { startTheme = localStorage.getItem('appTheme') || 'ink'; } catch (e) { /* ignore */ }
    applyTheme(startTheme);

    // One-time fetch of the active provider/model (existing /api/health
    // endpoint) so AI labels reflect the real provider. Fire-and-forget;
    // labels fall back to neutral "AI" when the server is unreachable.
    refreshAiProviderInfo();

    // Load resume profile on startup
    loadResumeProfileAndUpdateUI();

    // Job Discovery: restore saved search targets, expose the full role
    // catalogue in the browse select, and render the compact targets UI.
    discTargetsLoad();
    repopulateDiscoveryRoleFilter();
    repopulateMatchRoleFilter();
    renderDiscoveryUI();

    // Render applications list
    renderApplicationsList();

    // Seed the Match Analysis panel with a helpful empty state
    renderMatchResults();

    // Career fit placeholders (cards already hidden via d-none in HTML)
    document.getElementById('career-fit-score').textContent = '0%';
    document.getElementById('career-fit-feedback').textContent = 'Analyze your resume to see career fit details.';

    // Rotating quotes — smooth fade-out / rise-in, dots, pause on hover,
    // and the pool swaps with the active theme.
    const quoteEl = document.getElementById('rotatingQuote');
    const quoteTextEl = document.getElementById('rotatingQuoteText');
    const quoteDotsEl = document.getElementById('rotatingQuoteDots');
    if (quoteEl && quoteTextEl && quoteDotsEl) {
      let qi = 0;
      let qTheme = document.documentElement.getAttribute('data-theme') || 'ink';
      let paused = false;

      const activeQuotes = () => THEME_QUOTES[document.documentElement.getAttribute('data-theme') || 'ink'] || THEME_QUOTES.ink;

      function renderDots(count, active) {
        quoteDotsEl.innerHTML = Array.from({ length: count }, (_, i) =>
          `<span class="${i === active ? 'on' : ''}"></span>`).join('');
      }

      const pool = activeQuotes();
      quoteTextEl.textContent = pool[0];
      renderDots(pool.length, 0);

      quoteEl.addEventListener('mouseenter', () => { paused = true; });
      quoteEl.addEventListener('mouseleave', () => { paused = false; });

      setInterval(() => {
        if (paused) return;
        const themeNow = document.documentElement.getAttribute('data-theme') || 'ink';
        if (themeNow !== qTheme) {
          qTheme = themeNow;
          qi = -1; // applyTheme() already showed the new theme's first quote
          renderDots(activeQuotes().length, 0);
          return;
        }
        const q = activeQuotes();
        quoteEl.classList.add('is-out');
        setTimeout(() => {
          qi = (qi + 1) % q.length;
          quoteTextEl.textContent = q[qi];
          Array.from(quoteDotsEl.children).forEach((d, i) => d.classList.toggle('on', i === qi));
          quoteEl.classList.remove('is-out');
        }, 460);
      }, 7000);
    }

  }

  // Planner state: active category tab for the role search selector
  let activeCategory = 'all';

  // Initialize the app
  init();
  // Initialize the planner
  initPlanner();
  // Resume Studio initializes at the END of this callback (after its module
  // consts) — see initStudio() below the planner code.

  // =============================================
  // CAREER TRANSITION PLANNER
  // =============================================


  // Load planner data from localStorage
  // Only restores saved PLANS — not the current selection.
  // Current selection starts empty each session; user can reopen plans without re-selecting.
  function loadPlannerData() {
    try {
      const data = localStorage.getItem('careerPlannerData');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          // Restore only plans — NOT selectedRoles (fresh start each session)
          plannerData.plans = typeof parsed.plans === 'object' ? parsed.plans : {};
          // Reset selection for a clean start
          plannerData.selectedRoles = [];
          plannerData.customRole = '';
        }
      }
    } catch (e) {
      console.error('Failed to load planner data:', e);
    }
  }

  // Save planner data to localStorage
  function savePlannerData() {
    try {
      localStorage.setItem('careerPlannerData', JSON.stringify(plannerData));
    } catch (e) {
      console.error('Failed to save planner data:', e);
    }
  }

  // Clear current comparison selection only (keeps saved plans)
  function clearSelection() {
    if (plannerData.selectedRoles.length === 0 && !plannerData.customRole) {
      alert('No roles selected to clear.');
      return;
    }
    plannerData.selectedRoles = [];
    plannerData.customRole = '';
    savePlannerData();
    renderPlanner();
  }

  // Delete all planner data (selections + plans)
  function clearPlannerData() {
    plannerData.selectedRoles = [];
    plannerData.customRole = '';
    plannerData.plans = {};
    localStorage.removeItem('careerPlannerData');
    renderPlanner();
  }

  // Get all available roles from the role catalogue
  function getAvailableRoles() {
    // Return the flat catalogue (key -> { name, skills, exp, edu, family })
    return ALL_ROLES_FLAT;
  }

  // Render the planner UI.
  // reloadFromStorage: re-reads persisted planner data first. Pass false right
  // after mutating in-memory state (e.g. "Reopen saved plans") — re-reading
  // would reset the selection and undo the mutation.
  function renderPlanner(reloadFromStorage = true) {
    const plannerContent = document.getElementById('plannerContent');
    if (!plannerContent) return;

    // Load saved data
    if (reloadFromStorage) loadPlannerData();

    // Ensure we have resume data to work with (load from localStorage if needed)
    if (Object.keys(resumeData).length === 0) {
      loadResumeProfileAndUpdateUI();
    }

    // Get resume data for analysis
    const hasResumeData = Object.keys(resumeData).length > 0;

    let html = '';

    if (!hasResumeData) {
      // Show empty state when no resume data
      html = `
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <h5>Career Transition Planner</h5>
          <p>To use the Career Transition Planner, please first analyze your resume in the Resume tab.</p>
          <div class="planner-empty-actions">
            <button class="btn btn-outline-primary" id="plannerGoResume">Go to Resume Analysis</button>
          </div>
        </div>
      `;
    } else {
      // Show the main planner interface
      html = `
        <div class="planner-interface">
          <!-- Step 1: Select Target Roles -->
          <div class="planner-step">
            <h6>Step 1: Select Target Roles</h6>
            <p>Choose up to 5 roles to compare. Search by keyword or browse by career family.</p>

            <!-- Searchable Role Selector -->
            <div class="role-search-box mb-3">
              <input type="text" class="form-control" id="roleSearchInput" placeholder="Search roles… (e.g. 'marketing', 'analyst', 'seo')" autocomplete="off">
              <div class="role-category-tabs mt-2" id="roleCategoryTabs"></div>
              <div class="role-search-results" id="roleSearchResults"></div>
            </div>

            <!-- Custom Role Input -->
            <div class="mb-3">
              <label for="customRoleInput" class="form-label">No match? Enter a custom role title:</label>
              <div class="input-group">
                <input type="text" class="form-control" id="customRoleInput" placeholder="e.g., 'Growth Lead', 'Retail Ops Coordinator'" value="${plannerData.customRole}" maxlength="80">
                <button class="btn btn-outline-secondary" id="addCustomRoleBtn">Add</button>
              </div>
            </div>

            <!-- Selected Roles Display -->
            <div class="mb-3" id="selectedRolesDisplay">
              <!-- Selected roles will be shown here -->
            </div>
          </div>

          <!-- Step 2: Compare Roles -->
          <div class="planner-step" id="roleComparisonSection" ${plannerData.selectedRoles.length === 0 ? 'style="display:none;"' : ''}>
            <h6>Step 2: Compare Selected Roles</h6>
            <div id="roleComparisonContent">
              <!-- Role comparison will be generated here -->
            </div>
          </div>

          <!-- Step 3: Generate Plans (only visible when roles are selected) -->
          <div class="planner-step" id="plannerGenerationSection" ${plannerData.selectedRoles.length === 0 ? 'style="display:none;"' : ''}>
            <h6>Step 3: 30-Day Plans</h6>
            <div id="plannerGenerationContent"></div>
          </div>

          <!-- Saved Plans (shown when plans exist but no current selection) -->
          <div class="planner-step" id="savedPlansSection" ${plannerData.selectedRoles.length > 0 || Object.keys(plannerData.plans).length === 0 ? 'style="display:none;"' : ''}>
            <h6>Saved Plans <span class="text-muted" style="font-size:.8rem;font-weight:400;">from a previous session</span></h6>
            <div id="savedPlansContent"></div>
            <button class="btn btn-sm btn-outline-secondary mt-2" id="reopenSavedPlansBtn">Reopen Saved Plans</button>
          </div>

          <!-- Action Buttons -->
          <div class="planner-actions mt-4">
            <button class="btn btn-outline-secondary me-2" id="clearSelectionBtn">Clear Selection</button>
            <button class="btn btn-outline-secondary me-2" id="deleteAllPlannerBtn">Delete All Data</button>
            <button class="btn btn-primary" id="generatePlansBtn" ${plannerData.selectedRoles.length === 0 && !plannerData.customRole ? 'disabled' : ''}>Generate 30-Day Plans</button>
          </div>
        </div>
      `;
    }

    plannerContent.innerHTML = html;

    // Attach event listeners
    if (hasResumeData) {
      attachPlannerEventListeners();

      // Render the searchable role selector
      renderRoleSearch();

      // Render selected roles display
      renderSelectedRolesDisplay();

      // Render comparison and any saved plans on initial load
      renderRoleComparison();
      renderPlans();
      updatePlannerVisibility();
    }

    // Attach empty state button listener
    if (!hasResumeData) {
      document.getElementById('plannerGoResume')?.addEventListener('click', () => {
        switchTab('resumeAnalysis');
      });
    }
  }

  // Attach event listeners for planner controls
  function attachPlannerEventListeners() {
    // Custom role input
    document.getElementById('addCustomRoleBtn')?.addEventListener('click', () => {
      const customRoleInput = document.getElementById('customRoleInput');
      if (customRoleInput) {
        const roleName = customRoleInput.value.trim();
        if (!roleName) return;

        // Check limit (predefined + custom total)
        const totalSelected = plannerData.selectedRoles.length + 1;
        if (totalSelected > 5) {
          alert('You can select a maximum of 5 roles (including custom).');
          return;
        }

        // Prevent duplicate custom role
        if (plannerData.customRole && plannerData.customRole.toLowerCase() === roleName.toLowerCase()) {
          alert('That custom role is already added.');
          return;
        }

        // Add custom role
        plannerData.customRole = roleName;
        customRoleInput.value = '';
        savePlannerData();
        renderRoleSearch();
        renderSelectedRolesDisplay();
        renderRoleComparison();
        updatePlannerVisibility();
      }
    });

    // Clear selection only (keeps saved plans)
    document.getElementById('clearSelectionBtn')?.addEventListener('click', () => {
      clearSelection();
    });

    // Delete all planner data
    document.getElementById('deleteAllPlannerBtn')?.addEventListener('click', () => {
      if (confirm('Delete ALL planner data including saved plans? This cannot be undone.')) {
        clearPlannerData();
      }
    });

    // Generate plans button
    document.getElementById('generatePlansBtn')?.addEventListener('click', () => {
      generateAllPlans();
    });

    // Reopen saved plans — restores the role selection that matches saved plans
    document.getElementById('reopenSavedPlansBtn')?.addEventListener('click', () => {
      const hasCustom = !!plannerData.plans['custom'];
      let catalogKeys = Object.keys(plannerData.plans).filter(k => k !== 'custom');
      // Keep the restored selection within the 5-role limit
      catalogKeys = catalogKeys.slice(0, hasCustom ? 4 : 5);
      plannerData.selectedRoles = catalogKeys;
      plannerData.customRole = hasCustom
        ? (plannerData.plans['custom'].roleInfo?.name || '')
        : '';
      // Render from the in-memory state above: loadPlannerData() (run inside a
      // full renderPlanner()) deliberately empties the selection each session,
      // which would wipe out this restore and leave the plans invisible.
      renderPlanner(false);
    });
  }

  // Render the searchable role selector
  function renderRoleSearch() {
    const searchInput = document.getElementById('roleSearchInput');
    const categoryTabs = document.getElementById('roleCategoryTabs');
    const resultsEl = document.getElementById('roleSearchResults');
    if (!searchInput || !categoryTabs || !resultsEl) return;

    // Render category tabs
    const families = Object.entries(ROLE_CATALOGUE);
    categoryTabs.innerHTML = `
      <button class="role-cat-tab ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">All</button>
      ${families.map(([key, family]) => `
        <button class="role-cat-tab ${activeCategory === key ? 'active' : ''}" data-cat="${key}">${family.label}</button>
      `).join('')}
    `;

    // Category tab click handlers
    categoryTabs.querySelectorAll('.role-cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeCategory = tab.dataset.cat;
        searchInput.value = '';
        renderRoleSearch();
      });
    });

    // Render results (filter by category + search query)
    const query = searchInput.value.trim().toLowerCase();
    let filtered = Object.entries(ALL_ROLES_FLAT);

    if (activeCategory !== 'all') {
      const familyLabel = ROLE_CATALOGUE[activeCategory]?.label;
      filtered = filtered.filter(([key, role]) => role.family === familyLabel);
    }
    if (query) {
      filtered = filtered.filter(([key, role]) =>
        role.name.toLowerCase().includes(query) ||
        role.family.toLowerCase().includes(query) ||
        (role.skills || []).some(s => s.toLowerCase().includes(query))
      );
    }

    // When "All" is selected with no query, show only a compact sample + prompt to search
    const showAllView = activeCategory === 'all' && !query;
    if (showAllView) {
      // Show selected roles first, then a few suggestions from different families
      const selectedFirst = filtered.filter(([key]) => plannerData.selectedRoles.includes(key));
      const suggested = filtered
        .filter(([key]) => !plannerData.selectedRoles.includes(key))
        .slice(0, 10); // Just 10 suggestions
      filtered = [...selectedFirst, ...suggested];
    }

    // Show "at limit" notice
    const atLimit = (plannerData.selectedRoles.length + (plannerData.customRole ? 1 : 0)) >= 5;

    let resultsHtml = '';
    if (atLimit) {
      resultsHtml += '<div class="role-limit-notice">You\'ve reached the 5-role limit. Deselect one to add another.</div>';
    }

    if (filtered.length === 0) {
      resultsHtml += '<p class="role-search-empty">No roles match. Try a different search or enter a custom role below.</p>';
    } else {
      if (showAllView && filtered.length < Object.keys(ALL_ROLES_FLAT).length) {
        resultsHtml += '<p class="role-search-hint">Showing a sample. Use the search box or pick a category above to browse all roles.</p>';
      }

      // Group results by family for display
      const grouped = {};
      filtered.forEach(([key, role]) => {
        const f = role.family || 'Other';
        if (!grouped[f]) grouped[f] = [];
        grouped[f].push([key, role]);
      });

      Object.entries(grouped).forEach(([familyName, roles]) => {
        if (activeCategory !== 'all') {
          resultsHtml += `<div class="role-search-group-label">${familyName}</div>`;
        }
        roles.forEach(([key, role]) => {
          const isSelected = plannerData.selectedRoles.includes(key);
          const isCustomSelected = plannerData.customRole && plannerData.customRole.toLowerCase() === role.name.toLowerCase();
          const isDisabled = atLimit && !isSelected && !isCustomSelected;
          resultsHtml += `
            <button class="role-search-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
              data-key="${key}" data-name="${role.name}"
              ${isDisabled ? 'disabled' : ''}>
              <span class="role-item-name">${role.name}</span>
              <span class="role-item-family">${role.family || ''}</span>
              ${isSelected ? '<span class="role-item-check">✓</span>' : '<span class="role-item-add">+</span>'}
            </button>
          `;
        });
      });
    }

    resultsEl.innerHTML = resultsHtml;

    // Attach click handlers to role items
    resultsEl.querySelectorAll('.role-search-item:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const name = btn.dataset.name;
        if (plannerData.selectedRoles.includes(key)) {
          // Deselect
          plannerData.selectedRoles = plannerData.selectedRoles.filter(r => r !== key);
        } else {
          // Check limit including custom role
          const totalSelected = plannerData.selectedRoles.length + (plannerData.customRole ? 1 : 0);
          if (totalSelected >= 5) return; // Shouldn't happen due to disabled state
          plannerData.selectedRoles.push(key);
        }
        savePlannerData();
        renderRoleSearch();
        renderSelectedRolesDisplay();
        renderRoleComparison();
        updatePlannerVisibility();
      });
    });

    // Search input handler (debounced)
    searchInput.oninput = () => {
      activeCategory = 'all';
      renderRoleSearch();
    };
  }

  // Update section visibility based on selection state
  function updatePlannerVisibility() {
    const hasRoles = plannerData.selectedRoles.length > 0 || !!plannerData.customRole;
    const hasPlans = Object.keys(plannerData.plans).length > 0;
    document.getElementById('roleComparisonSection').style.display = hasRoles ? 'block' : 'none';
    // Main plans section: only when roles are currently selected
    document.getElementById('plannerGenerationSection').style.display = hasRoles ? 'block' : 'none';
    // Saved plans section: only when plans exist but NO current selection
    const savedSection = document.getElementById('savedPlansSection');
    if (savedSection) {
      savedSection.style.display = (!hasRoles && hasPlans) ? 'block' : 'none';
    }
    const genBtn = document.getElementById('generatePlansBtn');
    if (genBtn) {
      genBtn.disabled = !hasRoles;
      genBtn.textContent = hasRoles ? 'Generate 30-Day Plans' : 'Select roles to generate';
    }
  }

  // Render the selected roles display
  function renderSelectedRolesDisplay() {
    const display = document.getElementById('selectedRolesDisplay');
    if (!display) return;

    const selectedRoles = [...plannerData.selectedRoles];
    if (plannerData.customRole) {
      selectedRoles.push({ key: 'custom', name: plannerData.customRole, isCustom: true });
    }

    if (selectedRoles.length === 0) {
      display.innerHTML = '<p class="text-muted">No roles selected yet.</p>';
      return;
    }

    let html = `<h6>Selected Roles (${selectedRoles.length}/5):</h6>`;
    html += '<div class="selected-roles-list">';

    selectedRoles.forEach((role, index) => {
      if (role.isCustom) {
        html += `
          <div class="selected-role-item">
            <span class="role-name">${role.name}</span>
            <button class="btn btn-sm btn-outline-danger remove-role-btn" data-index="${index}">×</button>
          </div>
        `;
      } else {
        const availableRoles = getAvailableRoles();
        const roleInfo = availableRoles[role];
        html += `
          <div class="selected-role-item">
            <span class="role-name">${roleInfo.name}</span>
            <button class="btn btn-sm btn-outline-danger remove-role-btn" data-index="${index}">×</button>
          </div>
        `;
      }
    });

    html += '</div>';
    display.innerHTML = html;

    // Attach remove button listeners
    document.querySelectorAll('.remove-role-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Determine if it's a custom role or regular role based on position
        const isCustomIndex = plannerData.selectedRoles.length + (plannerData.customRole ? 1 : 0) - 1;
        let removedRoleKey = null;
        if (index >= plannerData.selectedRoles.length) {
          // It's the custom role
          plannerData.customRole = '';
        } else {
          // It's a regular role - capture the key before removing
          removedRoleKey = plannerData.selectedRoles[index];
          plannerData.selectedRoles = plannerData.selectedRoles.filter((_, i) => i !== index);
        }

        savePlannerData();
        renderSelectedRolesDisplay();
        renderRoleComparison();

        // Re-render the role search to update selection state
        renderRoleSearch();

        // Show/hide sections based on selection
        updatePlannerVisibility();
      });
    });
  }

  // Render role comparison section (compact)
  function renderRoleComparison() {
    const comparisonContent = document.getElementById('roleComparisonContent');
    if (!comparisonContent) return;

    const roleKeys = [...plannerData.selectedRoles];
    if (roleKeys.length === 0 && !plannerData.customRole) {
      comparisonContent.innerHTML = '<p class="text-muted">Select at least one role above to see a side-by-side comparison.</p>';
      return;
    }

    // Build comparison data for each role
    const rows = [];
    const allRoleKeys = [...plannerData.selectedRoles];
    if (plannerData.customRole) allRoleKeys.push('custom');

    allRoleKeys.forEach(key => {
      if (key === 'custom') {
        rows.push({
          key: 'custom',
          name: plannerData.customRole,
          skills: '—',
          exp: '—',
          edu: '—',
          gaps: 'Define role requirements to analyze',
          strength: plannerData.customRole
        });
      } else {
        const roleProfile = getRoleProfileForKey(key);
        if (!roleProfile) return;
        const roleInfo = getAvailableRoles()[key];
        if (!roleInfo) return;

        const skillsMatch = calculateTargetRoleSkillsMatch(resumeData.skills || [], roleProfile.keySkills || []);
        const expMatch = calculateTieredExperienceMatch(effectiveExperience(resumeData).years, roleProfile.experience || { min: 0, preferred: 0 });
        const eduMatch = calculateTieredEducationMatch(resumeData.education || [], roleProfile.education || { min: '', preferred: '' });

        const missing = getMissingRoleSkills(resumeData.skills || [], roleProfile.keySkills || []);
        const matched = (resumeData.skills || []).filter(s =>
          roleProfile.keySkills.some(k => k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()))
        ).slice(0, 3);

        rows.push({
          key,
          name: roleInfo.name,
          skills: Math.round(skillsMatch * 100) + '%',
          exp: Math.round(expMatch * 100) + '%',
          edu: Math.round(eduMatch * 100) + '%',
          gaps: missing.length > 0 ? missing.slice(0, 3).join(', ') : 'None found',
          strength: matched.length > 0 ? matched.join(', ') : 'Limited overlap'
        });
      }
    });

    // Render compact comparison table
    let html = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Skills</th>
            <th>Exp.</th>
            <th>Education</th>
            <th>Strength</th>
            <th>Top Gaps</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="comp-role">${r.name}</td>
              <td class="${parseInt(r.skills) >= 70 ? 'comp-good' : parseInt(r.skills) >= 40 ? 'comp-ok' : 'comp-low'}">${r.skills}</td>
              <td class="${parseInt(r.exp) >= 70 ? 'comp-good' : parseInt(r.exp) >= 40 ? 'comp-ok' : 'comp-low'}">${r.exp}</td>
              <td class="${parseInt(r.edu) >= 70 ? 'comp-good' : parseInt(r.edu) >= 40 ? 'comp-ok' : 'comp-low'}">${r.edu}</td>
              <td class="comp-strength">${r.strength}</td>
              <td class="comp-gaps">${r.gaps}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="comparison-note">Scores = how much of the role's requirements your profile covers. Not a hiring probability.</p>
    `;

    comparisonContent.innerHTML = html;
  }

  // Generate plans for all selected roles
  function generateAllPlans() {
    if (Object.keys(resumeData).length === 0) {
      alert('Please analyze your resume first.');
      return;
    }

    const rolesToProcess = [...plannerData.selectedRoles];
    if (plannerData.customRole) {
      rolesToProcess.push('custom');
    }

    if (rolesToProcess.length === 0) {
      alert('Please select at least one role.');
      return;
    }

    // Clear plans for roles NOT in the current selection (prevent unrelated old plans showing)
    const keepKeys = new Set(rolesToProcess);
    Object.keys(plannerData.plans).forEach(k => {
      if (!keepKeys.has(k)) delete plannerData.plans[k];
    });

    // Show loading state
    const plannerGenerationContent = document.getElementById('plannerGenerationContent');
    if (plannerGenerationContent) {
      plannerGenerationContent.innerHTML = '<div class="text-center py-4"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    }

    // Generate plans for each role
    const promises = rolesToProcess.map(roleKey =>
      roleKey === 'custom'
        ? generateCustomRolePlan(plannerData.customRole)
        : generateRolePlan(roleKey)
    );

    Promise.all(promises)
      .then(() => {
        // Save and render plans
        savePlannerData();
        renderPlans();
      })
      .catch(error => {
        console.error('Error generating plans:', error);
        if (plannerGenerationContent) {
          plannerGenerationContent.innerHTML = '<div class="alert alert-danger">Error generating plans. Please try again.</div>';
        }
      });
  }

  // Generate a plan for a specific role
  function generateRolePlan(roleKey) {
    return new Promise((resolve) => {
      // Get role info
      const availableRoles = getAvailableRoles();
      const roleInfo = availableRoles[roleKey];
      if (!roleInfo) {
        resolve(null);
        return;
      }

      // Analyze fit between resume and role
      const roleProfile = getRoleProfileForKey(roleKey);
      if (!roleProfile) {
        resolve(null);
        return;
      }

      // Calculate match percentages
      const skillsMatch = calculateTargetRoleSkillsMatch(resumeData.skills || [], roleProfile.keySkills || []);
      const experienceMatch = calculateTieredExperienceMatch(effectiveExperience(resumeData).years, roleProfile.experience || { min: 0, preferred: 0 });
      const educationMatch = calculateTieredEducationMatch(resumeData.education || [], roleProfile.education || { min: '', preferred: '' });

      // Generate detailed analysis
      const analysis = analyzeRoleFit(resumeData, roleProfile, roleInfo.name);

      // Generate 30-day plan
      const plan = generate30DayPlan(resumeData, roleProfile, roleInfo.name, skillsMatch, experienceMatch, educationMatch);

      // Store the plan
      plannerData.plans[roleKey] = {
        roleInfo: roleInfo,
        analysis: analysis,
        plan: plan,
        matchScores: {
          skills: skillsMatch,
          experience: experienceMatch,
          education: educationMatch
        },
        generatedAt: new Date().toISOString()
      };

      resolve(plannerData.plans[roleKey]);
    });
  }

  // Generate a plan for a custom role
  function generateCustomRolePlan(customRoleName) {
    return new Promise((resolve) => {
      // For custom roles, we'll create a basic analysis based on the resume data
      // Since we don't have a predefined profile, we'll use a generic approach

      // Analyze the resume to extract key information
      const skills = resumeData.skills || [];
      const totalExperience = effectiveExperience(resumeData).years;
      const education = resumeData.education || [];

      // Generate a basic analysis
      const analysis = {
        roleName: customRoleName,
        overview: `A customized role based on "${customRoleName}".`,
        suitability: `This role represents your career aspiration of becoming a ${customRoleName}.`,
        evidence: {
          supportedSkills: skills.slice(0, 5), // Top 5 skills
          transferableSkills: [], // Would need more analysis to determine
          relevantExperience: `${formatExperienceYears(totalExperience)} of total experience`,
          missingEvidence: ['Specific role requirements need to be defined']
        },
        gaps: {
          skillGaps: [], // Would need role-specific skills to compare
          experienceGaps: [], // Would need role-specific experience requirements
          educationGaps: [] // Would need role-specific education requirements
        }
      };

      // Generate a basic 30-day plan
      const plan = generateGeneric30DayPlan(skills, totalExperience, education, customRoleName);

      // Store the plan
      plannerData.plans['custom'] = {
        roleInfo: { name: customRoleName, category: 'Custom' },
        analysis: analysis,
        plan: plan,
        matchScores: {
          skills: 0.5, // Placeholder
          experience: 0.5, // Placeholder
          education: 0.5 // Placeholder
        },
        generatedAt: new Date().toISOString()
      };

      resolve(plannerData.plans['custom']);
    });
  }

  // Get role profile for a role key — uses the shared ROLE_CATALOGUE
  function getRoleProfileForKey(roleKey) {
    const role = ALL_ROLES_FLAT[roleKey];
    if (!role) return null;
    // Normalize to the old format expected by analyzeRoleFit and match functions
    return {
      name: role.name,
      keySkills: role.skills,
      experience: role.exp,
      education: role.edu,
      family: role.family
    };
  }

  // Analyze role fit between resume data and role profile
  function analyzeRoleFit(resumeData, roleProfile, roleName) {
    const skills = resumeData.skills || [];
    const experience = effectiveExperience(resumeData).years;
    const education = resumeData.education || [];

    // Calculate matches
    const skillsMatch = calculateTargetRoleSkillsMatch(skills, roleProfile.keySkills || []);
    const experienceMatch = calculateTieredExperienceMatch(experience, roleProfile.experience || { min: 0, preferred: 0 });
    const educationMatch = calculateTieredEducationMatch(education, roleProfile.education || { min: '', preferred: '' });

    // Identify supported skills (evidence of fit)
    const resumeSkillsLower = skills.map(s => s.toLowerCase());
    const roleSkillsLower = (roleProfile.keySkills || []).map(s => s.toLowerCase());
    const supportedSkills = [];
    const transferableSkills = [];

    roleProfile.keySkills?.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const isDirectMatch = resumeSkillsLower.some(resumeSkill =>
        resumeSkill.includes(skillLower) || skillLower.includes(resumeSkill)
      );

      if (isDirectMatch) {
        supportedSkills.push(skill);
      } else {
        // Check for transferable skills (simplified)
        // In a real implementation, this would be more sophisticated
        transferableSkills.push(skill);
      }
    });

    // Identify missing skills
    const missingSkills = roleProfile.keySkills?.filter(skill =>
      !supportedSkills.includes(skill)
    ) || [];

    // Generate analysis
    return {
      roleName: roleName,
      overview: getRoleOverview(roleName),
      suitability: getRoleSuitabilityStatement(roleName, skillsMatch, experienceMatch, educationMatch),
      evidence: {
        supportedSkills: supportedSkills,
        transferableSkills: transferableSkills.slice(0, 3), // Limit for display
        relevantExperience: `${formatExperienceYears(experience)} of total experience`,
        missingEvidence: missingSkills
      },
      gaps: {
        skillGaps: missingSkills,
        experienceGaps: experienceMatch < 0.8 ? [generateExperienceGapText(experience, roleProfile.experience)] : [],
        educationGaps: educationMatch < 0.8 ? [generateEducationGapText(education, roleProfile.education)] : []
      }
    };
  }

  // Get role overview text
  function getRoleOverview(roleName) {
    const overviews = {
      'E-commerce Operations Specialist': 'Manages online store operations, including product listings, inventory, and marketplace compliance across platforms like Amazon, Walmart, and eBay.',
      'Marketplace Analyst': 'Analyzes marketplace performance data to optimize product listings, pricing strategies, and advertising campaigns across e-commerce platforms.',
      'E-commerce Analyst': 'Analyzes e-commerce performance metrics to identify trends, optimize product listings, and improve marketplace compliance.',
      'Business Analyst': 'Bridge between business needs and technical solutions by analyzing processes, documenting requirements, and recommending improvements.',
      'Operations Analyst': 'Focuses on improving operational efficiency through process analysis, workflow optimization, and performance monitoring.',
      'Marketing Analyst': 'Analyzes marketing campaign performance to optimize advertising spend, improve targeting, and measure ROI.',
      'Performance Marketing Analyst': 'Specializes in optimizing paid advertising campaigns across platforms like Meta Ads and Google Ads to maximize ROAS.',
      'Marketing Analytics Analyst': 'Focuses on analyzing marketing data from multiple sources to provide insights for campaign optimization and strategy.',
      'AI Operations Analyst': 'Applies AI/ML techniques to optimize business processes, automate workflows, and provide predictive insights.',
      'Workflow Automation Analyst': 'Designs and implements automated workflows to streamline business processes and reduce manual effort.',
      'Junior Data Analyst': 'Performs data analysis tasks including data cleaning, visualization, and basic statistical analysis to support business decisions.'
    };

    return overviews[roleName] || `A professional role focused on ${roleName.toLowerCase()} responsibilities.`;
  }

  // Generate suitability statement
  function getRoleSuitabilityStatement(roleName, skillsMatch, experienceMatch, educationMatch) {
    const avgMatch = (skillsMatch + experienceMatch + educationMatch) / 3;

    if (avgMatch >= 0.8) {
      return `Your background shows strong alignment with the ${roleName} role, particularly in skills and experience.`;
    } else if (avgMatch >= 0.6) {
      return `Your background shows good potential for the ${roleName} role with some areas for development.`;
    } else if (avgMatch >= 0.4) {
      return `Your background shows moderate alignment with the ${roleName} role, indicating this could be a suitable career transition with focused development.`;
    } else {
      return `Your background shows some relevant experience for the ${roleName} role, but significant development would be needed for a successful transition.`;
    }
  }

  // Generate experience gap text
  function generateExperienceGapText(experience, roleExperience) {
    const years = experience || 0;
    const minYears = roleExperience?.min || 0;
    const preferredYears = roleExperience?.preferred || minYears;

    if (years >= preferredYears) {
      return `Your experience (${formatExperienceYears(years)}) meets or exceeds the preferred requirement (${formatExperienceYears(preferredYears)}).`;
    } else if (years >= minYears) {
      return `Your experience (${formatExperienceYears(years)}) meets the minimum requirement (${formatExperienceYears(minYears)}) but is below the preferred (${formatExperienceYears(preferredYears)}).`;
    } else {
      return `Your experience (${formatExperienceYears(years)}) is below the minimum requirement (${formatExperienceYears(minYears)}) for this role.`;
    }
  }

  // Generate education gap text
  function generateEducationGapText(education, roleEducation) {
    const hasEducation = Array.isArray(education) && education.length > 0;
    const minEdu = roleEducation?.min || '';
    const preferredEdu = roleEducation?.preferred || minEdu;

    if (!hasEducation) {
      return `No formal education documented in your profile. This role typically requires at least ${minEdu.toUpperCase()}.`;
    }

    // Simplified check - in reality would need to compare specific degrees
    return `Consider pursuing ${preferredEdu.toUpperCase()}`;
  }

  // Generate 30-day plan for a role
  function generate30DayPlan(resumeData, roleProfile, roleName, skillsMatch, experienceMatch, educationMatch) {
    const skills = resumeData.skills || [];
    const missingSkills = getMissingRoleSkills(skills, roleProfile.keySkills || []);
    const strongSkills = (roleProfile.keySkills || []).filter(k =>
      skills.some(s => s.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(s.toLowerCase()))
    ).slice(0, 3);

    // Build role-specific week 1 activities
    const week1Activities = [];
    if (missingSkills.length > 0) {
      week1Activities.push(`Identify free resources to learn: ${missingSkills.slice(0, 3).join(', ')}`);
    } else {
      week1Activities.push(`Map your ${strongSkills.length > 0 ? strongSkills.join(', ') : 'existing skills'} to what a ${roleName} actually does day-to-day`);
    }
    week1Activities.push(`Read 2-3 real ${roleName} job posts and list their top 5 daily tasks`);
    week1Activities.push(`Find 1 example of outstanding ${roleName} work online (portfolio, case study, or post) and note what makes it strong`);

    // Build role-specific week 2-3 activities
    const week23Activities = [];
    if (missingSkills.length > 0) {
      week23Activities.push(`Build one small project or document that demonstrates: ${missingSkills.slice(0, 2).join(', ')}`);
    }
    if (strongSkills.length > 0) {
      week23Activities.push(`Reframe your ${strongSkills[0]} experience into a short case study relevant to ${roleName} work`);
    }
    week23Activities.push(`Tailor 1 bullet on your resume to highlight transferable skills for this specific role`);
    if (experienceMatch < 0.7) {
      week23Activities.push(`Write a "projects" or "practical experience" section showing relevant work even from non-traditional contexts`);
    }

    // Build role-specific week 4 activities
    const week4Activities = [];
    week4Activities.push(`Create a 1-page portfolio piece or deliverable that a ${roleName} would produce (report, plan, dashboard, or brief)`);
    week4Activities.push(`Update your resume's top 3 bullets to mirror ${roleName} language and metrics`);
    week4Activities.push(`Prepare a 2-minute self-introduction tailored to ${roleName} roles you'd apply to`);
    if (missingSkills.length > 0) {
      week4Activities.push(`Draft a short "learning roadmap" for the skills you haven't demonstrated yet — shows hiring managers you have a plan`);
    }

    const weeks = [
      {
        week: 1,
        title: 'Understand the Role',
        objective: `Understand what a ${roleName} actually does and where your current skills map`,
        activities: week1Activities,
        deliverable: 'A one-page role map: top 5 tasks, 3 tools you already know, 2 you need to learn'
      },
      {
        week: '2–3',
        title: 'Build Evidence',
        objective: 'Produce something concrete that shows you can do the work',
        activities: week23Activities,
        deliverable: 'One portfolio piece or case study + updated resume bullet'
      },
      {
        week: 4,
        title: 'Package & Apply',
        objective: 'Make it easy for a hiring manager to say yes',
        activities: week4Activities,
        deliverable: 'Updated resume + 1-page deliverable + 2-min pitch script'
      }
    ];

    return {
      roleName,
      weeks,
      priorityAreas: missingSkills,
      generatedAt: new Date().toISOString()
    };
  }

  // Generate a generic 30-day plan for custom roles
  function generateGeneric30DayPlan(skills, experience, education, roleName) {
    return {
      roleName: roleName,
      weeks: [
        {
          week: 1,
          title: 'Orientation & Planning',
          objective: 'Understand the role requirements and create a development plan',
          activities: [
            `Research what a ${roleName} typically does`,
            'Identify key competencies needed for success',
            'Assess your current strengths and areas for growth',
            'Create a personalized 30-day development plan'
          ],
          deliverable: 'Customized development plan for the target role',
          evaluation: 'Completed plan document',
          nextStep: 'Begin skill development activities'
        },
        {
          week: '2-3',
          title: 'Skill Building',
          objective: 'Develop key competencies for the target role',
          activities: [
            'Focus on technical skills development',
            'Build transferable skills from your current experience',
            'Practice applying knowledge to practical scenarios',
            'Seek feedback from mentors or peers'
          ],
          deliverable: 'Skill development portfolio',
          evaluation: 'Completed skill practice items',
          nextStep: 'Apply skills to comprehensive projects'
        },
        {
          week: 4,
          title: 'Portfolio & Preparation',
          objective: 'Create demonstration work and prepare for job search',
          activities: [
            'Complete a capstone project demonstrating your capabilities',
            'Develop professional presentation materials',
            'Update professional profiles with new skills',
            'Begin networking and application process'
          ],
          deliverable: 'Professional portfolio and job search materials',
          evaluation: 'Completed portfolio ready for employer review',
          nextStep: 'Start applying to positions in your target field'
        }
      ],
      generatedAt: new Date().toISOString()
    };
  }

  // Render generated plans
  function renderPlans() {
    const hasRoles = plannerData.selectedRoles.length > 0 || !!plannerData.customRole;
    const hasPlans = Object.keys(plannerData.plans).length > 0;

    // Render the "Saved Plans" section (only when no roles selected but plans exist)
    const savedContent = document.getElementById('savedPlansContent');
    const savedSection = document.getElementById('savedPlansSection');
    if (savedSection) {
      savedSection.style.display = (!hasRoles && hasPlans) ? 'block' : 'none';
      if (savedContent && !hasRoles && hasPlans) {
        let savedHtml = `<p style="font-size:.8rem;color:var(--muted);margin-bottom:.5rem;">${hasPlans ? Object.keys(plannerData.plans).length : 0} plan(s) saved from a previous session. Click "Reopen" to view them, or select new roles above to generate updated plans.</p>`;
        savedContent.innerHTML = savedHtml;
      }
    }

    // The main plans container only shows content when roles are selected
    const plannerGenerationContent = document.getElementById('plannerGenerationContent');
    if (!plannerGenerationContent) return;

    if (!hasRoles || !hasPlans) {
      plannerGenerationContent.innerHTML = '<p class="text-muted">Select roles above, then click "Generate 30-Day Plans". Your plan will appear here.</p>';
      return;
    }

    let html = '';

    Object.keys(plannerData.plans).forEach(roleKey => {
      const planData = plannerData.plans[roleKey];
      if (!planData) return;

      const roleInfo = planData.roleInfo;
      const analysis = planData.analysis;
      const plan = planData.plan;
      const scores = planData.matchScores;

      const skillsPct = Math.round(scores.skills * 100);
      const expPct = Math.round(scores.experience * 100);
      const eduPct = Math.round(scores.education * 100);
      const gapList = analysis.gaps.skillGaps.filter(Boolean);
      const topGaps = gapList.slice(0, 3);

      html += `
        <div class="plan-card" data-plan="${roleKey}">
          <!-- Compact summary header (always visible) -->
          <div class="plan-summary">
            <div class="plan-summary-top">
              <h5>${roleInfo.name}</h5>
              <span class="plan-badge">Fit ${Math.round((skillsPct + expPct + eduPct) / 3)}%</span>
            </div>

            <!-- Three mini progress bars -->
            <div class="plan-bars">
              <div class="plan-bar-row">
                <span class="plan-bar-label">Skills</span>
                <div class="plan-bar-track"><div class="plan-bar-fill" style="width:${skillsPct}%;background:${skillsPct >= 70 ? 'var(--accent)' : 'var(--warn)'}"></div></div>
                <span class="plan-bar-val">${skillsPct}%</span>
              </div>
              <div class="plan-bar-row">
                <span class="plan-bar-label">Experience</span>
                <div class="plan-bar-track"><div class="plan-bar-fill" style="width:${expPct}%;background:${expPct >= 70 ? 'var(--accent)' : 'var(--warn)'}"></div></div>
                <span class="plan-bar-val">${expPct}%</span>
              </div>
              <div class="plan-bar-row">
                <span class="plan-bar-label">Education</span>
                <div class="plan-bar-track"><div class="plan-bar-fill" style="width:${eduPct}%;background:${eduPct >= 70 ? 'var(--accent)' : 'var(--warn)'}"></div></div>
                <span class="plan-bar-val">${eduPct}%</span>
              </div>
            </div>

            <!-- Top gaps as chips -->
            ${topGaps.length > 0 ? `
              <div class="plan-gaps">
                <span class="plan-gaps-label">Close these first:</span>
                ${topGaps.map(g => `<span class="gap-chip">${g}</span>`).join('')}
              </div>
            ` : '<div class="plan-gaps"><span class="gap-chip gap-chip-good">No major gaps</span></div>'}

            <button class="plan-toggle-btn" data-role="${roleKey}">View 30-Day Plan <span class="plan-toggle-arrow">▸</span></button>
          </div>

          <!-- Expandable detailed plan (hidden by default) -->
          <div class="plan-detail" id="plan-detail-${roleKey}" style="display:none;">
            ${plan.weeks.map(week => `
              <div class="plan-week">
                <div class="plan-week-head">
                  <strong>Wk ${week.week} · ${week.title}</strong>
                  ${week.deliverable ? `<span class="plan-week-deliverable">${week.deliverable}</span>` : ''}
                </div>
                <ul class="plan-week-activities">
                  ${(week.activities || []).slice(0, 4).map(a => `<li>${a}</li>`).join('')}
                </ul>
              </div>
            `).join('')}

            <div class="plan-actions">
              <button class="btn btn-sm btn-outline-secondary export-plan-btn" data-role="${roleKey}">Export</button>
              <button class="btn btn-sm btn-outline-secondary reset-progress-btn" data-role="${roleKey}">Reset Progress</button>
            </div>
          </div>
        </div>
      `;
    });

    plannerGenerationContent.innerHTML = html;

    // Attach toggle buttons (expand/collapse detail section)
    document.querySelectorAll('.plan-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roleKey = btn.dataset.role;
        const detail = document.getElementById(`plan-detail-${roleKey}`);
        const isOpen = detail.style.display !== 'none';
        detail.style.display = isOpen ? 'none' : 'block';
        btn.querySelector('.plan-toggle-arrow').textContent = isOpen ? '▸' : '▾';
        btn.childNodes[0].textContent = isOpen ? 'View 30-Day Plan ' : 'Hide 30-Day Plan ';
      });
    });

    // Attach export and reset buttons
    document.querySelectorAll('.export-plan-btn').forEach(btn => {
      btn.addEventListener('click', () => exportPlan(btn.dataset.role));
    });
    document.querySelectorAll('.reset-progress-btn').forEach(btn => {
      btn.addEventListener('click', () => resetPlanProgress(btn.dataset.role));
    });
  }

  // Export a plan (in a real app, this might generate a PDF or document)
  function exportPlan(roleKey) {
    const planData = plannerData.plans[roleKey];
    if (!planData) return;

    // Create a simple text representation for export
    const roleInfo = planData.roleInfo;
    const analysis = planData.analysis;
    const plan = planData.plan;

    let text = `CAREER TRANSITION PLAN\n`;
    text += `=====================\n\n`;
    text += `Role: ${roleInfo.name}\n`;
    text += `Generated: ${new Date(planData.generatedAt).toLocaleString()}\n\n`;
    text += `OVERVIEW\n${analysis.overview}\n\n`;
    text += `FIT ASSESSMENT\n${analysis.suitability}\n\n`;
    text += `30-DAY PLAN\n`;

    plan.weeks.forEach(week => {
      text += `\nWeek ${week.week}: ${week.title}\n`;
      text += `Objective: ${week.objective}\n`;
      text += `Activities:\n`;
      week.activities.forEach(activity => {
        text += `  - ${activity}\n`;
      });
      text += `Deliverable: ${week.deliverable}\n`;
    });

    // In a real app, we might use a library to generate a PDF or DOCX
    // For now, we'll show it in a modal or prompt to copy
    alert(`Plan for ${roleInfo.name} ready to export!\n\n${text.substring(0, 200)}...\n\n(In a full implementation, this would generate a downloadable document)`);
  }

  // Reset progress for a plan
  function resetPlanProgress(roleKey) {
    if (confirm(`Reset progress for ${plannerData.plans[roleKey]?.roleInfo.name || 'this plan'}?`)) {
      // In a full implementation, we might track completion status per task
      // For now, we'll just regenerate the plan
      delete plannerData.plans[roleKey];
      savePlannerData();

      // Regenerate if still selected
      const isStillSelected = plannerData.selectedRoles.includes(roleKey) ||
                             (roleKey === 'custom' && !!plannerData.customRole);
      if (isStillSelected) {
        if (roleKey === 'custom') {
          generateCustomRolePlan(plannerData.customRole).then(() => renderPlans());
        } else {
          generateRolePlan(roleKey).then(() => renderPlans());
        }
      } else {
        renderPlans();
      }
    }
  }

  // Initialize planner on startup
  function initPlanner() {
    loadPlannerData();
    renderPlanner();
  }

  // Call planner initialization after the main init
  // We'll modify the init() call at the bottom of the file to also init planner

  // ============================================================================
  // RESUME STUDIO
  // A local improvement studio on top of the SHARED saved profile. Rule-based
  // only (no AI service, no network): every suggestion is derived from the
  // analyzed profile itself and carries an evidence label — factual rewrite /
  // supported inference / needs your input. Drafts live in their own
  // localStorage key; the primary saved resume profile is never modified.
  // ============================================================================

  function loadStudioDrafts() {
    try {
      const data = JSON.parse(localStorage.getItem(STUDIO_DRAFTS_KEY) || '[]');
      if (!Array.isArray(data)) return [];
      // Keep every valid entry; drop malformed ones individually (never blank
      // the whole shelf) — same convention as loadApplications.
      return data.filter(d => d && typeof d === 'object' && typeof d.text === 'string'
        && typeof d.name === 'string' && d.id);
    } catch (e) { return []; }
  }

  function saveStudioDrafts(list) {
    try { localStorage.setItem(STUDIO_DRAFTS_KEY, JSON.stringify(list || [])); }
    catch (e) { /* storage unavailable (private mode) — in-memory shelf only */ }
  }

  // (studioState + STUDIO_SECTIONS are declared at the top of the callback —
  // see "Global data storage" — so renderStudio() is safe even when init()
  // activates the studio tab from a persisted value before this section's
  // code has executed.)

  // Guarded: in the test harness (or if studio-data.js failed to load)
  // window.STUDIO_* may be absent or not arrays — degrade to "no examples".
  function studioTemplates() { const t = window.STUDIO_TEMPLATES; return Array.isArray(t) ? t : []; }
  function studioExamples() { const e = window.STUDIO_EXAMPLES; return Array.isArray(e) ? e : []; }
  function studioResources() { const r = window.STUDIO_RESOURCES; return Array.isArray(r) ? r : []; }
  function studioRoleOptions() {
    return Object.entries(ALL_ROLES_FLAT || {}).map(([key, r]) =>
      ({ value: key, label: r.name + (key ? ' (' + key + ')' : '') }));
  }

  // Summarize experience honestly: dated when parseable, "as stated" when
  // only the candidate's own figure exists, "recent" when neither.
  function studioExpPhrase(profile) {
    const eff = effectiveExperience(profile || {});
    if (eff.source === 'stated') return '≈' + formatExperienceYears(eff.years) + ' (as stated by you)';
    if (eff.source === 'dates') return formatExperienceYears(eff.years);
    return 'recent';
  }

  function studioAutoSummary(profile, roleKey) {
    const skillTop = ((profile && profile.skills) || []).slice(0, 3)
      .map(s => String(s).charAt(0).toUpperCase() + String(s).slice(1)).join(', ');
    const role = (ALL_ROLES_FLAT && roleKey && ALL_ROLES_FLAT[roleKey]) ? ALL_ROLES_FLAT[roleKey].name : 'professional';
    return studioExpPhrase(profile) + ' ' + role + ' with hands-on experience in ' +
      (skillTop || 'your core skills') + '.';
  }

  // Content-matched verb for weak-opener rewrites (only the opener changes;
  // the bullet's own words are preserved — nothing is invented).
  function studioVerbFor(content) {
    const t = String(content || '').toLowerCase();
    if (/\b(manag)\w*\b/.test(t)) return 'Managed';
    if (/\b(led|oversaw|supervis|ran|direct|head)\w*\b/.test(t)) return 'Led';
    if (/\b(build|creat|develop|design|implement|shipped|migrat)\w*\b/.test(t)) return 'Built';
    if (/\b(automat|streamlin|integrat|optimi[sz])\b/.test(t)) return 'Automated';
    if (/\b(reduc|cut|lower|sav)\b/.test(t)) return 'Reduced';
    if (/\b(test|valid|review|verif|audit)\b/.test(t)) return 'Validated';
    if (/\b(report|document|analy)\b/.test(t)) return 'Reported';
    if (/\b(own|support|maintain)\b/.test(t)) return 'Owned';
    return 'Delivered';
  }

  // Lines under a heading section (Projects / Certifications), bounded by the
  // next recognized section heading.
  function studioExtractSectionLines(rawText, headingRe) {
    const lines = String(rawText || '').split(/\r?\n/);
    const nextSection = /^(summary|about|profile|objective|experience|employment|work\s+history|education|skills?|projects?|certifications?|achievements|languages?|interests?)\b/i;
    const out = [];
    let inSec = false;
    for (const line of lines) {
      const t = line.trim();
      if (t.length === 0) { if (inSec) { break; } continue; }
      if (inSec) {
        if (nextSection.test(t) && !headingRe.test(t) && t.length < 40) break;
        out.push(t);
      } else if (headingRe.test(t) && t.length < 40) {
        inSec = true;
      }
    }
    return out;
  }

  // ---- Improve workflow: rule-based suggestions from the saved profile ----
  function studioBuildSuggestions() {
    const profile = getSavedResumeProfile() || {};
    const roleKey = studioState.improveRole;
    const role = (ALL_ROLES_FLAT && ALL_ROLES_FLAT[roleKey]) || null;
    const raw = profile.rawText || '';
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const bullets = lines.filter(l => BULLET_LINE_RE.test(l));
    const sugg = [];
    let n = 0;
    const push = o => sugg.push(Object.assign({ id: 's' + (++n) }, o));

    // 1. Weak openers -> factual rewrite (opener swapped, words kept)
    const WEAK = ['responsible for', 'responsible', 'duties included', 'tasked with',
      'was responsible', 'helped with', 'involved in', 'assisted in', 'participated in'];
    bullets.forEach(b => {
      const s = b.replace(BULLET_MARKER_STRIP_RE, '').trim();
      const low = s.toLowerCase();
      const weak = WEAK.find(k => low.startsWith(k));
      if (!weak) return;
      let rest = s.replace(new RegExp('^' + weak.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'i'), '')
        .replace(/[.,]\s*$/, '').trim();
      if (!rest) return;
      const verb = studioVerbFor(rest);
      // If the content already leads with the same verb in another form
      // ("responsible for managing…" -> "Managed the monthly close"), drop
      // the duplicated verb word instead of writing "Managed managing…".
      const verbBase = verb.replace(/(ed|s|ing)$/, '').toLowerCase();
      if (verbBase.length >= 3) {
        rest = rest.replace(new RegExp('^' + verbBase + '\\w*\\s+', 'i'), '').trim() || rest;
      }
      push({
        area: 'Experience bullet', kind: 'factual', original: b,
        proposed: '• ' + verb + (rest && rest !== s ? ' ' + rest : ''),
        why: 'Action verbs open stronger than "' + weak + '". Only the opener changes — the content is your own wording.',
        autoApply: 'replace'
      });
    });

    // 2. Numberless bullets -> ask for a REAL metric (never invent one)
    bullets.filter(b => !/\d/.test(b)).slice(0, 4).forEach(b => {
      push({
        area: 'Quantified impact', kind: 'needs-input', original: b,
        proposed: b + ' [+ your measurable result]',
        why: 'This bullet has no number. If you have a real, verifiable result (%, time, ₹, scale), add it — this app will not invent one.',
        autoApply: 'replace'
      });
    });

    // 3. Summary (supported inference, reworded from profile facts only)
    const hasSummary = lines.slice(0, 6).some(l => !BULLET_LINE_RE.test(l) && l.length > 40 && !/\b@/.test(l));
    if (!hasSummary && (profile.skills || []).length > 0) {
      push({
        area: 'Professional summary', kind: 'inferred', original: '',
        proposed: studioAutoSummary(profile, roleKey),
        why: 'Reworded from your profile (' + studioExpPhrase(profile) + ', top skills) — no facts added. Edit it to your own voice before using it.',
        autoApply: 'insert-top'
      });
    }

    // 4. Target-role keyword gaps -> user must confirm each is honest
    if (role) {
      getMissingRoleSkills(profile.skills, role.skills).slice(0, 3).forEach(sk => {
        push({
          area: 'Relevance to ' + role.name, kind: 'needs-input', original: '',
          proposed: sk,
          why: 'The ' + role.name + ' profile lists "' + sk + '". Add it to your Skills only if you genuinely have it (work, projects or coursework) — padding gets caught in interviews.',
          autoApply: 'skip'
        });
      });
    }

    // 5. Pasted JD keywords -> alignment notes
    if (studioState.improveJd.trim()) {
      const jdSkills = parseJobDescription(studioState.improveJd).keySkills || [];
      getMissingRoleSkills(profile.skills, jdSkills).slice(0, 4).forEach(sk => {
        push({
          area: 'JD keyword alignment', kind: 'needs-input', original: '',
          proposed: sk,
          why: 'This JD names "' + sk + '". Use it where it reflects your real experience; never add a skill you cannot demonstrate.',
          autoApply: 'skip'
        });
      });
    }

    // 6. Structure sanity (inference, advisory only — not auto-applied)
    if (lines.length > 90) {
      push({
        area: 'Structure', kind: 'inferred', original: '', proposed: '',
        why: 'Your resume runs to ' + lines.length + ' lines (roughly 2+ pages). Keep your two most recent roles in full detail and compress older ones to one line each.',
        autoApply: 'skip'
      });
    }
    if (lines.some(l => /^-\s/.test(l)) && lines.some(l => /^[•●]\s?/.test(l))) {
      push({
        area: 'Consistency', kind: 'factual', original: '', proposed: '',
        why: 'You mix "-" and "•" bullet markers. Pick one marker throughout so the document reads consistently.',
        autoApply: 'skip'
      });
    }

    // 7. Grammar: one repeated word, if present
    const dup = raw.match(/\b(\w{3,})\s+\1\b/i);
    if (dup) {
      push({
        area: 'Grammar', kind: 'factual', original: dup[0], proposed: dup[1],
        why: 'Repeated word: "' + dup[0] + '" -> "' + dup[1] + '".',
        autoApply: 'replace'
      });
    }

    return sugg;
  }

  // Apply every ACCEPTED auto-applicable suggestion to the DRAFT text.
  // The saved source resume and profile are never touched.
  function studioApplyAccepted() {
    const accepted = (studioState.suggestions || [])
      .filter(s => studioState.accepted.includes(s.id) && s.autoApply !== 'skip');
    if (accepted.length === 0) return 0;
    studioState.snapshot = studioState.draftText;
    let text = studioState.draftText;
    let count = 0;
    accepted.forEach(s => {
      if (s.autoApply === 'insert-top') {
        if (!text.includes(s.proposed)) {
          text = s.proposed + '\n' + text;
          count++;
        }
        return;
      }
      if (s.autoApply === 'replace') {
        // Line-anchored replacement: match the line whose unmarked content
        // equals the original bullet; fall back to an exact string replace.
        const needle = String(s.original).trim();
        if (!needle) return;
        const markerless = l => l.trim().replace(BULLET_MARKER_STRIP_RE, '').trim();
        const foundLine = text.split('\n').find(l => markerless(l) === markerless(needle));
        if (foundLine !== undefined) {
          text = text.replace(foundLine, s.proposed);
          count++;
        } else if (text.includes(needle)) {
          text = text.split(needle).join(s.proposed);
          count++;
        }
      }
    });
    studioState.draftText = text;
    studioState.applied = accepted.map(s => s.id);
    return count;
  }

  function studioUndoApply() {
    if (studioState.snapshot) studioState.draftText = studioState.snapshot;
    studioState.applied = [];
  }

  // ---- New-draft builder: verified profile data + explicit placeholders ----
  function studioDraftNameFromProfile(profile) {
    const first = String((profile && profile.rawText) || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)[0] || '';
    // A name, not a heading or a bullet: short, no dates/emails/URLs/markers.
    if (first && first.length <= 40 && !/\d{4}|@|http/.test(first)
      && !nextSectionHeading.test(first) && !BULLET_LINE_RE.test(first)
      && /^\p{L}/u.test(first)) return first;
    return '';
  }
  const nextSectionHeading = /^(summary|about|profile|objective|experience|education|skills?|projects?|certifications?)\b/i;

  function studioBuildNewDraft() {
    const profile = getSavedResumeProfile() || {};
    const tpl = studioTemplates().find(t => t.id === studioState.newStructure) || studioTemplates()[0] || null;
    const activeSections = studioState.newSections || STUDIO_SECTIONS;
    const tplSkip = (tpl && tpl.skip) ? tpl.skip : [];
    const order = (tpl ? tpl.order : STUDIO_SECTIONS)
      .filter(s => activeSections.includes(s) && tplSkip.indexOf(s) === -1);

    const parts = [];
    const missing = [];
    const rewritten = [];
    const skillsArr = (profile.skills || []);

    order.forEach(section => {
      switch (section) {
        case 'contact': {
          const name = studioDraftNameFromProfile(profile);
          const c = profile.contactInfo || {};
          const contact = [c.email, c.phone, c.location].filter(Boolean).join('  ·  ');
          const lines = [];
          if (name) lines.push(name); else { lines.push('[Add your full name]'); missing.push('Full name'); }
          if (contact) lines.push(contact); else { lines.push('[Add your email and phone]'); missing.push('Contact details'); }
          parts.push(lines.join('\n'));
          break;
        }
        case 'summary':
          parts.push(studioAutoSummary(profile, studioState.newRole));
          rewritten.push('Professional summary — reworded from your profile (' + studioExpPhrase(profile) + '). Edit it to your voice.');
          break;
        case 'skills':
          if (skillsArr.length > 0) {
            parts.push('Skills: ' + skillsArr.slice(0, 14).map(s => String(s).charAt(0).toUpperCase() + String(s).slice(1)).join(', '));
            if (skillsArr.length > 14) rewritten.push('Skills list truncated to your first 14 detected skills — add any others by hand.');
          } else {
            parts.push('[Add your key skills]');
            missing.push('Skills');
          }
          break;
        case 'experience': {
          const ranges = ((profile.experience || {}).dateRanges || [])
            .filter(r => r && r.raw).slice()
            .sort((a, b) => (b.start || 0) - (a.start || 0));
          if (ranges.length > 0) {
            parts.push(ranges.map(r => {
              const title = r.positionTitle || '[job title]';
              const company = r.companyName || '[company]';
              let line = (title === '[job title]' ? '[Add: job title]' : title) + ', ' +
                (company === '[company]' ? '[Add: company]' : company) + ' (' + r.raw + ')';
              if (title === '[job title]') missing.push('A job title for ' + r.raw);
              if (company === '[company]') missing.push('A company for ' + r.raw);
              line += '\n' + (r.responsibilities ? '• ' + String(r.responsibilities).trim() : '• [Add 2–3 bullets of what you did in this role]');
              if (!r.responsibilities) missing.push('Responsibilities for ' + r.raw);
              return line;
            }).join('\n'));
          } else if (profile.statedExperience != null) {
            parts.push('Experience: ≈' + formatExperienceYears(Number(profile.statedExperience) || 0) + ' (as stated by you)\n• [Add your roles with dates]');
            missing.push('Dated work history (your stated ' + profile.statedExperience + ' years cannot be broken into roles here)');
          } else {
            parts.push('[Add your work history — role, company, dates]');
            missing.push('Work history');
          }
          break;
        }
        case 'projects': {
          const ps = studioExtractSectionLines(profile.rawText, /projects?\b/i);
          if (ps.length > 0) parts.push('Projects\n' + ps.slice(0, 6).map(l => l.startsWith('•') || l.startsWith('-') ? l : '• ' + l).join('\n'));
          else { parts.push('[Add your projects]'); missing.push('Projects'); }
          break;
        }
        case 'education': {
          const edus = (profile.education || []).filter(e => e && (e.degree || e.field));
          if (edus.length > 0) {
            parts.push(edus.map(e => [e.degree, e.field, e.institution && e.institution !== 'Unknown' ? e.institution : null].filter(Boolean).join(', ')).join('\n'));
          } else {
            parts.push('[Add your education]');
            missing.push('Education');
          }
          break;
        }
        case 'certifications': {
          const cs = studioExtractSectionLines(profile.rawText, /certifications?\b/i);
          if (cs.length > 0) parts.push('Certifications\n' + cs.slice(0, 6).map(l => l.startsWith('•') || l.startsWith('-') ? l : '• ' + l).join('\n'));
          else { parts.push('[Add your certifications, if any]'); missing.push('Certifications'); }
          break;
        }
      }
    });

    return { text: parts.join('\n\n'), missing, rewritten };
  }

  // ---- Preview: the draft rendered with the chosen structure ----
  function studioRenderPreview(text, tplId) {
    const tpl = studioTemplates().find(t => t.id === tplId);
    const lines = String(text || '').split(/\r?\n/).map(l => l.trim());
    let html = '';
    let openList = false;
    const closeList = () => { if (openList) { html += '</ul>'; openList = false; } };
    lines.forEach(l => {
      if (!l) return;
      if (BULLET_LINE_RE.test(l)) {
        if (!openList) { html += '<ul>'; openList = true; }
        html += '<li>' + escAttr(l.replace(BULLET_MARKER_STRIP_RE, '').trim()) + '</li>';
      } else {
        closeList();
        if (l === l.toUpperCase() && l.length >= 2 && l.length <= 28 && /[A-Z]/.test(l) && l.indexOf('[') !== 0) {
          html += '<h3>' + escAttr(l) + '</h3>';
        } else if (/^\[.*\]$/.test(l)) {
          html += '<p class="studio-pv-missing">' + escAttr(l) + '</p>';
        } else {
          html += '<p>' + escAttr(l) + '</p>';
        }
      }
    });
    closeList();
    return '<div class="studio-pv tpl-' + (tpl ? tpl.id : 'plain') + '" data-template="' + escAttr(tpl ? tpl.id : '') + '">' + html + '</div>';
  }

  // ---- Drafts shelf ----
  function studioSaveDraft(name, text, role, structure) {
    const list = loadStudioDrafts();
    const id = 'sd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    list.push({
      id,
      name: (name && name.trim()) || ('Draft ' + (list.length + 1)),
      role: role || '',
      structure: structure || 'ats-single-column',
      text: String(text || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    saveStudioDrafts(list);
    return id;
  }

  function studioFlash(msg) {
    const el = document.getElementById('studioFlash');
    if (el) {
      el.textContent = msg || '';
      clearTimeout(el._t);
      el._t = setTimeout(() => { el.textContent = ''; }, 3500);
    }
  }

  function studioCopyText(text, what) {
    const done = () => studioFlash((what || 'Draft') + ' copied to clipboard');
    const fail = () => studioFlash('Copy blocked by the browser — select the text manually');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else fail();
  }

  function studioPrint() {
    // Print the current NEW-DRAFT preview in a print-friendly view. The
    // on-screen layout is hidden via @media print rules keyed to body
    // .studio-printing; the user can "Save as PDF" from the print dialog.
    const area = document.getElementById('studioPrintArea');
    if (area) {
      area.innerHTML = studioRenderPreview(studioState.newDraftText || studioState.draftText, studioState.newStructure);
    }
    if (document.body && document.body.classList) document.body.classList.add('studio-printing');
    const clear = () => { if (document.body && document.body.classList) document.body.classList.remove('studio-printing'); };
    window.print();
    setTimeout(clear, 500);
  }

  // ---- The pane renderer ----
  function renderStudio() {
    const host = document.getElementById('studioContent');
    if (!host) return;
    const profile = getSavedResumeProfile();
    const templates = studioTemplates();
    const examples = studioExamples();
    const hasProfile = !!profile;

    const roleOpts = studioRoleOptions();
    const roleSelect = id =>
      `<select id="${id}" class="form-select form-select-sm" aria-label="Target role">
        <option value="">No specific role (improve generally)</option>
        ${roleOpts.map(r => `<option value="${escAttr(r.value)}" ${studioState.improveRole === r.value ? 'selected' : ''}>${escAttr(r.label)}</option>`).join('')}
      </select>`;
    const newRoleSelect = id =>
      `<select id="${id}" class="form-select form-select-sm" aria-label="Target role for new draft">
        <option value="">No specific role</option>
        ${roleOpts.map(r => `<option value="${escAttr(r.value)}" ${studioState.newRole === r.value ? 'selected' : ''}>${escAttr(r.label)}</option>`).join('')}
      </select>`;

    const sectionChecks = () => STUDIO_SECTIONS.map(s =>
      `<label class="studio-sec"><input type="checkbox" data-studio-section="${s}" ${((studioState.newSections || STUDIO_SECTIONS).indexOf(s) !== -1) ? 'checked' : ''}> ${s}</label>`
    ).join(' ');

    // ---------- Improve pane ----------
    let improve = '';
    if (!hasProfile) {
      improve = `
        <div class="studio-empty">
          <div class="studio-empty-title">No saved resume profile yet</div>
          <p>Build one in the <strong>Resume</strong> tab first (paste or upload your resume, then <em>Analyze</em>). The studio works from that same saved profile — you never upload the resume twice.</p>
          <button type="button" class="btn btn-outline-secondary btn-sm" data-studio-goresume>Go to Resume tab</button>
        </div>`;
    } else {
      const kindLabel = { factual: 'factual rewrite', inferred: 'supported inference', 'needs-input': 'needs your input' };
      const suggCards = (studioState.suggestions || []).map(s => {
        const applied = studioState.applied.indexOf(s.id) !== -1;
        const accepted = studioState.accepted.indexOf(s.id) !== -1;
        return `
          <div class="studio-sugg ${applied ? 'studio-sugg-applied' : ''}" data-sugg="${s.id}">
            <div class="studio-sugg-head">
              <span class="studio-chip">${escAttr(s.area)}</span>
              <span class="studio-chip studio-chip-${s.kind}">${kindLabel[s.kind] || s.kind}</span>
              ${s.autoApply === 'skip' ? '<span class="studio-chip studio-chip-info">informational</span>' : ''}
              ${applied ? '<span class="studio-chip studio-chip-done">applied ✓</span>' : ''}
            </div>
            ${s.original ? `<div class="studio-sugg-orig">${escAttr(s.original)}</div>` : ''}
            ${s.proposed ? `<div class="studio-sugg-prop">${escAttr(s.proposed)}</div>` : ''}
            <div class="studio-sugg-why">${escAttr(s.why)}</div>
            ${s.autoApply !== 'skip' ? `
              <label class="studio-sugg-accept">
                <input type="checkbox" data-studio-accept="${s.id}" ${accepted ? 'checked' : ''} aria-label="Accept suggestion: ${escAttr(s.area)}">
                Accept this change
              </label>` : ''}
          </div>`;
      }).join('');
      improve = `
        <div class="studio-profile-chip">Working with your saved profile ${profile.rawText ? '(' + Math.round(profile.rawText.length / 6) + ' words)' : ''} — it is never modified by the studio.</div>
        <div class="studio-controls">
          <div class="studio-control">
            <label for="studioRole">Target role</label>
            ${roleSelect('studioRole')}
          </div>
          <div class="studio-control studio-control-wide">
            <label for="studioJd">Job description (optional, for keyword alignment)</label>
            <textarea id="studioJd" class="form-control form-control-sm" rows="3" placeholder="Paste a JD so the studio can check keyword alignment against your real experience">${escAttr(studioState.improveJd)}</textarea>
          </div>
          <button type="button" class="btn btn-primary" data-studio-improve-go>Suggest improvements</button>
        </div>
        <div class="studio-ai">
          <div class="studio-ai-head">
            <h3 class="studio-sec-h">AI writing${aiProviderTag() ? ' (' + aiProviderTag() + ')' : ''}</h3>
            <span class="text-muted">Fresh AI generation · needs <code>python server.py</code></span>
          </div>
          <div class="studio-controls">
            <div class="studio-control">
              <label for="studioAiOp">Operation</label>
              <select id="studioAiOp" class="form-select form-select-sm" aria-label="AI operation">
                <option value="improve" ${studioState.aiOp === 'improve' ? 'selected' : ''}>Improve my resume</option>
                <option value="rewrite_bullets" ${studioState.aiOp === 'rewrite_bullets' ? 'selected' : ''}>Rewrite weak bullets</option>
                <option value="tailor" ${studioState.aiOp === 'tailor' ? 'selected' : ''}>Tailor to the JD</option>
                <option value="new_draft" ${studioState.aiOp === 'new_draft' ? 'selected' : ''}>New draft from my data</option>
                <option value="explain" ${studioState.aiOp === 'explain' ? 'selected' : ''}>Explain recommended changes</option>
              </select>
            </div>
            <div class="studio-control studio-control-wide">
              <label for="studioAiInstr">Instructions (optional)</label>
              <textarea id="studioAiInstr" class="form-control form-control-sm" rows="2"
                placeholder="e.g. Emphasize leadership; keep it to one page">${escAttr(studioState.aiInstr)}</textarea>
            </div>
            <button type="button" class="btn btn-primary" data-studio-ai-go>✍️ Generate with AI</button>
            <span class="studio-ai-status text-muted" id="studioAiStatus" style="font-size:0.75rem"></span>
          </div>
          <p class="rf-ai-privacy text-muted" style="font-size:0.72rem">
            Running this sends your current resume/draft (and the JD if present) to your configured AI provider.
            Where a fact is missing it returns a clearly-marked <em>question</em> — it never invents one.
          </p>
          <div id="studioAiResults"></div>
        </div>
        ${studioState.suggestions.length ? `
          <div class="studio-suggs">
            <h3 class="studio-sec-h">Rule-based suggestions (${studioState.suggestions.length}) — accept, then apply</h3>
            ${suggCards}
            <div class="studio-sugg-actions">
              <button type="button" class="btn btn-sm btn-primary" data-studio-apply>Apply selected to draft</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-undo>Undo</button>
            </div>
            ${studioState.suggestions.length === 0 ? '<p class="text-muted">No rule-based suggestions for this input — your bullets already open with action verbs and carry numbers.</p>' : ''}
            <label class="studio-draft-label" for="studioDraft">
              Draft editor <span class="text-muted">(edits happen in this draft, not in your saved resume)</span>
            </label>
            <textarea id="studioDraft" class="form-control" rows="12">${escAttr(studioState.draftText)}</textarea>
            <div class="studio-draft-actions">
              <input type="text" id="studioDraftName" class="form-control form-control-sm" placeholder="Name this draft (e.g. "Data analyst v2")" value="${escAttr(studioState.draftName)}" aria-label="Draft name">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-save-draft>Save as draft</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-copy-draft>Copy draft</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-print>Print / Save as PDF</button>
            </div>
          </div>` : ''}`;
    }

    // ---------- New-draft pane ----------
    const newPane = `
      <div class="studio-controls">
        <div class="studio-control">
          <label for="studioNewRole">Target job title</label>
          ${newRoleSelect('studioNewRole')}
          <input type="text" id="studioNewRoleText" class="form-control form-control-sm mt-1" placeholder="…or type a custom title" value="" aria-label="Custom target title">
        </div>
        <div class="studio-control">
          <label for="studioNewLevel">Experience level</label>
          <select id="studioNewLevel" class="form-select form-select-sm">
            <option value="entry" ${studioState.newLevel === 'entry' ? 'selected' : ''}>Entry / fresh graduate</option>
            <option value="mid" ${studioState.newLevel === 'mid' ? 'selected' : ''}>Mid-level</option>
            <option value="senior" ${studioState.newLevel === 'senior' ? 'selected' : ''}>Senior</option>
            <option value="leadership" ${studioState.newLevel === 'leadership' ? 'selected' : ''}>Leadership</option>
          </select>
        </div>
        <div class="studio-control">
          <label for="studioNewStructure">Preferred structure</label>
          <select id="studioNewStructure" class="form-select form-select-sm">
            ${templates.map(t => `<option value="${escAttr(t.id)}" ${studioState.newStructure === t.id ? 'selected' : ''}>${escAttr(t.name)}</option>`).join('')}
          </select>
          <small class="text-muted">${escAttr((templates.find(t => t.id === studioState.newStructure) || {}).notes || '')}</small>
        </div>
        <div class="studio-control studio-control-wide">
          <label>Sections to include</label>
          <div class="studio-sec-row">${sectionChecks()}</div>
        </div>
        <div class="studio-control studio-control-wide">
          <label for="studioNewJd">Job description (optional — informs the summary)</label>
          <textarea id="studioNewJd" class="form-control form-control-sm" rows="2" placeholder="Paste the JD to align the summary wording">${escAttr(studioState.newJd)}</textarea>
        </div>
        <button type="button" class="btn btn-primary" data-studio-new-go>Build draft from my profile</button>
      </div>
      ${!hasProfile ? '<div class="studio-empty"><div class="studio-empty-title">No saved profile</div><p>The draft will be placeholders only. Create a profile in the <strong>Resume</strong> tab to start from your verified data.</p></div>' : ''}
      ${studioState.newDraftText ? `
        <div class="studio-draft-cols">
          <div>
            <label class="studio-draft-label" for="studioNewDraft">Draft text (edit freely)</label>
            <textarea id="studioNewDraft" class="form-control" rows="16">${escAttr(studioState.newDraftText)}</textarea>
            <div class="studio-draft-actions">
              <input type="text" id="studioNewName" class="form-control form-control-sm" placeholder="Name this draft" value="${escAttr(studioState.newName)}" aria-label="Draft name">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-save-new>Save new draft</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-copy-new>Copy</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-print>Print / Save as PDF</button>
            </div>
          </div>
          <div>
            <label class="studio-draft-label">Preview (current structure: ${escAttr((templates.find(t => t.id === studioState.newStructure) || {}).name || 'ATS')})</label>
            <div class="studio-preview">${studioRenderPreview(studioState.newDraftText, studioState.newStructure)}</div>
          </div>
        </div>` : ''}`;

    // ---------- Examples / templates pane ----------
    const ex = examples.find(x => x.id === studioState.exCat) || examples[0];
    const exPreview = ex ? studioRenderPreview(
      ex.bullets.map(b => '• ' + b).join('\n'), studioState.exTpl
    ) : '';
    const examplesPane = examples.length ? `
      <div class="studio-controls">
        <div class="studio-control">
          <label for="studioExCat">Role category</label>
          <select id="studioExCat" class="form-select form-select-sm">
            ${examples.map(x => `<option value="${escAttr(x.id)}" ${ex && ex.id === x.id ? 'selected' : ''}>${escAttr(x.category)}</option>`).join('')}
          </select>
        </div>
        <div class="studio-control">
          <label for="studioExTpl">Structure to preview in</label>
          <select id="studioExTpl" class="form-select form-select-sm">
            ${templates.map(t => `<option value="${escAttr(t.id)}" ${studioState.exTpl === t.id ? 'selected' : ''}>${escAttr(t.name)}</option>`).join('')}
          </select>
        </div>
      </div>
      ${ex ? `
        <div class="studio-draft-cols">
          <div>
            <h3 class="studio-sec-h">Example bullets — ${escAttr(ex.category)}</h3>
            <p class="text-muted">Original examples for this app. <strong>Never copy them as your own facts</strong> — reword each one around something you actually did.</p>
            ${ex.bullets.map(b => `<div class="studio-ex-bullet">• ${escAttr(b)}</div>`).join('')}
            <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-copy-ex>Copy these bullets</button>
            <h3 class="studio-sec-h">Role guidance</h3>
            ${ex.guidance.map(g => `<div class="studio-ex-guidance">${escAttr(g)}</div>`).join('')}
          </div>
          <div>
            <label class="studio-draft-label">Preview in “${escAttr((templates.find(t => t.id === studioState.exTpl) || {}).name || '')}”</label>
            ${exPreview}
          </div>
        </div>` : ''}
      <div class="studio-template-note">${escAttr(window.STUDIO_TEMPLATE_NOTE || '')}</div>
      ${studioResources().length ? `
        <div class="studio-resources">
          <h3 class="studio-sec-h">External reading (linked sites are read in your browser — nothing from this app is sent to them)</h3>
          ${studioResources().map(r =>
            `<a href="${escAttr(r.url)}" target="_blank" rel="noopener noreferrer">${escAttr(r.label)}</a><span class="text-muted"> — ${escAttr(r.note || 'external reading')}</span>`).join('<br>')}
        </div>` : ''}`
      : '<p class="text-muted">No local examples loaded.</p>';

    // ---------- Drafts shelf (always visible) ----------
    const drafts = loadStudioDrafts();
    const shelf = drafts.length ? `
      <div class="studio-shelf">
        <h3 class="studio-sec-h">Saved drafts (${drafts.length})</h3>
        ${drafts.map(d => `
          <div class="studio-draft-row" data-draft-row="${d.id}">
            <strong>${escAttr(d.name)}</strong>
            <span class="text-muted">${escAttr(d.structure || '')} · ${escAttr(String(d.updatedAt || '').slice(0, 10))}</span>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-open="${d.id}">Open</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-studio-dup="${d.id}">Duplicate</button>
            <button type="button" class="btn btn-sm btn-outline-danger" data-studio-del="${d.id}">Delete</button>
          </div>`).join('')}
      </div>` : '<div class="studio-shelf"><h3 class="studio-sec-h">Saved drafts</h3><p class="text-muted">Nothing saved yet — drafts you create here appear here.</p></div>';

    const wfBtn = (id, label, desc) =>
      `<button type="button" class="studio-wf-btn ${studioState.wf === id ? 'active' : ''}" data-studio-wf="${id}" aria-pressed="${studioState.wf === id}">${label}<small>${desc}</small></button>`;

    host.innerHTML = `
      <div class="studio-wf-row" role="group" aria-label="Studio workflow">
        ${wfBtn('improve', 'Improve my existing resume', 'rule-based suggestions on your saved profile')}
        ${wfBtn('new', 'New resume for a target role', 'draft built from your verified profile')}
        ${wfBtn('examples', 'Examples & templates', 'local example bullets and structures')}
      </div>
      <div class="studio-pane" data-studio-pane="${studioState.wf}">
        ${studioState.wf === 'improve' ? improve : studioState.wf === 'new' ? newPane : examplesPane}
      </div>
      ${shelf}
      <div class="studio-flash" id="studioFlash" role="status" aria-live="polite"></div>
      <div class="studio-print-area" id="studioPrintArea" aria-hidden="true"></div>
    `;
  }

  // ---- Event wiring (delegated on the pane host) ----
  function studioHost() { return document.getElementById('studioContent'); }

  // ---- AI writing (OpenAI) — a fresh request every time; never reuses a
  // ---- previous AI output as the source unless the user copied it into the
  // ---- draft first. A slow response cannot overwrite a newer one.
  async function runStudioAi() {
    const profile = getSavedResumeProfile() || {};
    const opEl = document.getElementById('studioAiOp');
    if (opEl) studioState.aiOp = opEl.value || 'improve';
    const instrEl = document.getElementById('studioAiInstr');
    if (instrEl) studioState.aiInstr = instrEl.value || '';
    const roleEl = document.getElementById('studioRole');
    const role = roleEl ? (roleEl.value || '') : (studioState.improveRole || '');
    const jdEl = document.getElementById('studioJd');
    const jd = jdEl ? (jdEl.value || '') : (studioState.improveJd || '');
    const op = studioState.aiOp;

    const statusEl = document.getElementById('studioAiStatus');
    const host = document.getElementById('studioAiResults');
    const btn = document.querySelector('[data-studio-ai-go]');

    // Source of truth for each operation:
    //   new_draft -> the user's REAL entered data (the saved profile's raw text)
    //   everything else -> the CURRENT draft (what the user is looking at)
    const source = op === 'new_draft'
      ? (profile.rawText || studioState.draftText || '')
      : (studioState.draftText || profile.rawText || '');
    if (!source.trim()) {
      if (statusEl) statusEl.textContent = op === 'new_draft'
        ? 'No profile data yet — build one in the Resume tab first.'
        : 'Run "Suggest improvements" first so there is a draft to work on.';
      return;
    }

    studioState.aiSeq += 1;
    const seq = studioState.aiSeq;
    if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }
    if (host) host.innerHTML = '';
    if (statusEl) statusEl.textContent = 'Contacting ' + (aiProviderWord() || 'the AI provider') + '…';
    try {
      const res = await fetch('/api/resume-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: op,
          resumeText: op === 'new_draft' ? '' : source,
          candidateInfo: op === 'new_draft' ? source : '',
          jobDescription: jd,
          instructions: studioState.aiInstr,
          targetRole: role,
          requestId: 's' + seq
        })
      });
      const data = await res.json().catch(() => ({}));
      if (seq !== studioState.aiSeq) return; // superseded by a newer request
      if (!res.ok || !data.ok) {
        throw new Error(data.error || ('HTTP ' + res.status));
      }
      studioState.aiLast = { content: data.result && data.result.content, operation: op, model: data.model };
      renderStudioAi(data, host);
      if (statusEl) statusEl.textContent = 'AI generation ready' + (data.model ? ' (model ' + data.model + ')' : '') + '.';
    } catch (e) {
      if (seq !== studioState.aiSeq) return;
      let msg = e && e.message ? e.message : String(e);
      if (/\bFailed to fetch\b|NetworkError|HTTP (404|405)\b/i.test(msg) || !msg) {
        msg = 'The AI server is not available. Start it with `python server.py`, then try again.';
      }
      if (statusEl) statusEl.textContent = 'AI generation failed: ' + msg + ' No stale result is shown.';
      if (host) host.innerHTML = '<div class="studio-ai-err text-danger" style="font-size:0.8rem">' + escAttr(msg) + '</div>';
    } finally {
      if (seq === studioState.aiSeq && btn) { btn.disabled = false; btn.textContent = '✍️ Generate with AI'; }
    }
  }

  function renderStudioAi(data, host) {
    if (!host) return;
    const r = data.result || {};
    let html = '';
    if (r.summary) html += '<div class="studio-ai-summary"><strong>' + escAttr(r.summary) + '</strong></div>';
    if (r.content && r.content.trim()) {
      html += '<pre class="studio-ai-content" style="white-space:pre-wrap">' + escAttr(r.content) + '</pre>';
      const useLabel = r.operation === 'new_draft' ? 'Use as new-draft text' : 'Use this as the draft';
      html += '<button type="button" class="btn btn-sm btn-outline-primary" data-studio-ai-use>📥 ' + useLabel +
              ' <span class="text-muted">(copies into the editor — you still review & save it)</span></button> ';
      html += '<button type="button" class="btn btn-sm btn-outline-secondary" data-studio-ai-copy>Copy text</button>';
    }
    const sugg = (Array.isArray(r.suggestions) ? r.suggestions : []).filter(s => s && (s.original || s.suggested));
    if (sugg.length) {
      html += '<h6>Rewrites</h6><ul class="studio-ai-suggs">' + sugg.map(s =>
        '<li>' + (s.original ? '<span class="text-muted">' + escAttr(s.original) + '</span> → ' : '') +
        '<strong>' + escAttr(s.suggested) + '</strong>' +
        (s.why ? ' <em class="text-muted">— ' + escAttr(s.why) + '</em>' : '') + '</li>').join('') + '</ul>';
    }
    const qs = (Array.isArray(r.questions) ? r.questions : []).filter(Boolean);
    if (qs.length) {
      html += '<h6>Needs your input (not invented)</h6><ul class="studio-ai-qs">' +
        qs.map(q => '<li>' + escAttr(q) + '</li>').join('') + '</ul>';
    }
    if (!r.content && !sugg.length && !qs.length && !r.summary) {
      html = '<p class="text-muted">The model returned no usable output. Try again, or add more context.</p>';
    }
    host.innerHTML = html;
  }

  // Explicit user action: put the latest AI content into the editor. This is
  // how a previous result becomes an intentional input for a NEXT request.
  function studioUseAiResult() {
    const last = studioState.aiLast;
    if (!last || !last.content) { studioFlash('No AI text to insert yet.'); return; }
    if (last.operation === 'new_draft') {
      studioState.newDraftText = last.content;
      studioState.wf = 'new';
    } else {
      studioState.draftText = last.content;
    }
    renderStudio();
    studioFlash('AI text inserted into the editor — review it, then save/apply.');
  }
  function studioCopyAiResult() {
    const last = studioState.aiLast;
    if (last && last.content) studioCopyText(last.content, 'AI text');
  }

  function studioOnAction(e) {
    const host = studioHost();
    if (!host) return;
    const t = e.target || {};
    // e.target.closest works in the browser; the test harness passes a plain
    // object whose closest() emulates the same lookup.
    const closeTo = sel => (typeof t.closest === 'function') ? t.closest(sel) : null;
    let el;

    el = closeTo('[data-studio-wf]');
    if (el) {
      studioState.wf = el.dataset.studioWf || 'improve';
      studioState.exCat = studioState.exCat || (studioExamples()[0] && studioExamples()[0].id);
      renderStudio();
      return;
    }
    el = closeTo('[data-studio-improve-go]');
    if (el) {
      const roleEl = document.getElementById('studioRole');
      if (roleEl) studioState.improveRole = roleEl.value || '';
      const jdEl = document.getElementById('studioJd');
      if (jdEl) studioState.improveJd = jdEl.value || '';
      const profile = getSavedResumeProfile();
      if (!profile) return;
      studioState.draftText = profile.rawText || '';
      studioState.accepted = [];
      studioState.applied = [];
      studioState.snapshot = '';
      studioState.suggestions = studioBuildSuggestions();
      renderStudio();
      return;
    }
    el = closeTo('[data-studio-apply]');
    if (el) {
      const n = studioApplyAccepted();
      renderStudio();
      studioFlash(n ? n + ' suggestion' + (n > 1 ? 's' : '') + ' applied to the draft' : 'Nothing accepted yet — tick a suggestion first');
      return;
    }
    el = closeTo('[data-studio-undo]');
    if (el) {
      studioUndoApply();
      renderStudio();
      studioFlash('Draft restored to before the last apply');
      return;
    }
    el = closeTo('[data-studio-copy-draft]');
    if (el) { studioCopyText(studioState.draftText, 'Draft'); return; }
    el = closeTo('[data-studio-save-draft]');
    if (el) {
      const nameEl = document.getElementById('studioDraftName');
      studioSaveDraft(nameEl ? nameEl.value : studioState.draftName,
        studioState.draftText, studioState.improveRole, 'ats-single-column');
      studioState.draftName = '';
      renderStudio();
      studioFlash('Draft saved to your drafts shelf');
      return;
    }
    el = closeTo('[data-studio-new-go]');
    if (el) {
      const nr = document.getElementById('studioNewRole');
      const nrText = document.getElementById('studioNewRoleText');
      const lvl = document.getElementById('studioNewLevel');
      const tpl = document.getElementById('studioNewStructure');
      const jdt = document.getElementById('studioNewJd');
      if (nr) studioState.newRole = nr.value || '';
      if (nrText && nrText.value.trim()) studioState.newRole = nrText.value.trim();
      if (lvl) studioState.newLevel = lvl.value || 'mid';
      if (tpl) studioState.newStructure = tpl.value || 'ats-single-column';
      if (jdt) studioState.newJd = jdt.value || '';
      const built = studioBuildNewDraft();
      studioState.newDraftText = built.text;
      renderStudio();
      studioFlash(built.missing.length
        ? 'Draft built — ' + built.missing.length + ' gap(s) marked [add …] need your input'
        : 'Draft built from your profile');
      return;
    }
    el = closeTo('[data-studio-save-new]');
    if (el) {
      const nameEl = document.getElementById('studioNewName');
      studioSaveDraft(nameEl ? nameEl.value : studioState.newName,
        studioState.newDraftText, studioState.newRole, studioState.newStructure);
      studioState.newName = '';
      renderStudio();
      studioFlash('Draft saved to your drafts shelf');
      return;
    }
    el = closeTo('[data-studio-copy-new]');
    if (el) { studioCopyText(studioState.newDraftText, 'Draft'); return; }
    el = closeTo('[data-studio-copy-ex]');
    if (el) {
      const ex = studioExamples().find(x => x.id === studioState.exCat) || studioExamples()[0];
      if (ex) studioCopyText(ex.bullets.map(b => '• ' + b).join('\n'), 'Example bullets');
      return;
    }
    el = closeTo('[data-studio-print]');
    if (el) { studioPrint(); return; }
    el = closeTo('[data-studio-goresume]');
    if (el) { switchTab('resumeAnalysis'); return; }

    el = closeTo('[data-studio-ai-go]');
    if (el) { runStudioAi(); return; }
    el = closeTo('[data-studio-ai-use]');
    if (el) { studioUseAiResult(); return; }
    el = closeTo('[data-studio-ai-copy]');
    if (el) { studioCopyAiResult(); return; }

    el = closeTo('[data-studio-open]');
    if (el) {
      const d = loadStudioDrafts().find(x => x.id === el.dataset.studioOpen);
      if (d) {
        studioState.newDraftText = d.text;
        studioState.newStructure = d.structure || 'ats-single-column';
        studioState.newRole = d.role || '';
        studioState.newName = d.name || '';
        studioState.wf = 'new';
        renderStudio();
        studioFlash('Opened "' + d.name + '"');
      }
      return;
    }
    el = closeTo('[data-studio-dup]');
    if (el) {
      const list = loadStudioDrafts();
      const src = list.find(x => x.id === el.dataset.studioDup);
      if (src) {
        const copy = Object.assign({}, src, {
          id: 'sd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
          name: src.name + ' (copy)',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        list.push(copy);
        saveStudioDrafts(list);
        renderStudio();
        studioFlash('Duplicated "' + src.name + '"');
      }
      return;
    }
    el = closeTo('[data-studio-del]');
    if (el) {
      const id = el.dataset.studioDel;
      const d = loadStudioDrafts().find(x => x.id === id);
      // Destructive: confirm (the harness confirm() stub returns true).
      if (d && confirm('Delete the draft "' + d.name + '"? This cannot be undone.')) {
        saveStudioDrafts(loadStudioDrafts().filter(x => x.id !== id));
        renderStudio();
        studioFlash('Draft "' + d.name + '" deleted');
      }
      return;
    }
  }

  function studioOnChange(e) {
    const t = e.target || {};
    const closeTo = sel => (typeof t.closest === 'function') ? t.closest(sel) : null;
    let el;
    el = closeTo('[data-studio-accept]');
    if (el) {
      const id = el.dataset.studioAccept;
      if (t.checked === false) studioState.accepted = studioState.accepted.filter(x => x !== id);
      else if (studioState.accepted.indexOf(id) === -1) studioState.accepted.push(id);
      return;
    }
    el = closeTo('[data-studio-section]');
    if (el) {
      const sec = el.dataset.studioSection;
      const on = t.checked !== false;
      if (!studioState.newSections) studioState.newSections = STUDIO_SECTIONS.slice();
      if (on && studioState.newSections.indexOf(sec) === -1) studioState.newSections.push(sec);
      if (!on) studioState.newSections = studioState.newSections.filter(s => s !== sec);
      return;
    }
    // AI op select: sync to state WITHOUT re-rendering, so an already-generated
    // AI result (in #studioAiResults) and the instructions box are preserved.
    if (t.id === 'studioAiOp') {
      studioState.aiOp = t.value || 'improve';
      return;
    }
    // Plain selects/inputs identified by id
    if (t.id) {
      const selMap = {
        studioRole: 'improveRole',
        studioNewRole: 'newRole',
        studioNewLevel: 'newLevel',
        studioNewStructure: 'newStructure',
        studioExCat: 'exCat',
        studioExTpl: 'exTpl'
      };
      const key = selMap[t.id];
      if (key && 'value' in t) {
        studioState[key] = t.value || (key === 'exCat' ? '' : key === 'exTpl' ? 'ats-single-column' : '');
        if (key === 'improveRole') {
          // Role selection can only add new suggestions on the next GO.
        }
        renderStudio();
      }
    }
  }

  function studioOnInput(e) {
    const t = e.target || {};
    if (!t.id) return;
    switch (t.id) {
      case 'studioJd': studioState.improveJd = t.value || ''; break;
      case 'studioNewJd': studioState.newJd = t.value || ''; break;
      case 'studioNewRoleText': studioState.newRole = t.value ? t.value.trim() : ''; break;
      case 'studioDraft': studioState.draftText = t.value || ''; break;
      case 'studioDraftName': studioState.draftName = t.value || ''; break;
      case 'studioNewDraft': studioState.newDraftText = t.value || ''; break;
      case 'studioNewName': studioState.newName = t.value || ''; break;
      case 'studioAiInstr': studioState.aiInstr = t.value || ''; break;
      default: return;
    }
  }

  // Initialize the studio: wire once; re-renders happen on tab activation
  // and after every action.
  function initStudio() {
    const host = studioHost();
    if (!host) return;
    host.addEventListener('click', studioOnAction);
    host.addEventListener('change', studioOnChange);
    host.addEventListener('input', studioOnInput);
    renderStudio();
  }


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

    // Skills the candidate stated explicitly (SKILLS/TOOLS sections)
    const statedSkills = extractStatedSkills(resumeText);

    // Prose-stated experience, used ONLY when employment dates are unparsable,
    // so a "12+ years" resume is never silently scored as 0.
    const stated = extractStatedExperience(resumeText);
    const experienceSource = experience.totalYears >= 0.5
      ? 'dates'
      : (stated ? 'stated' : 'unknown');

    // Flatten all skills (keyword-detected + stated), deduped case-insensitively
    // so the same skill found in two categories is never counted or shown twice.
    const dedupSeen = new Set();
    const allSkills = Object.values(skills).flat().concat(statedSkills)
      .filter(s => {
        const k = String(s).toLowerCase().replace(/\s+/g, ' ');
        if (dedupSeen.has(k)) return false;
        dedupSeen.add(k);
        return true;
      });

    return {
      rawText: resumeText,
      skills: allSkills,
      experience: experience,
      education: education,
      contactInfo: contactInfo,
      totalExperience: experience.totalYears,
      statedExperience: stated ? stated.years : null,
      experienceSource: experienceSource,
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
      statedSkills: statedSkills,
      allSkills: allSkills
    };
  }

  // Best available experience evidence: parsed dates when present, otherwise
  // the candidate's own stated figure. Never a silent zero.
  function effectiveExperience(resume) {
    const r = resume || {};
    const parsed = Number(r.totalExperience) || 0;
    if (parsed >= 0.5) return { years: parsed, source: 'dates' };
    if (Number.isFinite(Number(r.statedExperience)) && Number(r.statedExperience) >= 0.5) {
      return { years: Number(r.statedExperience), source: 'stated' };
    }
    return { years: parsed, source: parsed > 0 ? 'dates' : 'none' };
  }

  // Display-only source-of-evidence label for experience. Reads the
  // profile-level experienceSource (Commit A) so sub-0.5y values show as
  // "dated but thin" — never as "no dates found" and never as a stated
  // claim. Presentation mapping only: no calculation or threshold changes.
  function displayExperience(resume) {
    const r = resume || {};
    const parsed = Number(r.totalExperience) || 0;
    const eff = effectiveExperience(r);
    // Legacy profiles (pre-Commit A) have no experienceSource field: derive
    // the equivalent — 0.5y+ of parseable dates reads as 'dates'.
    const src = (typeof r.experienceSource === 'string' && r.experienceSource)
      ? r.experienceSource
      : (eff.years >= 0.5 ? 'dates' : 'unknown');
    if (src === 'stated') {
      return { text: '≈' + formatExperienceYears(eff.years), label: 'Stated exp.' };
    }
    if (src === 'dates') {
      return { text: formatExperienceYears(eff.years), label: 'Experience' };
    }
    if (parsed > 0) {
      // Dated but under the 0.5y materiality gate: show the real figure,
      // labeled as short dated history.
      return { text: formatExperienceYears(parsed), label: 'Experience (<0.5y dated)' };
    }
    return { text: formatExperienceYears(0), label: 'No dates found' };
  }

  // Skills extraction function
  function extractSkills(text) {
    // Define skill categories as requested by the user
    const skillCategories = {
      functional: [
        'project management', 'data analysis', 'market research', 'client relations',
        'strategic planning', 'process improvement', 'quality assurance', 'risk management',
        'stakeholder management', 'budget management', 'vendor management', 'team leadership',
        'cross-functional collaboration', 'change management', 'performance management',
        'financial modeling', 'financial reporting', 'forecasting', 'variance analysis',
        'budgeting', 'bookkeeping', 'reconciliation', 'audit', 'internal audit',
        'internal controls', 'compliance', 'cash flow management', 'forex',
        'banking relationships', 'treasury systems', 'invoicing', 'gst', 'tds',
        'gaap', 'erp systems', 'agile', 'system design', 'code review',
        'data pipelines', 'threat detection', 'incident response', 'penetration testing',
        'test case design', 'bug tracking', 'api testing', 'test automation'
      ],
      technical: [
  'meta ads', 'google ads', 'google analytics', 'excel',
  'python', 'sql', 'tableau', 'power bi', 'r', 'sas',
  'java', 'c++', 'c#', 'javascript', 'typescript', 'html', 'css',
  'react', 'angular', 'vue', 'node', 'rest api', 'microservices',
  'spring boot', 'django', 'flask', 'redis', 'mongodb', 'postgres',
  'machine learning', 'deep learning', 'nlp', 'computer vision',
  'data mining', 'etl', 'apache airflow', 'data warehousing', 'big data',
  'hadoop', 'spark', 'aws', 'azure', 'gcp', 'docker', 'ci/cd', 'linux',
  'kubernetes', 'jenkins', 'git', 'jira', 'confluence', 'selenium',
  'salesforce', 'hubspot', 'marketo', 'mailchimp',
  'google workspace', 'microsoft office',
  'network security', 'siem', 'networking', 'monitoring', 'troubleshooting',
  'windows server', 'active directory', 'sdlc', 'api', 'apis', 'server',
  'cybersecurity', 'vulnerability', 'kotlin', 'android', 'elasticsearch', 'vba'
],
      marketplacePlatforms: [
  'amazon', 'walmart', 'target', 'ebay', 'tiktok', 'shopify',
  'etsy', 'woocommerce', 'magento', 'bigcommerce',
  'salesforce commerce cloud', 'shopify plus'
],
      tools: [
        'excel', 'powerpoint', 'word', 'outlook', 'google sheets', 'google docs',
        'google slides', 'notion', 'airtable', 'trello', 'asana', 'monday.com',
        'slack', 'teams', 'zoom', 'webex', 'googletomeeting', 'sap'
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
        // \b only works next to word characters: "\bc++\b" can never match,
        // so bound each end only when the skill starts/ends with a word char.
        const lead = /^\w/.test(skill) ? '\\b' : '';
        const trail = /\w$/.test(skill) ? '\\b' : '';
if (new RegExp(lead + escapedSkill + trail, 'i').test(text)) {
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
 
// field stays '' unless the resume itself named one: a bare "MBA" does not
// prove "Business Administration" (an MBA in HR or Analytics is equally
// possible), and "B.Tech" does not prove "Engineering" (B.Tech in English
// exists). Inventing the field would fabricate a qualification.
const educationFallbacks = [
  { pattern: /\bMBA\b/i, degree: 'MBA', field: '' },
  { pattern: /\bB\.?\s?E\.?\b/i, degree: 'B.E.', field: '' },
  { pattern: /\bB\.?\s?Tech\b/i, degree: 'B.Tech', field: '' },
  { pattern: /\bB\.?\s?Sc\b/i, degree: 'B.Sc.', field: '' },
  { pattern: /\bB\.?\s?Com\b/i, degree: 'B.Com.', field: '' },
  { pattern: /\bBCA\b/i, degree: 'BCA', field: '' },
  { pattern: /\bBBA\b/i, degree: 'BBA', field: '' },
  { pattern: /\bBachelor(?:'s)?\b/i, degree: 'Bachelor', field: '' },
  { pattern: /\bMaster(?:'s)?\b/i, degree: 'Master', field: '' },
  { pattern: /\bPh\.?\s?D\b/i, degree: 'Ph.D.', field: '' }
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

    // Resume years live in this window; anything else (zip codes, phone
    // fragments, "6/6 semesters") must not produce a date.
    const saneYear = y => !isNaN(y) && y >= 1950 && y <= 2100;

    // Try format like "MM/yyyy" or "MM-yyyy" (e.g., "10/2021" or "10-2021")
    const mYMatch = dateStr.match(/^(\d{1,2})[-\/](\d{4})$/);
    if (mYMatch) {
      let month = parseInt(mYMatch[1]) - 1; // Convert to 0-based
      let year = parseInt(mYMatch[2]);

      // Check if month and year are valid numbers
      if (isNaN(month) || isNaN(year)) {
        return null;
      }

      if (month >= 0 && month < 12 && saneYear(year)) {
        // Return first day of the month
        return new Date(year, month, 1);
      }
      return null; // Invalid month
    }

    // Try format like "Month yyyy" or "Month-yyyy" (e.g., "Oct 2021", "Oct-2021",
    // "Oct. 2021" — full month names too: "October 2021", "September 2015")
    const monthNameMatch = dateStr.match(/^([a-z]+)\.?(?:[\s\/-])(\d{4})$/i);
    if (monthNameMatch) {
      const name = monthNameMatch[1].slice(0, 3).toLowerCase(); // jan/feb/.../dec prefix
      const MONTH_ABBR = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthIndex = MONTH_ABBR.indexOf(name);
      let year = parseInt(monthNameMatch[2]);

      // Check if month and year are valid
      if (monthIndex === -1 || !saneYear(year)) {
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

    // Try format like "Month dd, yyyy" (e.g., "Oct 15, 2021", "September 15 2021")
    const monthDayYearMatch = dateStr.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);
    if (monthDayYearMatch) {
      const name = monthDayYearMatch[1].slice(0, 3).toLowerCase();
      const MONTH_ABBR = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthIndex = MONTH_ABBR.indexOf(name);
      let day = parseInt(monthDayYearMatch[2]);
      let year = parseInt(monthDayYearMatch[3]);

      // Check if month, day, and year are valid
      if (monthIndex === -1 || isNaN(day) || !saneYear(year)) {
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
      // Check if year is a valid (and sane) number
      if (saneYear(year)) {
        // Return January 1st of the year
        return new Date(year, 0, 1);
      }
      return null; // Invalid year
    }

    // If we can't parse it, return null
    return null;
  }

  // Check if a date range is likely an educational period: the range's own
  // line (or the line above it) must carry a degree/education marker.
  // Job-domain words ("engineering", "business", "science") no longer
  // disqualify employment ranges.
  function isEducationRange(text, matchStart, matchEnd) {
    // Trailing \b is essential: without it, "ma" matches inside "manager" /
    // "Mar 2019" and employment lines get misclassified as education.
    const eduMarker = /\b(b\.?e\.?|b\.?tech|bca|b\.?sc|bs|b\.?s\.?|ba|b\.?a\.?|ma|m\.?a\.?|ms|m\.?s\.?|bfa|b\.?f\.?a\.?|mfa|m\.?f\.?a\.?|ben|b\.?e\.?n\.?|meng|m\.?e\.?n\.?|mba|m\.?tech|m\.?sc|ph\.?d|mbchb|iit|iim|bachelor|master|degree|diploma|university|college|institute|school|graduat\w*|higher secondary|matric\w*)\b/;
    // Some resumes are pasted as ONE long line. Line-based checks are then
    // meaningless (the "range's line" is the whole resume and carries every
    // marker), so fall back to a small window right before the range — degree
    // markers normally sit close in front of education dates.
    if ((text.match(/\n/g) || []).length < 3) {
      const before = text.substring(Math.max(0, matchStart - 60), matchStart).toLowerCase();
      return eduMarker.test(before);
    }
    const lineStart = text.lastIndexOf('\n', matchStart);
    const lineEnd = text.indexOf('\n', matchEnd);
    const rangeLineStart = lineStart === -1 ? 0 : lineStart + 1;
    const rangeLineEnd = lineEnd === -1 ? text.length : lineEnd;
    const rangeLine = text.substring(rangeLineStart, rangeLineEnd).toLowerCase();
    // Education blocks often stack degree / institution / dates on separate
    // lines ("B.Tech\nIIT Delhi\n2015 – 2019") — the marker may sit two lines
    // above the dates. Check the two lines above, not just one.
    const prevLineStart = lineStart === -1 ? 0 : text.lastIndexOf('\n', lineStart - 1) + 1;
    const prevLine = lineStart === -1 ? '' : text.substring(prevLineStart, lineStart).toLowerCase();
    const prevPrevLineStart = prevLineStart === 0 ? 0 : text.lastIndexOf('\n', prevLineStart - 1) + 1;
    const prevPrevLine = prevLineStart === 0 ? '' : text.substring(prevPrevLineStart, prevLineStart).toLowerCase();
    return eduMarker.test(rangeLine) || eduMarker.test(prevLine) || eduMarker.test(prevPrevLine);
  }

  function extractDateRangesWithContext(text) {
    if (!text || typeof text !== 'string') return [];

    // Regex to match date ranges like "October 2021â€“June 2023" or "Oct 2021 - Jun 2023"
    // Also matches "Month YYYYâ€“Present" or "Month YYYY - Present"
    // Also matches "YYYYâ€“YYYY" or "YYYY - Present" or "YYYY - YYYY" - THIS IS THE FIX
    // One date unit: "Month YYYY" / "Mon YYYY" / "Mon. YYYY" / "08/2020" / "YYYY".
    // A spaced slash is NOT a unit separator by itself — it is only accepted
    // between two bare years (see dateSep), so phone numbers stay safe.
    const dateUnit = '(?:[a-zA-Z]+\\.?(?:[\\s/-]\\d{4})|\\d{1,2}/\\d{4}|\\d{1,2}-\\d{4}|\\d{4})';
    // Separators: hyphen/en/em dash, "to"/"till", or a slash whose left side
    // is a full 4-digit year ("2021/2025", "2011 / 2015", "April 2011 /
    // September 2015" as pasted from one-line resumes). Requiring the \d{4}
    // lookbehind keeps phone numbers and "6/6" style text out.
    const dateSep = '(?:\\s*[-\\u2013\\u2014]\\s*|\\s+(?:to|till)\\s+|(?<=\\d{4})\\s*/\\s*)';
    const dateRangeRegex = new RegExp(
      '(' + dateUnit + ')' + dateSep + '([a-zA-Z]+\\.?(?:[\\s/\\-]\\d{4})|\\d{1,2}[/\\-]\\d{4}|\\d{4}|present|current|ongoing|till date|till now)',
      'gi'
    );

    const ranges = [];
    let match;

    while ((match = dateRangeRegex.exec(text)) !== null) {
      const startStr = match[1].trim();
      const endStr = match[2].trim();

      const startDate = parseDateString(startStr);
      let endDate;

      if (/^(?:present|current|ongoing|till date|till now)$/i.test(endStr)) {
        endDate = new Date(); // Current date
      } else {
        endDate = parseDateString(endStr);
      }

      // Only add if both dates were parsed successfully
      if (startDate !== null && endDate !== null) {
        // A flipped range ("Jun 2023 – Jan 2021") is almost always a typo,
        // not evidence the job ran backwards: normalize it instead of
        // silently dropping the whole period from the total.
        let rangeStart = startDate;
        let rangeEnd = endDate;
        if (rangeEnd.getTime() < rangeStart.getTime()) {
          const swap = rangeStart;
          rangeStart = rangeEnd;
          rangeEnd = swap;
        }
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

        // Educational periods are detected by degree markers on the range's
        // own line or the line above it — not by a loose 50-char context scan,
        // which wrongly dropped employment ranges in IT/business resumes.
        const isEducation = isEducationRange(text, matchStart, matchEnd);

        // ONLY ADD IF IT'S NOT AN EDUCATIONAL PERIOD
        if (!isEducation) {
          ranges.push({
            start: rangeStart,
            end: rangeEnd,
            raw: match[0],
            isInternship: isInternship
          });
        }
      }
    }

    return ranges;
  }

  // "N years of experience" stated in prose. Used only to AVOID silently
  // reporting 0 years when a resume states its own experience but its
  // employment dates are unparsable — the statement itself is the evidence.
  function extractStatedExperience(text) {
    if (!text || typeof text !== 'string') return null;
    const rangeMatch = text.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*(\+)?\s*years?\s*(?:of\s+)?(?:work\s+|professional\s+|total\s+)?experience/i);
    if (rangeMatch) {
      const lo = parseInt(rangeMatch[1], 10);
      const hi = parseInt(rangeMatch[2], 10);
      // "0 – N years" is a fresher's range, not an N-year claim: only the
      // lower bound is certain, so report 0 rather than inventing N years.
      if (hi >= 0 && hi <= 60) return { years: lo === 0 ? 0 : hi, raw: rangeMatch[0] };
    }
    const single = text.match(/(\d{1,2}(?:\.\d)?)\s*(\+)?\s*years?\s*(?:of\s+)?(?:work\s+|professional\s+|total\s+|combined\s+)?experience/i);
    if (single) {
      const years = parseFloat(single[1]);
      if (!isNaN(years) && years >= 0 && years <= 60) return { years, raw: single[0] };
    }
    // "N(+ )years of/across/in <domain>" — a stated career length without the
    // literal word "experience". Reject look-back phrases ("5 years ago",
    // "in the last 3 years") which are not total-tenure claims.
    const domain = text.match(/(\d{1,2}(?:\.\d)?)\s*(\+)?\s*years?\s+(?:of\s+|across\s+|in\s+|throughout\s+)/i);
    if (domain) {
      const window = text.slice(Math.max(0, domain.index - 20), domain.index + domain[0].length + 12).toLowerCase();
      const isLookback = /\b(ago|in the|over the|past|last|recent|within|since)\b/.test(window);
      if (!isLookback) {
        const years = parseFloat(domain[1]);
        if (!isNaN(years) && years >= 0 && years <= 60) return { years, raw: domain[0] };
      }
    }
    return null;
  }

  // Skills the candidate states explicitly in a SKILLS/TOOLS section, as
  // distinct tokens (never concatenated). Merged with keyword-detection so a
  // resume listing "ITIL, ISO 27001, ServiceNow" is not reduced to only the
  // tokens a fixed vocabulary knows.
  function extractStatedSkills(text) {
    if (!text || typeof text !== 'string') return [];
    const lines = text.split(/\r?\n/);
    const sectionHeading = /^\s*(core\s+)?(key\s+)?(skills?|technologies?|technical\s+skills?|tools?\s*(\(used\))?|tech\s+stack|platforms?|certifications?)\b[:\-–—]?\s*$/i;
    const nextSection = /^(summary|about|profile|objective|experience|employment|work\s+history|education|projects|achievements|awards|languages?|interests?)\b/i;
    const tokens = [];
    let inSection = false;
    let blankStreak = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (sectionHeading.test(trimmed)) { inSection = true; blankStreak = 0; continue; }
      if (inSection) {
        if (nextSection.test(trimmed)) break;
        if (trimmed === '') { blankStreak++; if (blankStreak > 1) break; continue; }
        blankStreak = 0;
        // Split on delimiters ONLY (commas, pipes, bullets, slashes,
        // semicolons) — never on bare spaces — so multi-word skills like
        // "Active Directory" or "Vendor Management" stay intact.
        trimmed
          .split(/[,;/|·▪‣•●]+/)
          .map(tok => tok.replace(/^[\s\-–—:()\[\]]+|[\s\-–—:()\[\]]+$/g, '').trim().toLowerCase())
          .forEach(tok => {
            if (tok.length >= 2 && tok.length <= 30 && /^[a-z0-9+#. ]+$/.test(tok)) tokens.push(tok);
          });
      }
    }
    // Drop words that are not skill-like
    const stop = new Set(['the','and','with','proficient','advanced','intermediate','familiar','exposure','knowledge','experience','skills','certified','certification','listed','above','strong','excellent','working']);
    const seen = new Set();
    return tokens
      .filter(t => !stop.has(t) && !t.includes(' years') && !/^\d+$/.test(t))
      .filter(t => { const k = t.replace(/\s+/g, ' '); if (seen.has(k)) return false; seen.add(k); return true; })
      .slice(0, 30);
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
    // Blank out the range itself: its years must not leak into the parsed
    // bullet and inflate the "quantified impact" meter with a date, not a result.
    const context = fullText.substring(contextStart, contextEnd).replace(dateRangeText, ' ');

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
      const items = content.items.filter(it => it.str && it.str.trim() !== '');

      // Rebuild visual lines from the PDF's own coordinates: pdf.js reports a
      // y transform per text item, so a y jump means a new line. Without this
      // every page collapses into one unreadable run-on line and the
      // experience/bullet parsers see a single line instead of structure.
      let pageText = '';
      let lastY = null;
      for (const item of items) {
        const y = item.transform ? item.transform[5] : null;
        if (y !== null && lastY !== null && Math.abs(y - lastY) > 2) {
          pageText += '\n';
        } else if (pageText && !/[\n ]$/.test(pageText)) {
          pageText += ' ';
        }
        pageText += item.str;
        if (y !== null) lastY = y;
      }
      pageText = pageText
        .split('\n')
        .map(line => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n');

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

  // Initialize the Resume Studio here (not at the top of the callback): the
  // studio module's const state must be initialized before its first render.
  if (typeof initStudio === 'function') initStudio();

});

