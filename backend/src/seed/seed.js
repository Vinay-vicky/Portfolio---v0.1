import dotenv from "dotenv";
import { db } from "../db/client.js";
import { initSchema } from "../db/schema.js";

dotenv.config();

const profile = {
  id: 1,
  full_name: "Vignesh R V",
  role: "Full Stack Developer",
  quote: "Code is like humor. When you have to explain it, it’s bad.",
  bio: "I’m Vignesh, a Full-Stack Developer and I help brands grow",
  about_intro: "About Me",
  about_text:
    "I recently achieved a significant milestone by completing a comprehensive web development course on Coursera, complemented by an intensive e-learning project completed within just 4 months. This endeavor not only solidified my expertise in web development but also honed my ability to effectively manage projects under tight deadlines. In May month, I completed a rigorous Python full-stack course at SkillVertex. This program provided a holistic approach, equipping me with the necessary tools and frameworks to thrive in the dynamic field of software development. At the end of May month, I also completed a captivating project centered on Customer Churn Prediction and Analysis, leveraging cutting-edge machine learning techniques. This project not only demonstrated my proficiency in data analysis and predictive modeling but also showcased my commitment to solving real-world challenges using innovative solutions. Currently, I am enhancing my knowledge in the MERN Stack and working on exciting projects related to this technology. My ongoing focus is to deepen my expertise in full-stack development, leveraging the MERN Stack to create robust and scalable web applications. Driven by a passion for innovation and a desire to make a meaningful impact, I am dedicated to continuously learning, growing, and contributing to the ever-evolving landscape of technology. I am excited about the opportunities that lie ahead and look forward to leveraging my skills to drive positive change in the tech industry.",
  tagline: "Crafting Innovative Digital Experiences",
  email: "vignesh@example.com",
  phone: "+91 93614 77185",
  location: "Chennai, Tamil Nadu, India",
  github_url: "https://github.com/Vinay-vicky",
  linkedin_url:
    "https://www.linkedin.com/in/vignesh-renugambal-b070b8293?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  whatsapp_url: "https://wa.link/2tng40",
  instagram_url: "https://instagram.com/vinay_vicky.2000",
  facebook_url: "https://www.facebook.com/vignesh.velan.52?mibextid=ZbWKwL",
  resume_pdf_url: "/legacy-assets/Vignesh RV.pdf",
  profile_image_url: "/legacy-assets/passport size.png",
};

const experiences = [
  {
    company: "Magic Bus India Foundation",
    company_url: "https://www.magicbus.org/",
    position: "Web Development & Designing (Trainee)",
    period_label: "Jan 2025 - April 2025",
    start_date: "2025-01",
    end_date: "2025-04",
    location: "Chennai, Tamilnadu",
    description:
      "I am honing my skills as a web developer Trainee at Magic Bus Foundation India, where I am undergoing training in frontend web development. I am gaining expertise in technologies such as React, Angular, Bootstrap, GitHub, and JavaScript, while actively completing assigned tasks to build hands-on experience. With React, I am learning component-based architecture, state management, and hooks, while my Angular training focuses on TypeScript, two-way data binding, and modular development. I am also mastering Bootstrap to create responsive designs using pre-built components and grid systems, alongside leveraging GitHub for version control, collaboration, and efficient code management."
  },
  {
    company: "SALS Education",
    company_url: "https://www.salseducation.com/",
    position: "Project Coordinator (Intern)",
    period_label: "Mar 2024 - Jul 2024",
    start_date: "2024-03",
    end_date: "2024-07",
    location: "Tamilnadu, India",
    description:
      "I worked as a Project Coordinator (Intern) in SALS Educational Academy Private Limited from between Mar 2024 to Jul 2024. During this internship period i was assigned as Project Coordinator by CEO. During this period of time I worked on 5 Edutech Web Applications and managed the Team for Each Project. Also got the Certificate of Appreciation for successfully completed the Internship program organised by SALS Educational Academy Private Limited."
  },
  {
    company: "Skillvertex",
    company_url: "https://www.skillvertex.com/",
    position: "Python Fullstack (Course/Internship)",
    period_label: "Jan 2024 - May 2024",
    start_date: "2024-01",
    end_date: "2024-05",
    location: "Bangalore, India",
    description:
      "I completed my python Fullstack internship/Course in Skillvertex from Jan 2024 to May 2024. during my internship i learnt about python framework's such as Flask & Django and worked on projects related to python Fullstack. During this period i preformed the Task well which is assigned by my mentor sir Nithish. Also i got the successful Internship Completion certificate & Course Completion certificate through Skillvertex."
  }
];

