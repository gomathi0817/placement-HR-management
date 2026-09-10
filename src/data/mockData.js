export const INITIAL_HRS = [
  {
    id: "hr-1",
    name: "Gomathi HR",
    companyId: "comp-1",
    companyName: "ABC Technologies",
    designation: "Manager — Talent Acquisition",
    phone: "+91 98765 43210",
    email: "gomathi.hr@abctechnologies.com",
    whatsapp: "+91 98765 43210",
    status: "Active", // Active, Waiting for Response, Follow-Up Scheduled, Inactive
    lastContactDate: "2026-08-30",
    nextFollowUpDate: "2026-09-03",
    nextFollowUpTime: "10:30 AM",
    nextFollowUpPurpose: "Discuss campus recruitment process & interview rounds",
    priority: "High",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    companyInfo: {
      recruitmentType: "Full-Time + Internship",
      studentsRequired: 30,
      jobRoles: ["Software Engineer Trainee", "Data Analyst Intern"],
      location: "Bengaluru / Hybrid",
      currentStatus: "Process Discussion Phase",
      pkgDetails: "6.5 LPA (Full Time), ₹25,000/mo (Stipend)"
    }
  },
  {
    id: "hr-2",
    name: "Priya Nair",
    companyId: "comp-2",
    companyName: "Infosys",
    designation: "HR Lead — Campus Relations",
    phone: "+91 98450 11223",
    email: "priya_nair@infosys.com",
    whatsapp: "+91 98450 11223",
    status: "Active",
    lastContactDate: "2026-08-25",
    nextFollowUpDate: "2026-08-31", // Overdue!
    nextFollowUpTime: "02:00 PM",
    nextFollowUpPurpose: "Waiting for interview schedule confirmation",
    priority: "High",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    companyInfo: {
      recruitmentType: "Full-Time Pool Drive",
      studentsRequired: 45,
      jobRoles: ["Systems Engineer", "Specialist Programmer"],
      location: "Mysuru Training Campus / Pan India",
      currentStatus: "Awaiting Slot Confirmation",
      pkgDetails: "4.0 to 9.5 LPA"
    }
  },
  {
    id: "hr-3",
    name: "Ravi Kumar",
    companyId: "comp-3",
    companyName: "Tech Solutions Pvt Ltd",
    designation: "HR Executive",
    phone: "+91 91234 56789",
    email: "ravi.k@techsolutions.io",
    whatsapp: "+91 91234 56789",
    status: "Waiting for Response",
    lastContactDate: "2026-09-01",
    nextFollowUpDate: "2026-09-03",
    nextFollowUpTime: "11:45 AM",
    nextFollowUpPurpose: "Confirm PPT (Pre-Placement Talk) dates",
    priority: "Medium",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    companyInfo: {
      recruitmentType: "Direct Hiring",
      studentsRequired: 15,
      jobRoles: ["Frontend Developer", "DevOps Assistant"],
      location: "Chennai",
      currentStatus: "Shortlisting Resumes",
      pkgDetails: "5.2 LPA"
    }
  },
  {
    id: "hr-4",
    name: "Ananya Sharma",
    companyId: "comp-4",
    companyName: "Innovate Systems",
    designation: "Senior HR Manager",
    phone: "+91 99887 76655",
    email: "ananya@innovatesys.org",
    whatsapp: "+91 99887 76655",
    status: "Active",
    lastContactDate: "2026-08-28",
    nextFollowUpDate: "2026-09-04",
    nextFollowUpTime: "04:30 PM",
    nextFollowUpPurpose: "Finalize MOU for annual placement partnership",
    priority: "High",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    companyInfo: {
      recruitmentType: "Exclusive Campus Drive",
      studentsRequired: 20,
      jobRoles: ["Cloud Engineer Trainee", "QA Automation Specialist"],
      location: "Hyderabad",
      currentStatus: "MOU Draft Review",
      pkgDetails: "7.0 LPA"
    }
  },
  {
    id: "hr-5",
    name: "Vikram Malhotra",
    companyId: "comp-5",
    companyName: "Cognizant Technology",
    designation: "Associate Director — University Relations",
    phone: "+91 97654 32109",
    email: "vikram.m@cognizant.com",
    whatsapp: "+91 97654 32109",
    status: "Active",
    lastContactDate: "2026-08-20",
    nextFollowUpDate: "2026-08-30", // Overdue
    nextFollowUpTime: "11:00 AM",
    nextFollowUpPurpose: "Collect GenC exam candidate eligibility list",
    priority: "Medium",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    companyInfo: {
      recruitmentType: "Mass Campus Drive",
      studentsRequired: 60,
      jobRoles: ["GenC Programmer", "GenC Elevate"],
      location: "Pan India",
      currentStatus: "Registration Open",
      pkgDetails: "4.2 to 5.5 LPA"
    }
  },
  {
    id: "hr-6",
    name: "Karthik Subramanian",
    companyId: "comp-6",
    companyName: "Zoho Corporation",
    designation: "Head of Campus Talent",
    phone: "+91 98840 98840",
    email: "karthik.s@zohocorp.com",
    whatsapp: "+91 98840 98840",
    status: "Waiting for Response",
    lastContactDate: "2026-08-15",
    nextFollowUpDate: "2026-08-28", // Overdue
    nextFollowUpTime: "03:15 PM",
    nextFollowUpPurpose: "Follow up on off-campus test link distribution",
    priority: "Low",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    companyInfo: {
      recruitmentType: "Zoho Schools / Campus",
      studentsRequired: 25,
      jobRoles: ["Member Technical Staff"],
      location: "Tenkasi / Chennai",
      currentStatus: "Initial screening",
      pkgDetails: "6.0 to 10.0 LPA"
    }
  }
];

