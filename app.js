(()=>{'use strict';
  const channel='https://www.youtube.com/@grim-gamer-YT/featured';
  const menu=document.getElementById('menuBtn');
  const mobile=document.getElementById('mobileNav');
  const navLinks=[...document.querySelectorAll('.desktop-nav a')];
  const sections=[...document.querySelectorAll('main section[id]')];
  const closeMenu=()=>{if(!menu||!mobile)return;mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')};
  if(menu){menu.addEventListener('click',()=>{const show=mobile.hidden;mobile.hidden=!show;menu.setAttribute('aria-expanded',String(show));menu.setAttribute('aria-label',show?'Close navigation':'Open navigation')});}
  mobile?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  document.addEventListener('click',e=>{if(!mobile?.hidden&&!mobile.contains(e.target)&&!menu?.contains(e.target))closeMenu()});
  const filters=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-type]')];
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    const type=btn.dataset.filter;
    filters.forEach(filter=>{const selected=filter===btn;filter.classList.toggle('active',selected);filter.setAttribute('aria-pressed',String(selected))});
    cards.forEach(card=>{card.hidden=type!=='all'&&card.dataset.type!==type});
  }));
  const year=document.getElementById('year');if(year)year.textContent=String(new Date().getFullYear());
  const toast=document.getElementById('toast');let timeout;
  const tell=message=>{if(!toast)return;toast.textContent=message;toast.classList.add('shown');clearTimeout(timeout);timeout=setTimeout(()=>toast.classList.remove('shown'),2600)};
  document.getElementById('copyChannel')?.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(channel);tell('CHANNEL LINK COPIED')}catch(err){
      const input=document.createElement('textarea');input.value=channel;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();try{document.execCommand('copy');tell('CHANNEL LINK COPIED')}catch(e){tell('OPEN THE CHANNEL TO COPY ITS LINK')}input.remove();
    }
  });
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const active='#'+entry.target.id;navLinks.forEach(link=>link.classList.toggle('nav-active',link.getAttribute('href')===active))})},{rootMargin:'-30% 0px -60% 0px'});sections.forEach(section=>observer.observe(section))}
})();