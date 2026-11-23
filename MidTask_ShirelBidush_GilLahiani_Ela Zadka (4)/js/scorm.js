(() => {
 'use strict';
 const api = window.pipwerks?.SCORM;
 const offline = document.getElementById('scorm-notice');
 const warning = document.getElementById('lms-save-notice');
 let connected = false, readOnly = false, route = null, savedRoute = null, lastSubmission = null, pendingRoute = null, pendingAssessment = null;
 let state = {};
 const routes = ['first', 'refresher'];
 const validSize = value => [100, 125, 150].includes(Number(value));
 const safely = (fn, fallback = false) => { try { return fn(); } catch { return fallback; } };
 const get = key => safely(() => api.get(key), '');
 const set = (key, value) => safely(() => api.set(key, String(value))) === true;
 const save = () => safely(() => api.save()) === true;
 function notify(ok) {
  if (warning) { warning.hidden = ok; warning.textContent = ok ? '' : 'לא ניתן לאשר שמירה במערכת הלמידה. אפשר להמשיך ולנסות שוב; אין לסגור את היחידה לפני בדיקת השמירה.'; }
 }
 if (api) {
  api.version = '1.2';
  // The application owns completion and exit so review mode stays read-only.
  api.handleCompletionStatus = false;
  api.handleExitMode = false;
  connected = safely(() => api.init()) === true;
 }
 if (offline) offline.hidden = connected;
 if (connected) {
  readOnly = ['review', 'browse'].includes(get('cmi.core.lesson_mode'));
  const raw = get('cmi.suspend_data');
  try { const parsed = JSON.parse(raw || '{}'); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) state = parsed; } catch { state = {}; }
  const name = get('cmi.core.student_name');
  if (typeof name === 'string' && name.trim()) {
   const parts = name.split(',');
   const display = parts.length > 1 ? [parts.slice(1).join(',').trim(), parts[0].trim()].filter(Boolean).join(' ') : name.trim();
   document.getElementById('learner-greeting').textContent = 'שלום ' + display + '!';
  }
  if (!readOnly && ['not attempted', 'unknown', ''].includes(get('cmi.core.lesson_status'))) {
   notify(set('cmi.core.lesson_status', 'incomplete') && save());
  }
 }
 function preferences() {
  const data = state.ichilov || {};
  return { route: routes.includes(data.route) ? data.route : null, textSize: validSize(data.textSize) ? Number(data.textSize) : 100 };
 }
 function persistPreferences(data) {
  state.ichilov = { ...state.ichilov, ...data };
  if (!connected || readOnly) return null;
  const encoded = JSON.stringify(state);
  if (encoded.length > 4096) { notify(false); return false; }
  const success = set('cmi.suspend_data', encoded) && save();
  notify(success); return success;
 }
 function count() {
  const value = get('cmi.interactions._count');
  return /^\d+$/.test(String(value)) ? Number(value) : null;
 }
 function reportRoute(value) {
  if (!routes.includes(value)) return false;
  if (route !== value) { lastSubmission = null; pendingAssessment = null; }
  route = value;
  if (!connected || readOnly) { state.ichilov = { ...state.ichilov, route }; return null; }
  if (savedRoute === route) return persistPreferences({ route });
  if (!pendingRoute || pendingRoute.route !== route) {
   const index = count(); if (index === null) { notify(false); return false; }
   pendingRoute = { route, index };
  }
  const prefix = `cmi.interactions.${pendingRoute.index}.`;
  let ok = true;
  const write = (key, value) => { if (!set(key, value)) ok = false; };
  write(prefix + 'id', 'ichilov_route_' + route);
  write(prefix + 'type', 'choice');
  write(prefix + 'student_response', route === 'first' ? 'a' : 'b');
  write(prefix + 'weighting', 0);
  write(prefix + 'result', 'neutral');
  write('cmi.core.lesson_location', 'route:' + route);
  state.ichilov = { ...state.ichilov, route };
  write('cmi.suspend_data', JSON.stringify(state));
  // Commit the route before any assessment interaction is allowed to be written.
  const committed = save();
  ok = ok && committed;
  if (ok) { savedRoute = route; pendingRoute = null; }
  notify(ok); return ok;
 }
 window.ichilovSession = {
  connected, readOnly, preferences,
  chooseRoute: reportRoute,
  saveTextSize: value => validSize(value) ? persistPreferences({ textSize: Number(value) }) : false
 };
 window.reportIchilovAssessment = (questions, selections, scores, total) => {
  if (!connected || readOnly) return null;
  if (!routes.includes(route)) return false;
  if (savedRoute !== route && reportRoute(route) !== true) return false;
  if (questions.length !== 4 || selections.length !== 4 || scores.length !== 4 || !Number.isFinite(total) || total < 0 || total > 100) return false;
  const signature = JSON.stringify({ route, questionIds: questions.map(question => question.id), selections });
  if (signature === lastSubmission) return true;
  if (!pendingAssessment || pendingAssessment.signature !== signature) {
   const index = count(); if (index === null) return false;
   pendingAssessment = { signature, index };
  }
  const letters = values => values.map(value => 'abcd'[value]).join(',');
  let ok = true;
  const write = (key, value) => { if (!set(key, value)) ok = false; };
  questions.forEach((question, i) => {
   const prefix = `cmi.interactions.${pendingAssessment.index + i}.`;
   write(prefix + 'id', `ichilov_${route}_${question.id || 'q' + (i + 1)}`);
   write(prefix + 'type', 'choice');
   write(prefix + 'student_response', letters(selections[i]));
   write(prefix + 'correct_responses.0.pattern', letters(question.correct));
   write(prefix + 'weighting', 25);
   write(prefix + 'result', scores[i] === 25 ? 'correct' : scores[i] === 0 ? 'wrong' : scores[i] / 25);
  });
  // An interaction failure must never be followed by a success status.
  if (ok) {
   write('cmi.core.score.min', 0); write('cmi.core.score.max', 100); write('cmi.core.score.raw', total);
   if (ok) write('cmi.core.lesson_status', total >= 75 ? 'passed' : 'failed');
  }
  const committed = save(); ok = ok && committed;
  if (ok) { lastSubmission = signature; pendingAssessment = null; }
  notify(ok); return ok;
 };
 window.addEventListener('pagehide', event => {
  if (event.persisted || !connected) return;
  if (!readOnly) set('cmi.core.exit', ['passed', 'completed'].includes(get('cmi.core.lesson_status')) ? '' : 'suspend');
  safely(() => api.quit()); connected = false;
 });
})();
