# StudyRank

StudyRank is a static, mobile-first study-to-play app. It uses plain HTML, CSS, and JavaScript and can be hosted on GitHub Pages. Study answers to earn points, exchange points for tickets, and simulate timed Mobile Legends sessions.

## Publish with GitHub Pages

1. Open the repository **Settings**.
2. In **Pages**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then save.
4. Open the Pages URL shown in Settings after the deployment finishes.

## Gemini API key

AI grading is optional. Add your own key in AI settings. The key is stored only in localStorage in the user's browser; never put a key in repository files. When AI grading is enabled, answers and any attached photo are sent to Google Gemini.

## Notes

- Progress, decks, weak spots, and the Gemini key are stored in the current browser and are not synced.
- Anki import/export loads JSZip 3.10.1 and sql.js 1.10.3 from jsDelivr only when an import or export is requested.
- Game locking is a simulated countdown; this page does not block Mobile Legends.
- Test manually on mobile browsers and import exported `.apkg` packages into Anki/AnkiDroid before relying on backups.
