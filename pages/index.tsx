import Head from 'next/head';
import { useState } from 'react';
import { HiOutlineMail, HiChevronDown } from 'react-icons/hi';
import { SiGithub, SiLinkedin, SiBluesky } from 'react-icons/si';

// Skill data
const skills = [
  {
    id: 'teaching',
    title: 'Teaching & Curriculum',
    description: 'Instructor in UW\'s GIS Certificate Program, teaching cartography, spatial analysis, and advanced GIS applications. Bridging Esri\'s ArcGIS platform and the open-source ecosystem so students can work in both.',
    tags: ['Curriculum Development', 'Esri ArcGIS', 'Technical Writing', 'Public Speaking', 'Mentorship'],
  },
  {
    id: 'mapping',
    title: 'Geospatial Technology',
    description: 'Cartographic pipelines, map styling, spatial data management, and rendering systems — from enterprise platforms to open-source stacks. 15 years building mapping products at every scale.',
    tags: ['MapLibre', 'Figma', 'QGIS', 'ArcGIS', 'Python', 'R', 'Vector Tiles'],
  },
  {
    id: 'projects',
    title: 'Projects & Practice',
    description: 'Making web mapping more accessible through open-source tools, documentation, and governance. From standalone map workshops to AI agent skills, lowering the barriers to getting a map on the web.',
    tags: ['MapLibre', 'OpenStreetMap', 'Cloud Native Geo', 'PMTiles', 'AI Agent Skills'],
  },
  {
    id: 'frontend',
    title: 'Web & Tool Development',
    description: 'Creating interactive mapping applications and data visualizations that work everywhere; building the tools that make that stack more maintainable: browser-native stylesheet editors, AI agent skills, and open infrastructure for the people doing this work.',
    tags: ['React', 'TypeScript', 'MapLibre', 'PMTiles', 'AI Agent Skills']
  },
];

