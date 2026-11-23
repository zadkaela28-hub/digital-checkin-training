(() => {
 'use strict';
 const session = window.ichilovSession;
 const main = document.getElementById('main');
 const status = document.getElementById('route-choice-status');
 const continueLink = document.getElementById('route-continue');
 const links = Array.from(document.querySelectorAll('.nav-links a, .hero-actions a, .skip-link[href="#main"]'));
 const radios = Array.from(document.querySelectorAll('input[name="learning-route"]'));
 const storeKey = 'ichilov-learning-preferences-v1';
 let local = {};
 try { local = JSON.parse(localStorage.getItem(storeKey) || sessionStorage.getItem(storeKey) || '{}'); } catch { local = {}; }
 const initial = session?.connected ? session.preferences() : local;
 let selectedRoute = null, activeRoute = null, learningStarted = false, textSize = 100;
 function storeLocal() { try { localStorage.setItem(storeKey, JSON.stringify({ route: selectedRoute, textSize })); } catch { /* Learning remains available if browser storage is blocked. */ } }
 function applyTextSize(value, report = false) {
  textSize = [100, 125, 150].includes(Number(value)) ? Number(value) : 100;
  document.documentElement.style.fontSize = `${textSize}%`;
  document.querySelectorAll('[data-text-size]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.textSize) === textSize)));
  document.getElementById('text-size-status').textContent = textSize === 100 ? 'הטקסט הוחזר לגודל הרגיל' : `גודל הטקסט ${textSize} אחוזים`;
  storeLocal();
  if (report) session?.saveTextSize(textSize);
 }
 function chooseRoute(value) {
  if (!['first', 'refresher'].includes(value) || value === selectedRoute) return;
  selectedRoute = value;
  learningStarted = false;
  main.hidden = true;
  links.forEach(link => link.setAttribute('aria-disabled', 'true'));
  radios.forEach(radio => { radio.checked = radio.value === value; });
  status.textContent = '';
  continueLink.hidden = false;
  continueLink.textContent = value === 'first' ? 'ממשיכים ללמידה הראשונה' : 'ממשיכים לריענון';
  storeLocal();
 }
 function startLearning(event) {
  if (!['first', 'refresher'].includes(selectedRoute)) {
   event.preventDefault();
   status.textContent = 'בחרו למידה ראשונה או ריענון כדי להתחיל.';
   document.getElementById('route-choice-heading').focus();
   return;
  }
  const routeChanged = activeRoute !== selectedRoute;
  activeRoute = selectedRoute;
  learningStarted = true;
  main.hidden = false;
  links.forEach(link => link.removeAttribute('aria-disabled'));
  status.textContent = '';
  document.querySelectorAll('[data-route-content]').forEach(element => { element.hidden = element.dataset.routeContent !== activeRoute; });
  document.querySelector('.hero-actions a').textContent = activeRoute === 'first' ? 'מתחילים ללמוד' : 'מתחילים ריענון';
  // Only a confirmed route may reset the lesson or be reported to the LMS.
  if (routeChanged) {
   session?.chooseRoute(activeRoute);
   document.dispatchEvent(new CustomEvent('ichilov:routechange', { detail: { route: activeRoute } }));
  }
  storeLocal();
 }
 window.ichilovLearning = { get route() { return learningStarted ? activeRoute : null; }, get textSize() { return textSize; } };
 main.hidden = true;
 links.forEach(link => {
  link.setAttribute('aria-disabled', 'true');
  link.addEventListener('click', event => {
   if (learningStarted) return;
   event.preventDefault();
   status.textContent = selectedRoute ? 'לחצו על כפתור ההמשך כדי לפתוח את הלמידה.' : 'בחרו למידה ראשונה או ריענון כדי להתחיל.';
   (selectedRoute ? continueLink : document.getElementById('route-choice-heading')).focus();
  });
 });
 radios.forEach(radio => radio.addEventListener('change', () => { if (radio.checked) chooseRoute(radio.value); }));
 continueLink.addEventListener('click', startLearning);
 document.querySelectorAll('[data-text-size]').forEach(button => button.addEventListener('click', () => applyTextSize(button.dataset.textSize, true)));
 applyTextSize(initial?.textSize);
 // Every new opening offers First Learning; saved text size still applies.
 // Continue remains required before revealing content or reporting a route.
 chooseRoute('first');
 const glossary = document.getElementById('glossary-dialog');
 const opener = document.getElementById('open-glossary');
 opener.addEventListener('click', () => {
  if (glossary.open) return;
  glossary.showModal();
  // The closing button must not autofocus the scrollable dialog to its bottom.
  document.getElementById('glossary-title').focus({ preventScroll: true });
  glossary.scrollTop = 0;
 });
 glossary.addEventListener('click', event => { if (event.target === glossary) { const r = glossary.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) glossary.close(); } });
 glossary.addEventListener('close', () => opener.focus({ preventScroll: true }));
})();
