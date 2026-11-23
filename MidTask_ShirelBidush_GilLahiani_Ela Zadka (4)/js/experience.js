(() => {
 'use strict';
 // The full glossary is the single source of definitions for inline explanations.
 const definitions = new Map(Array.from(document.querySelectorAll('#glossary-dialog dt[data-term-key]'), term => [term.dataset.termKey, { title: term.textContent, definition: term.nextElementSibling.textContent }]));
 const popover = document.getElementById('term-popover');
 const title = document.getElementById('term-title');
 const definition = document.getElementById('term-definition');
 let activeTrigger = null;
 function positionTerm() {
  if (!activeTrigger || popover.hidden) return;
  const rect = activeTrigger.getBoundingClientRect();
  const box = popover.getBoundingClientRect();
  const width = window.innerWidth || 1024;
  const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom + 8;
  const left = Math.max(12, Math.min(rect.right - box.width, width - box.width - 12));
  const below = rect.bottom + 10;
  const top = below + box.height <= window.innerHeight - 12 ? below : Math.max(headerBottom, rect.top - box.height - 10);
  popover.style.left = `${left}px`;
  popover.style.top = `${Math.max(12, top)}px`;
  popover.style.maxHeight = `${Math.max(80, window.innerHeight - Math.max(12, top) - 12)}px`;
 }
 function closeTerm(restoreFocus = true) {
  if (!activeTrigger) return;
  const previous = activeTrigger;
  activeTrigger = null;
  previous.setAttribute('aria-expanded', 'false');
  popover.hidden = true;
  if (restoreFocus && previous.isConnected) previous.focus({ preventScroll: true });
 }
 document.addEventListener('click', event => {
  const trigger = event.target.closest?.('button[data-term]');
  if (trigger) {
   if (trigger === activeTrigger) { closeTerm(); return; }
   const term = definitions.get(trigger.dataset.term);
   if (!term) return;
   closeTerm(false);
   activeTrigger = trigger;
   title.textContent = term.title;
   definition.textContent = term.definition;
   trigger.setAttribute('aria-expanded', 'true');
   popover.hidden = false;
   positionTerm();
   popover.focus({ preventScroll: true });
  } else if (activeTrigger && !popover.contains(event.target)) closeTerm(false);
 });
 document.getElementById('close-term').addEventListener('click', () => closeTerm());
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeTrigger) { event.preventDefault(); closeTerm(); }
 });
 document.addEventListener('ichilov:routechange', () => closeTerm(false));
 document.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', () => closeTerm(false));
  tab.addEventListener('keydown', event => {
   if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) closeTerm(false);
  });
 });
 window.addEventListener('resize', positionTerm);
 window.addEventListener('scroll', positionTerm, { passive: true });

 // Scroll progress drives the checkpoints. Navigation stays native and untimed.
 const transitions = Array.from(document.querySelectorAll('.checkin-transition'));
 let bridgeFrame = 0;
 function updateBridges() {
  bridgeFrame = 0;
  const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
  transitions.forEach(element => {
   const rect = element.getBoundingClientRect();
   if (rect.bottom < 0 || rect.top > window.innerHeight) return;
   const reduced = motionPreference.matches || document.body.classList.contains('reduced-motion');
   const progress = reduced ? 1 : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / Math.max(1, window.innerHeight - headerHeight)));
   element.style.setProperty('--bridge-progress', progress.toFixed(3));
  });
 }
 function queueBridges() { if (!bridgeFrame) bridgeFrame = window.requestAnimationFrame(updateBridges); }
 window.addEventListener('scroll', queueBridges, { passive: true });
 window.addEventListener('resize', queueBridges);
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   entry.target.classList.toggle('is-active', entry.isIntersecting);
   if (entry.isIntersecting) queueBridges();
  }), { threshold: .6 });
  transitions.forEach(element => observer.observe(element));
 } else transitions.forEach(element => element.classList.add('is-active'));
 queueBridges();

 // Store only presentation preferences locally. LMS state remains authoritative.
 const motionControl = document.getElementById('reduce-motion');
 const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
 let manualMotion = false;
 try { manualMotion = localStorage.getItem('ichilov-reduced-motion') === 'true'; } catch { /* Optional preference storage. */ }
 motionControl.checked = manualMotion || motionPreference.matches;
 document.body.classList.toggle('reduced-motion', motionControl.checked);
 motionControl.addEventListener('change', () => {
  try { localStorage.setItem('ichilov-reduced-motion', String(motionControl.checked)); } catch { /* Optional preference storage. */ }
  queueBridges();
 });
 motionPreference.addEventListener?.('change', event => {
  if (event.matches) { motionControl.checked = true; document.body.classList.add('reduced-motion'); queueBridges(); }
 });
})();

