import { updateRating, calculateLpChange } from "./elo";
export default class Player {
  constructor(obj) {
    this.mmr = obj?.mmr ?? 1500;
    this.tier = obj?.tier ?? "Silver";
    this.division = obj?.division ?? "IV";
    this.lp = obj?.lp ?? 0;
    this.gamesPlayed = obj?.gamesPlayed ?? 0;
    this.losspreventions = obj?.losspreventions ?? 1;
    this.lastChange = obj?.lastChange ?? 0;
    this.lastmmrchange = obj?.lastmmrchange ?? 0;
  }

  updateAfterGame(outcome, difficulty) {
    this.gamesPlayed++;

    const newMMR = updateRating(this.mmr, difficulty, outcome);
    this.lastmmrchange = newMMR - this.mmr;
    this.mmr = newMMR;

    const lpChange = calculateLpChange(this, outcome);

    this.lp += lpChange;

    this.lastChange = lpChange;

    this.checkForPromotionOrDemotion();
  }

  checkForPromotionOrDemotion() {
    if (
      this.lp >= 100 &&
      !["Master", "Grandmaster", "Challenger"].includes(this.tier)
    ) {
      this.promote();
    } else if (this.tier == "Master" && this.lp > 400) {
      this.promote();
    } else if (this.tier == "Grandmaster" && this.lp > 800) {
      this.promote();
    } else if (this.tier == "Challenger" && this.lp < 800) {
      this.demote();
    } else if (this.tier == "Grandmaster" && this.lp < 400) {
      this.demote();
    } else if (this.lp < 0) {
      this.demote();
    }
  }

  promote() {
    const currentTierIndex = this.tiers.indexOf(this.tier);
    const currentDivisionIndex = this.divisions.indexOf(this.division);

    if (this.tier === "Master" || this.tier === "Grandmaster") {
      this.tier = this.tiers[currentTierIndex + 1];
    } else if (currentDivisionIndex < 3) {
      this.lp = this.lp - 100;
      this.division = this.divisions[currentDivisionIndex + 1];
    } else if (currentDivisionIndex === 3) {
      this.lp = this.lp - 100;
      this.division = "IV";
      this.tier = this.tiers[currentTierIndex + 1];
    }
  }

  demote() {
    const currentTierIndex = this.tiers.indexOf(this.tier);
    const currentDivisionIndex = this.divisions.indexOf(this.division);

    if (this.tier === "Challenger" || this.tier === "Grandmaster") {
      this.tier = this.tiers[currentTierIndex - 1];
    } else if (this.losspreventions > 0) {
      this.losspreventions--;
      this.lastChange -= this.lp;
      this.lp = 0;
      return;
    } else if (currentDivisionIndex == 0) {
      this.lp = 75;
      this.lastChange = -25;
      this.division = "I";
      this.tier = this.tiers[currentTierIndex - 1];
      this.losspreventions = 1;
    } else {
      this.lp = 75;
      this.lastChange = -25;
      this.division = this.divisions[currentDivisionIndex - 1];
      this.losspreventions = 1;
    }
  }

  getRankDisplay() {
    if (
      this.tier === "Master" ||
      this.tier === "Grandmaster" ||
      this.tier === "Challenger"
    ) {
      return `${this.tier} - ${this.lp} LP (${this.lastChange})`;
    }
    return `${this.tier} ${this.division} - ${this.lp} LP (${
      this.lastChange > 0 ? "+" : ""
    }${this.lastChange}) `;
  }

  getDebugRankDisplay() {
    if (
      this.tier === "Master" ||
      this.tier === "Grandmaster" ||
      this.tier === "Challenger"
    ) {
      return `${this.tier} - ${this.lp} LP (${this.lastChange})`;
    }
    return `${this.tier} ${this.division} - ${this.lp} LP (${
      this.lastChange > 0 ? "+" : ""
    }${this.lastChange}) [${this.mmr} (${this.lastmmrchange > 0 ? "+" : ""}${
      this.lastmmrchange
    })]`;
  }

  tiers = [
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
  divisions = ["IV", "III", "II", "I"];
}
