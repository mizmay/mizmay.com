import Head from 'next/head';
import { HiOutlineCalendar, HiOutlineMail } from 'react-icons/hi';
import { SiGithub, SiLinkedin, SiBluesky } from 'react-icons/si';

export default function Home() {
  return (
    <div className="main-container">
      <Head>
        <title>Stephanie May | I Make Maps</title>
      </Head>

      <header>
        <h1>Stephanie May</h1>
      </header>

      <section>
        <p>I work at the intersection of technology, geography, and storytelling. From climate data to community voices, I use cartographic tools to surface the layered ways people understand place.</p>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          <img src="/nav_phone.png" alt="Navigation" style={{ width: '100px', height: 'auto', flexShrink: 0 }} />
          <ul className="list-disc list-inside">
            <li>Interactive & Web Mapping (Maplibre, Mapbox, OpenStreetMap)</li>
            <li>Spatial Analysis (R, Python, GDAL, QGIS, PostGIS, ArcGIS)</li>
            <li>Front-End Development (HTML, CSS, JavaScript, React)</li>
            <li>Mobile-First Design (Figma, custom workflows)</li>
            <li>Cloud Native Workflows (PMTiles, COG, Cloudflare, AWS)</li>
            <li>Geographic Storytelling & Participatory Mapping</li>
            <li>Teaching & Curriculum Design</li>
          </ul>
        </div>
      </section>

      <section>
        <p>Have a project in mind? Please reach out. I'm based in Seattle, WA.</p>
        <div className="inline">
          <a href="https://calendly.com/stephanie-may-scheduling/availability" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Calendar">
            <HiOutlineCalendar /> Calendar
          </a>
          <a href="mailto:hello@mizmay.com" className="contact-link" aria-label="Email">
            <HiOutlineMail /> Email
          </a>
          <a href="https://github.com/mizmay" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="GitHub">
            <SiGithub /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/mizmay" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="LinkedIn">
            <SiLinkedin /> LinkedIn
          </a>
          <a href="https://bsky.app/profile/mizmay.com" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Bluesky">
            <SiBluesky /> Bluesky
          </a>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Stephanie May</p>
      </footer>
    </div>
  );
}