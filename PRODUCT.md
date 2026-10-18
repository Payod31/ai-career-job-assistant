# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Job seekers and career changers who want to analyze their resumes, match with job descriptions, and plan career transitions using AI-assisted tools.

## Product Purpose
Provides a comprehensive career assistance platform that helps users analyze resumes, compare with job descriptions, calculate match scores, discover job opportunities, track applications, and plan career transitions—all in one integrated interface.

## Positioning
A unified career assistance tool that combines resume analysis, job matching, and career planning features with persistent data storage, premium UI design, and theme customization—offering more than isolated resume builders or job boards by providing end-to-end career development support.

## Operating Context
Used in modern web browsers for career development activities including resume preparation, job search, application tracking, and career planning. Accessible via desktop and mobile browsers for flexible usage.

## Capabilities and Constraints
- Resume upload, parsing, and analysis with skill/experience/education/contact extraction
- Job description analysis and skill requirement extraction  
- Resume-job match scoring with skills/experience/education breakdown
- Career transition planning with 30-day action plans
- Job discovery: resume-based role recommendations, per-board pre-filled external
  search links (LinkedIn / Indeed / Naukri / Monster India) where each board only
  receives filters it actually accepts as URL parameters; salary is never encoded
  into links and is flagged as a page-level filter. Role catalogue covers e-commerce,
  marketing, sales, operations, data/BI, HR, finance & accounting, project
  management and IT/software engineering
- Application tracker for job applications with status management
- LocalStorage persistence for all user data and preferences
- Premium UI with theme system (Ink/OnePiece/Wizarding themes)
- Tab-based navigation with responsive layout
- Sample data embedding for immediate usability
- Input signature tracking for stale data detection
- Visual feedback with score rings, skill chips, and insight cards

## Brand Commitments
- Product name: "AI Career & Job Match Assistant"
- Theme system: Ink (default), OnePiece, and Wizarding themes
- Tab-based interface structure: Resume, Job Description, Match Analysis, Application Tracker, Job Discovery, Career Transition Planner
- Data privacy: All user data stored locally in browser localStorage
- No external API dependencies for core functionality

## Evidence on Hand
- Functional resume analysis with skills/experience/education extraction
- Working job description analysis with skill requirement identification  
- Operational match calculation algorithm with weighted scoring
- Career transition planner with role-based planning capabilities
- Job discovery engine generating honest, per-board external search links (each board gets only the filters it accepts as URL parameters; salary is surfaced as a page-level reminder, never faked in a link)
- Application tracker with CRUD operations for job applications
- LocalStorage persistence verified across page refreshes
- Theme switching functionality working
- Responsive layout adapting to different screen sizes
- Premium UI components: score rings, skill chips, insight cards
- Tab navigation system with visual feedback

## Product Principles
- User data ownership and privacy through localStorage persistence
- Seamless flow from resume analysis to job discovery to career planning
- Actionable insights through skill gap analysis and match scoring
- Visual feedback and progressive disclosure of complex information
- Theme customization for personalized user experience
- Robust error handling and edge case management
- Performance-conscious implementation with efficient algorithms
- Accessible design with proper color contrast and interactive elements

## Accessibility & Inclusion
- Keyboard navigable interface with proper tab ordering
- Semantic HTML structure for screen reader accessibility
- Sufficient color contrast in theme designs
- Focusable interactive elements with visible focus states
- Responsive design accommodating various viewport sizes
- Clear visual hierarchy and information organization