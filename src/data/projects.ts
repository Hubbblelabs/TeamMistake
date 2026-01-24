export interface Project {
    id: number;
    title: string;
    category: string;
    description: string;
    longDescription: string;
    technologies: string[];
    features: string[];
}

export const projects: Project[] = [
    {
        id: 1,
        title: 'Inventory & Billing',
        category: 'Enterprise',
        description: 'Complete business management solution',
        longDescription: 'A comprehensive inventory and billing system designed for modern businesses. Track stock levels, manage suppliers, generate invoices, and gain insights into your business operations with real-time analytics.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        features: ['Real-time inventory tracking', 'Automated billing', 'Supplier management', 'Analytics dashboard']
    },
    {
        id: 2,
        title: 'Brand Identity',
        category: 'Design',
        description: 'Unique digital identities',
        longDescription: 'Create stunning brand identities that resonate with your audience. From logo design to complete brand guidelines, we craft visual languages that tell your story.',
        technologies: ['Figma', 'Adobe Suite', 'Brand Strategy'],
        features: ['Logo design', 'Color palettes', 'Typography systems', 'Brand guidelines']
    },
    {
        id: 3,
        title: 'Student AI',
        category: 'EdTech',
        description: 'Virtual academic support',
        longDescription: 'AI-powered virtual assistant helping students with homework, exam preparation, and personalized learning paths. Available 24/7 to provide instant academic support.',
        technologies: ['Python', 'TensorFlow', 'OpenAI', 'FastAPI'],
        features: ['Homework assistance', 'Exam preparation', 'Personalized learning', '24/7 availability']
    },
    {
        id: 4,
        title: 'School Management',
        category: 'Platform',
        description: 'Data and record systems',
        longDescription: 'End-to-end school management platform handling student records, attendance, grades, and communication between teachers, students, and parents.',
        technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'TypeScript'],
        features: ['Student records', 'Attendance tracking', 'Grade management', 'Parent portal']
    },
    {
        id: 5,
        title: 'Learning Systems',
        category: 'Education',
        description: 'Interactive learning platforms',
        longDescription: 'Interactive e-learning platforms with video courses, quizzes, assignments, and progress tracking. Gamified learning experience to keep students engaged.',
        technologies: ['React', 'Video.js', 'WebRTC', 'Redis'],
        features: ['Video courses', 'Interactive quizzes', 'Progress tracking', 'Gamification']
    },
    {
        id: 6,
        title: 'CRM Solutions',
        category: 'Enterprise',
        description: 'Customer engagement tools',
        longDescription: 'Powerful CRM system to manage customer relationships, track sales pipelines, automate marketing campaigns, and improve customer satisfaction.',
        technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
        features: ['Contact management', 'Sales pipeline', 'Email automation', 'Analytics']
    },
    {
        id: 7,
        title: 'Analytics Hub',
        category: 'Data',
        description: 'Business intelligence platform',
        longDescription: 'Advanced analytics platform providing deep insights into business operations. Custom dashboards, predictive analytics, and data visualization tools.',
        technologies: ['Python', 'Apache Spark', 'D3.js', 'Tableau'],
        features: ['Custom dashboards', 'Predictive analytics', 'Data visualization', 'Real-time reporting']
    },
    {
        id: 8,
        title: 'Mobile Apps',
        category: 'Development',
        description: 'Cross-platform solutions',
        longDescription: 'Native and cross-platform mobile applications for iOS and Android. From concept to deployment, we build apps that users love.',
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
        features: ['Cross-platform', 'Native performance', 'Offline support', 'Push notifications']
    },
];
