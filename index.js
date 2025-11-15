const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MAX = { A: 6, B: 6, C: 6, D: 7 };

// メモリ上に人数保持（Railway ではプロセスが保持するのでOK）
let count = { A: 0, B: 0, C: 0, D: 0 };

function assignTeam() {
  // まだ枠があるチームだけ抽選対象にする
  const available = Object.keys(MAX).filter((t) => count[t] < MAX[t]);

  if (available.length === 0) return null;

  // available からランダム選択
  const team = available[Math.floor(Math.random() * available.length)];

  count[team]++;
  return team;
}

// API：チームをランダム配分
app.post("/assign", (req, res) => {
  const name = req.body.name || "noname";

  const team = assignTeam();
  if (!team) {
    return res.json({ ok: false, error: "枠がすべて埋まりました" });
  }

  console.log(`Assigned: ${name} → ${team}`);
  res.json({ ok: true, team, count, max: MAX });
});

// 状態確認
app.get("/status", (req, res) => {
  res.json({ count, max: MAX });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
