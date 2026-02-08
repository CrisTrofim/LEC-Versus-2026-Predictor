# 🏆 LEC Versus 2026 Predictor

An interactive simulation tool designed for League of Legends esports fans. This tool allows users to predict the outcomes of the final week of the **LEC Versus 2026** regular season, automatically generate the final standings using official tie-break rules, and simulate the entire Double Elimination playoff bracket.

## 🚀 Key Features

### 1. Advanced Standing Engine

The simulator uses the official 2026 LEC tie-break hierarchy to separate tied teams:

* **Primary**: Total Win/Loss record.
* **Secondary**: Head-to-Head (direct match results).
* **Tertiary**: **Strength of Victory (SoV)** – Sum of wins of all opponents a team has defeated.
* **Quaternary**: **Average Game Time** – Total duration of all winning games divided by the number of wins (lower is better).

### 2. Regular Season & Playoffs

* **Clean UI**: Focus on readability with a color-coded interface for qualified and eliminated teams.
* **Dynamic Brackets**: The Top 8 teams are automatically seeded into a Double Elimination bracket based on their final rank.
* **Standard Seeding**: Following rule **6.2.11**, Seed #1 faces Seed #8, and Seed #2 faces Seed #7, ensuring the highest-ranked teams are placed on opposite sides of the bracket.
* **Lower Bracket Logic**: Fully automated "Loser Dropping" logic (e.g., Losers of Round 1 Matches are correctly funneled into the Lower Bracket).

---

## 📂 Project Structure

```bash
├── index.html   # Main layout and bracket containers (Tailwind CSS)
├── style.css    # Custom UI styling, animations, and mobile-friendly scrollbars
└── script.js    # Data, Tie-break engine (SoV/Time), and Bracket logic
```

---

## 🛠️ Setup & Installation

1. **Download/Clone** the project files.
2. Ensure that `index.html`, `style.css`, and `script.js` are in the same folder.
3. Open `index.html` in any modern web browser.

---

## ⚖️ Simulation Rules

### The "SoV" & "Time" Factor

In the 2026 format, every second counts. If two teams have identical win records and a 1-1 head-to-head record:

1. The tool calculates the **SoV** (the sum of wins of the teams they managed to beat).
2. If still tied, it compares the **Average Victory Time** (Total winning duration / Number of wins).
3. In the simulator, "Upcoming matches" are calculated with a neutral default time of **30:00** for consistency.

### Playoff Progression

* **Winner Selection**: Click on a team's name within the bracket to advance them to the next stage.
* **Score Tracking**: Use the input fields to track the exact Bo3/Bo5 series score (e.g., 2-1, 3-0).
* **Real-time Updates**: Changing a winner in the Upper Bracket automatically recalculates and updates the potential opponents in the Lower Bracket.

---

## 🎨 Customization

To update the current standings or modify team data, edit the `teams` and `headToHead` constants at the top of the `script.js` file.

```javascript
{ id: 'team_id', name: "Team Name", w: 8, l: 2 }
```

---

## 📝 License

This project is free to use for the LEC community.

*Developed for the fans of the European competitive scene. See you on the Rift!* 🎮🔥

---