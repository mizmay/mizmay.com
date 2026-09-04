import Head from 'next/head';
import { useEffect, useState } from 'react';

// Formspree endpoint — "Mapstrata interest" form under the mizmay.com project.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzebrran';

const PURPOSES = [
  'Email me when the repo opens',
  'I have a use case',
  'I want to help build it',
  'I’m interested in funding the work',
];

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; message: string };

// The eight screenshots from the FOSS4G tour slide, with the deck's own captions.
const TOUR = [
  {
    src: '/mapstrata/welcome.webp',
    alt: 'Mapstrata welcome screen with Import style and New project options',
    title: 'Welcome screen.',
    cap: <>Import a <code>style.json</code>, or start empty.</>,
  },
  {
    src: '/mapstrata/layers.webp',
    alt: 'Layers tab listing all imported layers beside the live map preview',
    title: 'Layers tab.',
    cap: <>All layers listed in render order or alphabetically, tagged by geometry and source.</>,
  },
  {
    src: '/mapstrata/layer-expanded.webp',
    alt: 'A single layer expanded, showing its filter and paint properties as form fields',
    title: 'One layer, expanded.',
    cap: <>The tabs show raw value, variable binding, computed result.</>,
  },
  {
    src: '/mapstrata/palette.webp',
    alt: 'Palette tab grouping every value in the style, with per-value layer counts',
    title: 'Palette.',
    cap: <>Every value in the style, with the number of layers sharing each one. The suggestion queue proposes what to create.</>,
  },
  {
    src: '/mapstrata/style-tab.webp',
    alt: 'Style tab with identity, camera, sprite and glyph URLs, and environment blocks',
    title: 'Style tab.',
    cap: <>Everything that isn&apos;t a layer: metadata, camera, sprite and glyph URLs, environment.</>,
  },
  {
    src: '/mapstrata/xray.webp',
    alt: 'X-ray mode recoloring the map by source, with a legend counting style layers per source',
    title: 'X-ray mode.',
    cap: <>Turn tile layers on and off, and inspect unstyled features per source.</>,
  },
  {
    src: '/mapstrata/inspect-style.webp',
    alt: 'Map inspector popup on the Styles tab, listing the style layers drawing at the clicked point, grouped by source',
    title: 'Inspect: the styles.',
    cap: <>Every style layer drawing at the clicked point, grouped by source, in draw order.</>,
  },
  {
    src: '/mapstrata/inspect-data.webp',
    alt: 'Same inspector popup switched to the Data tab, showing raw source-feature properties',
    title: 'Inspect: the data.',
    cap: <>The raw source-feature properties behind each layer, so you can see what a filter has to match.</>,
  },
];

