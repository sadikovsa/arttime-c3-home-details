/* Finite, interruptible motion. Native semantics and state never wait. */
(() => {
 'use strict';
 window.ArtTimeMotion = {
  create(allowed) {
   const active = new Map(), images = new WeakMap(), closes = new WeakMap();
   const cancel = owner => {const entry=active.get(owner);if(entry){active.delete(owner);entry.a.cancel();entry.cleanup();}};
   const run = (owner,frames,duration,cleanup=()=>{},finish=()=>{},settings={}) => {
    cancel(owner);if(!allowed()){cleanup();finish();return;}
    const a=owner.animate(frames,{duration,easing:'cubic-bezier(.16,1,.3,1)',fill:'both',...settings});const e={a,cleanup,finish};active.set(owner,e);
    a.onfinish=()=>{if(active.get(owner)!==e)return;active.delete(owner);a.cancel();cleanup();finish();};
   };
   const scope = element => {
    [...active.keys()].forEach(owner=>{if(owner===element||element.contains(owner))cancel(owner);});
    element.querySelectorAll('.motion-photo-exit,.motion-photo-transfer').forEach(n=>n.remove());
    element.querySelectorAll('img').forEach(i=>images.set(i,(images.get(i)||0)+1));
   };
   const settle = () => {[...active].forEach(([owner,e])=>{cancel(owner);e.finish();});document.querySelectorAll('.motion-photo-exit,.motion-photo-transfer,.sculpture-sheen').forEach(n=>n.remove());};
   const swap = (image,update,direction=1,duration=430) => {
    const parent=image.parentElement, painted=parent.querySelector('.motion-photo-exit')||image;
    const remembered=painted.complete&&painted.naturalWidth?painted.cloneNode(false):null, paintedSrc=painted.currentSrc;scope(parent);
    const version=(images.get(image)||0)+1;images.set(image,version);
    let old=null;
    if(allowed()&&remembered){
     parent.style.position='relative';const b=image.getBoundingClientRect(),p=parent.getBoundingClientRect();
     old=remembered;old.removeAttribute('id');old.removeAttribute('srcset');old.removeAttribute('sizes');old.removeAttribute('loading');old.src=paintedSrc;old.alt='';old.className='motion-photo-exit';old.setAttribute('aria-hidden','true');
     old.style.cssText=`position:absolute;left:${b.left-p.left}px;top:${b.top-p.top}px;width:${b.width}px;height:${b.height}px;object-fit:${getComputedStyle(image).objectFit};pointer-events:none;z-index:2`;
     parent.append(old);
    }
    update();
    const done=()=>{if(images.get(image)!==version)return;if(!allowed()||image.closest('dialog')&&!image.closest('dialog').open){old?.remove();return;}
     run(image,[{clipPath:`inset(0 ${direction<0?7:0}% 0 ${direction>0?7:0}%)`},{clipPath:'inset(0 0 0 0)'}],duration);
     if(old)run(old,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction*24}px)`}],190,()=>old.remove());
    };
    (image.decode?image.decode():Promise.resolve()).then(done,()=>{if(images.get(image)===version)old?.remove();});
   };
   const enter = (dialog,opener,axis='x') => {
    closes.set(dialog,(closes.get(dialog)||0)+1);scope(dialog);
    run(dialog,[{opacity:.82,transform:axis==='x'?'translateX(18px)':'translateY(16px)'},{opacity:1,transform:'translate(0,0)'}],260);
    const image=dialog.querySelector('img:not(.motion-photo-transfer)'),source=opener?.closest('[data-product-card],figure')?.querySelector('img');
    if(!image)return;
    run(image,[{clipPath:axis==='x'?'inset(0 6% 0 0)':'inset(5% 0 0 0)'},{clipPath:'inset(0 0 0 0)'}],380);
    if(!allowed()||!source?.complete||!source.naturalWidth)return;
    const from=source.getBoundingClientRect(),to=image.getBoundingClientRect(),box=dialog.getBoundingClientRect();if(!from.width||!to.width||from.top>innerHeight||from.bottom<0)return;
    const clone=source.cloneNode(false);clone.removeAttribute('id');clone.removeAttribute('srcset');clone.removeAttribute('sizes');clone.removeAttribute('loading');clone.alt='';clone.src=source.currentSrc;clone.className='motion-photo-transfer';clone.setAttribute('aria-hidden','true');
    clone.style.cssText=`position:absolute;left:${to.left-box.left-dialog.clientLeft}px;top:${to.top-box.top-dialog.clientTop+dialog.scrollTop}px;width:${to.width}px;height:${to.height}px;object-fit:contain;transform-origin:0 0;pointer-events:none;z-index:4`;
    dialog.append(clone);run(clone,[{transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`,opacity:.95},{transform:'translate(0,0) scale(1)',opacity:0}],380,()=>clone.remove());
   };
   const close = dialog => {if(!dialog.open)return;scope(dialog);const v=(closes.get(dialog)||0)+1;closes.set(dialog,v);run(dialog,[{opacity:1},{opacity:.35}],150,()=>{},()=>{if(closes.get(dialog)===v&&dialog.open)dialog.close();});};
   const bind = (pause,reduced) => {pause?.addEventListener('click',()=>queueMicrotask(()=>{if(!allowed())settle();}));reduced.addEventListener('change',()=>{if(!allowed())settle();});};
   return {run,cancel,scope,settle,swap,enter,close,bind};
  }
 };
})();
