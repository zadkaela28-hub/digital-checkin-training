"use strict";
// Shared data keeps rendering, scoring, and feedback consistent.
const practiceSteps = [
 {screen:"ברוכים הבאים לקבלה העצמית. יש להעביר כרטיס קופת חולים.",context:"דניאל הגיע למרפאה שבה השירות זמין. הוא נעצר מול העמדה ומבקש עזרה.",patient:"אני חושש ללחוץ על משהו לא נכון.",question:"איך תפתחו את השיחה?",options:["אעבור איתך על כל התהליך מראש, ואז תוכל להתחיל.","אפשר לעבור יחד על מה שמופיע במסך, בקצב שנוח לך.","עדיף שאבצע הכול במקומך כדי שלא תהיה טעות."],correct:1,feedback:["הסבר מלא מראש עשוי להעמיס. התחילו מהמסך הנוכחי והציעו פעולה אחת.","הצעתם לעבור יחד על הפעולה, בקצב שמתאים לדניאל.","שאלו איזו עזרה מתאימה לו ואפשרו לו להשתתף, במקום לבצע הכול במקומו."]},
 {screen:"נדרש בירור לפני המשך הרישום. יש לפנות לצוות הקבלה.",context:"כעת נקרא את התוצאה המוצגת ונחליט מה נכון לומר.",patient:"אז סיימתי ואפשר ללכת להמתין?",question:"מה נכון להשיב?",options:["הכרטיס כבר הועבר, אז אפשר לגשת להמתנה.","ננסה להעביר שוב את הכרטיס לפני שנפנה לצוות.","ההודעה מבקשת בירור. נבדוק מה נדרש לפני שנמשיך."],correct:2,feedback:["מעבר למסך אחר אינו אישור סיום. קראו את ההודעה ופעלו לפיה.","אין בהודעה הנחיה לניסיון נוסף. תחילה צריך להבין מה דורש בירור.","זיהיתם שהמצב לא הושלם והסברתם למטופל את הפעולה הבאה."]},
 {screen:"הרישום הושלם. המשך: המתנה באזור המופיע בהנחיות הביקור.",context:"זו תוצאה חלופית של התרגול, ולא הדגמה של פתרון הבירור הקודם.",patient:"מה עושים עכשיו?",question:"איך תסיימו את הסיוע?",options:["הפעולה הושלמה לפי ההודעה. נבדוק יחד לאן ההנחיה מפנה אותך.","הרישום הסתיים. אין עוד משהו שצריך לבדוק.","השלמת הרישום מבטיחה שתיכנס מיד."],correct:0,feedback:["חיברתם בין הודעת ההשלמה להכוונה מעשית, בלי להבטיח דבר שלא מופיע בה.","הודעת ההשלמה כוללת גם הנחיית המשך. כדי לסיים את הליווי צריך לוודא שהמטופל יודע לאן לפנות, ולא להסתפק באישור הרישום.","ההודעה אינה מבטיחה כניסה מיידית. חשוב לדייק בציפיות."]}
];
const baseQuestions = [
 {context:"מטופלת אומרת: אני לא מבינה מה צריך לעשות עכשיו.",title:"איזה הסבר מתאים ביותר?",options:["אקרא לך את כל ההוראות מההתחלה, גם את אלה שכבר ביצעת.","נבדוק יחד מה מופיע כרגע, ואז אסביר את הפעולה הבאה.","אני אבצע את הפעולות עבורך, וכך לא תצטרכי להתעסק בזה."],correct:[1],feedback:["הסבר חוזר על כל התהליך אינו מתמקד בקושי הנוכחי. התחילו מההודעה שמוצגת כעת והסבירו פעולה אחת שאפשר לבצע.","התחלתם מהמצב הנוכחי והצעתם צעד ברור ומותאם.","אפשר להציע עזרה בלי להניח שהמטופלת אינה יכולה להשתתף. שאלו מה יעזור לה."]},
 {context:"במסך ההדגמה כתוב: הפעולה טרם הושלמה. נדרש בירור. המטופל שואל אם אפשר להמשיך.",title:"אילו שתי פעולות מתאימות?",options:["להסביר שעדיין אין אישור סיום.","לסייע בבירור מול הגורם המתאים במרפאה.","לנסות שוב את אותה הפעולה ללא בדיקת סיבת ההודעה.","להפנות להמתנה משום שהכרטיס כבר הועבר."],correct:[0,1],full:"זיהיתם את הצורך להסביר את המצב וגם להמשיך בסיוע.",partial:["זיהיתם שהפעולה לא הושלמה. צריך גם לסייע בבירור.","בחרתם להמשיך בסיוע. חשוב גם להסביר למטופל מדוע נדרש בירור."],wrong:"המסך מציין מצב לא פתור. אין להבטיח השלמה או להנחות להתעלם."},
 {context:"העמדה עברה למסך אחר, אך אין הודעת השלמה או הנחיית המשך ברורה.",title:"מהי הבחירה המתאימה?",options:["לראות בשינוי המסך הוכחה לסיום.","להנחות להמתין לרופא ולברר רק אם לא יקראו לו.","לבדוק את המצב לפני שמכוונים את המטופל להמשך."],correct:[2],feedback:["אין עדיין מידע מספיק. בדקו והסבירו למטופל מה מבררים.","אין עדיין מידע מספיק. בדקו והסבירו למטופל מה מבררים.","הבחנתם בין שינוי חזותי לבין מידע שמאפשר לקבל החלטה."]},
 {context:"מטופלת אומרת שהיא מתקשה לקרוא את המסך ומבקשת עזרה.",title:"אילו שתי תגובות מסייעות לליווי מכבד?",options:["לשאול איזו עזרה תתאים לה.","להציע לעבור יחד על ההודעה במילים פשוטות.","לפנות מיד למלווה ולבקש שיבצע את התהליך במקומה.","לחזור על אותן הוראות בלי לברר מה מקשה עליה בקריאה."],correct:[0,1],full:"התייחסתם לבקשה והצעתם התאמה תוך שיתוף המטופלת.",partial:["בירור הצורך חשוב. אפשר להוסיף הצעה מעשית לעזרה בקריאה ובהבנה.","הצעתם סיוע מעשי. כדאי גם לשאול אם הוא מתאים למטופלת."],wrong:"פנו תחילה למטופלת ובררו מה יעזור לה. העברה אוטומטית למלווה או חזרה על הסבר שלא הובן אינן מבטיחות מענה לקושי בקריאה."}
];
const appliedQuestions = [
 {context:'מטופלת לוחצת שוב ושוב על אותה אפשרות ואומרת שההסבר הקודם לא עזר לה.',title:'איך תתאימו את ההסבר?',options:['אשאל מה לא היה ברור, וננסה פעולה אחת במילים אחרות.','אחזור על אותו הסבר מהר יותר.','אבצע את כל הפעולות בלי לשאול אותה.'],correct:[0],feedback:['שיניתם את ההסבר לפי הקושי ובחרתם צעד שאפשר לבדוק יחד.','חזרה מהירה על הסבר שלא הובן אינה מתאימה אותו לקושי.','קודם מבררים איזו עזרה המטופלת רוצה ומאפשרים לה להשתתף.']},
 {context:'המסך מבקש בירור. המטופל אומר שחיכה מספיק, והמלווה מציע להתעלם מההודעה.',title:'אילו שתי פעולות יאפשרו להתקדם?',options:['להפנות להמתנה כדי להפחית את הלחץ.','להסביר למטופל מה בהודעה עדיין דורש בירור.','לנסות שוב בלי לבדוק את משמעות ההודעה.','לסייע בפנייה לצוות המתאים במרפאה.'],correct:[1,3],full:'חיברתם בין הסבר המצב לבין סיוע מעשי בבירור.',partial:{1:'הסבר המצב חשוב; צריך גם לסייע בהגעה לגורם שיברר אותו.',3:'בחרתם בסיוע מעשי; הסבירו גם מדוע נדרש הבירור.'},wrong:'לחץ אינו אישור סיום. פועלים לפי ההודעה ומסייעים בבירור במקום להתעלם ממנה.'},
 {context:'הרישום הושלם. המטופלת שואלת אם היא יכולה להיכנס עכשיו לחדר הרופא, אך המסך מפנה לאזור המתנה.',title:'איך תסיימו את הליווי?',options:['אומר לה שהשלמת הרישום מבטיחה כניסה מיידית.','נקרא יחד את הנחיית ההמשך ונוודא שהיא יודעת לאן לפנות.','אסתפק באמירה שהרישום הסתיים.'],correct:[1],feedback:['הודעת ההשלמה אינה מבטיחה זמן כניסה.','קישרתם בין ההשלמה לבין ההכוונה המעשית, בלי הבטחה שאינה במסך.','סיום הליווי כולל גם הבנת הצעד הבא.']},
 {context:'מלווה עונה במקום המטופל, והמטופל מבקש להבין בעצמו מה צריך לעשות.',title:'אילו שתי תגובות מתאימות?',options:['לפנות למטופל ולשאול איזו עזרה תתאים לו.','להמשיך רק עם המלווה, כי הוא כבר התחיל.','לברר עם המטופל אם וכיצד ירצה שהמלווה ישתתף.','לבקש מהמלווה לעזוב בלי לברר את רצון המטופל.'],correct:[0,2],full:'שמרתם על פנייה למטופל ואפשרתם לו לבחור איך לשלב את המלווה.',partial:{0:'התחלתם בפנייה למטופל; בררו גם את רצונו בנוגע למלווה.',2:'ביררתם את מעורבות המלווה; חשוב גם להתאים את העזרה למטופל עצמו.'},wrong:'פנו למטופל ובדקו את העדפותיו לפני שקובעים מי ישתתף בליווי.'}
];
const complexQuestions = [
 {context:'בזמן עומס המטופלת אומרת שהסתדרה, אך מסבירה שצריך להעביר שוב כרטיס, בניגוד להודעת הבירור שבמסך.',title:'מה תעשו לפני שתסיימו את הסיוע?',options:['אסתפק בכך שאמרה שהבינה.','אבצע עבורה ניסיון נוסף כדי לחסוך זמן.','אברר את הפער בין מה שהבינה להודעה, ואז נבחר צעד אחד.'],correct:[2],feedback:['ההסבר שלה מצביע על פער בהבנה שעדיין דורש מענה.','ניסיון נוסף ללא בירור עלול לשמר את אי ההבנה.','בדקתם הבנה בפועל והתמקדתם בפער לפני שממשיכים.']},
 {context:'המטופל מפרש שינוי במסך כסיום. עמית מפנה אותו להמתנה, אף שאין אישור או הנחיית המשך ברורה.',title:'אילו שתי פעולות נחוצות כעת?',options:['לעצור את ההפניה ולהסביר שטרם התקבל אישור ברור.','להסכים עם העמית משום שהוא מנוסה.','לסייע בבדיקת המצב מול הגורם המתאים במרפאה.','לומר למטופל שימתין עד שיבחינו בבעיה.'],correct:[0,2],full:'זיהיתם את המידע החסר וחיברתם בין תיקון ההכוונה לבירור מעשי.',partial:{0:'תיקנתם את ההכוונה; נדרש גם סיוע בבדיקת המצב.',2:'פניתם לבירור; צריך גם להסביר למטופל מדוע ההפניה להמתנה מוקדמת.'},wrong:'לא מסתמכים על ביטחון של עמית או על שינוי חזותי בלבד. בודקים את המצב לפני הכוונה להמשך.'},
 {context:'מטופל אומר שאינו מצליח לקרוא את המסך. המלווה מבקש לבצע הכול בשבילו, אך המטופל רוצה להמשיך בעצמו.',title:'איזו דרך תתאים למצב?',options:['אציע לקרוא איתו את ההודעה ואבדוק איזו עזרה ירצה מהמלווה.','אעביר את כל הפעולה למלווה בלי לברר.','אדרוש שיסיים לבד כדי לשמור על עצמאותו.'],correct:[0],feedback:['התאמתם את הסיוע לקושי ושמרתם על הבחירה של המטופל.','המלווה אינו מחליף אוטומטית את רצון המטופל.','עצמאות אינה מחייבת היעדר עזרה. מציעים התאמה לפי הצורך.']},
 {context:'המטופלת מבקשת לברר פרט אישי מול העמדה. אנשים ממתינים בסמוך, והיא גם חוששת שלא תדע לאן ללכת אחר כך.',title:'אילו שתי פעולות ישלבו פרטיות והכוונה?',options:['לבקש שתגיד בקול את כל הפרטים כדי לסיים מהר.','להפנות לבירור במקום ובדרך המתאימים לפי נוהלי המרפאה.','להבטיח שהבירור יסתיים מיד.','לוודא שהיא יודעת למי לפנות ומה הצעד הבא.'],correct:[1,3],full:'שמרתם על בירור מתאים של מידע אישי ועל המשך ברור למטופלת.',partial:{1:'בחרתם דרך מתאימה לבירור; ודאו גם שהמטופלת מבינה לאן להמשיך.',3:'הכוונה ברורה חשובה; הקפידו גם על מקום ודרך מתאימים לבירור האישי.'},wrong:'לא מבררים מידע אישי בקול מול הממתינים ולא מבטיחים זמן טיפול שלא נבדק.'}
];
const experienceOptions = ['ללא ניסיון', 'ניסיון מועט', 'ניסיון שוטף', 'מעדיפ/ה לא לציין'];
function assessmentLevel(experience, confidence) {
 if (!experienceOptions.includes(experience) || !/^[1-5]$/.test(String(confidence))) return null;
 if (experience === 'ללא ניסיון' || Number(confidence) <= 2) return 'foundation';
 if (experience === 'ניסיון שוטף' && Number(confidence) >= 4) return 'complex';
 return 'applied';
}
function currentAssessmentLevel() {
 return assessmentLevel(document.getElementById('experience').value, document.getElementById('confidence').value);
}
let questions = [], renderedAssessmentKey = '';
function questionsForRoute(level = currentAssessmentLevel() || 'foundation') {
 const bank = { foundation: baseQuestions, applied: appliedQuestions, complex: complexQuestions }[level];
 const items = bank.map((item, i) => ({ ...item, id: level + '_q' + (i + 1) }));
 if (level !== 'foundation') {
  const refresher = window.ichilovLearning?.route === 'refresher';
  items[0].id = `${refresher ? 'refresher' : 'first'}_${items[0].id}`;
  if (refresher) items[0].context = level === 'applied' ? 'במשמרת עמוסה אתם מחליפים עמית. מטופלת אומרת שההסבר שקיבלה לא עזר ולוחצת שוב על אותה אפשרות.' : 'במשמרת עמוסה עמית כבר מסיים את הליווי. המטופלת אומרת שהבינה, אך מתארת פעולה שסותרת את הודעת הבירור במסך.';
  return items;
 }
 if (window.ichilovLearning?.route === 'refresher') {
  items[0] = { id: 'refresher_foundation_q1', context: 'במשמרת עמוסה המסך השתנה, אך אין אישור השלמה. עמית מציע להפנות את המטופל להמתנה ולהמשיך לבא בתור.', title: 'איך נכון לפעול גם כשיש לחץ בקבלה?', options: ['להפנות להמתנה כי הכרטיס כבר הועבר.', 'לקרוא את ההודעה ולברר עם צוות הקבלה לפני שמפנים להמתנה.', 'להעביר שוב את הכרטיס בלי לבדוק מה קרה.'], correct: [1], feedback: ['העברת הכרטיס אינה אישור סיום. גם כשיש עומס צריך לבדוק את התוצאה.', 'בחרתם לשמור על בדיקת המצב גם במשמרת עמוסה, ולהמשיך בסיוע לפני ההפניה.', 'ניסיון נוסף ללא בירור אינו מסביר את המצב. תחילה קוראים את ההודעה ומבררים מה נדרש.'] };
 } else {
  items[0] = { ...items[0], id: 'first_foundation_q1', context: 'עובדת חדשה מלווה מטופלת לראשונה. המטופלת אומרת שהיא אינה מבינה מה לעשות עכשיו.', title: 'באיזה הסבר כדאי להתחיל?' };
 }
 return items;
}
const $ = (selector) => document.querySelector(selector);
let quizPager = null;
const letters = ["א","ב","ג","ד"];
const answerMarkup = (options,name,multiple=false) => options.map((option,i)=>`<label class="answer"><input type="${multiple?"checkbox":"radio"}" id="${name}-${i}" name="${name}" value="${i}"><span>${letters[i]}. ${option}</span></label>`).join("");
let practiceIndex = 0;
function renderPractice(focus=false) {
 const step=practiceSteps[practiceIndex];
 $("#simulation").innerHTML=`<div class="simulation-step">
 <div class="practice-meta"><h3 class="step-label" id="practice-heading" tabindex="-1">שלב ${practiceIndex+1} מתוך 3</h3><p class="practice-context">${step.context}</p></div>
 <div class="clinic-stage" role="group" aria-label="מפגש עם דניאל מול עמדת הקבלה העצמית">
  <picture class="clinic-backdrop"><source media="(max-width: 991px)" srcset="assets/images/clinic-simulation-small.webp"><img class="clinic-photo" src="assets/images/clinic-simulation.webp" width="2172" height="724" alt="המחשה של דניאל משמאל ונציגת הקבלה מימין במרפאה, בפריים רחב" decoding="async"></picture>
  <div class="kiosk"><div class="kiosk-chassis"><div class="mock-screen"><div class="mock-toolbar"><p class="mock-label">קבלה עצמית / הדמיה</p><span class="kiosk-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/></svg></span></div><div class="screen-body"><div class="practice-track" aria-hidden="true">${practiceSteps.map((_,i)=>`<span class="${i<=practiceIndex?"filled":""}"></span>`).join("")}</div><span class="screen-status" aria-hidden="true">${["1","!","✓"][practiceIndex]}</span><h3>${step.screen}</h3></div></div><div class="kiosk-reader"><span class="kiosk-slot" aria-hidden="true"><span class="kiosk-card"></span></span><span>כרטיס קופת חולים</span></div></div><div class="kiosk-stem" aria-hidden="true"></div><div class="kiosk-foot" aria-hidden="true"></div></div>
  <span class="scene-label scene-label-staff">נציגת הקבלה</span>
  <p class="dialogue"><strong>דניאל:</strong><span>״${step.patient}״</span></p>
 </div>
 <p class="simulation-notice visually-hidden">הדמיה לתרגול בלבד, ללא הזנת מידע אישי.</p>
 <form id="practice-form"><fieldset><legend>${step.question}</legend><div class="practice-options">${answerMarkup(step.options,"practice")}</div></fieldset><div class="practice-controls"><div class="practice-actions"><button class="btn primary" type="submit">בודקים את הבחירה</button><button class="btn secondary" id="next-step" type="button" hidden>${practiceIndex===2?"סיום התרגול":"לשלב הבא"}</button></div><div id="practice-feedback" role="status" aria-live="polite" aria-atomic="true"></div></div></form></div>`;
 $("#practice-form").addEventListener("submit",event=>{
  event.preventDefault();const selected=$("input[name=practice]:checked");const output=$("#practice-feedback");
  const correct=selected && Number(selected.value)===step.correct;
  $(".clinic-stage").classList.toggle("is-confirmed", Boolean(correct));
  output.className=`feedback ${correct?"success":"error"}`;
  output.textContent=selected?`${correct?"נכון. ":"כדאי לנסות שוב. "}${step.feedback[Number(selected.value)]}`:"בחרו תגובה לפני הבדיקה.";
  $("#next-step").hidden=!correct;
 });
 $("#practice-form").addEventListener("change",()=>{$("#next-step").hidden=true;$("#practice-feedback").textContent="";$("#practice-feedback").className="";$(".clinic-stage").classList.remove("is-confirmed");});
 $("#next-step").addEventListener("click",()=>{
  if(practiceIndex<2){practiceIndex++;renderPractice(true);}else{
   $("#simulation").innerHTML='<div class="practice-complete"><span class="complete-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span><h3 tabindex="-1" id="practice-heading">סיימתם את התרגול</h3><p>הצעתם עזרה, זיהיתם מצב לא פתור וסיימתם בהכוונה ברורה.</p><button class="btn secondary" id="restart-practice" type="button">לתרגול חוזר</button> <a class="btn primary" href="#assessment">להערכת הלמידה</a></div>';
   $("#restart-practice").addEventListener("click",()=>{practiceIndex=0;renderPractice(true);});$("#practice-heading").focus();
  }
 });
 if(focus)$("#practice-heading").focus();
}
function renderAssessmentQuestions() {
 questions = questionsForRoute();
 renderedAssessmentKey = `${window.ichilovLearning?.route || 'first'}:${currentAssessmentLevel() || 'foundation'}`;
$("#questions").innerHTML=questions.map((q,i)=>`<fieldset class="question" tabindex="-1" id="question-${i}" aria-describedby="context-${i} question-error-${i}"><legend>${i+1}. ${q.title}</legend><p class="question-context" id="context-${i}">${q.context}</p><p class="help">${q.correct.length===2?"רב ברירה: סמנו שתי תשובות. בחירה אחת תיבדק כחלקית.":"חד ברירה: בחרו תשובה אחת."}</p><div class="question-grid"><div class="question-answers">${answerMarkup(q.options,`q${i}`,q.correct.length===2)}</div><div id="question-feedback-${i}" hidden></div></div><p class="field-error" id="question-error-${i}"></p></fieldset>`).join("");
document.querySelectorAll("#questions input").forEach(input => {
 const index = input.name.slice(1);
 input.setAttribute("aria-describedby", `context-${index} question-error-${index}`);
});

}
renderAssessmentQuestions();

