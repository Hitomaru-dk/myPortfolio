import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import ProjectsPage from './ProjectsPage';
import AboutPage from './AboutPage';

export default function OnePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // รอคอมโพเนนต์ Mount เสร็จและคำนวณความสูงเรียบร้อยแล้วเลื่อนหน้าจอ
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <div className="flex flex-col">
      <section id="home">
        <HomePage />
      </section>
      <section id="projects" className="border-t border-hairline bg-bg">
        <ProjectsPage />
      </section>
      <section id="about" className="border-t border-hairline bg-surface/10">
        <AboutPage />
      </section>
    </div>
  );
}
