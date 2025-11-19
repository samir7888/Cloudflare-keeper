**Cloudflare Keeper**

- **Description:** A small browser arcade game built with React + Vite. Keep the Cloudflare logo afloat by clicking or tapping it  every successful click scores a point. Gravity, horizontal drift, and background speed increase as your score climbs. The game ends when the logo falls off the bottom of the screen.

- **Objective:** Prevent the logo from falling. Click/tap the logo to jump and rack up points. Reach milestone messages as you progress; the game gets harder over time.

**How to Play**

- **Click / Tap:** Click or tap the Cloudflare logo to make it jump and gain +1 score.
- **Start / Restart:** Use the `Start` button on the title screen. When you lose, press `Reboot System` to try again.
- **Scoring:** Each click on the logo increments your score. High score is saved in `localStorage`.

**Controls**

- **Mouse / Touch:** Click or tap the logo to jump.

**Run locally**

- **Prerequisites:** Node.js (recommended v18+)

Open a terminal in the project folder and run:

```powershell
npm install
npm run dev
```

Then open the address shown by Vite (usually `http://localhost:5173`).

**Build / Preview**

```powershell
npm run build
npm run preview
```

**Notes & implementation details**

- **Game loop / physics:** Implemented in `components/GameCanvas.tsx`. The logo's position and velocity are updated each frame; gravity and difficulty scale with score.
- **High score:** Stored under the `cf-keeper-highscore` key in `localStorage`.
- **UI & icons:** Uses `lucide-react` for icons and a `CloudflareLogo` component in `components/CloudflareLogo.tsx`.

**Files of interest**

- `components/GameCanvas.tsx`  main game logic and rendering
- `components/CloudflareLogo.tsx`  logo component and click handler
- `index.html`, `index.tsx`, `App.tsx`  app entry and mounting

**Credits**

- Built with React + Vite.
- Icons from `lucide-react`.

Enjoy the game  try to beat your high score!