const education = [
  {
    years: "2022 - 2024",
    institution: "SCSVMV University",
    location: "Kanchipuram, Tamilnadu",
    level: "Master's",
    field: "Computer Application",
    description:
      "I completed my Master's (MCA) in SCSVMV University from 2022 to 2024. I Successfully completed my undergraduate with first class with distinction. In my Master's i worked on mini-project named E-Learning Site (Tier Study) and the main project named Customer Churn Prediction & Analysis (Churn Guard) and i published my paper for my main project. I enhanced my skillset in web development by Completion of certified courses."
  },
  {
    years: "2019 - 2022",
    institution: "University of Madras",
    location: "Kanchipuram, Tamilnadu",
    level: "Undergraduate",
    field: "Computer Application",
    description:
      "I completed my undergraduate (BCA) in University of Madras from 2019 to 2022. I Successfully completed my undergraduate with first class with distinction. In my undergraduate period i used to work on NSS volunteer services and i completed more than 4 certificate courses."
  }
];

const skills = [
  { category: "Professional Skills", name: "Web Development", sort_order: 1 },
  { category: "Professional Skills", name: "Digital Marketing", sort_order: 2 },
  { category: "Professional Skills", name: "SEO", sort_order: 3 },
  { category: "Professional Skills", name: "Database Management", sort_order: 4 },
  { category: "Professional Skills", name: "JavaScript Frameworks", sort_order: 5 },
  { category: "Professional Skills", name: "Content Management", sort_order: 6 },
  { category: "Languages", name: "HTML", sort_order: 1 },
  { category: "Languages", name: "Bootstrap (Framework)", sort_order: 2 },
  { category: "Languages", name: "Javascript", sort_order: 3 },
  { category: "Languages", name: "Python", sort_order: 4 },
  { category: "Languages", name: "Flask (Framework)", sort_order: 5 },
  { category: "Languages", name: "MERN Stack", sort_order: 6 },
];

