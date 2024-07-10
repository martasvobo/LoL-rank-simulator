const rankMmrMap = {
  Iron: 0,
  Bronze: 800,
  Silver: 1200,
  Gold: 1600,
  Platinum: 2000,
  Emerald: 2400,
  Diamond: 2800,
  Master: 3200,
  Grandmaster: 3600,
  Challenger: 4000,
};

const divisionMmrMap = {
  I: 300,
  II: 200,
  III: 100,
  IV: 0,
};

function calculateLpChange(player, gameOutcome) {
  const baseLp = 20; // Base LP gain/loss

  const totalLP =
    rankMmrMap[player.tier] +
    player.lp +
    (["Challenger", "Grandmaster", "Master"].includes(player.tier)
      ? 0
      : divisionMmrMap[player.division]);
  let offset = player.mmr - totalLP;

  let lpChange;

  if (gameOutcome === "defeat") {
    offset = -offset;
  }
  if (offset >= 1000) {
    lpChange = 35;
  } else if (offset < -1000) {
    lpChange = 10;
  } else if (offset < 0) {
    lpChange = baseLp + parseInt(offset / 100);
  } else {
    lpChange = baseLp + parseInt((offset * 15) / 1000);
  }

  return gameOutcome == "victory" ? lpChange : -lpChange;
}

function getMmrRankDifference(playerMmr, playerRank) {
  const expectedMmr = getExpectedMmrForRank(playerRank);
  return Math.floor((playerMmr - expectedMmr) / 50); // Adjust divisor as needed
}

function getExpectedMmrForRank(playerRank) {
  // Implement this function based on your MMR ranges for each rank
  // This is a placeholder implementation

  const [tier] = playerRank.split(" ");
  return rankMmrMap[tier] || 1500;
}

function updateRating(oldRating, difficulty, outcome) {
  const difficultyRatings = {
    veryEasy: Math.max(oldRating - 400, 0),
    easy: Math.max(oldRating - 200, 0),
    medium: oldRating,
    hard: oldRating + 200,
    veryHard: oldRating + 400,
  };

  const difficultyRating = difficultyRatings[difficulty];

  const expected = calculateExpectedOutcome(oldRating, difficultyRating);

  const ratingChange =
    16 * (outcome === "victory" ? 1 - expected : 0 - expected);
  return oldRating + parseInt(ratingChange);
}

function calculateExpectedOutcome(playerRating, difficultyRating) {
  return 1 / (1 + Math.pow(10, (difficultyRating - playerRating) / 400));
}

export {
  calculateLpChange,
  getMmrRankDifference,
  getExpectedMmrForRank,
  updateRating,
};