function scoreAnswer(question,selected){
 if(question.correct.length===1){const score=question.correct.includes(selected[0])?25:0;return{score,text:question.feedback[selected[0]]};}
 const hits=selected.filter(value=>question.correct.includes(value));const misses=selected.length-hits.length;
 const score=Math.max(0,(hits.length-misses)*12.5);
 const text=score===25?question.full:misses?`${hits.length?"חלק מהבחירות מתאימות, אך נבחרה גם תגובה שאינה מתאימה. ":""}${question.wrong}`:question.partial[hits[0]];
 return {score,text};
}
function clearQuizFeedback(){
 quizPager?.invalidate();
 $("#error-summary").hidden=true;$("#quiz-result").hidden=true;
 document.querySelectorAll(".field-error").forEach(el=>el.textContent="");
 document.querySelectorAll("[aria-invalid]").forEach(el=>el.removeAttribute("aria-invalid"));
 questions.forEach((q,i)=>{$(`#question-feedback-${i}`).hidden=true;});
}
function profileErrors() {
 const errors = [];
 for (const [id, valid, text] of [
  ['experience', experienceOptions.includes($('#experience').value), 'בחרו אפשרות בשדה הניסיון. אפשר לבחור גם לא לציין.'],
  ['confidence', /^[1-5]$/.test($('#confidence').value), 'בחרו רמת ביטחון בין 1 ל־5.']
 ]) {
  if (valid) continue;
  $(`#${id}-error`).textContent = text;
  $(`#${id}`).setAttribute('aria-invalid', 'true');
  errors.push({ target: id, text });
 }
 return errors;
}
function showQuizErrors(errors) {
 const box = $('#error-summary');
 box.innerHTML = '<h3>לפני הבדיקה יש להשלים או לתקן:</h3><ul>' + errors.map(e => `<li><a href="#${e.target}">${e.text}</a></li>`).join('') + '</ul>';
 box.hidden = false;
 quizPager?.showField(errors[0].target);
 box.focus();
}
function syncProfileQuestions() {
 const level = currentAssessmentLevel();
 const descriptions = { foundation: 'השאלות יתמקדו בצעדי הליווי הבסיסיים.', applied: 'השאלות יתמקדו בהתאמת הליווי למצבים משתנים.', complex: 'השאלות ישלבו כמה שיקולים במצבי ליווי מורכבים.' };
 $('#assessment-adaptation').textContent = level ? descriptions[level] : 'השאלות יותאמו לניסיון ולרמת הביטחון שתבחרו.';
 if (!level || renderedAssessmentKey === `${window.ichilovLearning?.route || 'first'}:${level}`) return false;
 quizPager = null;
 renderAssessmentQuestions();
 clearQuizFeedback();
 $('#quiz-result').textContent = '';
 $('#error-summary').textContent = '';
 setupQuizPager();
 return true;
}
$("#quiz").addEventListener("submit",event=>{
 event.preventDefault();
 if (!window.ichilovLearning?.route) { document.getElementById("route-choice-status").textContent = "בחרו מסלול לפני ההערכה."; document.getElementById("route-choice-heading").focus(); return; }
 syncProfileQuestions();
 clearQuizFeedback();const errors=profileErrors();
 const addError=(field,id,text)=>{document.getElementById(id).textContent=text;field.setAttribute("aria-invalid","true");errors.push({target:field.id,text});};
 const selections=questions.map((q,i)=>Array.from(document.querySelectorAll(`input[name=q${i}]:checked`),el=>Number(el.value)));
 questions.forEach((q,i)=>{if(!selections[i].length||selections[i].length>2){const input=$(`input[name=q${i}]`);addError(input,`question-error-${i}`,selections[i].length?`שאלה ${i+1}: אפשר לבחור עד שתי תשובות.`:`שאלה ${i+1}: עדיין לא נבחרה תשובה.`);}});
 if(errors.length){showQuizErrors(errors);return;}
 let total=0; const scores=[];
 questions.forEach((q,i)=>{const result=scoreAnswer(q,selections[i]);total+=result.score;scores.push(result.score);const box=$(`#question-feedback-${i}`);box.className=`feedback ${result.score===25?"success":result.score>0?"partial":"error"}`;box.innerHTML=`<strong>${result.score===25?"תשובה נכונה":result.score>0?"תשובה חלקית":"תשובה שגויה"}: ${result.score} מתוך 25</strong><p>${result.text}</p><p>התשובות המתאימות: ${q.correct.map(index=>q.options[index]).join("; ")}</p>`;box.hidden=false;});
 const output=$("#quiz-result");output.innerHTML=`<p class="eyebrow">${total>=75?"השלמתם את ההערכה בהצלחה":"ממשיכים לתרגל"}</p><h3>הציון שלכם</h3><p class="score-value"><strong class="score-number"><bdi dir="ltr">${total}</bdi></strong><span class="score-total">מתוך 100</span></p><p class="result-message">${total>=75?"אפשר לעבור שוב על המשוב ולחזור לתרגול.":"כדאי לעיין במשוב ולתרגל את המצבים שבהם התלבטתם. אפשר לנסות שוב."}</p><a href="#question-0">לעיון במשוב השאלות </a>`;output.hidden=false;$("#retry").hidden=false;quizPager?.showResult();output.focus();
if(window.reportIchilovAssessment?.(questions,selections,scores,total)===false){
  const notice=document.createElement("p");
  notice.className="alert alert-warning";
  notice.setAttribute("role","status");
  notice.textContent="לא ניתן היה לאשר שמירת התוצאות במוודל.";
  output.append(notice);
 }
});
// Hide obsolete scores as soon as the learner changes an answer.
$("#quiz").addEventListener("change",event=>{if(event.target.closest('.profile-fields'))syncProfileQuestions();clearQuizFeedback();});
$("#retry").addEventListener("click",()=>{document.querySelectorAll("#questions input").forEach(el=>el.checked=false);clearQuizFeedback();$("#retry").hidden=true;quizPager?.showQuestion(0);$("input[name=q0]").focus();});
$("#reduce-motion").addEventListener("change",event=>document.body.classList.toggle("reduced-motion",event.target.checked));
$("#practice-again").addEventListener("click",()=>{practiceIndex=0;renderPractice();});
renderPractice();

