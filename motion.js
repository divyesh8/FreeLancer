// Motion runs by default; explicit Pause persists. OS reduced-motion uses a gentler mode.
const system = matchMedia('(prefers-reduced-motion: reduce)');
let preference = 'full';
try { preference = localStorage.getItem('form-field-motion-v2') || 'full'; } catch {}
export let motionReduced = preference === 'off';
const root = document.documentElement;
const control = document.createElement('button');
control.className = 'motion-control'; control.type = 'button';
document.body.append(control);
function sync() {
  motionReduced = preference === 'off';
  root.classList.toggle('reduced', motionReduced);
  root.classList.toggle('gentle-motion', system.matches);
  root.classList.toggle('motion-full', !motionReduced);
  document.querySelectorAll('.motion-control,#motion-toggle').forEach(button => {
    button.disabled = false;
    button.textContent = motionReduced ? 'Enable motion ↗' : 'Pause motion Ⅱ';
    button.setAttribute('aria-pressed', String(!motionReduced));
    button.setAttribute('aria-label', motionReduced ? 'Enable full animation on this website' : 'Pause animation on this website');
  });
  document.dispatchEvent(new CustomEvent('motionchange', {detail:motionReduced}));
}
function toggle() { preference = motionReduced ? 'full' : 'off'; try { localStorage.setItem('form-field-motion-v2', preference); } catch {} sync(); }
control.addEventListener('click', toggle);
document.querySelector('#motion-toggle')?.addEventListener('click', toggle);
system.addEventListener('change', sync);
sync();

// A short, interruptible editorial shutter. Native navigation is the fallback.
const curtain = document.createElement('div');
curtain.className = 'page-curtain'; curtain.setAttribute('aria-hidden','true');
curtain.innerHTML = '<i></i><i></i><i></i><span>FORM / FIELD<small>IDEAS IN MOTION</small></span>';
document.body.append(curtain);
let navigating = false;
const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
function resetCurtain() { curtain.classList.remove('cover','depart'); navigating = false; }
window.addEventListener('pageshow', resetCurtain);
document.addEventListener('keydown', e => { if(e.key === 'Escape') resetCurtain(); });
document.addEventListener('click', async e => {
  const link = e.target.closest('a[href]');
  if (!link || motionReduced || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href,location.href);
  if(url.origin !== location.origin || !['http:','https:'].includes(url.protocol)) return;
  const samePage = url.pathname === location.pathname;
  const target = samePage && url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
  if(samePage && (!target || link.classList.contains('skip'))) return;
  if(navigating) { e.preventDefault(); return; }
  e.preventDefault(); navigating = true;
  curtain.classList.remove('depart'); curtain.classList.add('cover');
  await wait(520);
  if(!navigating) return;
  if(target) {
    history.pushState(null,'',url.hash);
    if(!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    window.scrollTo({top:target.getBoundingClientRect().top + scrollY - 36,behavior:'instant'});
    curtain.classList.add('depart'); curtain.classList.remove('cover');
    await wait(650); resetCurtain();
  } else location.assign(url.href);
});

// Split headlines into masked lines while retaining their original semantic text.
document.querySelectorAll('.section h2,.case-main h1').forEach(heading => {
  if(heading.querySelector('a')) return;
  const lines = heading.innerHTML.split(/<br\s*\/?>/i);
  heading.innerHTML = lines.map((line,i)=>`<span class="line-mask"><span class="line-rise" style="--line:${i}">${line}</span></span>`).join('');
  heading.classList.add('cinema-heading');
});
const sections = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('scene-visible',entry.isIntersecting);
}),{threshold:.12});
document.querySelectorAll('.cinema-heading,.project,.character-scene,.hero,.case-art').forEach(el=>sections.observe(el));

