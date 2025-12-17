import Head from 'next/head';
import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineMail, HiChevronDown } from 'react-icons/hi';
import { SiGithub, SiLinkedin, SiBluesky, SiReact, SiTypescript, SiPython, SiQgis, SiFigma, SiMapbox, SiPostgresql, SiJavascript, SiHtml5, SiCss3 } from 'react-icons/si';
import { TbPresentation, TbMap } from 'react-icons/tb';
import { BiData } from 'react-icons/bi';

// Profile image from public folder

// Skill data with descriptions and icons
const skills = [
  {
    id: 'frontend',
    title: 'Front-End Development',
    description: 'Building responsive, accessible web applications with modern frameworks.',
    tags: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Next.js'],
  },
  {
    id: 'design',
    title: 'Human Centered Design',
    description: 'User research, prototyping, and iterative design processes. Creating intuitive interfaces that put people first.',
    tags: ['Figma', 'User Research', 'Prototyping', 'Accessibility', 'UX'],
  },
  {
    id: 'mapping',
    title: 'Interactive & Web Mapping',
    description: 'Geospatial data transformation, custom map styling, and location-based applications. Making complex geographic data accessible and engaging.',
    tags: ['Maplibre', 'QGIS', 'PostGIS', 'Three.js', 'ArcGIS', 'Python', 'R'],
  },
  {
    id: 'teaching',
    title: 'Teaching & Curriculum',
    description: 'Developing educational content and workshops for technical topics. Making complex subjects approachable for diverse audiences.',
    tags: ['Workshop Design', 'Technical Writing', 'Mentorship', 'Public Speaking'],
  },
  {
    id: 'leadership',
    title: 'Organizational & Thought Leadership',
    description: 'Strategic consulting, project planning, and driving innovation. Bridging technical and business perspectives to deliver impact.',
    tags: ['Strategy', 'Team Leadership', 'Product Vision', 'Stakeholder Management'],
  },
];

// Portfolio items
const portfolioItems = [
  { id: 'projects', title: 'Projects', href: '#' },
  { id: 'presentations', title: 'Presentations', href: '#' },
  { id: 'publications', title: 'Publications', href: '#' },
];

// Accordion component
function Accordion({ items }: { items: typeof skills }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="accordion">
      {items.map((item) => (
        <div key={item.id} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggle(item.id)}
            aria-expanded={openId === item.id}
          >
            <span>{item.title}</span>
            <HiChevronDown 
              className={`accordion-arrow ${openId === item.id ? 'open' : ''}`} 
              size={20}
            />
          </button>
          {openId === item.id && (
            <div className="accordion-content">
              <p className="accordion-description">{item.description}</p>
              <div className="accordion-skills">
                {item.tags.map((tag) => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="site-wrapper">
      <Head>
        <title>Stephanie May | Map Product Engineer</title>
        <meta name="description" content="Map product engineer working at the intersection of technology, geography, and storytelling." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="content-wrapper">
        {/* Hero */}
        <section className="hero">
          <div className="hero-layout">
            <div className="hero-profile">
              <img 
                src="/profile_pic.png" 
                alt="Stephanie May" 
                className="hero-profile-image"
              />
            </div>
            <div className="hero-content">
              <h1>Stephanie May</h1>
              <p className="tagline">Map Product Engineer</p>
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2>About</h2>
          <div className="about-content">
            <p>
              Designer, coder, urban climatologist and cartographer with a passion for building tools that help people understand and engage with the world around us. 
              15+ years making maps, data visualizations, and geospatial data pipelines for some of the biggest technology companies in the world.
              Currently organizing for open source software and consulting for small businesses and nonprofits.
            </p>
          </div>
        </section>

        {/* What I Do */}
        <section>
          <h2>What I Do</h2>
          <Accordion items={skills} />
        </section>

        {/* Portfolio */}
        <section>
          <h2>Portfolio</h2>
          <ul className="portfolio-list">
            {portfolioItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="portfolio-item">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2>Get in Touch</h2>
          <p>Have a project in mind? I'd love to hear from you. Based in Seattle, WA.</p>
          <div className="contact-links">
            <a 
              href="https://calendly.com/stephanie-may-scheduling/availability" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-link"
            >
              <HiOutlineCalendar /> Calendar
            </a>
            <a 
              href="mailto:hello@mizmay.com" 
              className="contact-link"
            >
              <HiOutlineMail /> Email
            </a>
            <a 
              href="https://github.com/mizmay" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-link"
            >
              <SiGithub /> GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/mizmay" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-link"
            >
              <SiLinkedin /> LinkedIn
            </a>
            <a 
              href="https://bsky.app/profile/mizmay.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-link"
            >
              <SiBluesky /> Bluesky
            </a>
          </div>
        </section>

        <footer>
          <p>&copy; 2025 Stephanie May</p>
        </footer>
      </div>
    </div>
  );
}