// Reveal content once, without hiding it when scripting or motion is unavailable.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window) {
 const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting) {
    if (!motionPreference.matches && !document.body.classList.contains("reduced-motion")) {
     entry.target.classList.add("is-revealed");
    }
    revealObserver.unobserve(entry.target);
   }
  });
 }, { threshold: 0.12 });
 document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
}
// Highlight the section currently being read, including for assistive technology.
if ("IntersectionObserver" in window) {
 const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === `#${entry.target.id === "tools" ? "learn" : entry.target.id === "start" ? "route" : entry.target.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
   });
  });
 }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
 document.querySelectorAll("main > section").forEach(section => sectionObserver.observe(section));
}

// Reading progress follows scrolling; it has no timer or automatic movement.
const readingProgress = document.querySelector(".reading-progress");
let progressFrame = 0;
function updateReadingProgress() {
 const available = document.documentElement.scrollHeight - window.innerHeight;
 const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
 readingProgress.style.transform = `scaleX(${ratio})`;
 progressFrame = 0;
}
function queueReadingProgress() {
 if (!progressFrame) progressFrame = window.requestAnimationFrame(updateReadingProgress);
}
window.addEventListener("scroll", queueReadingProgress, { passive: true });
window.addEventListener("resize", queueReadingProgress);
window.addEventListener("load", queueReadingProgress);
if ("ResizeObserver" in window) new ResizeObserver(queueReadingProgress).observe(document.body);
queueReadingProgress();

// Progressive enhancement: both versions are readable when scripting is unavailable.
document.querySelectorAll("[data-flip-card]").forEach(card => {
 const button = card.querySelector("[data-flip-toggle]");
 const front = card.querySelector(".flip-front");
 const back = card.querySelector(".flip-back");
 if (!button || !front || !back) return;
 function setFlipState(isOpen) {
  card.classList.toggle("is-open", isOpen);
  button.setAttribute("aria-expanded", String(isOpen));
  button.textContent = isOpen ? button.dataset.closeLabel : button.dataset.openLabel;
  front.setAttribute("aria-hidden", String(isOpen));
  back.setAttribute("aria-hidden", String(!isOpen));
  front.toggleAttribute("inert", isOpen);
  back.toggleAttribute("inert", !isOpen);
 }
 button.addEventListener("click", () => setFlipState(!card.classList.contains("is-open")));
 setFlipState(false);
 card.classList.add("is-enhanced");
 button.hidden = false;
});

// Keep anchors and keyboard focus below the measured sticky header at every size.
const stickyHeader = document.querySelector(".site-header");
function syncHeaderHeight() {
 const height = Math.ceil(stickyHeader.getBoundingClientRect().height);
 document.documentElement.style.setProperty("--header-height", `${height}px`);
}
syncHeaderHeight();
window.addEventListener("resize", syncHeaderHeight);
if ("ResizeObserver" in window) new ResizeObserver(syncHeaderHeight).observe(stickyHeader);
if (document.fonts?.ready) document.fonts.ready.then(syncHeaderHeight);
// Only keyboard navigation may correct an obscured control. Clicking a large
// focusable container (such as main) must never scroll back to its beginning.
let keyboardNavigation = false;
document.addEventListener("keydown", event => {
 if (["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " ", "Escape"].includes(event.key)) {
  keyboardNavigation = true;
  document.body.classList.add("keyboard-navigation");
 }
}, true);
document.addEventListener("pointerdown", () => { keyboardNavigation = false; document.body.classList.remove("keyboard-navigation"); }, true);
document.addEventListener("focusin", event => {
 const target = event.target;
 if (!keyboardNavigation || !target?.matches?.("a[href], button, input, select, textarea, summary, [role='tab'], [role='button']")) return;
 if (stickyHeader.contains(target)) return;
 const top = target.getBoundingClientRect().top;
 const safeTop = stickyHeader.getBoundingClientRect().bottom + 12;
 if (top < safeTop && safeTop < window.innerHeight) {
  window.scrollBy({ top: top - safeTop, behavior: "instant" });
 }
});

// Close the mobile menu after choosing a destination and move focus to its content.
const navigation = document.getElementById("navigation");
document.querySelectorAll(".nav-links a").forEach(link => {
 link.addEventListener("click", () => {
  if (!window.matchMedia("(max-width: 991px)").matches || !navigation.classList.contains("show")) return;
  if (!window.bootstrap?.Collapse) return;
  window.bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
  const target = document.getElementById(link.getAttribute("href").slice(1));
  if (target) {
   target.setAttribute("tabindex", "-1");
   target.focus({ preventScroll: true });
  }
 });
});

// Tabs shorten the lesson section while leaving every panel visible without JavaScript.
const lessonPanels = Array.from(document.querySelectorAll("[data-lesson-panel]"));
if (lessonPanels.length) {
 const labels = ["בירור הקושי", "הסבר ובדיקת הבנה", "הכוונה להמשך", "עצמאות ופרטיות"];
 const tabList = document.createElement("div");
 tabList.className = "lesson-tabs";
 tabList.setAttribute("role", "tablist");
 tabList.setAttribute("aria-label", "נושאים בליווי המטופל");
 const tabs = lessonPanels.map((panel, index) => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "lesson-tab";
  tab.id = `lesson-tab-${index + 1}`;
  tab.textContent = labels[index];
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.tabIndex = 0;
  tabList.append(tab);
  return tab;
 });
 function selectLesson(index, focus = false) {
  tabs.forEach((tab, i) => {
   tab.setAttribute("aria-selected", String(i === index));
   tab.tabIndex = i === index ? 0 : -1;
   lessonPanels[i].hidden = i !== index;
  });
  if (focus) tabs[index].focus();
 }
 tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectLesson(index));
  tab.addEventListener("keydown", event => {
   let target = index;
   if (event.key === "ArrowLeft") target = (index + 1) % tabs.length;
   else if (event.key === "ArrowRight") target = (index - 1 + tabs.length) % tabs.length;
   else if (event.key === "Home") target = 0;
   else if (event.key === "End") target = tabs.length - 1;
   else return;
   event.preventDefault();
   selectLesson(target, true);
  });
 });
 document.querySelector(".lesson-intro").after(tabList);
 selectLesson(0);
}

// One assessment question per page; changing pages never clears a response.
function setupQuizPager() {
 document.querySelector(".quiz-navigation")?.remove();
 const form = document.getElementById("quiz");
 const profile = form.querySelector(".profile-fields");
 profile.id = "quiz-profile";
 profile.setAttribute("role", "group");
 profile.setAttribute("aria-label", "לפני שמתחילים");
 const pages = [profile, ...form.querySelectorAll(".question"), document.getElementById("quiz-result")];
 const actions = form.querySelector(".quiz-actions");
 const navigation = document.createElement("div");
 navigation.className = "quiz-navigation";
 navigation.innerHTML = '<button type="button" class="btn secondary" id="quiz-previous">הקודם</button><p class="quiz-page-label" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" class="btn secondary" id="quiz-next">הבא</button>';
 actions.before(document.getElementById("quiz-result"), navigation);
 const previous = navigation.querySelector("#quiz-previous");
 const next = navigation.querySelector("#quiz-next");
 const label = navigation.querySelector(".quiz-page-label");
 let current = 0;
 let graded = false;
 function showPage(index, focus = false) {
  current = Math.max(0, Math.min(index, graded ? pages.length - 1 : pages.length - 2));
  pages.forEach((page, i) => { page.hidden = i !== current; });
  previous.disabled = current === 0;
  next.hidden = current === pages.length - 1 || (current === pages.length - 2 && !graded);
  next.textContent = current === 0 ? "לשאלה הראשונה" : current === pages.length - 2 ? "לציון המסכם" : "לשאלה הבאה";
  const isResult = current === pages.length - 1;
  form.classList.toggle("is-result", isResult);
  label.hidden = isResult;
  label.textContent = isResult ? "" : current === 0 ? "לפני שמתחילים" : `שאלה ${current} מתוך ${questions.length}`;
  document.getElementById("grade-quiz").hidden = current !== pages.length - 2 || graded;
  document.getElementById("retry").hidden = !graded;
  if (focus) pages[current].focus();
 }
 pages.forEach(page => { page.classList.add("quiz-page"); page.tabIndex = -1; });
 previous.addEventListener("click", () => showPage(current - 1, true));
 next.addEventListener("click", () => {
  if (current === 0) {
   clearQuizFeedback();
   const errors = profileErrors();
   if (errors.length) { showQuizErrors(errors); return; }
   if (syncProfileQuestions()) { quizPager.showQuestion(0, true); return; }
  }
  showPage(current + 1, true);
 });
 function showField(id) {
  const field = document.getElementById(id);
  const index = pages.findIndex(page => page.contains(field));
  if (index >= 0) showPage(index);
 }
 document.getElementById("error-summary").onclick = event => {
  const anchor = event.target.closest("a");
  if (anchor) showField(anchor.getAttribute("href").slice(1));
 };
 document.getElementById("quiz-result").onclick = event => {
  if (event.target.closest('a[href="#question-0"]')) showPage(1);
 };
 quizPager = {
  showField,
  showQuestion: (index, focus = false) => showPage(index + 1, focus),
  showResult: () => { graded = true; showPage(pages.length - 1); },
  invalidate: () => { graded = false; showPage(current); }
 };
 showPage(0);
}

setupQuizPager();
document.addEventListener('ichilov:routechange', () => {
 quizPager = null;
 // A confirmed new route starts a completely fresh assessment.
 document.querySelectorAll('.profile-fields input, .profile-fields select').forEach(field => { field.value = ''; });
 renderAssessmentQuestions();
 clearQuizFeedback();
 $("#quiz-result").textContent = '';
 $("#error-summary").textContent = '';
 setupQuizPager();
 syncProfileQuestions();
 practiceIndex = 0;
 renderPractice();
});
