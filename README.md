# StudyRank

A study-to-play app. Solve problems, get graded by AI, earn points, and redeem them for timed game sessions. Everything runs in the browser from a single file, `index.html`, with no build step.

## Features

- Anki-style decks: create, rename and delete decks, and add, edit, move or delete cards. Subdecks work like Anki: name a deck `Math::Calculus::Limits` and it nests under `Math` and `Calculus`, with collapsible parents that add up their subdecks' cards.
- One "Your solution" box for steps and a final answer, plus optional photo of handwritten work.
- AI grading with a detailed full solution that refers to your own work (Gemini or NVIDIA's Mistral Large 4, your own key). Math in feedback and solutions is written in LaTeX and rendered with MathJax (loaded from a CDN the first time a solution contains math).
- Answer-key checking when AI is off.
- Weak spots: missed cards come back after 10 minutes, then 1, 3, 7 and 14 days. They never disappear on their own, and you can practice them any time.
- Ranks from Warrior to Mythic, points, streaks and tickets (100 points = 1 ticket = 20 minutes, no daily limit). The game lock is simulated.
- Study timer: a pausable stopwatch with a subject picker, a topic note, a "still studying?" check-in and points per minute you set for each subject. Finished sessions add points to the same total you spend on tickets. The Study log shows time and points by subject, the last 7 days and recent sessions.
- Anki import and export as `.apkg` files (text only).

## AI chat

Tap **💬 Ask AI** (bottom right) or **Ask a follow-up** under a result to open a chat panel on the right. The AI knows the current problem, the reference answer, your submitted work and your grade, so you can ask why a step works or request another method. It uses the provider, key and model from AI settings. The photo you submitted for grading is included automatically, and the 📷 button attaches more photos to a question. Chats are kept only until the page is reloaded.

## Pages

Tap **☰ Menu** at the top to switch pages: **Study** (timer, problems, weak spots, decks, Anki import/export), **Study log**, **Game tickets** and **AI settings**. Rank, points, streak and tickets stay visible on every page.

## Put it online with GitHub Pages

1. Create a public repository, for example `studyrank`.
2. Upload `index.html` (and this README) with **Add file > Upload files**, then **Commit changes**.
3. Open **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then **Save**.
4. After a few minutes the app is at `https://YOUR-USERNAME.github.io/studyrank/`.
5. On your phone, open the link and use your browser menu's **Add to Home screen**.

## Turn on AI grading

Pick a provider in **AI settings**. Your key is stored only in your own browser and is sent only to that provider (or to your proxy, if you set one). Never put it in the repository.

### Google Gemini

1. Create a Gemini API key at https://aistudio.google.com/apikey. Make one just for this app.
2. In **AI settings**, choose **Google Gemini**, paste the key and tap **Save and test**.
3. If grading stops working, the model name may have been retired. Type a newer Gemini model name in **AI settings**.

### NVIDIA (Mistral Large 4)

1. Create a key at https://build.nvidia.com (it starts with `nvapi-`). Make one just for this app.
2. In **AI settings**, choose **NVIDIA (Mistral Large 4)**, paste the key, keep the model `mistralai/mistral-large-4-1t-a52b` and tap **Save and test**.
3. If the test says it could not reach NVIDIA even though you are online, your browser is probably blocking the call (CORS). Set up the proxy below and paste its address into **Proxy URL**.
4. Free NVIDIA use has per-minute limits. The app retries a few times on "too many requests" errors; if it still fails, wait a minute.
5. Photos are shrunk a bit more for NVIDIA to keep requests small.

### Optional proxy for NVIDIA (free Cloudflare Worker)

The proxy only forwards your request to NVIDIA and adds the headers browsers need. Your key still lives in your browser and travels in the request header.

1. Sign in at https://dash.cloudflare.com and open **Workers & Pages > Create > Hello World**. Name it, for example `studyrank-nvidia`, and deploy it.
2. Open **Edit code**, replace everything with the code below and **Deploy**.
3. Copy the worker address (like `https://studyrank-nvidia.YOUR-NAME.workers.dev`) into **Proxy URL** in **AI settings**, then tap **Save and test**.

```js
const CORS = {
  // Optional: replace * with https://YOUR-USERNAME.github.io
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default {
  async fetch(req) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: CORS });
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: req.body,
    });
    return new Response(res.body, {
      status: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  },
};
```

Answers and photos you submit are sent to the selected provider (and through your proxy, if set) while AI grading is on, and count against that provider's quota.

## Your data

Decks, points, weak spots and the study timer log are saved in your browser's local storage on each device. They do not sync. Export your decks as `.apkg` now and then as a backup.

## Anki

- **Deck hierarchy** is kept both ways. Export writes `Parent::Child` names, which Anki and AnkiDroid show as real subdecks, and import keeps Anki's subdeck structure. Rename a deck to `Other::Name` to move it under another parent.
- **Export** downloads an `.apkg` file (the Export button on a parent deck exports it with all its subdecks). Open it with AnkiDroid or use File > Import in Anki.
- **Import** reads `.apkg` files from both older and current Anki versions, including the newest format. Basic and cloze notes are supported; images and sounds are skipped.
- Export and import load two small libraries (JSZip, sql.js, and fzstd for the newest Anki format) from the jsDelivr CDN, so you need an internet connection the first time you use them.