// Original SVG cast: Spark, Dot, and Block. No downloaded character assets.
function character(kind) {
  const body = kind === 'spark' ? '<path class="character-shell" d="M100 14L117 51L155 29L151 72L194 81L160 108L182 146L140 145L132 188L102 157L69 186L64 145L23 154L42 116L9 91L51 78L42 36L82 54Z"/>' : kind === 'block' ? '<rect class="character-shell" x="39" y="40" width="125" height="125" rx="30"/><path class="antenna" d="M101 40V18m-9 0h18"/>' : '<circle class="character-shell" cx="100" cy="100" r="66"/>';
  return `<svg viewBox="0 0 200 230" aria-hidden="true"><ellipse class="character-shadow" cx="100" cy="216" rx="48" ry="7"/><g class="character-body"><g class="limbs"><path class="left-leg" d="M76 150L67 201H48"/><path class="right-leg" d="M124 150L139 200H157"/><path class="left-arm" d="M48 100Q16 111 22 141"/><path class="right-arm" d="M151 100Q184 87 176 59"/></g>${body}<g class="character-eyes"><ellipse cx="79" cy="94" rx="13" ry="19" fill="#f1f0e9"/><ellipse cx="121" cy="94" rx="13" ry="19" fill="#f1f0e9"/><g class="pupils"><ellipse cx="82" cy="96" rx="6" ry="9"/><ellipse cx="124" cy="96" rx="6" ry="9"/></g></g><path class="character-smile" d="M88 125Q100 136 115 122"/></g></svg>`;
}
const hero = document.querySelector('.hero');
if(hero) {

  const scene = document.createElement('section'); scene.className = 'character-scene'; scene.id = 'play';
  scene.innerHTML = `<div class="character-stage"><div class="scene-caption"><span>THE STUDIO / DIFFERENT WAYS OF THINKING</span><span>SCROLL TO BRING US TOGETHER ↓</span></div><div class="scene-orbit" aria-hidden="true"></div><h2>Curiosity meets<br><em>capability.</em></h2><div class="character-cast">${['spark','dot','block'].map((kind,i)=>`<button type="button" class="character character-${kind}" aria-label="Make ${kind} jump" style="--index:${i}">${character(kind)}<span>${['SPARK / THE IDEA','DOT / THE CURIOSITY','BLOCK / THE BUILDER'][i]}</span></button>`).join('')}</div><div class="scene-bottom"><p>A little curiosity.<br>A lot of possibility.</p><span>IDEAS, EXPLORATION, AND EXECUTION.<br>MOVE YOUR POINTER. TAP A CHARACTER.</span></div></div>`;
  document.querySelector('#about').append(scene); sections.observe(scene);
  document.querySelectorAll('.character').forEach(el=>el.addEventListener('click',()=>{
    if(motionReduced) return;
    el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump');
    el.addEventListener('animationend',()=>el.classList.remove('jump'),{once:true});
  }));
  let scrollQueued = false;
  const updateScroll = () => {
    scrollQueued = false;
    const rect = scene.getBoundingClientRect();
    const progress = Math.max(0,Math.min(1,-rect.top / Math.max(1,rect.height-innerHeight)));
    scene.style.setProperty('--scene-progress', motionReduced ? .5 : progress);
    const heroProgress = Math.min(1,scrollY / Math.max(1,hero.offsetHeight));
    hero.style.setProperty('--hero-progress',motionReduced ? 0 : heroProgress);
  };
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
  window.addEventListener('resize',updateScroll); document.addEventListener('motionchange',updateScroll); updateScroll();
  let px=0,py=0,eyeFrame=0;
  document.addEventListener('pointermove',e=>{
    if(motionReduced) return;
    px=(e.clientX/innerWidth-.5)*8; py=(e.clientY/innerHeight-.5)*6;
    if(!eyeFrame) eyeFrame=requestAnimationFrame(()=>{ root.style.setProperty('--eye-x',`${px}px`);root.style.setProperty('--eye-y',`${py}px`); eyeFrame=0; });
  },{passive:true});
}
document.addEventListener('visibilitychange',()=>root.classList.toggle('tab-inactive',document.hidden));