export const INITIAL_COMPANIES = [
  {
    id: "comp-1",
    name: "ABC Technologies",
    industry: "IT Services & Consulting",
    location: "Bengaluru",
    status: "Active Recruitment",
    studentsRequired: 30,
    recruitmentStage: "Technical Process Discussion",
    lastInteraction: "30 Aug 2026",
    nextFollowUp: "03 Sep 2026",
    hrContact: "Gomathi HR",
    hrDesignation: "Manager — Talent Acquisition",
    tier: "Tier 1",
    website: "https://abctechnologies.example.com"
  },
  {
    id: "comp-2",
    name: "Infosys",
    industry: "IT & Global Services",
    location: "Mysuru / Bengaluru",
    status: "Drive Scheduled",
    studentsRequired: 45,
    recruitmentStage: "Slot Confirmation Pending",
    lastInteraction: "25 Aug 2026",
    nextFollowUp: "31 Aug 2026 (Overdue)",
    hrContact: "Priya Nair",
    hrDesignation: "HR Lead — Campus Relations",
    tier: "Tier 1",
    website: "https://infosys.example.com"
  },
  {
    id: "comp-3",
    name: "Tech Solutions Pvt Ltd",
    industry: "Software Products",
    location: "Chennai",
    status: "In Conversation",
    studentsRequired: 15,
    recruitmentStage: "PPT & Resume Shortlisting",
    lastInteraction: "01 Sep 2026",
    nextFollowUp: "03 Sep 2026",
    hrContact: "Ravi Kumar",
    hrDesignation: "HR Executive",
    tier: "Tier 2",
    website: "https://techsolutions.example.io"
  },
  {
    id: "comp-4",
    name: "Innovate Systems",
    industry: "Cloud & Cyber Security",
    location: "Hyderabad",
    status: "MOU Stage",
    studentsRequired: 20,
    recruitmentStage: "Partnership Agreement Review",
    lastInteraction: "28 Aug 2026",
    nextFollowUp: "04 Sep 2026",
    hrContact: "Ananya Sharma",
    hrDesignation: "Senior HR Manager",
    tier: "Tier 1",
    website: "https://innovatesys.example.org"
  },
  {
    id: "comp-5",
    name: "Cognizant Technology",
    industry: "IT Infrastructure & Enterprise",
    location: "Pan India",
    status: "Registration Phase",
    studentsRequired: 60,
    recruitmentStage: "Candidate Enrollment",
    lastInteraction: "20 Aug 2026",
    nextFollowUp: "30 Aug 2026 (Overdue)",
    hrContact: "Vikram Malhotra",
    hrDesignation: "Associate Director",
    tier: "Tier 1",
    website: "https://cognizant.example.com"
  },
  {
    id: "comp-6",
    name: "Zoho Corporation",
    industry: "SaaS & Enterprise Apps",
    location: "Chennai",
    status: "Screening Phase",
    studentsRequired: 25,
    recruitmentStage: "Screening Round Links",
    lastInteraction: "15 Aug 2026",
    nextFollowUp: "28 Aug 2026 (Overdue)",
    hrContact: "Karthik Subramanian",
    hrDesignation: "Head of Campus Talent",
    tier: "Tier 1",
    website: "https://zoho.example.com"
  }
];

