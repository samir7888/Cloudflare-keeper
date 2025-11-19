
export const GRAVITY = 0.3;
export const JUMP_STRENGTH = -12;
export const TERMINAL_VELOCITY = 15;
export const HORIZONTAL_DRIFT_RANGE = 1.4;
export const LOGO_SIZE = 100; // px
export const SPAWN_Y_OFFSET = 0.3; // % of screen height

export const COLORS = {
  primary: '#F6821F', // Cloudflare Orange
  secondary: '#FAD414', // Lighter Orange/Yellow
  accent: '#404040',
};

export const GAME_OVER_MESSAGES = [
  "Error 502: Bad Gamer Gateway",
  "Error 522: Connection Timed Out (Reflexes too slow)",
  "DDoS Attack Detected: Gravity overwhelming",
  "Cache Miss: You missed the click",
  "Rerouting traffic... straight to the floor",
  "Worker CPU Limit Exceeded",
  "DNS Probe Finished: No Skills Found",
  "Host Error: Gravity wins this round",
  "Packet Loss: 100%",
  "System status: Degraded Performance",
];

export const MILESTONE_MESSAGES: Record<number, string> = {
  5: "Traffic Routing Initiated! 🚀",
  10: "Cache Status: HIT! ⚡",
  15: "WAF Deployed! 🛡️",
  20: "CDN Nodes Expanded! 🌍",
  25: "Argo Smart Routing Enabled! 🧠",
  30: "DDoS Protection Active! 🧱",
  40: "SSL Handshake Complete! 🤝",
  50: "100% Uptime Achievement! 🏆",
  100: "Cloudflare God Mode! 🌩️"
};
