function calculateLpChange(playerMmr, playerRank, gameOutcome) {
  const baseLp = 20; // Base LP gain/loss
  const mmrRankDiff = getMmrRankDifference(playerMmr, playerRank);

  let lpChange;
  if (gameOutcome === "win") {
    lpChange = baseLp + mmrRankDiff;
  } else {
    lpChange = -baseLp + mmrRankDiff;
  }

  return Math.max(-100, Math.min(100, lpChange)); // Cap LP change
}

function getMmrRankDifference(playerMmr, playerRank) {
  const expectedMmr = getExpectedMmrForRank(playerRank);
  return Math.floor((playerMmr - expectedMmr) / 50); // Adjust divisor as needed
}

function getExpectedMmrForRank(playerRank) {
  // Implement this function based on your MMR ranges for each rank
  // This is a placeholder implementation
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

  const [tier] = playerRank.split(" ");
  return rankMmrMap[tier] || 1500;
}

function updateRating(oldRating, difficulty, outcome, gamesPlayed) {
  const difficultyRatings = { easy: 1300, medium: 1600, hard: 1900 };
  const difficultyMultipliers = { easy: 0.8, medium: 1.0, hard: 1.2 };

  const difficultyRating = difficultyRatings[difficulty];
  const multiplier = difficultyMultipliers[difficulty];

  const expected = calculateExpectedOutcome(oldRating, difficultyRating);

  // Dynamic K-factor
  const k = 32 * (1 + 1 / Math.log(gamesPlayed + 3));

  const ratingChange =
    k * (outcome === "win" ? 1 - expected : 0 - expected) * multiplier;
  return oldRating + ratingChange;
}

function calculateExpectedOutcome(playerRating, difficultyRating) {
  return 1 / (1 + Math.pow(10, (difficultyRating - playerRating) / 400));
}

function getRankDisplay(player) {
  return `${player.tier} ${player.division} - ${player.lp} LP`;
}

export {
  calculateLpChange,
  getMmrRankDifference,
  getExpectedMmrForRank,
  updateRating,
  getRankDisplay,
};
