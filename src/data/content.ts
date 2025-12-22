export const skills = [
  { group: 'Languages', items: ['Java', 'JavaScript', 'HTML', 'CSS'] },
  { group: 'Frameworks', items: ['ReactJS', 'SpringBoot'] },
  { group: 'Databases', items: ['MySQL', 'DBMS'] },
  { group: 'Tools', items: ['Git & GitHub'] },
]

export const achievements = [
  'Certificate of Achievement at Samadhan Hackathon',
  'Cleared HackerRank assessment in Java',
  '8-week NPTEL course in DBMS, earned certification',
]

export const education = [
  { school: 'Sagar Institute Of Science And Technology, Bhopal', degree: 'BTech, Computer Science and Engineering', year: '2024', detail: 'CGPA 7.2' },
]

export type Project = { title: string; blurb: string; link?: string; tags: string[]; image?: string; isPublic?: boolean }

export const projects: Project[] = [
  {
    title: 'Contract Farming Platform',
    blurb: 'Full-stack app. Angular frontend with Spring Boot APIs for transparent agriculture contracts.',
    link: 'https://contractfarming.netlify.app/dashboard',
    tags: ['Full‑stack', 'Angular', 'Spring Boot'],
    image: '/images/mp1.jpg',
    isPublic: true,
  },
  {
    title: 'Angular Admin Dashboard',
    blurb: 'Role-based dashboards with charts and CRUD over REST endpoints.',
    tags: ['Angular'],
    image: '/images/Screenshot 2025-10-14 160630.png',
    isPublic: true,
  },
  {
    title: 'Spring Boot Services',
    blurb: 'Authentication with JWT and MySQL-backed services.',
    tags: ['Spring Boot'],
    isPublic: true,
  },
]

export const experience = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Cloud Nexus',
    period: 'June 2025 – Present',
    location: 'India',
    techStack: 'Spring Boot, Angular, React.js',
    bullets: [
      'Contributing to the development of dynamic, full-stack web applications with a focus on responsive design and scalability.',
      'Building RESTful APIs using Spring Boot and integrating them with Angular and React.js frontends.',
      'Collaborating with cross-functional teams to enhance user experience, optimize application performance, and ensure seamless deployment.',
      'Involved in both frontend and backend development, debugging, and feature implementation to deliver production-ready solutions.',
      'Gaining hands-on experience in agile development workflows, version control, and modern software architecture.',
    ],
  },
]
