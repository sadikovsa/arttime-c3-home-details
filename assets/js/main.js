(() => {
'use strict';
const root = document.documentElement;
const data = JSON.parse(document.getElementById('content-data').textContent);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow = window.matchMedia('(max-width: 760px)');
root.classList.add('js');
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const text = (selector, value) => { $(selector).textContent = value; };
const motion = window.ArtTimeMotion.create(()=>!reduced.matches&&!paused);
let dialogOpener = null;
function openDialog(dialog, opener) {
  dialogOpener = opener;
  dialog.showModal();
  $('[data-dialog-close]', dialog).focus();motion.enter(dialog,opener,'y');
}
$$('dialog').forEach(dialog => {
  $('[data-dialog-close]', dialog).addEventListener('click', () => motion.close(dialog));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) motion.close(dialog); } });
  dialog.addEventListener('cancel',e=>{e.preventDefault();motion.close(dialog);});
  dialog.addEventListener('close', () => {motion.scope(dialog);
    const opener = dialogOpener;
    dialogOpener = null;
    if (opener && opener.isConnected && opener.getClientRects().length) opener.focus({preventScroll: true});
  });
});
const productDialog = $('#product-dialog');
let selectedRequest = '';
$$('[data-product]').forEach(button => button.addEventListener('click', event => {
  const item = data.catalog.find(x => x.id === button.dataset.product);
  if (!item) return;
  event.preventDefault();
  const img = $('#product-image');
  img.src = item.image; img.alt = item.title; img.width = item.width; img.height = item.height;
  text('#product-category', item.category); text('#product-title', item.title);
  text('#product-description', item.description); text('#product-specification', item.specification);
  selectedRequest = item.title;
  openDialog(productDialog, button);
}));
const rooms = {
  dining: {
    title: 'Столовая', image: 'assets/img/hero-room-1672.webp', original: 'assets/img/arttime-3939665758827879283.webp',
    srcset: 'assets/img/hero-room-640.webp 640w, assets/img/hero-room-960.webp 960w, assets/img/hero-room-1672.webp 1672w',
    alt: 'Картина с листьями, цветы в вазе и аксессуары в светлой столовой',
    note: 'От картины к деталям на столе.', origin: [31, 45],
    points: [[.30,.39],[.446,.64],[.69,.795]],
    titles: ['Картина','Хрусталь','Детали'],
    descriptions: [
      'Крупная картина с зелёными листьями связывает светлые поверхности и природные оттенки. В оформленной кухне Art Time подобрана картина под масштаб стены и характер уже существующей комнаты.',
      'Хрустальная ваза и цветы на круглом столе продолжают вертикальный ритм картины. Сочетание прозрачного сосуда и насыщенной композиции даёт комнате выразительный, но спокойный акцент.',
      'Фруктовый сосуд и салфетница соединяют повседневные детали в общую композицию. В этом интерьере Art Time подбирал аксессуары к уже существующим поверхностям и мебели.'
    ],
    short: ['Искусство, которое задаёт настроение пространству.','Выразительные детали для особой атмосферы.']
  },
  living: {
    title: 'Гостиная', image: 'assets/img/arttime-3961265184843446238.webp', original: 'assets/img/arttime-3961265184843446238.webp', srcset: '',
    alt: 'Гостиная со светлым диваном, бирюзовой вазой с цветами и декором в нишах',
    note: 'Цвет, силуэт и ритм открытых ниш.', origin: [43, 55],
    points: [[.40,.61],[.14,.45],[.72,.405]], titles: ['Композиция','Декор ниш','Силуэт'],
    descriptions: [
      'Бирюзовая ваза с цветами собрала цветовой акцент рядом со светлым диваном. В этом оформлении Art Time подобрал цветочную композицию и предметы для ниш.',
      'Отдельные предметы распределены по открытым полкам. Разная высота и свободное пространство между ними помогают избежать ощущения перегруженности.',
      'Вытянутые формы на полках поддерживают вертикальный ритм ниш. Подбор объединяет комнату через масштаб и силуэт, сохраняя собственный характер каждого предмета.'
    ], short: ['Один цветовой акцент рядом со светлой мебелью.','Разная высота предметов, общий ритм комнаты.']
  },
  hall: {
    title: 'Холл', image: 'assets/img/arttime-3934439479825559402.webp', original: 'assets/img/arttime-3934439479825559402.webp', srcset: '',
    alt: 'Высокое пространство виллы с золотистыми акцентами и декором открытых ниш',
    note: 'Предметы в масштабе большого пространства.', origin: [28, 53],
    points: [[.285,.575],[.41,.38],[.93,.60]], titles: ['Золотистый акцент','Ниши','Цветы'],
    descriptions: [
      'Небольшая группа золотистых предметов на отдельной поверхности собирает тёплый акцент в высоком пространстве. Art Time показал подбор наполнения для входной зоны, холла и других комнат четырёхэтажной виллы.',
      'Декор на открытых полках соотносится с высотой помещения. Предметы подбираются как часть наполнения готового интерьера, с учётом его материалов и пропорций.',
      'Цветочная композиция рядом с мягкой мебелью добавляет лёгкий природный силуэт. Обсудим подобный акцент для вашей комнаты и подберём подходящий масштаб.'
    ], short: ['Тёплый акцент в высоком пространстве.','Наполнение, которое учитывает высоту и пропорции.']
  }
};
let activeRoom = 'dining';
let roomGeneration = 0;
const stage = $('.room-stage');
const roomImage = $('#room-image');
const scene = $('.room-scene');
const viewport = $('.room-viewport');
const visual = $('.room-visual');
const storyImages = $$('.story-object>img');
function positionHotspots() {
  const room = rooms[activeRoom];
  const width = viewport.clientWidth, height = viewport.clientHeight;
  if (!roomImage.naturalWidth || !width) return;
  const scale = Math.max(width / roomImage.naturalWidth, height / roomImage.naturalHeight);
  const imageWidth = roomImage.naturalWidth * scale, imageHeight = roomImage.naturalHeight * scale;
  const left = (width-imageWidth)*.5, top = (height-imageHeight)*.55;
  $$('.hotspot').forEach((button, i) => {
    const [x,y] = room.points[i];
    button.style.left = `${Math.max(70, Math.min(width-70, left+x*imageWidth))}px`;
    button.style.top = `${Math.max(75, Math.min(height-160, top+y*imageHeight-24))}px`;
  });
}
function applyRoom(key) {
  activeRoom = key;
  const room = rooms[key];
  stage.dataset.activeRoom = key;
  roomImage.src = room.image;
  if (room.srcset) roomImage.srcset = room.srcset; else roomImage.removeAttribute('srcset');
  roomImage.alt = room.alt;
  visual.style.transformOrigin = `${room.origin[0]}% ${room.origin[1]}%`;
  $$('[data-room]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.room===key)));
  $$('.hotspot').forEach((b,i) => { $('.hotspot__name',b).textContent=room.titles[i]; b.setAttribute('aria-label', `${i+1}. ${room.titles[i]} — ${room.title}`); });
  $$('.mobile-hotspots button').forEach((b,i) => { b.lastElementChild.textContent=room.titles[i]; });
  $('.room-note>span:last-child').textContent=room.note;
  storyImages.forEach((img,i) => { img.src=room.original; img.alt=`${room.titles[i]} — ${room.title}`; img.classList.toggle('story-object__painting',key==='dining'&&i===0); img.classList.toggle('story-object__vase',key==='dining'&&i===1); });
  [0,1].forEach(i => {text(`#story-title-${i+1}`,room.titles[i]);text(`#story-text-${i+1}`,room.short[i]);});
  positionHotspots(); queueMotion();
}
function roomAccents(){if(reduced.matches||paused)return;$$('.hotspot-focus').forEach(n=>{motion.cancel(n);n.remove();});
 const targets=narrow.matches?$$('.mobile-hotspots button'):$$('.hotspot');targets.forEach((button,i)=>{button.style.position=button.classList.contains('hotspot')?'absolute':'relative';const ring=document.createElement('span');ring.className='hotspot-focus';ring.setAttribute('aria-hidden','true');button.append(ring);setTimeout(()=>{if(!ring.isConnected)return;motion.run(ring,[{opacity:0,transform:'scale(.9)'},{opacity:.8,transform:'scale(1)',offset:.45},{opacity:0,transform:'scale(1.12)'}],420,()=>ring.remove());},i*150);});
}
function switchRoom(key){const generation=++roomGeneration;const image=new Image();image.src=rooms[key].image;
 const present=()=>{if(generation!==roomGeneration)return;const before=roomImage.cloneNode(false);before.removeAttribute('id');before.removeAttribute('srcset');before.removeAttribute('sizes');before.src=roomImage.currentSrc;before.alt='';
  $$('.room-photo-old').forEach(n=>{motion.cancel(n);n.remove();});$$('.hotspot-focus').forEach(n=>{motion.cancel(n);n.remove();});applyRoom(key);
  if(reduced.matches||paused)return;
  const layer=document.createElement('div');layer.className='room-photo-old';layer.setAttribute('aria-hidden','true');layer.inert=true;layer.append(before);visual.append(layer);
  const direction=key==='hall'?-1:1;motion.run(layer,[{clipPath:'inset(0 0 0 0)'},{clipPath:direction>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)'}],narrow.matches?480:620,()=>layer.remove());roomAccents();
 };
 image.decode().then(present,()=>{if(generation===roomGeneration)applyRoom(key);});
}
$$('[data-room]').forEach(button=>button.addEventListener('click',()=>switchRoom(button.dataset.room)));
roomImage.addEventListener('load', () => {positionHotspots();measureScene();});
const detailDialog = $('#detail-dialog');
$$('[data-detail]').forEach(button => button.addEventListener('click', () => {
  const room = rooms[activeRoom], index = Number(button.dataset.detail);
  text('#detail-title',room.titles[index]);text('#detail-description',room.descriptions[index]);
  text('#detail-index',`${room.title} / 0${index+1}`);
  const img=$('#detail-image'); img.src=room.original;img.alt=`${room.title} — ${room.titles[index]}`;
  selectedRequest=`${room.title}: ${room.titles[index]}`;
  openDialog(detailDialog,button);
}));
$('#detail-dialog [data-catalog-link]').addEventListener('click',()=> {dialogOpener=null;detailDialog.close();});
$$('[data-request]').forEach(button => button.addEventListener('click', () => {
  const dialog = button.closest('dialog');
  if (dialog) {dialogOpener=null;dialog.close();}
  $('#request-object').value = selectedRequest;
  $('#request').scrollIntoView({behavior: reduced.matches?'instant':'smooth',block:'start'});
  $('#request-name').focus({preventScroll:true});
}));
// Native scrolling owns progress. Pause keeps the scroll geometry stable.
let paused = false;
let ticking = false;
function measureScene() {
  scene.style.setProperty('--stage-height',`${stage.offsetHeight}px`);
  scene.style.setProperty('--scroll-span',`${innerHeight*(narrow.matches?.38:.7)}px`);
  positionHotspots();queueMotion();
}
function updateMotion() {
  ticking=false;
  if (reduced.matches || paused) {
    stage.style.setProperty('--room-scale','1');stage.style.setProperty('--room-x','0px');stage.style.setProperty('--room-y','0px');
    stage.style.setProperty('--title-opacity','1');stage.style.setProperty('--title-y','0px');stage.style.setProperty('--note-opacity','0');
    scene.dataset.progress='0';return;
  }
  const travel=Math.max(1,scene.offsetHeight-stage.offsetHeight);
  const progress=Math.max(0,Math.min(1,-scene.getBoundingClientRect().top/travel));
  // A distinct zoom into the selected zone, followed by the ordinary object strip.
  const eased=progress*progress*(3-2*progress);
  stage.style.setProperty('--room-scale',String(1+eased*(narrow.matches?.28:.62)));
  stage.style.setProperty('--room-x',`${eased*(narrow.matches?10:40)}px`);
  stage.style.setProperty('--room-y',`${eased*-18}px`);
  stage.style.setProperty('--title-opacity',String(Math.max(0,1-progress*2.3)));
  stage.style.setProperty('--title-y',`${progress*28}px`);
  stage.style.setProperty('--note-opacity',String(Math.max(0,Math.min(1,(progress-.28)/.30))));
  stage.style.setProperty('--note-y',`${Math.max(0,1-progress*2)*28}px`);
  scene.dataset.progress=progress.toFixed(3);
}
function queueMotion(){ if(!ticking){ticking=true;requestAnimationFrame(updateMotion);} }
function setMotionMode(){root.classList.toggle('motion-ready',!reduced.matches);const b=$('[data-motion-toggle]');b.disabled=reduced.matches;b.setAttribute('aria-pressed',String(paused||reduced.matches));b.firstChild.textContent=reduced.matches?'Движение уменьшено ':paused?'Включить движение ':'Остановить движение ';measureScene();}
$('[data-motion-toggle]').addEventListener('click',()=>{paused=!paused;root.classList.toggle('motion-paused',paused);setMotionMode();});
addEventListener('scroll',queueMotion,{passive:true});addEventListener('resize',measureScene,{passive:true});
reduced.addEventListener('change',setMotionMode);narrow.addEventListener('change',measureScene);
if(document.fonts)document.fonts.ready.then(measureScene);
motion.bind($('[data-motion-toggle]'),reduced);
const replay=$('[data-motion-replay]');replay.hidden=false;replay.disabled=reduced.matches;reduced.addEventListener('change',()=>{replay.disabled=reduced.matches;});
replay.addEventListener('click',()=>{if(reduced.matches)return;if(paused)$('[data-motion-toggle]').click();scrollTo({top:0,behavior:'instant'});roomAccents();});
setMotionMode();positionHotspots();roomImage.decode().then(()=>requestAnimationFrame(()=>requestAnimationFrame(roomAccents))).catch(()=>{});
// Native details retains no-JS behavior; reverse from the current animated height.
const disclosures=new WeakMap();
$$('[data-accordion]').forEach(details => {
  const summary=$('summary',details),panel=$('.disclosure',details);
  if(!panel)return;
  summary.addEventListener('click',event=>{
    if(details.classList.contains('menu')&&!narrow.matches)return;
    event.preventDefault();
    const previous=disclosures.get(details);
    const wantsOpen=previous?!previous.target:!details.open;
    const from=details.getBoundingClientRect().height;
    const fromOpacity=previous?Number(getComputedStyle(panel).opacity):(wantsOpen?0:1);
    if(previous)previous.animation.cancel();
    if(reduced.matches){details.open=wantsOpen;details.style.height='';details.style.overflow='';disclosures.delete(details);measureScene();return;}
    details.open=true;
    details.style.height='';
    const to=wantsOpen?details.getBoundingClientRect().height:summary.getBoundingClientRect().height;
    details.style.height=`${from}px`;details.style.overflow='hidden';
    const animation=details.animate([{height:`${from}px`},{height:`${to}px`}],{duration:270,easing:'cubic-bezier(.22,.7,.25,1)'});
    const fade=panel.animate([{opacity:fromOpacity},{opacity:wantsOpen?1:0}],{duration:270,easing:'ease-out'});
    const state={animation,target:wantsOpen,fade};disclosures.set(details,state);
    animation.onfinish=()=>{if(disclosures.get(details)!==state)return;details.open=wantsOpen;details.style.height='';details.style.overflow='';disclosures.delete(details);measureScene();};
    animation.oncancel=()=>fade.cancel();
  });
});
const menu=$('.menu');
menu.open=!narrow.matches;root.classList.add("ui-ready");
narrow.addEventListener('change',()=>{const s=disclosures.get(menu);if(s)s.animation.cancel();disclosures.delete(menu);menu.style.height='';menu.style.overflow='';menu.open=!narrow.matches;measureScene();});
function closeMenu(){const pending=disclosures.get(menu);if(pending?.target===false||(!menu.open&&!pending))return;$('summary',menu).click();}
$('.menu nav').addEventListener('click',event=>{if(narrow.matches&&event.target.closest('a'))closeMenu();});
addEventListener('keydown',event=>{if(event.key==='Escape'&&narrow.matches&&menu.open&&!$('dialog[open]')){closeMenu();$('[data-menu-toggle]').focus();}});
// Finite, initial-HTML catalog with IME-safe search and shareable filter state.
let category='Все',composing=false;
const search=$('[data-search]'),cards=$$('[data-product-card]');
const filterMotion = window.ArtTimeFilterMotion.create(cards, {isPaused: () => paused});
function filterCatalog(writeURL=true){
  const filterSnapshot = writeURL ? filterMotion.capture() : null;
  const query=search.value.trim().toLocaleLowerCase('ru');
  let count=0;
  cards.forEach(card=>{const item=data.catalog.find(x=>x.id===card.dataset.id);const matches=(category==='Все'||item.category===category)&&[item.title,item.category,item.description,item.specification].join(' ').toLocaleLowerCase('ru').includes(query);card.hidden=!matches;if(matches)count++;});
  $$('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
  $('.catalog-empty').hidden=count>0;text('.catalog-status',`${count} ${count===1?'предмет':count>1&&count<5?'предмета':'предметов'}`);
  if(writeURL){const url=new URL(location.href);if(category==='Все')url.searchParams.delete('category');else url.searchParams.set('category',category);if(query)url.searchParams.set('q',search.value.trim());else url.searchParams.delete('q');history.replaceState(null,'',url);}
  filterMotion.play(filterSnapshot);
  queueMotion();
}
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filterCatalog();}));
search.addEventListener('compositionstart',()=>{composing=true;});search.addEventListener('compositionend',()=>{composing=false;filterCatalog();});search.addEventListener('input',()=>{if(!composing)filterCatalog();});
$('[data-search-clear]').addEventListener('click',()=>{search.value='';filterCatalog();search.focus();});
$('[data-filter-reset]').addEventListener('click',()=>{category='Все';search.value='';filterCatalog();search.focus();});
const params=new URL(location.href).searchParams;
if($$('[data-filter]').some(b=>b.dataset.filter===params.get('category')))category=params.get('category');search.value=params.get('q')||'';filterCatalog(false);
const galleryDialog=$('#gallery-dialog');let galleryIndex=0;
function renderGallery(){const item=data.gallery[galleryIndex];const img=$('#gallery-image');img.src=item.image;img.alt=item.title;img.width=item.width;img.height=item.height;text('#gallery-title',item.title);text('#gallery-description',item.description);text('#gallery-count',`${galleryIndex+1} / ${data.gallery.length} · ${galleryIndex<5?'Наполнение интерьера':'Интерьерный пример'}`);}
$$('[data-gallery]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();galleryIndex=Number(button.dataset.gallery);renderGallery();openDialog(galleryDialog,button);}));
$('[data-gallery-prev]').addEventListener('click',()=>{galleryIndex=(galleryIndex+data.gallery.length-1)%data.gallery.length;motion.swap($('#gallery-image'),renderGallery,-1,narrow.matches?340:430);});
$('[data-gallery-next]').addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%data.gallery.length;motion.swap($('#gallery-image'),renderGallery,1,narrow.matches?340:430);});
galleryDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')$('[data-gallery-prev]').click();if(event.key==='ArrowRight')$('[data-gallery-next]').click();});
// Editable inquiry stays local. TXT and clipboard use the edited draft verbatim.
$('#request-form').addEventListener('submit',event=>{
  event.preventDefault();let firstInvalid=null;
  [['request-name','name-error','Укажите ваше имя.'],['request-contact','contact-error','Укажите телефон или контакт для связи.']].forEach(([id,error,message])=>{const input=document.getElementById(id);const invalid=!input.value.trim();input.setAttribute('aria-invalid',String(invalid));document.getElementById(error).textContent=invalid?message:'';if(invalid&&!firstInvalid)firstInvalid=input;});
  if(firstInvalid){firstInvalid.focus();text('.request-status','Заполните имя и контакт для связи.');return;}
  const name=$('#request-name').value.trim(),contact=$('#request-contact').value.trim(),object=$('#request-object').value.trim(),message=$('#request-message').value.trim();
  $('#request-text').value=`Здравствуйте, Art Time!\n\nМеня зовут ${name}.\nКонтакт: ${contact}\n${object?`Комната или предмет: ${object}\n`:''}${message?`\nМоя задача: ${message}\n`:''}\nХочу обсудить подбор, стоимость и наличие.`;
  $('.request-draft').hidden=false;text('.request-status','Текст подготовлен. Вы можете его изменить, скопировать или скачать.');$('#request-text').focus();
});
$('[data-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#request-text').value);text('.request-status','Текст скопирован. Передайте его Art Time в Instagram.');}catch{$('#request-text').focus();$('#request-text').select();text('.request-status','Автоматическое копирование недоступно. Текст выделен — скопируйте его вручную или скачайте TXT.');}});
$('[data-download]').addEventListener('click',()=>{const blob=new Blob(['\uFEFF'+$('#request-text').value],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='art-time-request.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);text('.request-status','TXT скачан. Текст сохранён с вашими правками.');});
})();
