import Head from 'next/head';
import { useState } from 'react';

// Formspree endpoint — "Mapstrata interest" form under the mizmay.com project.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzebrran';

const PURPOSES = [
  'Email me when the repo opens',
  'I have a use case',
  'I want to help build it',
  'I’m interested in funding the work',
];

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; message: string };

export default function Mapstrata() {
  const [purposes, setPurposes] = useState<string[]>([PURPOSES[0]]);
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  function togglePurpose(value: string) {
    setPurposes((cur) =>
      cur.includes(value) ? cur.filter((p) => p !== value) : [...cur, value]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if ((data.get('_gotcha') as string)?.length) return; // honeypot tripped
    if (!purposes.length) {
      setStatus({ kind: 'error', message: 'Pick at least one reason for reaching out.' });
      return;
    }

    data.set('purpose', purposes.join(', '));
    data.set('_subject', `Mapstrata interest — ${purposes.join(', ')}`);

    setStatus({ kind: 'sending', message: 'Sending…' });
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const wantsFollowup = purposes.some((p) => p !== PURPOSES[0]);
        form.reset();
        setPurposes([PURPOSES[0]]);
        setStatus({
          kind: 'ok',
          message: wantsFollowup
            ? "Got it, thanks. You'll get the one repo-opening email, and I'll follow up about what you shared before then."
            : "Got it. You're on the list — one email when the repo opens, nothing else.",
        });
      } else {
        const body = await res.json().catch(() => null);
        const msg = body?.errors?.map((x: { message: string }) => x.message).join(', ');
        setStatus({ kind: 'error', message: msg || 'Something went wrong. Try again, or email hello@mizmay.com.' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Network error. Try again, or email hello@mizmay.com.' });
    }
  }

  return (
    <>
      <Head>
        <title>Mapstrata — a MapLibre style editor that keeps the JSON legible</title>
        <meta
          name="description"
          content="Mapstrata decomposes a monolithic MapLibre style.json into one file per layer. Preview, pre-1.0, one person — repo opens October 2026."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="ms">
        <nav>
          <div className="nav-inner">
            <div className="nav-brand">
              <a className="home" href="https://mizmay.com">mizmay.com</a>
              <span className="sep">/</span>
              <span className="cur">mapstrata</span>
            </div>
            <a className="nav-cta" href="#ask">Get in touch</a>
          </div>
        </nav>

        <div className="wrap">
          <section className="hero">
            <div className="status-badge"><span className="dot" />Preview · pre-1.0</div>
            <h1>A MapLibre style editor that keeps the <span className="accent">JSON legible.</span></h1>
            <p className="hero-lede">
              Mapstrata makes working with massive <code>style.json</code> files easy, allowing cartographers
              to manage design palettes using variables and themes. Exports are available in two forms: a
              project file that decomposes the monolithic layer list into one file per layer (so changes make
              sense in git) plus a single <code>style.json</code> per theme.
            </p>
            <div className="hero-cta">
              <a href="#ask" className="btn-primary">Get in touch</a>
            </div>

            <figure className="shot">
              <img src="/mapstrata-welcome.png" alt="The Mapstrata welcome screen: import a style.json from a URL or file, or start a new project from scratch." />
              <figcaption>Mapstrata on launch — import an existing <code>style.json</code>, or build one from scratch.</figcaption>
            </figure>
          </section>

          <section id="what">
            <div className="eyebrow">What it is</div>
            <h2>Five pieces, one legible structure</h2>
            <p className="muted">Import a style, and each piece stays visible and editable on its own terms:</p>
            <div className="pillars">
              <div className="pillar">Import</div>
              <div className="pillar">Decompose</div>
              <div className="pillar">Variables</div>
              <div className="pillar">Theme-pairing</div>
              <div className="pillar">Export</div>
            </div>
  
          </section>
            
          <section id="fund">
            <div className="eyebrow">Funding</div>
            <h2>Want to fund the work?</h2>
            <p>
              So far this is a self-funded, part-time project. If you want to fund the work,
              I&apos;d love to hear from you. It helps me prioritize and ship faster.
            </p>
            <p className="muted">
              Check the funding box in the form below and I&apos;ll follow up.
            </p>
          </section>

          <section id="ask">
            <div className="eyebrow">One ask</div>
            <h2>Tell me why you&apos;re here.</h2>
            <div className="ask-box">
              <p>
                The core promise is one email, in October, when there&apos;s a repo to open — no
                waitlist implying a queue, no early access, no roadmap dates. Anything beyond that
                happens only if you ask for it: if you have a style you&apos;d want this to handle,
                want to help build it, or could fund the work, say so below and it shapes what ships.
              </p>
              <form className="ask-form" onSubmit={handleSubmit}>
                <fieldset className="ask-purpose">
                  <legend>What brings you here? (pick any)</legend>
                  {PURPOSES.map((p) => (
                    <label key={p} className="check">
                      <input
                        type="checkbox"
                        name="purpose_option"
                        value={p}
                        checked={purposes.includes(p)}
                        onChange={() => togglePurpose(p)}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </fieldset>

                <label className="field">
                  <span className="field-label">Email</span>
                  <input type="email" name="email" placeholder="you@example.com" required aria-label="Email address" />
                </label>

                <label className="field">
                  <span className="field-label">Tell me more (optional)</span>
                  <textarea name="details" rows={4} placeholder="What style do you maintain and what breaks? How you'd like to help? Funding context? Whatever's relevant." />
                </label>

                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="gotcha" />

                <button type="submit" className="btn-primary" disabled={status.kind === 'sending'}>
                  {status.kind === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </form>
              <div className={`ask-status ${status.kind}`} role="status">{status.message}</div>
              <div className="ask-promise">→ one email when the repo opens. Anything more only if you ask for it.</div>
            </div>
          </section>

          <footer>
            <div className="footer-links">
              <a href="https://mizmay.com">mizmay.com</a>
              <a href="https://github.com/mizmay">GitHub</a>
              <a href="https://www.linkedin.com/in/mizmay" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://bsky.app/profile/mizmay.com" target="_blank" rel="noopener noreferrer">Bluesky</a>
            </div>
            <p className="footer-fine">
              © 2026 Stephanie May · Mapstrata is a solo, part-time project · repo opens October 2026
            </p>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        /* ── Reset the mizmay.com globals.css rules that leak where the draft
           stylesheet is silent. Scoped to .ms so the rest of the site is
           untouched. ── */
        .ms h2 { display: block; text-transform: none; letter-spacing: normal; font-weight: 700; }
        .ms h2::before { content: none; }
        .ms section { margin: 0; }
        .ms .hero { margin: 0; }
        .ms p { line-height: 1.7; }
        .ms footer { border-top: none; }
        .ms a { transition: none; }

        /* ── Ported from mapstrata-landing-page.html ── */
        .ms {
          --bg:#0d0d0d; --bg-alt:#000000; --surface:#1a1a1a; --surface-2:#212121;
          --line:#2a2a2a; --text:#f5f5f5; --text-muted:#9a9a9a; --text-dim:#6b6b6b;
          --primary:#ff2d6a; --primary-dim:#ff2d6a26; --secondary:#f7ff00; --accent:#00e5ff; --accent-dim:#00e5ff26;
          --font-display:'Space Grotesk', system-ui, sans-serif;
          --font-body:'Nunito', system-ui, sans-serif;
          --font-mono:'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
          background:var(--bg); color:var(--text); font-family:var(--font-body);
          line-height:1.7; -webkit-font-smoothing:antialiased;
          min-height:100vh;
        }
        .ms *, .ms *::before, .ms *::after { box-sizing:border-box; margin:0; padding:0; }
        .ms ::selection { background:var(--primary); color:#000; }
        .ms a { color:var(--accent); text-decoration:none; }
        .ms a:hover { color:#66f0ff; }
        .ms code { font-family:var(--font-mono); background:var(--surface-2); padding:.1em .4em; border-radius:4px; font-size:.9em; color:var(--accent); }
        .ms img, .ms svg { max-width:100%; }
        .ms .wrap { max-width:820px; margin:0 auto; padding:0 24px; }

        .ms nav { position:sticky; top:0; z-index:40; background:rgba(13,13,13,.88); backdrop-filter:blur(10px); border-bottom:1px solid var(--line); }
        .ms .nav-inner { max-width:820px; margin:0 auto; padding:0 24px; height:58px; display:flex; align-items:center; justify-content:space-between; }
        .ms .nav-brand { display:flex; align-items:baseline; gap:8px; font-family:var(--font-display); }
        .ms .nav-brand .home { color:var(--text-dim); font-size:.95rem; font-weight:500; }
        .ms .nav-brand .sep { color:var(--text-dim); font-size:.9rem; }
        .ms .nav-brand .cur { color:var(--primary); font-size:1.02rem; font-weight:700; }
        .ms .nav-cta { background:var(--primary); color:#000; font-weight:700; font-size:.85rem; padding:8px 16px; border-radius:5px; transition:box-shadow .2s; }
        .ms .nav-cta:hover { color:#000; box-shadow:0 0 18px rgba(255,45,106,.45); }

        .ms .hero { padding:clamp(56px,9vw,96px) 0 clamp(40px,6vw,60px); border-bottom:1px solid var(--line); }
        .ms .status-badge { display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.07em; color:var(--secondary); border:1px solid #f7ff0044; background:#f7ff0010; padding:5px 12px; border-radius:20px; margin-bottom:22px; }
        .ms .status-badge .dot { width:6px; height:6px; border-radius:50%; background:var(--secondary); }
        .ms h1 { font-family:var(--font-display); font-weight:700; color:var(--text); font-size:clamp(2.4rem,6vw,3.6rem); line-height:1.08; text-wrap:balance; margin-bottom:.45em; }
        .ms h1 .accent { color:var(--primary); }
        .ms .hero-lede { font-size:clamp(1.05rem,2vw,1.25rem); color:var(--text-muted); max-width:56ch; margin-bottom:1.6em; }
        .ms .hero-cta { display:flex; flex-wrap:wrap; gap:14px; }
        .ms .btn-primary { display:inline-flex; align-items:center; gap:8px; background:var(--primary); color:#000; font-weight:700; font-family:var(--font-body); padding:13px 26px; border-radius:6px; font-size:.95rem; transition:box-shadow .2s, transform .15s; border:none; cursor:pointer; }
        .ms .btn-primary:hover { box-shadow:0 0 24px rgba(255,45,106,.5); transform:translateY(-1px); color:#000; }
        .ms .btn-primary:disabled { opacity:.6; cursor:default; box-shadow:none; transform:none; }

        .ms .shot { margin-top:clamp(40px,6vw,64px); border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#050505; }
        .ms .shot img { display:block; width:100%; height:auto; border-bottom:1px solid var(--line); }
        .ms .shot figcaption { font-size:.85rem; color:var(--text-dim); padding:14px 20px; background:var(--surface); }

        .ms section { padding:clamp(48px,7vw,76px) 0; border-bottom:1px solid var(--line); }
        .ms section:last-of-type { border-bottom:none; }
        .ms .eyebrow { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.18em; color:var(--secondary); display:flex; align-items:center; gap:12px; margin-bottom:22px; }
        .ms .eyebrow::before { content:''; width:28px; height:2px; background:var(--secondary); flex-shrink:0; }
        .ms h2 { font-family:var(--font-display); font-size:clamp(1.5rem,3vw,2rem); color:var(--text); margin-bottom:.55em; text-wrap:balance; }
        .ms p { font-size:1.02rem; color:var(--text); max-width:64ch; }
        .ms p + p { margin-top:.9em; }
        .ms .muted { color:var(--text-muted); }

        .ms .pillars { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-top:26px; }
        .ms .pillar { background:var(--surface); border:1px solid var(--line); border-radius:8px; padding:14px 16px; font-family:var(--font-mono); font-size:.83rem; color:var(--accent); text-align:center; }

        .ms .ask-box { background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:clamp(24px,4vw,34px); margin-top:24px; }
        .ms .ask-form { display:flex; flex-direction:column; gap:16px; margin-top:18px; }
        .ms .ask-purpose { border:1px solid var(--line); border-radius:8px; padding:16px 18px; display:flex; flex-direction:column; gap:10px; }
        .ms .ask-purpose legend { font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); padding:0 6px; }
        .ms .check { display:flex; align-items:flex-start; gap:10px; font-size:.95rem; color:var(--text); cursor:pointer; }
        .ms .check input { margin-top:.2em; accent-color:var(--primary); width:16px; height:16px; flex-shrink:0; }
        .ms .field { display:flex; flex-direction:column; gap:6px; }
        .ms .field-label { font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); }
        .ms .ask-form input[type="email"], .ms .ask-form textarea { width:100%; background:var(--bg); border:1px solid var(--line); border-radius:6px; padding:13px 16px; font-family:var(--font-body); font-size:.95rem; color:var(--text); resize:vertical; }
        .ms .ask-form input[type="email"]:focus, .ms .ask-form textarea:focus { outline:2px solid var(--accent); outline-offset:1px; border-color:var(--accent); }
        .ms .ask-form input[type="email"]::placeholder, .ms .ask-form textarea::placeholder { color:var(--text-dim); }
        .ms .ask-form .btn-primary { align-self:flex-start; }
        .ms .gotcha { position:absolute; left:-9999px; width:1px; height:1px; opacity:0; }
        .ms .ask-promise { font-family:var(--font-mono); font-size:.82rem; color:var(--accent); margin-top:14px; }
        .ms .ask-status { font-size:.88rem; color:var(--text-muted); margin-top:12px; min-height:1.2em; }
        .ms .ask-status.ok { color:var(--accent); }
        .ms .ask-status.error { color:var(--primary); }

        .ms footer { padding:36px 0 44px; text-align:center; }
        .ms .footer-links { display:flex; flex-wrap:wrap; justify-content:center; gap:18px; margin-bottom:16px; }
        .ms .footer-links a { font-size:.88rem; color:var(--text-muted); }
        .ms .footer-links a:hover { color:var(--accent); }
        .ms .footer-fine { font-size:.8rem; color:var(--text-dim); }
      `}</style>
    </>
  );
}
