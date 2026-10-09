import { site } from './site.config.js';
import { motionReduced } from './motion.js';
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(pointer: fine)');
let reduced = motionReduced;
const motionButton = document.querySelector('#motion-toggle');
function syncMotion() { reduced = motionReduced; render(0); }
document.addEventListener('motionchange', syncMotion);
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
matchMedia('(min-width:651px)').addEventListener('change', closeMenu);
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('pending'); revealObserver.unobserve(entry.target); } }); }, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => { el.classList.add('pending'); revealObserver.observe(el); });
const canvas = document.querySelector('#ribbon');
const context = canvas.getContext('2d');
let width = 1, height = 1, visible = true, pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 }, scroll = 0;
function resize() { if (!context) return; const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); render(0); }
// Original 2D parametric ribbon: a twisting field of nested loops, drawn locally.
function render(time) {
  if (!context) return;
  context.clearRect(0, 0, width, height);
  const t = reduced ? .7 : time * .00016;
  eased.x += (pointer.x - eased.x) * .04; eased.y += (pointer.y - eased.y) * .04;
  context.save(); context.translate(width * .52 + (reduced ? 0 : eased.x * 15), height * .48 + (reduced ? 0 : eased.y * 12));
  context.rotate(-.39 + (reduced ? 0 : scroll * .00012));
  const size = Math.min(width * .36, height * .43);
  for (let j = 0; j < 61; j++) {
    const phase = j / 60;
    context.beginPath();
    for (let i = 0; i <= 150; i++) {
      const a = i / 150 * Math.PI * 2;
      const r = size * (.82 + phase * .18 + .15 * Math.sin(a * 3 + t + phase * 1.9));
      const x = Math.cos(a) * r * 1.23 + Math.sin(phase * Math.PI * 2 + a * 2 + t) * size * .32;
      const y = Math.sin(a) * r * .61 + (phase - .5) * size * .8;
      i === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
    }
    context.closePath(); context.strokeStyle = `rgba(213,250,53,${.27 + .55 * Math.sin(phase * Math.PI)})`; context.lineWidth = .8; context.stroke();
  }
  context.restore();
}
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(canvas);
const cursor = document.querySelector('.cursor');
let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0, cursorVisible = false;
document.addEventListener('pointermove', e => { if (!finePointer.matches || reduced) return; pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = e.clientY / innerHeight * 2 - 1; targetX = e.clientX; targetY = e.clientY; if (!cursorVisible) {cursorX=targetX;cursorY=targetY;cursorVisible=true;} cursor.style.opacity = '1'; cursor.classList.toggle('active', !!e.target.closest('a,button,summary')); }, { passive: true });
document.addEventListener('pointerleave', () => { cursorVisible = false; cursor.style.opacity = '0'; });
window.addEventListener('scroll', () => { scroll = window.scrollY; }, { passive: true });
document.querySelectorAll('.magnetic').forEach(el => { el.addEventListener('pointermove', e => { if (reduced || !finePointer.matches) return; const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.12}px)`; }); el.addEventListener('pointerleave', () => { el.style.transform = ''; }); });
let animationId;
function animate(time) { if (!document.hidden && !reduced) { if (visible) render(time); if (cursorVisible) { cursorX += (targetX-cursorX)*.18; cursorY += (targetY-cursorY)*.18; cursor.style.transform = `translate(${cursorX}px,${cursorY}px) translate(-50%,-50%)`; } } animationId = requestAnimationFrame(animate); }
syncMotion(); resize(); animationId = requestAnimationFrame(animate);
window.addEventListener('pagehide', () => cancelAnimationFrame(animationId));
window.addEventListener('pageshow', e => { if (e.persisted) animationId = requestAnimationFrame(animate); });

const core = document.querySelector('.cursor-core');
function hideCursor() {
  cursorVisible = false; cursor.style.opacity = '0'; core.style.opacity = '0';
  document.documentElement.classList.remove('custom-pointer');
}
document.addEventListener('pointermove', e => {
  if (!finePointer.matches || reduced || e.pointerType === 'touch' || e.target.closest('input,textarea,select,label')) { hideCursor(); return; }
  document.documentElement.classList.add('custom-pointer');
  core.style.opacity = '1'; core.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
  const project = e.target.closest('.project');
  cursor.classList.toggle('project-cursor', !!project);
  cursor.textContent = project ? 'Explore ↗' : '';
}, {passive:true});
document.addEventListener('pointerleave', hideCursor);
window.addEventListener('blur', hideCursor);
window.addEventListener('resize', hideCursor);
motionQuery.addEventListener('change', hideCursor);
finePointer.addEventListener('change', hideCursor);
motionButton.addEventListener('click', hideCursor);
document.querySelectorAll('a').forEach(a => a.addEventListener('click', hideCursor));

const timeline = document.querySelector('.timeline');
let scrollTick = false;
function updateTimeline() {
  const rect = timeline.getBoundingClientRect();
  const progress = reduced ? 1 : Math.max(0, Math.min(1, (innerHeight * .85 - rect.top) / (rect.height + innerHeight * .25)));
  timeline.style.setProperty('--progress', progress);
  scrollTick = false;
}
window.addEventListener('scroll', () => { if (!scrollTick) { scrollTick = true; requestAnimationFrame(updateTimeline); } }, {passive:true});
updateTimeline();
const animationObserver = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => target.classList.toggle('in-view', isIntersecting)));
document.querySelectorAll('.process-instrument,.service,.timeline').forEach(el => animationObserver.observe(el));
// The four stages are selectable, with progressive emphasis and semantic pressed states.
const stages = [...document.querySelectorAll('.process-grid article')];
stages.forEach((stage, index) => {
  const button = document.createElement('button');
  button.className = 'stage-select'; button.type = 'button';
  button.textContent = stage.querySelector('span').textContent;
  button.setAttribute('aria-pressed', String(index === 0));
  stage.querySelector('span').replaceWith(button);
  if (index === 0) stage.classList.add('selected');
  button.addEventListener('click', () => {
    stages.forEach((el, i) => { el.classList.toggle('selected', i === index); el.querySelector('button').setAttribute('aria-pressed', String(i === index)); });
    document.querySelector('.process-instrument').dataset.stage = String(index);
    document.querySelector('.process-instrument>span').textContent = ['AN IDEA BECOMES A SHARED DIRECTION.', 'A DIRECTION BECOMES A VISUAL LANGUAGE.', 'DESIGN AND ENGINEERING COME TOGETHER.', 'THE DETAILS MAKE THE DIFFERENCE.'][index];
  });
});
document.querySelectorAll('.service-number').forEach((el, i) => {
  el.insertAdjacentHTML('beforeend', `<svg class="service-icon" viewBox="0 0 40 40" aria-hidden="true"><path d="${['M5 20H35M20 5V35M9 9L31 31M9 31L31 9','M5 5H35V35H5ZM5 15H35M15 15V35','M14 9L3 20L14 31M26 9L37 20L26 31M23 4L17 36'][i]}"/></svg>`);
});
if (site.email) {
  const email = document.querySelector('.email'); email.textContent = `${site.email} ↗`; email.href = `mailto:${site.email}`;
  email.nextElementSibling.textContent = 'Prefer email? Send your idea directly.';
}
if (site.socials.length) {
  const socials = document.querySelector('.socials'); socials.replaceChildren();
  site.socials.forEach(({label,url}) => { if (!url.startsWith('https://')) return; const a = document.createElement('a'); a.textContent = `${label} ↗`; a.href = url; socials.append(a); });
}
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const submit = form.querySelector('[type=submit]');
if (site.contactEndpoint) document.querySelector('#form-note').textContent = 'Your details will only be used to respond to this enquiry.';
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (data.website) { status.textContent = 'Please clear the hidden website field and try again.'; return; }
  if (!data.name.trim() || data.description.trim().length < 20) { status.textContent = 'Please add your name and at least 20 characters describing the project.'; return; }
  status.replaceChildren();
  if (!site.contactEndpoint) {
    status.append('Your brief is ready, but has not been sent. Contact delivery is not configured. ');
    const download = document.createElement('button'); download.type = 'button'; download.className = 'download-brief'; download.textContent = 'Download your brief ↓';
    download.addEventListener('click', () => {
      const text = `PROJECT BRIEF\n\nName: ${data.name}\nEmail: ${data.email}\nType: ${data.projectType}\nBudget: ${data.budget || 'To discuss'}\n\n${data.description}\n\nNot submitted. Share this file directly with the studio.`;
      const url = URL.createObjectURL(new Blob([text], {type:'text/plain'}));
      const a = document.createElement('a'); a.href = url; a.download = 'project-brief.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }); status.append(download); return;
  }
  submit.disabled = true; submit.textContent = 'Sending…'; status.textContent = 'Sending your brief securely…';
  try {
    if (!site.contactEndpoint.startsWith('https://')) throw new Error('Configuration error');
    const response = await fetch(site.contactEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('Delivery failed');
    status.textContent = 'Your brief has been received. Thank you for sharing your idea.'; form.reset();
  } catch { status.textContent = 'Your brief could not be sent. Your entries are still here; please try again or use the direct email contact.'; }
  finally { submit.disabled = false; submit.innerHTML = 'Send project brief <span>↗</span>'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