const projects = [
  {
    title: "Customer Churn Prediction & Analysis",
    description:
      "The main Objective of this project is to minimize customer churn by predicting the likelihood of churn among customers. Designed and coded the complete site using HTML, Bootstrap, JavaScript, Flask(Python), SQLite and the Machine Learning algorithms like Logistic Regression & XGBoost. The main goal of this project is to effectively predicts customer churn, providing valuable insights for businesses to retain at-risk customers.",
    tech_stack: "HTML, Bootstrap, JavaScript, Flask, SQLite, Machine Learning",
    project_url: "https://github.com/Vinay-vicky/Customer-Churn-Prediction-Flask.git",
    image_url: "/legacy-assets/Churn Guard Site.png",
    sort_order: 1
  },
  {
    title: "CodeCatalyst",
    description:
      "I have created an e-learning site called CodeCatalyst, designed for learning digital platforms like coding and designing, which I coded and developed using HTML, CSS, JavaScript, and Bootstrap, ensuring full responsiveness. This site helps learners gain real-time experience with clear explanations and understanding to enhance their skills and boost their chances in the IT industry.",
    tech_stack: "HTML, CSS, JavaScript, Bootstrap",
    project_url: "https://edu-tech-magicbus-200fs.vercel.app",
    image_url: "/legacy-assets/Screenshot 2025-03-27 101649.png",
    sort_order: 2
  },
  {
    title: "Testimonials(GOT)",
    description:
      "This project showcases a dynamic Game of Thrones testimonials carousel, featuring iconic quotes from the legendary series. Built with HTML, CSS, and JavaScript, it delivers smooth transitions and engaging visuals. Each quote captures the essence of the show's unforgettable characters and moments. Designed to be fully responsive, the experience is seamless across all devices.",
    tech_stack: "HTML, CSS, JavaScript",
    project_url: "https://got-testimonial.vercel.app/",
    image_url: "/legacy-assets/GOT Testimonials.png",
    sort_order: 3
  },
  {
    title: "Scientific Calculator",
    description:
      "This project is a responsive Scientific Calculator built using HTML, CSS, and JavaScript. It supports advanced operations along with memory functions like M+, MR, and MC. Features like Dark Mode and Calculation History offer a modern, user-friendly experience. Designed for efficiency and accuracy, it adapts perfectly to all screen sizes.",
    tech_stack: "HTML, CSS, JavaScript",
    project_url: "https://scientific-calculator-bay-delta.vercel.app/",
    image_url: "/legacy-assets/Scientific Calculator.png",
    sort_order: 4
  },
  {
    title: "Product card",
    description:
      "This project features a sleek and stylish product card for the Nike ZOOM KD 12 shoes. Built using HTML, CSS, and JavaScript, it highlights key product details with smooth UI interactions. Designed with a modern, clean layout to showcase the brand’s premium look and feel. Fully responsive, the card adapts seamlessly to all devices for a perfect shopping experience.",
    tech_stack: "HTML, CSS, JavaScript",
    project_url: "https://product-card-mu-flax.vercel.app/",
    image_url: "/legacy-assets/Product Card.png",
    sort_order: 5
  },
  {
    title: "Analog + Digital Clock",
    description:
      "This project presents a combined Analog and Digital Clock built with HTML, CSS, and JavaScript. It displays real-time hours, minutes, and seconds with smooth animations and clean design. The analog dial and digital display are perfectly synchronized for accurate timekeeping. Fully responsive, it offers a stylish and functional experience across all screen sizes.",
    tech_stack: "HTML, CSS, JavaScript",
    project_url: "https://analog-and-digital-clock-alpha.vercel.app/",
    image_url: "/legacy-assets/Analog & Digital Clock.png",
    sort_order: 6
  },
  {
    title: "Meesho Clone",
    description:
      "This project is a front-end clone of the popular Meesho shopping platform, built using HTML, CSS, and JavaScript. It replicates the clean design, product listings, navigation bar, and responsive layouts of the original site. Interactive elements like product hovers, dropdowns, and banners enhance the user experience. Fully responsive and visually appealing, it brings a real-world e-commerce feel to all devices.",
    tech_stack: "HTML, CSS, JavaScript",
    project_url: "https://meesho-clone-two.vercel.app/",
    image_url: "/legacy-assets/Meesho Clone.png",
    sort_order: 7
  },
  {
    title: "ToDo - List",
    description:
      "This project is a simple and efficient ToDo List application built with HTML, CSS, and JavaScript. Users can easily add, delete, and mark tasks as completed with a clean and intuitive interface. Designed for better task management, it features a smooth and responsive user experience. Fully responsive across devices, helping users stay organized anytime, anywhere.",
    tech_stack: "HTML, CSS, JavaScript",
    project_url: "https://to-do-list-magicbus.vercel.app/",
    image_url: "/legacy-assets/ToDo List.png",
    sort_order: 8
  },
  {
    title: "Loading - Pages",
    description:
      "This project showcases a collection of stylish Page Loaders created using pure HTML and CSS. It features a variety of animation styles like spinners, pulse effects, and bouncing loaders. Each loader is designed to enhance user experience during page transitions or data fetching. Fully responsive and lightweight, these loaders are perfect for any modern web project.",
    tech_stack: "HTML, CSS",
    project_url: "https://loading-pages-pi.vercel.app/",
    image_url: "/legacy-assets/Loading Pages.png",
    sort_order: 9
  },
  {
    title: "ToDo List(React App)",
    description:
      "This project is a dynamic ToDo List application developed using React with Vite for faster performance. It allows users to add, edit, delete, and mark tasks as completed with a smooth, real-time interface. Built with reusable components and efficient state management for a clean user experience. Fully responsive and optimized for speed, delivering a modern task management solution.",
    tech_stack: "React, Vite, JavaScript",
    project_url: "https://react-todo-app-coral-six.vercel.app/",
    image_url: "/legacy-assets/ToDo List(React App).png",
    sort_order: 10
  },
  {
    title: "Timer(React App)",
    description:
      "This project is a responsive Timer application built using React for dynamic and real-time updates. It features start, pause, reset functionalities with a clean and intuitive user interface. Developed with component-based architecture and efficient state management for smooth performance. Fully responsive and optimized for all devices, ensuring a seamless time-tracking experience.",
    tech_stack: "React, JavaScript",
    project_url: "https://timer-app-vdn2.vercel.app/",
    image_url: "/legacy-assets/Timer App(React).png",
    sort_order: 11
  },
  {
    title: "Competitive Exam Site (E-Learning)",
    description:
      "Designed and coded Competitive Exam E-learning site using HTML, CSS, JavaScript, Php and MySql. Currently Provide Guidance to Aspirants those who want to clear the difficult exams and view the details about other detail also. It consist of both TNPSC and UPSC Boards related resources",
    tech_stack: "HTML, CSS, JavaScript, PHP, MySQL",
    project_url: "",
    image_url: "/legacy-assets/Tier Study Site.png",
    sort_order: 12
  },
];

