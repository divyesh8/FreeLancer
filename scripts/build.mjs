import { mkdir, copyFile, readFile, writeFile, cp, access } from 'node:fs/promises';
import { projects } from '../site.config.js';
import { artwork as projectArtwork } from '../project-art.js';
const files = ['index.html', 'styles.css', 'redesign.css', 'app.js', 'motion.js', 'site.config.js', 'favicon.svg', 'social-preview.png'];
let html = await readFile('index.html', 'utf8');
const safe = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function artFor(project) {
 if(project.thumbnail) return '<div class="project-art"><img src="'+safe(project.thumbnail)+'" alt="'+safe(project.title)+' project preview" width="1200" height="900" loading="lazy"></div>';
 return projectArtwork[project.slug] || projectArtwork.index;
}
const cards=projects.map(project=>'<a class="project reveal" href="work/'+safe(project.slug)+'.html" aria-label="Explore '+safe(project.title)+', '+(project.isConcept ? 'visual concept' : 'project')+'">'+artFor(project)+'<div class="project-meta"><h3>'+safe(project.title)+'</h3><span>'+safe(project.category)+'</span></div><p>'+safe(project.description)+'</p><span class="concept-label">'+(project.isConcept ? 'ORIGINAL CONCEPT / NOT CLIENT WORK' : safe(project.label || 'PROJECT'))+'</span></a>').join('\n');
html=html.replace(/<!-- PROJECTS:START -->[\s\S]*?<!-- PROJECTS:END -->/,'<!-- PROJECTS:START -->\n<div class="project-grid">'+cards+'</div>\n<!-- PROJECTS:END -->');
await writeFile('index.html',html);
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(anchor)) throw new Error(`Broken anchor: ${anchor}`);
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const head = (title, description, prefix='') => `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} — Form / Field</title><meta name="description" content="${escape(description)}"><meta property="og:title" content="${escape(title)} — Form / Field"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website"><link rel="stylesheet" href="${prefix}styles.css"><link rel="stylesheet" href="${prefix}redesign.css"><link rel="icon" href="${prefix}favicon.svg"><script type="module" src="${prefix}motion.js"></script></head><body>`;
await mkdir('work', {recursive:true});
for (const [i, project] of projects.entries()) {
  const card = html.match(new RegExp(`<a class="project[^>]+href="work/${project.slug}\\.html"[\\s\\S]*?</a>`))?.[0];
  if (!card) throw new Error(`Missing project preview ${project.slug}`);
  const artwork = card.slice(card.indexOf('<div class="project-art'), card.indexOf('<div class="project-meta')).replace(/src="(?!https?:|\/)/g, 'src="../');
  const page = `${head(project.title, project.description, '../')}<a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="../index.html">FORM<span>/</span>FIELD</a><nav aria-label="Project navigation" style="display:flex;position:static;background:none;padding:0"><a href="../index.html#work">← All work</a><a href="../index.html#contact">Start a project ↗</a></nav></header><main id="main" class="case-main"><span class="eyebrow accent">DESIGN STUDY / ORIGINAL DEMONSTRATION · ${String(i+1).padStart(2,'0')}</span><h1>${project.title}</h1><p class="case-lead">${project.description}</p><div class="case-art">${artwork}</div><div class="case-meta"><span>${project.category}</span><span>${escape(project.technology)}<br>${(project.services || []).map(escape).join(' / ')}</span><span>${project.isConcept ? 'CONCEPT · NOT CLIENT WORK' : 'PROJECT'}</span></div>${(project.images || []).map(image=>'<img class="case-image" src="'+escape(image.src)+'" alt="'+escape(image.alt)+'" loading="lazy" width="1200" height="800">').join('')}<div class="case-sections">${[['The objective',project.objective],['The approach',project.approach],['Design & development',project.decisions],['What this demonstrates',project.outcome]].map(([h,p])=>`<section><h2>${h}</h2><p>${p}</p></section>`).join('')}</div>${project.url ? '<p class="project-external"><a href="'+escape(project.url)+'" target="_blank" rel="noopener noreferrer">Visit project ↗</a></p>' : ''}<div class="case-nav"><a class="button" href="../index.html#contact">Build something like this ↗</a><a href="${projects[(i+1)%projects.length].slug}.html">Next: ${projects[(i+1)%projects.length].title} ↗</a></div></main></body></html>`;
  await writeFile(`work/${project.slug}.html`, page);
}
await writeFile('404.html', `${head('Page not found','This page has moved or does not exist.','/')}<main class="error-page"><span class="eyebrow accent">404 / OFF THE GRID</span><h1>Lost in<br><em>the field.</em></h1><p>This page has moved or does not exist. Let’s get you back to a good idea.</p><a class="button" href="/">Back to the studio ↗</a></main></body></html>`);
await mkdir('dist/work', {recursive:true});
for (const file of [...files,'404.html',...projects.map(p=>`work/${p.slug}.html`)]) await copyFile(file, `dist/${file}`);
try { await access('assets'); await cp('assets','dist/assets',{recursive:true}); } catch(error) { if(error.code !== 'ENOENT') throw error; }
console.log(`Built home, ${projects.length} case studies, custom 404, and assets. Internal home anchors verified.`);
