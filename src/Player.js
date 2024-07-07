import { updateRating, calculateLpChange } from "./elo";
export default class Player {
  constructor(initialMmr = 1500) {
    this.mmr = initialMmr;
    this.tier = "Silver";
    this.division = "IV";
    this.lp = 0;
    this.gamesPlayed = 0;
  }

  updateAfterGame(outcome, difficulty) {
    this.gamesPlayed++;

    // Update hidden MMR
    this.mmr = updateRating(this.mmr, difficulty, outcome, this.gamesPlayed);

    // Update visible rank
    const lpChange = calculateLpChange(
      this.mmr,
      `${this.tier} ${this.division}`,
      outcome
    );
    this.lp += lpChange;

    this.checkForPromotionOrDemotion();
  }

  checkForPromotionOrDemotion() {
    if (this.lp >= 100) {
      this.promote();
    } else if (this.lp < 0) {
      this.demote();
    }
  }

  promote() {
    const tiers = [
      "Iron",
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Emerald",
      "Diamond",
      "Master",
      "Grandmaster",
      "Challenger",
    ];
    const divisions = ["IV", "III", "II", "I"];

    if (["Master", "Grandmaster", "Challenger"].includes(this.tier)) {
      this.lp = Math.max(0, this.lp - 100); // Reset LP to 0 or keep excess
      return;
    }

    const currentTierIndex = tiers.indexOf(this.tier);
    const currentDivisionIndex = divisions.indexOf(this.division);

    if (currentDivisionIndex > 0) {
      // Promote to next division within the same tier
      this.division = divisions[currentDivisionIndex - 1];
    } else {
      // Promote to next tier
      this.tier = tiers[currentTierIndex + 1];
      this.division = "IV";
    }

    this.lp = 0; // Reset LP after promotion
  }

  demote() {
    const tiers = [
      "Iron",
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Emerald",
      "Diamond",
      "Master",
      "Grandmaster",
      "Challenger",
    ];
    const divisions = ["IV", "III", "II", "I"];

    if (["Master", "Grandmaster", "Challenger"].includes(this.tier)) {
      this.lp = 0; // Reset LP to 0
      if (this.tier !== "Master") {
        this.tier = "Master"; // Demote to Master
      }
      return;
    }

    const currentTierIndex = tiers.indexOf(this.tier);
    const currentDivisionIndex = divisions.indexOf(this.division);

    if (currentDivisionIndex < divisions.length - 1) {
      // Demote to previous division within the same tier
      this.division = divisions[currentDivisionIndex + 1];
      this.lp = 75; // Set LP to 75 after demotion
    } else {
      // Demote to previous tier
      if (currentTierIndex > 0) {
        this.tier = tiers[currentTierIndex - 1];
        this.division = "I";
        this.lp = 75; // Set LP to 75 after demotion
      }
    }
  }
}
