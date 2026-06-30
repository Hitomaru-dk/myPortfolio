import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding portfolio projects...');

  // ลบข้อมูลโปรเจกต์เดิมที่มีอยู่ก่อนเพื่อไม่ให้ซ้ำซ้อน
  await prisma.project.deleteMany();

  const projects = [
    {
      title: 'Mecha Store Design (Ai)',
      description: 'A UI design of a mobile app for a Gundam model shop (Gundam Model Shop). It features login screen, search bar, featured models (RX-78-2 Gundam, MS-06S Zaku II), and new arrivals (Gundam Aerial MG 1/100, Gundam Calibarn HG 1/144, Gundam Lfrith RG 1/144).',
      techStack: ['Adobe Illustrator', 'UI Design'],
      liveUrl: 'https://nattakorn-portfolio.super.site/mecha-store-designai',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'ออกแบบอุปกรณ์ตรวจฝุ่นติดแอร์',
      description: 'A conceptual design of a smart dust detector device installed on an air conditioner filter, complete with a mobile app UI screen that displays the current PM2.5 levels and warning alerts.',
      techStack: ['Conceptual Design', 'UI Design'],
      liveUrl: 'https://nattakorn-portfolio.super.site/33d50e1bd97080799d83e8d205ca9734',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'Feane E-Commerce Platform 🍔🛒',
      description: 'A full-stack e-commerce web application for a restaurant, featuring a food menu, cart, booking table system, etc.',
      techStack: ['Node.js', 'Express', 'SQLite', 'Layered Architecture'],
      liveUrl: 'https://nattakorn-portfolio.super.site/feane',
      repoUrl: 'https://github.com/Hitomaru-dk/e-com',
      imageUrl: '',
    },
    {
      title: 'RPGGameApp (Java)',
      description: 'An RPG game simulation engine implemented in Java, defining weapons, characters, destructible objects, and consumable items with interfaces (e.g., Scenario 4: Interfaces - Destructible & Consumable).',
      techStack: ['Java', 'Object-Oriented Programming', 'Interfaces'],
      liveUrl: 'https://nattakorn-portfolio.super.site/rpggameappjava-1',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'Library Management System (Java)',
      description: 'A console-based library management system built in Java, featuring Member Management, Media Management, Borrow Media, Return Media, and Reports & Fees.',
      techStack: ['Java', 'Object-Oriented Programming'],
      liveUrl: 'https://nattakorn-portfolio.super.site/library-management-systemjava-1',
      repoUrl: 'https://github.com/Hitomaru-dk/oop-post-midterm-project',
      imageUrl: '',
    },
    {
      title: 'Student Management System (Figma)',
      description: 'A UI design of a student management system for Ban Mae Soi Ngoen School, designed to help teachers track student problems in academic, behavior, and family areas.',
      techStack: ['Figma', 'UI Design', 'Prototyping'],
      liveUrl: 'https://www.figma.com/proto/irRQY80gt6Z9ivxRALoozy/Prototype?node-id=93-25',
      repoUrl: 'https://www.figma.com/design/irRQY80gt6Z9ivxRALoozy/Prototype?node-id=0-1',
      imageUrl: '',
    },
    {
      title: 'Cinema (Java)',
      description: 'A console-based cinema ticket booking system in Java that includes movie selection, showtime selection, seat booking with layout map, member discounts, and food/snack purchasing.',
      techStack: ['Java', 'Object-Oriented Programming'],
      liveUrl: 'https://nattakorn-portfolio.super.site/cinemajava-1',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'M-Spec by WPF',
      description: 'A full-stack niche marketplace combining Dyno Tuning appointment booking (Capacity Logic) and Rare Car Parts sales (Multi-Step Status Logic), built on a professional Controller-Route-Service architecture.',
      techStack: ['C#', 'WPF', 'Controller-Route-Service'],
      liveUrl: 'https://nattakorn-portfolio.super.site/m-spec-by-wpf',
      repoUrl: 'https://github.com/WindsurfHUB/M-Spec-By-WPF',
      imageUrl: '',
    },
    {
      title: 'Showpro (DII CAMT ShowPro Group)',
      description: 'A full-stack web application designed for the DII department, serving 5 user roles (Student, Teacher, Staff, Company, Admin) and covering the full cycle of education: course registration -> evaluation -> activities -> internship -> job seeking.',
      techStack: ['Full-Stack Web Development', 'React', 'Node.js', 'PostgreSQL'],
      liveUrl: 'http://diishowpro.linkpc.net/',
      repoUrl: '',
      imageUrl: '',
    },
  ];

  for (const project of projects) {
    const created = await prisma.project.create({
      data: project,
    });
    console.log(`Created project: ${created.title}`);
  }

  console.log('Seeding portfolio projects completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