(() => {
 'use strict';
 // Fictional practice encounters; no personal data or assessment score is collected.
 const cases = [
  {
   label: 'קושי בקריאה', speaker: 'עדינה',
   quote: 'הכתב קטן לי. אני לא מצליחה לקרוא מה כתוב כאן.',
   context: 'עדינה מבקשת עזרה בקריאת ההודעה שעל המסך.',
   principle: 'מבררים איזו עזרה מתאימה, בלי לקחת את השליטה.',
   options: [
    { text: 'אני אלחץ במקומך, כדי שתוכלי לסיים מהר.', reply: 'אבל אני רוצה להבין מה אני מאשרת.', feedback: 'הביצוע במקומה אינו עונה על הקושי בקריאה. הציעו דרך שתאפשר לה להבין ולהשתתף.' },
    { text: 'תרצי שאקרא איתך את ההודעה, ואז נבדוק יחד מה לעשות?', reply: 'כן, תקראי איתי. אחר כך אנסה בעצמי.', feedback: 'התאמתם את הסיוע לקושי שהוצג והשארתם לעדינה אפשרות להשתתף.', correct: true },
    { text: 'כל ההוראות כתובות על המסך. נסי לקרוא שוב.', reply: 'אני עדיין לא מצליחה לקרוא את הכתב.', feedback: 'חזרה על אותה הנחיה אינה מסייעת כשהטקסט אינו קריא למטופלת. שאלו מה יעזור לה.' }
   ]
  },
  {
   label: 'המלווה עונה במקומו', speaker: 'אורי',
   quote: 'אני יכול לענות בעצמי, רק תסבירו לי מה צריך.',
   context: 'המלווה של אורי עונה על השאלות לפני שאורי מספיק להגיב.',
   principle: 'פונים למטופל ומבררים איך הוא רוצה לשלב את המלווה.',
   options: [
    { text: 'אורי, איזו עזרה תתאים לך, ותרצה שגם המלווה ישתתף?', reply: 'תסבירו לי קודם. אם אצטרך, אבקש ממנו לעזור.', feedback: 'פניתם לאורי עצמו ואפשרתם לו לבחור את מידת המעורבות של המלווה.', correct: true },
    { text: 'נמשיך עם המלווה, כי הוא כבר התחיל לענות.', reply: 'אבל אני כאן ורוצה להבין מה קורה.', feedback: 'נוכחות מלווה אינה מחליפה פנייה למטופל. בדקו עם אורי איך הוא רוצה לקבל עזרה.' },
    { text: 'המלווה לא יכול להשתתף. תצטרך להסתדר לבד.', reply: 'דווקא ארצה שהוא יעזור אם אתקע.', feedback: 'אפשר לשמור על עצמאות המטופל וגם לאפשר סיוע לפי רצונו, בהתאם לנהלי המקום.' }
   ]
  },
  {
   label: 'לחץ ועומס בקבלה', speaker: 'נועם',
   quote: 'התור שלי כבר התחיל. אני חייב להיכנס עכשיו!',
   context: 'יש עומס בקבלה, ונועם מודאג שיאחר לביקור.',
   principle: 'מכירים בדאגה ומציעים צעד ברור, בלי להבטיח זמן כניסה.',
   options: [
    { text: 'אין מה לדאוג, אני מבטיחה שתיכנס מיד.', reply: 'אז אני יכול כבר ללכת לחדר הרופא?', feedback: 'הבטחה לזמן כניסה יוצרת ציפייה שאינה בשליטתכם. הציעו בירור מעשי של המצב.' },
    { text: 'כולם מחכים. חכה עד שיקראו לך.', reply: 'אבל עוד לא הבנתי אם הקבלה שלי הושלמה.', feedback: 'לפני שמפנים להמתנה צריך להבין מה מצב התהליך ולתת הנחיית המשך ברורה.' },
    { text: 'אני מבינה את הדאגה. נבדוק מה מופיע במסך ומה הצעד הבא.', reply: 'בסדר, בואי נבדוק מה עוד צריך לעשות.', feedback: 'הכרתם בדאגה והצעתם פעולה ממוקדת, בלי להבטיח דבר שטרם נבדק.', correct: true }
   ]
  }
 ];
 const root = document.getElementById('encounter-practice');
 const progress = document.getElementById('encounter-progress');
 const buttons = Array.from(document.querySelectorAll('[data-encounter]'));
 const status = document.getElementById('encounter-status');
 let active = 0;
 let selections = cases.map(() => null);
 function render() {
  const item = cases[active];
  const selected = selections[active];
  const response = selected === null ? null : item.options[selected];
  const complete = cases.filter((item, i) => item.options[selections[i]]?.correct).length;
  progress.textContent = `${complete} מתוך 3 מפגשים תורגלו בהצלחה`;
  buttons.forEach((button, i) => {
   button.setAttribute('aria-pressed', String(i === active));
   button.classList.toggle('is-complete', Boolean(cases[i].options[selections[i]]?.correct));
   button.querySelector('.encounter-complete').hidden = !cases[i].options[selections[i]]?.correct;
  });
  root.innerHTML = `<div class="encounter-patient"><p class="encounter-label">במפגש עם ${item.speaker}</p><blockquote>״&#8288;${item.quote}&#8288;״</blockquote><p>${item.context}</p><div class="encounter-principle"><span>העיקרון במפגש</span><p>${item.principle}</p></div></div>
   <div class="encounter-response"><h3 id="encounter-question">איך תגיבו?</h3><div class="encounter-options" role="group" aria-labelledby="encounter-question">${item.options.map((option, i) => `<button type="button" class="encounter-option" data-encounter-answer="${i}" aria-pressed="${selected === i}"><span class="encounter-choice-mark" aria-hidden="true"></span><span>${option.text}</span></button>`).join('')}</div>
   <div id="encounter-feedback" class="encounter-feedback${response?.correct ? ' is-helpful' : ''}"${response ? '' : ' hidden'}>${response ? `<p class="encounter-feedback-label">${response.correct ? 'בחירה מתאימה' : 'כדאי לנסות ניסוח אחר'}</p><p class="encounter-reply"><strong>${item.speaker}:</strong> ״&#8288;${response.reply}&#8288;״</p><p>${response.feedback}</p>` : ''}</div></div>`;
  root.querySelectorAll('[data-encounter-answer]').forEach(button => button.addEventListener('click', () => {
   const index = Number(button.dataset.encounterAnswer);
   selections[active] = index;
   render();
   // Preserve keyboard position when updating the response and announce the result once.
   root.querySelector(`[data-encounter-answer="${index}"]`).focus({ preventScroll: true });
   const option = item.options[index];
   status.textContent = `${option.correct ? 'בחירה מתאימה.' : 'כדאי לנסות ניסוח אחר.'} ${item.speaker}: ${option.reply} ${option.feedback}`;
  }));
 }
 buttons.forEach((button, i) => button.addEventListener('click', () => {
  active = i;
  status.textContent = '';
  render();
 }));
 document.getElementById('encounter-reset').addEventListener('click', () => {
  selections = cases.map(() => null);
  active = 0;
  render();
  buttons[0].focus({ preventScroll: true });
  status.textContent = 'המפגשים אופסו. אפשר להתנסות מחדש.';
 });
 document.addEventListener('ichilov:routechange', () => {
  selections = cases.map(() => null);
  active = 0;
  status.textContent = '';
  render();
 });
 render();
})();