export const INITIAL_INTERACTIONS = [
  {
    id: "int-1",
    hrId: "hr-1",
    hrName: "Gomathi HR",
    companyName: "ABC Technologies",
    date: "2026-08-17",
    method: "Call", // Call, WhatsApp, Email, Meeting
    title: "Initial Discussion",
    summary: "Discussed campus recruitment requirements for 2027 batch passing out students. Expressed interest in CSE & ECE branches.",
    studentsRequired: 30,
    recruitmentProcess: "Aptitude Test → Coding Round → 2 Technical Interviews → HR Round",
    importantNotes: "Requested top 15% student profiles with no standing arrears.",
    nextAction: "Send company profile to department heads and follow up on 20 Aug via WhatsApp"
  },
  {
    id: "int-2",
    hrId: "hr-1",
    hrName: "Gomathi HR",
    companyName: "ABC Technologies",
    date: "2026-08-20",
    method: "WhatsApp",
    title: "WhatsApp Follow-Up",
    summary: "Shared student enrollment statistics, branch breakdown, and company brochure with placement coordinators.",
    studentsRequired: 30,
    recruitmentProcess: "Aptitude Test → Technical Interview → HR",
    importantNotes: "HR confirmed stipend during 6-month internship will be ₹25,000 per month.",
    nextAction: "Schedule call on 27 Aug to finalize assessment dates."
  },
  {
    id: "int-3",
    hrId: "hr-1",
    hrName: "Gomathi HR",
    companyName: "ABC Technologies",
    date: "2026-08-30",
    method: "Call",
    title: "Recruitment Process Discussion",
    summary: "Detailed discussion on recruitment stages, online assessment platform hosting, and slot booking for 2nd week of September.",
    studentsRequired: 30,
    recruitmentProcess: "Online Aptitude + Coding → Technical 1 → Technical 2 → Management HR",
    importantNotes: "Requested auditorium reservation for Pre-Placement Talk on Day 1.",
    nextAction: "Follow up on 03 Sep at 10:30 AM to confirm final dates."
  },
  {
    id: "int-4",
    hrId: "hr-2",
    hrName: "Priya Nair",
    companyName: "Infosys",
    date: "2026-08-25",
    method: "Email",
    title: "Infosys Campus Pool Slot Request",
    summary: "Submitted official campus placement slot request form for Systems Engineer & Specialist Programmer roles.",
    studentsRequired: 45,
    recruitmentProcess: "Infytq Assessment / HackWithInfy + Campus Interview",
    importantNotes: "Waiting for regional campus lead approval from Mysuru headquarters.",
    nextAction: "Follow up on 31 Aug if confirmation mail is delayed."
  },
  {
    id: "int-5",
    hrId: "hr-3",
    hrName: "Ravi Kumar",
    companyName: "Tech Solutions Pvt Ltd",
    date: "2026-09-01",
    method: "Meeting",
    title: "On-Campus Meeting & Lab Inspection",
    summary: "Met HR Executive in Placement Office. Showed computing labs (300 system capacity). Satisfied with infrastructure.",
    studentsRequired: 15,
    recruitmentProcess: "PPT → Paper Test → Technical HR",
    importantNotes: "Will send finalized PPT slides by tomorrow.",
    nextAction: "Call HR on 03 Sep to confirm PPT schedule."
  }
];

