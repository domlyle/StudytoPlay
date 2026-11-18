# StudyRank

Solve problems. Earn points. Earn your free time.

StudyRank is a single-file study app (`index.html`) that makes studying feel like a game. You answer flashcard-style problems and run a study timer to earn points and climb ranks, then spend the points on guilt-free **free time** for anything you enjoy. It runs in the browser, works offline, and can sync across devices.

## How it works

1. **Study** by solving problems or running the study timer.
2. **Earn points.** Harder problems and longer study sessions give more.
3. **Convert points into free time** on the Free time page.
4. **Enjoy your free time** with a countdown that only runs while you are playing or resting.

Invest in studying first, then take your leisure time as a reward for the hard work.

## Features

### Problems and scoring
- Decks and subdecks (use `::`, for example `Math::Calculus::Limits`).
- Base points per problem: Easy 10, Medium 20, Hard 30.
- Show the answer, then rate yourself Wrong, Partly or Correct (keys `1`, `2`, `3`).
- Optional **Check with AI**: grades your typed work and an optional photo of your handwritten solution. Its grade replaces your self-rating and finalizes the points, plus up to +5 for clear steps.
- Streak combo bonus for consecutive correct answers.
- Math is written as LaTeX between `$...$` and rendered with MathJax.
- Cards can contain pictures (stored on your device and shrunk to fit).

### Ranks
- 7 tiers: Warrior, Elite, Master, Grandmaster, Epic, Legend, Mythic.
- 5 stars per tier. A correct answer gives +1 star, a wrong answer takes one away. Partial credit changes nothing.

### Study timer
- Pausable stopwatch with a progress ring, per-subject points-per-minute rates, and a topic note for each session.
- Check-in prompt every N minutes ("Still studying?") so idle time is not counted. Choosing "I stopped" rolls the clock back.
- Points are banked when you press **Finish and bank points**.
- Study log with daily streak, 7-day chart and recent sessions.

### Free time (replaces game tickets)
- Convert points to minutes of free time at **5 points = 1 minute** (change `PPM` in the script to adjust).
- Type the minutes you want or use the +10, +30, +60 and Max buttons.
- **Start free time** runs a countdown from your banked time. Pause any time, and unused time stays banked. The app beeps when it runs out.
- The page only tracks time. It does not block any game or app.
- Old tickets from earlier versions convert automatically to 20 minutes each.

### Weak spots
Missed problems come back on a spaced schedule (10 minutes, then 1, 3, 7 and 14 days) until you get them right, grouped by deck.

### Ask AI chat
- Follow-up questions about the current problem, with optional photo attachment.
- Buttons beside each AI bubble: **📝 Copy to note**, **↩ Reply** (quote that message in your next question), **📋 Copy full text** (math kept as LaTeX).
- Chat history is cleared when you reload the page. Save anything you want to keep as a note.

### Notes
- Notes panel on the left side of the screen, opened with the **📝 Notes** button.
- Every note is tied to a deck, and to a card when it came from a card. **Go to card** jumps back to practice it.
- Add, edit, search, copy and delete notes. **Copy all** exports every note as text.
- Notes sync and back up with the rest of your data.

### Decks and cards
- Create, rename, delete and export decks. The deck header stays pinned while you scroll its cards.
- Search cards by any word in the front, back, explanation or deck name.
- Replace a card's solution (and optionally its answer) with an AI-written one using the buttons under an AI result.

### Import, export and backup
- **Anki:** import and export `.apkg` packages (text and pictures; sounds are skipped). Up to 5000 cards in total.
- **JSON backup:** one file with decks, pictures, weak spots, points, rank, study log and notes. You can restore (replace everything) or merge. AI keys are never included.

### Sync across devices (optional)
Sign in with Google to keep everything in sync through Firebase. Without signing in, everything stays only on your device. If two devices change things at the same time, decks, cards, weak spots, notes and study sessions are combined and points and free time are added together. A card or note deleted on one device can come back if the other device edited at the same time.

## Setup

### Run it
Host `index.html` anywhere static, for example GitHub Pages, or just open the file. Everything is in that one file.

### AI (optional)
Open **Menu, AI settings**, pick a provider and paste your key.

| Provider | Default model | Key from |
| --- | --- | --- |
| Google Gemini | `gemini-3.6-flash` | https://aistudio.google.com/apikey |
| NVIDIA | `mistralai/mistral-large-4-1t-a52b` | https://build.nvidia.com |

- Your key is stored only in this browser and sent only to the provider (or to your proxy).
- Browsers may block direct calls to NVIDIA (CORS). If you see "Could not reach NVIDIA", deploy a small proxy (for example a Cloudflare Worker that forwards the request to NVIDIA and adds CORS headers) and paste its HTTPS URL into **Proxy URL**.
- Answers and photos are sent to the provider only when you tap **Check with AI** or send a chat message.

### Cloud sync (optional)
1. In the Firebase console, create a project and add a web app. Put its config into `FB_CFG` in `index.html`.
2. **Authentication:** enable the Google sign-in method and add your site address under Authorized domains.
3. **Firestore:** create a database named `default` and publish these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Where your data lives

| Data | Location |
| --- | --- |
| Decks, points, weak spots, study log, notes | This browser (`localStorage`) |
| Card pictures | This browser (IndexedDB) |
| AI keys | This browser only, never synced or backed up |
| Running study stopwatch and free-time countdown | This browser only, never synced |
| Synced data (if signed in) | Your Firebase project |

Clearing your browser data erases the local copy, so export a JSON backup now and then or turn on sync.

## Tech notes
- One HTML file, no build step.
- Libraries load on demand: MathJax (math), JSZip and sql.js (Anki import and export), Firebase (sync).
- Fonts: Inter and Rajdhani from Google Fonts.