export default function Mapstrata() {
  const [purposes, setPurposes] = useState<string[]>([PURPOSES[0]]);
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  // Loop the demo clips, but only while they're on screen and only if the
  // visitor hasn't asked for reduced motion. Setting the `autoplay` attribute
  // from React wouldn't work: browsers only honour it while the element is
  // loading, and by the time an effect runs the <video> already exists — so
  // playback has to be started with an explicit play() call.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>('video[data-autoloop]')
    );
    // Videos the visitor paused themselves; scrolling back must not restart them.
    const userPaused = new Set<HTMLVideoElement>();
    const programmatic = new Set<HTMLVideoElement>();

    const onPause = (e: Event) => {
      const v = e.currentTarget as HTMLVideoElement;
      if (programmatic.has(v)) programmatic.delete(v);
      else userPaused.add(v);
    };
    const onPlay = (e: Event) => userPaused.delete(e.currentTarget as HTMLVideoElement);

    videos.forEach((v) => {
      v.loop = true;
      v.addEventListener('pause', onPause);
      v.addEventListener('play', onPlay);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (!userPaused.has(v)) v.play().catch(() => {}); // autoplay may still be blocked; controls remain
          } else if (!v.paused) {
            programmatic.add(v);
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    videos.forEach((v) => io.observe(v));

    return () => {
      io.disconnect();
      videos.forEach((v) => {
        v.removeEventListener('pause', onPause);
        v.removeEventListener('play', onPlay);
      });
    };
  }, []);

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
            : "Got it. You're on the list: one email when the repo opens, nothing else.",
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
        <title>Mapstrata stylesheet editor</title>
        <meta
          name="description"
          content="A MapLibre style editor for people who maintain real basemaps. Keep the JSON legible: one file per layer, shared values as variables, readable diffs."
        />

        {/* Link previews. og:image must be an absolute URL — scrapers don't
            resolve relative paths. */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="mizmay.com" />
        <meta property="og:url" content="https://mizmay.com/mapstrata/" />
        <meta property="og:title" content="Mapstrata stylesheet editor" />
        <meta
          property="og:description"
          content="A MapLibre style editor for people who maintain real basemaps. Keep the JSON legible: one file per layer, shared values as variables, readable diffs."
        />
        <meta property="og:image" content="https://mizmay.com/mapstrata/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="The Mapstrata layer list beside a live map preview, above the title: a MapLibre style editor that keeps the JSON legible."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mapstrata stylesheet editor" />
        <meta
          name="twitter:description"
          content="A MapLibre style editor for people who maintain real basemaps. Keep the JSON legible: one file per layer, shared values as variables, readable diffs."
        />
        <meta name="twitter:image" content="https://mizmay.com/mapstrata/og.jpg" />

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
              to manage design palettes using variables and themes. Exports come in two forms: a project
              file that decomposes the monolithic layer list into one file per layer, so changes make
              sense in git, and a single validated <code>style.json</code> per theme.
            </p>
            <div className="hero-cta">
              <a href="#ask" className="btn-primary">Get in touch</a>
            </div>
          </section>

          <section id="problem">
            <div className="eyebrow">The problem</div>
            <h2>A change that should take five minutes takes fifty</h2>
            <p className="muted">One color duplicated across dozens of layers, and you can&apos;t just search and replace.</p>
            <div className="pullquote">
              Since two layers may share the same property value coincidentally, you examine them
              case-by-case, stopping for visual review every time.
            </div>

            <h3 className="sub">No good solution for maintaining open source stylesheets</h3>
            <div className="cmp-pair">
              <figure className="cmp-item">
                <img src="/mapstrata/maputnik.webp" loading="lazy" alt="Maputnik style editor: layer property form on the left, map preview on the right" />
                <figcaption><b>Maputnik.</b> Visual editing, but every save rewrites one monolithic <code>style.json</code>.</figcaption>
              </figure>
              <figure className="cmp-item">
                <img
                  src="/mapstrata/text-editor.webp"
                  loading="lazy"
                  alt="A style.json open in a code editor: the layers array, with background and earth layers expanded to show their paint colors, and a minimap showing how far the file scrolls on."
                />
                <figcaption>
                  <b>A code editor.</b> Full control, but the spec lives in your head and nothing
                  is visual until reload. If you reorder layers, the diffs are a mess.
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="what">
            <div className="eyebrow">What it is</div>
            <h2>One stylesheet or related stylesheets, managed together</h2>
            <p className="muted">Import one on its own, or import a family built from the same sources and work on them as a single project.</p>
            <dl className="pieces">
              <dt>Import</dt>
              <dd>Point at a <code>style.json</code> and see it rendered in the viewport.</dd>
              <dt>Theme-pairing</dt>
              <dd>Seed a theme from a sibling style on the same tile source; layers pair by id, order and source.</dd>
              <dt>Variables</dt>
              <dd>Every property value can be stored as a variable and shared within and across themes: colors and sizes, but also expressions, fonts and icons.</dd>
              <dt>Decompose</dt>
              <dd>One file per layer on disk, so an edit lands as a readable diff instead of churn inside one big document.</dd>
              <dt>Export</dt>
              <dd>One validated <code>style.json</code> per theme, plus a git-ready project file if desired.</dd>
            </dl>

          </section>

          <section id="decompose">
            <div className="eyebrow">Decompose</div>
            <h2>Edit properties easily</h2>
            <p className="muted">
              Darken the admin boundaries and see the change instantly; export to see the{' '}
              <code>git diff</code>.
            </p>
            <div className="cmp-pair">
              <figure className="cmp-item">
                <video
                  src="/mapstrata/edit-color.mp4"
                  poster="/mapstrata/edit-color-poster.webp"
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  data-autoloop
                />
                <figcaption>
                  <b>In the app.</b> Edit <code>line-color</code> on the <code>boundaries</code> layer.
                  The preview updates as you type. Undo and redo back and forth through your edits, and
                  export the log alongside them.
                </figcaption>
              </figure>
              <figure className="cmp-item">
                <div className="diffmock">
                  <div className="diff-head">layers/boundaries.json</div>
                  <div className="diff-line ctx">{'  "paint": {'}</div>
                  <div className="diff-line del">{'-   "line-color": "#adadad",'}</div>
                  <div className="diff-line add">{'+   "line-color": "#8f8f8f",'}</div>
                  <div className="diff-line ctx">{'    "line-width": 0.4,'}</div>
                  <div className="diff-line ctx">{'    "line-dasharray": [ "step", ["zoom"], ... ]'}</div>
                </div>
                <figcaption>
                  <b>On disk.</b> One file per layer, so even if you moved the layer too, the edit
                  lands as a readable change instead of churn inside one big <code>style.json</code>.
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="tour">
            <div className="eyebrow">A quick tour</div>
            <h2>What you get after the import</h2>
            <p className="muted">Every panel below is the same imported stylesheet.</p>
            <div className="tour">
              {TOUR.map((s) => (
                <figure className="tour-shot" key={s.src}>
                  <img src={s.src} alt={s.alt} loading="lazy" />
                  <figcaption><b>{s.title}</b> {s.cap}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="suggestions">
            <div className="eyebrow">Variables</div>
            <h2>The suggestion queue proposes; you decide</h2>
            <p className="muted">
              Mapstrata reads the imported style and proposes variables to create. Each proposal
              is filed under the heuristic that found it, and nothing is applied until you accept it.
            </p>

            <figure className="tour-shot wide-shot">
              <img
                src="/mapstrata/suggestion-heuristics.webp"
                loading="lazy"
                alt="The Palette tab showing 43 suggestions, with the review dialog open over the map and the heuristics listed as counted chips"
              />
              <figcaption>
                <b>43 suggestions on Protomaps Light.</b> The chips across the top are the
                heuristics, each with the number of proposals it found: family, batch, drift,
                coinc, shared, dead, ramp, filter. The dropdown sets how aggressive the
                proposals are. Accept the suggestion to simplify a filter or create a variable,
                Dismiss to ignore it, or Defer to come back to it later.
              </figcaption>
            </figure>

            <div className="trio">
              <div className="trio-col">
              <figure className="tour-shot">
                <img
                  src="/mapstrata/suggestion-shared.webp"
                  loading="lazy"
                  alt="A shared-value proposal: layout.text-font set to Noto Sans Italic across five label layers, to be named textFontBuildings"
                />
                <figcaption>
                  <b>Shared value.</b> The plainest case: an identical value repeated across
                  layers. Here <code>layout.text-font</code> is Noto Sans Italic on three water label
                  layers, an island label layer and address labels. Create a variable for just the
                  water labels, or for every layer that uses it.
                </figcaption>
              </figure>
              <figure className="tour-shot">
                <img
                  src="/mapstrata/suggestion-filter.webp"
                  loading="lazy"
                  alt="A redundant-filter proposal simplifying a nested any/in filter on landuse_runway to a plain in filter"
                />
                <figcaption>
                  <b>Redundant filter.</b> Not every proposal is a variable. This one unwraps a
                  needless <code>any</code> around a single <code>in</code> on{' '}
                  <code>landuse_runway</code>.
                </figcaption>
              </figure>
              </div>
              <div className="trio-col">
              <figure className="tour-shot">
                <img
                  src="/mapstrata/suggestion-drift.webp"
                  loading="lazy"
                  alt="A drift proposal: near-identical greys #938a8d on two label layers and #91888b on two others, measured at delta-E 0.8, to be merged into one variable named textBuildings"
                />
                <figcaption>
                  <b>Drift</b> catches color values that are close enough to be visually
                  indistinguishable. The ΔE value is a color perception metric used to
                  define what counts as drift. These two sit 0.8 apart, and anything under 1
                  is imperceptible to the human eye. Create separate variables for
                  <code>#938a8d</code>, used on two road label layers, and{' '}
                  <code>#91888b</code> on two more, or merge them into one.
                </figcaption>
              </figure>
              </div>
            </div>
          </section>

          <section id="themes">
            <div className="eyebrow">Themes</div>
            <h2>Theme-pairing</h2>
            <p className="muted">Point at a sibling style on the same tile source. Protomaps Dark as seed.</p>
            <div className="shotsplit">
              <figure className="hlshot">
                <img
                  src="/mapstrata/add-theme-dark.webp"
                  loading="lazy"
                  alt="New theme dialog seeded from protomaps-dark.json, reporting 71 of 71 layers paired and nothing sent to the review queue"
                />
              </figure>
              <div>
                <ul className="bullets">
                  <li>Layers pair mechanically: same ids, same order, same source.</li>
                  <li>There are built-in heuristics for when it isn&apos;t this clean.</li>
                </ul>
                <div className="stat-callout">
                  <div className="num">3 → 7</div>
                  <div className="stat-label">Dark paints one light color five ways, so three names split into seven.</div>
                </div>
              </div>
            </div>

            <h3 className="sub">Scope structure to a theme, not just values</h3>
            <p className="muted">
              Associate sources and layers with a specific theme.
            </p>
            <div className="shotsplit">
              <figure className="hlshot">
                <img
                  src="/mapstrata/no-hillshade-dark.webp"
                  loading="lazy"
                  alt="Sources dialog viewed from the dark theme: the raster-dem source is listed as inactive, in the style but not building for dark"
                />
              </figure>
              <p className="hlcap">
                <b>Same project, dark selected.</b> The DEM is in the style but isn&apos;t part of
                this theme. Adding it here is a decision.
              </p>
            </div>
          </section>

          <section id="hillshade">
            <div className="eyebrow">Adding to a style</div>
            <h2>Add a hillshade</h2>
            <p className="muted">A <code>raster-dem</code> source and a hillshade built on it.</p>
            <figure className="cmp-item bigvideo">
              <video
                src="/mapstrata/add-hillshade.mp4"
                poster="/mapstrata/add-hillshade-poster.webp"
                controls
                muted
                playsInline
                preload="metadata"
                data-autoloop
              />
              <figcaption>
                <b>Adding the DEM.</b> Paste the URL, pick <code>DEM</code> if it isn&apos;t
                auto-detected. Add a hillshade layer, set the layer order, and tune the style.
              </figcaption>
            </figure>
          </section>

          <section id="who">
            <div className="eyebrow">Who&apos;s building this</div>
            <h2>One person, part time, over a summer.</h2>
            <ul className="credlist">
              <li>15+ years building web maps</li>
              <li>MapLibre governing board</li>
              <li>Teaching Cartography, University of Washington</li>
            </ul>
            <div className="pullquote">
              The complaints I opened with aren&apos;t research findings. They&apos;re my own experience.
            </div>
          </section>

          <section id="fund">
            <div className="eyebrow">Funding</div>
            <h2>Want to fund the work?</h2>
            <p>
              So far this is a self-funded, part-time project. If that&apos;s something you could
              support, I&apos;d love to hear from you. Funding helps me prioritize and ship faster.
            </p>
            <p className="muted">
              Check the funding box in the form below and I&apos;ll follow up.
            </p>
          </section>

          <section id="ask">
            <div className="eyebrow">One ask</div>
            <h2>Tell me why you&apos;re here.</h2>
            <p className="muted ask-lede">
              I&apos;m looking for projects that will put Mapstrata through its paces on real stylesheets.
            </p>
            <div className="ask-box">
              <p>
                If you just want to know when the source code is public, say so below. If you
                have more to offer, tell me that too.
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
                  <textarea name="details" rows={4} placeholder="What style do you maintain, and what breaks? How would you like to help? Funding context? Whatever's relevant." />
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
        /* globals.css styles h2 with Tailwind's text-xs, which also sets
           line-height:1rem — it must be reset alongside the font-size or tall
           headings overlap when they wrap. */
        .ms h2 { display: block; text-transform: none; letter-spacing: normal; font-weight: 700; line-height: 1.22; }
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
          --diff-add:#00e5ff; --diff-add-bg:#00e5ff14; --diff-del:#ff2d6a; --diff-del-bg:#ff2d6a14;
          --warn:#f7ff00; --warn-bg:#f7ff0012; --warn-border:#f7ff0055;
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

        .ms section { padding:clamp(48px,7vw,76px) 0; border-bottom:1px solid var(--line); }
        .ms section:last-of-type { border-bottom:none; }
        .ms .eyebrow { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.18em; color:var(--secondary); display:flex; align-items:center; gap:12px; margin-bottom:22px; }
        .ms .eyebrow::before { content:''; width:28px; height:2px; background:var(--secondary); flex-shrink:0; }
        .ms h2 { font-family:var(--font-display); font-size:clamp(1.5rem,3vw,2rem); color:var(--text); margin-bottom:.55em; text-wrap:balance; }
        .ms p { font-size:1.02rem; color:var(--text); max-width:64ch; }
        .ms p + p { margin-top:.9em; }
        .ms .muted { color:var(--text-muted); }

        .ms .pieces { margin-top:26px; display:flex; flex-direction:column; gap:18px; max-width:64ch; }
        .ms .pieces dt { font-family:var(--font-mono); font-size:.9rem; color:var(--accent); letter-spacing:.02em; }
        .ms .pieces dd { font-size:1.02rem; color:var(--text-muted); line-height:1.6; margin-top:4px; padding-left:16px; border-left:2px solid var(--line); }

        /* ── Ported from mapstrata-deck-v1.html. Slide-geometry sizing (52/62/64vh)
           is dropped: these figures live in a scrolling column, not on a slide.
           .shot/.compare-item are renamed to .tour-shot/.cmp-item because .shot is
           already the hero figure above. ── */
        .ms .sub { font-family:var(--font-display); font-size:clamp(1.15rem,2.2vw,1.4rem); color:var(--secondary); font-weight:700; margin:2.2em 0 .6em; }

        .ms .pullquote { font-family:var(--font-display); font-weight:500; font-size:clamp(1.1rem,1.9vw,1.45rem); color:var(--text); line-height:1.42; max-width:40ch; border-left:3px solid var(--primary); padding-left:.7em; margin:1.2em 0; }

        .ms .cmp-pair { display:flex; flex-direction:column; gap:clamp(28px,4vw,44px); margin:1.4em 0; }
        .ms .cmp-item { display:flex; flex-direction:column; gap:12px; min-width:0; }
        .ms .cmp-item img, .ms .cmp-item video { width:100%; height:auto; border:1px solid var(--line); border-radius:8px; background:var(--surface); display:block; }
        .ms .cmp-item figcaption { font-size:1.02rem; color:var(--text-muted); line-height:1.6; max-width:74ch; }
        .ms .cmp-item figcaption b { color:var(--text); font-family:var(--font-display); font-weight:600; margin-right:.35em; }
        .ms .bigvideo { margin:1.4em 0; }

        .ms .diffmock { border:1px solid var(--line); border-radius:10px; overflow-x:auto; background:#050505; }
        .ms .diffmock .diff-head { font-family:var(--font-mono); font-size:.78rem; color:var(--text-dim); padding:9px 16px; border-bottom:1px solid var(--line); background:var(--surface); }
        .ms .diffmock .diff-line { font-family:var(--font-mono); font-size:.86rem; padding:5px 16px; white-space:pre; color:var(--text-muted); }
        .ms .diffmock .diff-line.add { color:var(--diff-add); background:var(--diff-add-bg); }
        .ms .diffmock .diff-line.del { color:var(--diff-del); background:var(--diff-del-bg); }
        .ms .diffmock .diff-line.ctx { opacity:.55; }

        .ms .tour { display:flex; flex-direction:column; gap:clamp(28px,4vw,44px); margin-top:28px; }
        .ms .tour-shot { display:flex; flex-direction:column; gap:12px; }
        .ms .tour-shot img { width:100%; height:auto; display:block; border:1px solid var(--line); border-radius:8px; background:var(--surface); }
        .ms .tour-shot figcaption { font-size:1.02rem; color:var(--text-muted); line-height:1.6; max-width:74ch; }
        .ms .tour-shot figcaption b { color:var(--text); font-family:var(--font-display); font-weight:600; margin-right:.35em; }

        /* The one place the page isn't a single column: detail shots that are read
           against each other, so they sit in two columns above 860px, with the
           shorter two stacked in the left column. */
        .ms .trio { display:flex; gap:clamp(18px,2.4vw,28px); margin-top:clamp(28px,4vw,40px); align-items:flex-start; }
        .ms .trio-col { flex:1 1 0; min-width:0; display:flex; flex-direction:column; gap:clamp(28px,3.4vw,40px); }
        /* These three are cropped to the dialog itself, which carries its own
           border and rounded corners, so the shared figure chrome would double up. */
        .ms .trio .tour-shot img { object-fit:contain; object-position:top; border:0; background:none; border-radius:10px; }
        .ms .trio figcaption { font-size:.95rem; }
        @media (max-width:860px) { .ms .trio { flex-direction:column; gap:clamp(28px,4vw,44px); } }
        .ms .wide-shot { margin-top:28px; }

        .ms .shotsplit { display:flex; flex-direction:column; gap:clamp(18px,2.8vw,28px); margin:1.4em 0; }
        .ms .hlshot { border:1px solid var(--line); border-radius:8px; overflow:hidden; background:var(--surface); line-height:0; min-width:0; }
        .ms .hlshot img { display:block; width:100%; height:auto; }
        .ms .hlcap { font-size:1.02rem; color:var(--text-muted); line-height:1.6; }
        .ms .hlcap b { color:var(--text); font-family:var(--font-display); font-weight:600; margin-right:.35em; }

        .ms .bullets { list-style:none; display:flex; flex-direction:column; gap:.6em; max-width:52ch; }
        .ms .bullets li { font-size:1rem; color:var(--text); line-height:1.55; padding-left:1.3em; position:relative; }
        .ms .bullets li::before { content:'—'; position:absolute; left:0; color:var(--accent); }

        .ms .stat-callout { display:inline-flex; align-items:center; gap:20px; background:var(--warn-bg); border:1px solid var(--warn-border); border-radius:10px; padding:16px 22px; margin-top:1.1em; }
        .ms .stat-callout .num { font-family:var(--font-display); font-weight:700; font-size:clamp(1.6rem,2.6vw,2.2rem); color:var(--secondary); font-variant-numeric:tabular-nums; }
        .ms .stat-callout .stat-label { font-size:.9rem; color:var(--text-muted); max-width:32ch; line-height:1.45; }

        .ms .credlist { list-style:none; display:flex; flex-direction:column; gap:.4em; margin:.2em 0 .4em; font-family:var(--font-mono); font-size:.95rem; color:var(--text-muted); }
        .ms .credlist li::before { content:'▸ '; color:var(--secondary); }

        .ms .ask-lede { margin-bottom:.2em; }
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
