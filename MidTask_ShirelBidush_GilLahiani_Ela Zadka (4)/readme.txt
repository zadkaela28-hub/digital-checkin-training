Ichilov Digital Check-in Learning Unit
Team: Shirel Bidush, Gil Lahiani, Ella Tzadaka. Group 5.
Release: 2026-11-23. SCORM 1.2.

LMS deployment
Upload the ZIP as a SCORM activity in Moodle. imsmanifest.xml must be at the ZIP root. Launch index.html. The package has no external runtime dependencies.
The API must be available from the SCO frame, a parent frame, or the opener, as supported by pipwerks. Actual Moodle validation is still required.

Standalone preview
Extract the complete package and open index.html in a current browser. Learning, route choice, text size, the glossary and assessment work locally. A screen-reader notice describes unavailable LMS reporting; assessment profile text also distinguishes local use from LMS reporting. No patient data entry is simulated.

Client changes
Choose First Learning or Refresher after the greeting. Each route has different content and a route-specific first question. Selecting a route prepares the choice; only Continue opens the content and reports the confirmed route. Confirming a different route clears all assessment fields, answers, score and feedback and returns the assessment to its profile page without reloading. Pending choices and repeated entry to the active route preserve the current assessment. Every new opening defaults to First Learning, including when a previous Refresher choice exists in browser or LMS storage. Continue is still required and text-size preferences still restore. Five terms have inline explanations as well as the full glossary. Text sizes are 100, 125 and 150 percent. Browser localStorage stores presentation/route preferences, never patient information; LMS preferences are read from cmi.suspend_data and take priority. Blocked storage does not prevent learning.

SCORM reporting
Route choice is a neutral, zero-weight choice interaction with ID ichilov_route_first or ichilov_route_refresher. Response a means First Learning; response b means Refresher. That interaction is committed before any assessment interactions.
Each valid assessment reports four choice interactions, their responses, correct responses, weights and results, plus cmi.core.score.raw/min/max and cmi.core.lesson_status. Each question is worth 25 points. Partial results are numeric ratios. Total 75 or above is passed; lower scores are failed. Missing/invalid responses are not reported. Duplicate submissions with unchanged question IDs and responses are suppressed. Switching routes permits a fresh submission.
A failed route commit blocks assessment reporting. Save failures are shown to the learner. Review and browse modes do not modify learner data. SCORM exit is sent on final pagehide, with browser back-forward cache events excluded.

Licenses and credits
Bootstrap 5.3.2: licenses/bootstrap-mit.txt.
Pipwerks wrapper v1.1.20180906: original notice in scorm-api-wrapper.js, licenses/pipwerks-notice.txt and licenses/pipwerks-mit.txt.
Heebo: assets/fonts/ofl-heebo.txt.
AI illustrations, prompts and supplied logo provenance: assets/image-credits.txt. The clinic simulation background was created with OpenAI's built-in image tool, using the existing hero only as a character reference. The live kiosk and inline SVG drawings were authored in the project with Codex assistance. No external icon library was added. The latest detail polish replaces only the requested desktop simulation composition with a wider generated panorama; the original mobile composition is preserved through picture/source selection. Logo rights remain with their owner; permission for broader publication has not been established by this package.
Code and content were developed with Codex assistance, disclosed in the unit and accompanying documentation.

Verification and remaining work
UI refinement: uncluttered hero with no image overlays, clear route choices, concise facts, subtle connectors, a compact live kiosk with step indicator, context definitions and a minimal source/credits footer. Native radio controls, text enlargement, keyboard focus and reduced-motion preferences remain supported. Normal desktop styles use the available viewport; small screens and larger text grow naturally rather than clipping content.
Automated DOM and SCORM 1.2 simulated-API checks are documented outside this runtime package. Local Chromium checks confirmed base section fit at 1280x720, 1366x768, 1440x900 and 1920x1080; assessment/review pages at 1280x720; small-screen reflow at widths 390/320; and 150 percent text scaling. These are not real Moodle certification or a complete accessibility audit. Before submission, test Moodle reports/resume, additional physical devices and browsers, 200/400 percent browser zoom, full keyboard navigation and a screen reader. Add the GitHub URL, demonstration video and student-authored QA table to the final submission documentation.

Detail polish, 2026-11-22
Flip-card actions stay at the shared bottom edge. Programmatic group focus no longer draws a large outline after pointer input; keyboard controls keep visible focus and groups retain semantic focus. Navy/lime accents are used across learning, simulation and feedback. Native next-section links respond to scroll progress and offer finite hover/arrival animations; reduced-motion mode keeps the progress decoration static. No assessment or SCORM reporting logic changed.

Entry and glossary fixes, 2026-11-22
The main content is hidden in the initial markup to prevent a pre-script flash. Selection and entry are separate; the header cannot bypass Continue, and a pending selection cannot submit assessment results. Restored routes remain candidates until confirmed. The full glossary focuses its title and resets its scroll position on every opening, including at larger text sizes. No image, library, license or SCORM-wrapper changes were made in this patch.

Interactive encounters (2026-11-23): three fictional situations about reading the screen, companion participation and reception pressure appear before the Daniel simulation in First Learning only. The Refresher hides this section and its navigation/checkpoint links. Each offers three responses with patient reactions and feedback. Selection is retained between cases within the current route, and reset by replay or a confirmed route change. This ungraded practice collects no patient information and writes no assessment score/interactions to the LMS.

Adaptive assessment: confidence is a required select with values 1-5; validation also runs before question one and grading. No experience or confidence 1-2 selects foundation questions. Routine experience with confidence 4-5 selects complex questions. Remaining combinations select applied questions. Each level has four questions and a route-specific first question; two are single-choice and two multi-choice. A level change clears old answers, grade and feedback but keeps the profile. Question IDs identify the level in SCORM; deduplication includes IDs so the same answer positions in a different bank are reported. Profile values themselves are not separately reported.