// Portfolio items with nested links
const portfolioItems = [
  {
    id: 'projects',
    title: 'Projects & Practice',
    items: [
      { title: 'Standalone Web Maps', href: 'https://github.com/mizmay/standalone_web_maps_foss4g2025', description: 'Workshop materials for building and deploying web maps with PMTiles, MapLibre, and GitHub Pages — no server required' },
      { title: 'MapLibre Agent Skills', href: 'https://github.com/maplibre/agent-skills', description: 'Teaching AI to write correct MapLibre code — an open, eval-tested knowledge base for AI coding assistants' },
      { title: 'Mapstrata', href: 'https://github.com/mizmay', description: 'A stylesheet editor that makes MapLibre style.json maintainable — decomposing monolithic styles into reviewable, diffable, git-friendly files' },
      { title: 'Liminal Maps', href: 'https://www.linkedin.com/in/mizmay', description: 'Geospatial consulting practice — bringing strategic mapping expertise from Apple, Meta, and Stamen to organizations that need it without a full-time hire.' },
    ]
  },
  {
    id: 'talks',
    title: 'Talks & Conferences',
    items: [
      { title: 'Standalone Web Maps, No Platform Required — FOSS4G 2025', href: 'https://mizmay.github.io/standalone_web_maps_foss4g2025/', description: 'Workshop on building and deploying web maps with open-source tools, PMTiles, and GitHub — no server or platform needed' },
      { title: 'Mapping Muddy Branch Trail — State of the Map US 2025', href: 'https://openstreetmap.us/events/state-of-the-map-us/2025/mapping-muddy-branch-trail/', description: 'Mapping an 11-mile suburban watershed trail from Gaithersburg, MD to the Potomac River' },
      { title: 'Practical Cartography Day — NACIS 2024', href: 'https://www.youtube.com/watch?v=t1AWJ90JpTQ', description: 'New technology and workflows for making web maps more accessible to cartographers' },
      { title: 'Why do Full Stack Cartographers Love Open Source? — SotM US 2023', href: 'https://openstreetmap.us/events/state-of-the-map-us/2023/why-do-full-stack-cartographers-love-open-source/', description: 'Opening session on how open source enables repeatable, iterative workflows for map curation and design' },
      { title: 'What is Vector Tile Cartography? — NACIS 2022', href: 'https://www.youtube.com/watch?v=0G5S1yIgQfQ', description: 'Untangling the many strands of vector tile cartography — what cartographers need to know about the modern web map stack' },
      { title: 'Figmasset: A Missing Map Tool — NACIS 2022', href: 'https://stamen.com/videos-of-stamens-nacis-2022-presentations-are-now-live/', description: 'Practical Cartography Day presentation on new mapping workflows (with Kelsey Taylor)' },
      { title: 'We Made A Facebook Map — NACIS 2020', href: 'https://nacis2020.sched.com/list/descriptions/', description: 'How Facebook took a novel approach to building vector tile maps (with Vladimir Gluzman)' },
      { title: 'Teaching Mapping to Geographers — SotM US 2014', href: 'https://2014.stateofthemap.us/session/teaching-mapping-to-geographers/', description: 'Using OpenStreetMap as a pedagogical tool (with Alan McConchie)' },
    ]
  },
  {
    id: 'writing',
    title: 'Public Writing & Research',
    items: [
      { title: 'What is Full Stack Cartography?', href: 'https://stamen.com/what-is-full-stack-cartography/', description: 'Defining the practice of working across the entire cartographic pipeline — Stamen blog' },
      { title: 'Here comes the future of Stamen Maps', href: 'https://stamen.com/here-comes-the-future-of-stamen-maps/', description: 'On the transition of Stamen\'s map tiles to new stewardship — Stamen blog' },
      { title: 'Open Data Maps for AWS', href: 'https://stamen.com/open-data-maps-for-aws/', description: 'Creating basemaps from OpenStreetMap data for Amazon Location Service — Stamen blog' },
      { title: 'Characteristics of the Park Cool Island in Golden Gate Park', href: 'https://link.springer.com/article/10.1007/s00704-022-04296-x', description: 'Research on urban microclimate and the cooling effects of green space' },
      { title: 'Health Effects of Road Pricing in San Francisco', href: 'https://activelivingresearch.org/health-effects-road-pricing-san-francisco-california', description: 'Quantitative research on transportation policy and public health (Health Impact Assessment)' },
    ]
  },
  {
    id: 'boards',
    title: 'Boards & Governance',
    items: [
      { title: 'MapLibre', href: 'https://maplibre.org', description: 'Governing board member — guiding strategy for the leading open-source map rendering library' },
      { title: 'Cloud Native Geospatial Forum', href: 'https://cloudnativegeo.org', description: 'Founding editorial board member — advancing open standards for cloud-native geospatial data' },
      { title: 'CaGIS', href: 'https://cartogis.org', description: 'Board member — Cartography and Geographic Information Society' },
      { title: 'CUGOS', href: 'https://cugos.org', description: 'Board member — Cascadia Users of Geospatial Open Source' },
    ]
  },
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

// Portfolio Accordion component
function PortfolioAccordion({ items }: { items: typeof portfolioItems }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="accordion">
      {items.map((category) => (
        <div key={category.id} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggle(category.id)}
            aria-expanded={openId === category.id}
          >
            <span>{category.title}</span>
            <HiChevronDown 
              className={`accordion-arrow ${openId === category.id ? 'open' : ''}`} 
              size={20}
            />
          </button>
          {openId === category.id && (
            <div className="accordion-content">
              <ul className="portfolio-links">
                {category.items.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="portfolio-link"
                    >
                      <span className="portfolio-link-title">{item.title}</span>
                      <span className="portfolio-link-description">{item.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
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
        <title>Stephanie May | Cartographer, Educator, Open Source</title>
        <meta name="description" content="GIS instructor, open-source geospatial contributor, and cartographer. Making it easier for people to make web maps — through teaching, tools, and open-source community." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="content-wrapper">
        {/* Hero */}
        <section className="hero">
          <div className="hero-layout">
            <div className="hero-profile">
              <img 
                src="/profile_pic.jpg" 
                alt="Stephanie May" 
                className="hero-profile-image"
              />
            </div>
            <div className="hero-content">
              <h1>Stephanie May</h1>
              <p className="tagline">Cartographer · Educator · Open Source</p>
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2>About</h2>
          <div className="about-content">
            <p>
              I want to make it easier to think and communicate spatially through maps. I spent a decade building cartographic systems at Apple, Meta, and Stamen. Now I teach, write tools, and contribute to the open-source projects that bring together cartographic design and engineering without a platform or a big-company budget.
            </p>
            <p className="mt-4">
              I teach GIS at the University of Washington, where I teach fundamentals in Esri&apos;s enterprise stack and give students a credible bridge to the open-source and cloud-native side of the industry. I serve on the boards of MapLibre, CNG, CaGIS, and CUGOS, and I&apos;m building tools and giving workshops to lower the barriers to web cartography.
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
          <PortfolioAccordion items={portfolioItems} />
        </section>

        {/* Contact */}
        <section>
          <h2>Get in Touch</h2>
          <p>Interested in collaborating on open-source mapping, speaking about web cartography, or connecting about geospatial education? Based in Seattle, WA.</p>
          <div className="contact-links">
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
          <p>&copy; 2026 Stephanie May</p>
        </footer>
      </div>
    </div>
  );
}