export const INITIAL_FOLLOW_UPS = [
  {
    id: "fol-1",
    hrId: "hr-1",
    hrName: "Gomathi HR",
    companyName: "ABC Technologies",
    date: "2026-09-03", // Today's date relative to demo context
    time: "10:30 AM",
    purpose: "Discuss campus recruitment process & interview rounds",
    priority: "High", // Low, Medium, High
    status: "Pending", // Pending, Follow-Up Due, Contacted, Waiting for HR Response, Completed, Cancelled
    notes: "Ensure auditorium availability chart is ready before calling."
  },
  {
    id: "fol-2",
    hrId: "hr-3",
    hrName: "Ravi Kumar",
    companyName: "Tech Solutions Pvt Ltd",
    date: "2026-09-03",
    time: "11:45 AM",
    purpose: "Confirm PPT (Pre-Placement Talk) dates and guest accommodation",
    priority: "Medium",
    status: "Pending",
    notes: "Check guest house reservation status."
  },
  {
    id: "fol-3",
    hrId: "hr-2",
    hrName: "Priya Nair",
    companyName: "Infosys",
    date: "2026-08-31", // Overdue
    time: "02:00 PM",
    purpose: "Waiting for interview schedule confirmation mail",
    priority: "High",
    status: "Overdue",
    notes: "2 days overdue! Send polite reminder email + phone follow up."
  },
  {
    id: "fol-4",
    hrId: "hr-5",
    hrName: "Vikram Malhotra",
    companyName: "Cognizant Technology",
    date: "2026-08-30", // Overdue
    time: "11:00 AM",
    purpose: "Collect GenC exam candidate eligibility registration link",
    priority: "Medium",
    status: "Overdue",
    notes: "Need link to distribute to 400 eligible final year students."
  },
  {
    id: "fol-5",
    hrId: "hr-6",
    hrName: "Karthik Subramanian",
    companyName: "Zoho Corporation",
    date: "2026-08-28", // Overdue
    time: "03:15 PM",
    purpose: "Follow up on off-campus test link distribution status",
    priority: "Low",
    status: "Overdue",
    notes: "Re-verify student email domain list."
  },
  {
    id: "fol-6",
    hrId: "hr-4",
    hrName: "Ananya Sharma",
    companyName: "Innovate Systems",
    date: "2026-09-04",
    time: "04:30 PM",
    purpose: "Finalize MOU for annual placement partnership",
    priority: "High",
    status: "Upcoming",
    notes: "Legal team approved draft MOU."
  },
  {
    id: "fol-7",
    hrId: "hr-1",
    hrName: "Gomathi HR",
    companyName: "ABC Technologies",
    date: "2026-08-27",
    time: "10:30 AM",
    purpose: "Initial slot discussion",
    priority: "High",
    status: "Completed",
    notes: "Completed successfully. Detailed notes added to HR timeline."
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Follow-up due today",
    hrName: "Gomathi HR",
    companyName: "ABC Technologies",
    time: "10:30 AM",
    type: "reminder",
    read: false,
    date: "2026-09-03"
  },
  {
    id: "notif-2",
    title: "Overdue Follow-up alert",
    hrName: "Priya Nair",
    companyName: "Infosys",
    time: "02:00 PM",
    type: "overdue",
    read: false,
    date: "2026-08-31"
  },
  {
    id: "notif-3",
    title: "New HR interaction logged",
    hrName: "Ravi Kumar",
    companyName: "Tech Solutions Pvt Ltd",
    time: "Yesterday",
    type: "activity",
    read: true,
    date: "2026-09-01"
  }
];

export const MOCK_ANALYTICS = {
  communicationMethods: [
    { method: "Call", count: 18, percentage: 45, icon: "Phone" },
    { method: "WhatsApp", count: 12, percentage: 30, icon: "MessageCircle" },
    { method: "Email", count: 7, percentage: 17, icon: "Mail" },
    { method: "Meeting", count: 3, percentage: 8, icon: "Users" }
  ],
  followUpStatusBreakdown: [
    { status: "Completed", count: 26, color: "#16A34A" },
    { status: "Upcoming", count: 8, color: "#2563EB" },
    { status: "Pending", count: 5, color: "#D97706" },
    { status: "Overdue", count: 3, color: "#DC2626" },
    { status: "Waiting Response", count: 7, color: "#7C3AED" }
  ],
  recruitmentMetrics: {
    totalStudentsRequired: 195,
    studentsSelectedSoFar: 84,
    activeDrives: 6,
    completedDrives: 12
  }
};
