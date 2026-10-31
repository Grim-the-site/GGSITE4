(()=>{'use strict';
  const YOUTUBE='https://www.youtube.com/@grim-gamer-YT/featured';
  const menu=document.getElementById('menuToggle');
  const mobile=document.getElementById('mobileNav');
  const closeMenu=()=>{if(!menu||!mobile)return;mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu')};
  menu?.addEventListener('click',()=>{const opened=mobile.hidden;mobile.hidden=!opened;menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'Close menu':'Open menu')});
  mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(mobile&&!mobile.hidden&&!mobile.contains(e.target)&&!menu?.contains(e.target))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  const tabs=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-type]')];
  tabs.forEach(tab=>tab.addEventListener('click',()=>{const chosen=tab.dataset.filter;tabs.forEach(t=>{const selected=t===tab;t.classList.toggle('active',selected);t.setAttribute('aria-pressed',String(selected))});cards.forEach(card=>card.hidden=chosen!=='all'&&card.dataset.type!==chosen)}));
  const sections=[...document.querySelectorAll('main section[id]')];
  const nav=[...document.querySelectorAll('.desktop-nav a')];
  const progress=document.getElementById('scrollProgress');
  let ticking=false;
  const updateScroll=()=>{ticking=false;const available=document.documentElement.scrollHeight-window.innerHeight;const pct=available>0?Math.min(100,Math.max(0,scrollY/available*100)):0;if(progress)progress.style.width=pct+'%'};
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
  const year=document.getElementById('year');if(year)year.textContent=String(new Date().getFullYear());
  if('IntersectionObserver' in window){
    const entryObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');entryObserver.unobserve(entry.target)}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>entryObserver.observe(el));
    const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){nav.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}}),{rootMargin:'-28% 0px -60% 0px'});sections.forEach(el=>navObserver.observe(el));
  }else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'))}
  const toast=document.getElementById('toast');let toastTimer;
  const notify=text=>{if(!toast)return;toast.textContent=text;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2300)};
  document.getElementById('copyChannel')?.addEventListener('click',async()=>{
    try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');await navigator.clipboard.writeText(YOUTUBE);notify('CHANNEL LINK COPIED')}
    catch{const field=document.createElement('textarea');field.value=YOUTUBE;field.style.cssText='position:fixed;opacity:0';document.body.appendChild(field);field.select();let result=false;try{result=document.execCommand('copy')}catch{}field.remove();notify(result?'CHANNEL LINK COPIED':'OPEN THE CHANNEL TO COPY THE LINK')}
  });
})();