const seed = async () => {
  await db.execute("DROP TABLE IF EXISTS contact_messages");
  await db.execute("DROP TABLE IF EXISTS projects");
  await db.execute("DROP TABLE IF EXISTS skills");
  await db.execute("DROP TABLE IF EXISTS education");
  await db.execute("DROP TABLE IF EXISTS experiences");
  await db.execute("DROP TABLE IF EXISTS profile");

  await initSchema();

  await db.execute({
    sql: `INSERT INTO profile (id, full_name, role, quote, bio, about_intro, about_text, tagline, email, phone, location, github_url, linkedin_url, whatsapp_url, instagram_url, facebook_url, resume_pdf_url, profile_image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      profile.id,
      profile.full_name,
      profile.role,
      profile.quote,
      profile.bio,
      profile.about_intro,
      profile.about_text,
      profile.tagline,
      profile.email,
      profile.phone,
      profile.location,
      profile.github_url,
      profile.linkedin_url,
      profile.whatsapp_url,
      profile.instagram_url,
      profile.facebook_url,
      profile.resume_pdf_url,
      profile.profile_image_url,
    ],
  });

  for (const experience of experiences) {
    await db.execute({
      sql: `INSERT INTO experiences (company, company_url, position, period_label, start_date, end_date, location, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        experience.company,
        experience.company_url,
        experience.position,
        experience.period_label,
        experience.start_date,
        experience.end_date,
        experience.location,
        experience.description,
      ],
    });
  }

  for (const edu of education) {
    await db.execute({
      sql: `INSERT INTO education (years, institution, location, level, field, description)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [edu.years, edu.institution, edu.location, edu.level, edu.field, edu.description],
    });
  }

  for (const skill of skills) {
    await db.execute({
      sql: `INSERT INTO skills (category, name, sort_order)
            VALUES (?, ?, ?)`,
      args: [skill.category, skill.name, skill.sort_order],
    });
  }

  for (const project of projects) {
    await db.execute({
      sql: `INSERT INTO projects (title, description, tech_stack, project_url, image_url, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        project.title,
        project.description,
        project.tech_stack,
        project.project_url,
        project.image_url,
        project.sort_order,
      ],
    });
  }

  console.log("Seed complete ✅");
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
