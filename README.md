# StudyRank

A study-to-play app. Solve problems, get graded by AI, earn points, and redeem them for timed game sessions. Everything runs in the browser from a single file, `index.html`, with no build step.

## Features

- Anki-style decks: create, rename and delete decks, and add, edit, move or delete cards. Subdecks work like Anki: name a deck `Math::Calculus::Limits` and it nests under `Math` and `Calculus`, with collapsible parents that add up their subdecks' cards.
- One "Your solution" box for steps and a final answer, plus optional photo of handwritten work.
- AI grading with a detailed full solution that refers to your own work (Gemini, your own key). Math in feedback and solutions is written in LaTeX and rendered with MathJax (loaded from a CDN the first time a solution contains math).
- Answer-key checking when AI is off.
- Weak spots: missed cards come back after 10 minutes, then 1, 3, 7 and 14 days. They never disappear on their own, and you can practice them any time.
- Ranks from Warrior to Mythic, points, streaks and tickets (100 points = 1 ticket = 20 minutes, no daily limit). The game lock is simulated.
- Study timer: a pausable stopwatch with a subject picker, a topic note, a "still studying?" check-in and points per minute you set for each subject. Finished sessions add points to the same total you spend on tickets. The Study log shows time and points by subject, the last 7 days and recent sessions.
- Anki import and export as `.apkg` files (text only).

## Put it online with GitHub Pages

1. Create a public repository, for example `studyrank`.
2. Upload `index.html` (and this README) with **Add file > Upload files**, then **Commit changes**.
3. Open **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then **Save**.
4. After a few minutes the app is at `https://YOUR-USERNAME.github.io/studyrank/`.
5. On your phone, open the link and use your browser menu's **Add to Home screen**.

## Turn on AI grading

1. Create a Gemini API key at https://aistudio.google.com/apikey. Make one just for this app.
2. In the app, open **AI settings**, paste the key and tap **Save and test**.
3. The key is stored only in your own browser and is sent only to Google. Never put it in the repository.
4. If grading stops working, the model name may have been retired. Type a newer Gemini model name in **AI settings**.

Answers and photos you submit are sent to Google while AI grading is on and count against your Gemini quota.

## Your data

Decks, points, weak spots and the study timer log are saved in your browser's local storage on each device. They do not sync. Export your decks as `.apkg` now and then as a backup.

## Anki

- **Deck hierarchy** is kept both ways. Export writes `Parent::Child` names, which Anki and AnkiDroid show as real subdecks, and import keeps Anki's subdeck structure. Rename a deck to `Other::Name` to move it under another parent.
- **Export** downloads an `.apkg` file (the Export button on a parent deck exports it with all its subdecks). Open it with AnkiDroid or use File > Import in Anki.
- **Import** reads `.apkg` files from both older and current Anki versions, including the newest format. Basic and cloze notes are supported; images and sounds are skipped.
- Export and import load two small libraries (JSZip, sql.js, and fzstd for the newest Anki format) from the jsDelivr CDN, so you need an internet connection the first time you use them.
