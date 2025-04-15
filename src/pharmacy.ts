/**
 * Represents a drug with its properties.
 * @param {string} name - The name of the drug.
 * @param {number} expiresIn - The number of days until the drug expires.
 * @param {number} benefit - The benefit value of the drug.
 */
export class Drug {
  name: string;
  expiresIn: number;
  benefit: number;

  constructor(name: string, expiresIn: number, benefit: number) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

// Constants for benefit limits
const MAX_BENEFIT = 50;
const MIN_BENEFIT = 0;

// Constant for benefit variation
const BENEFIT_VARIATION = 1;

/**
 * Clamps the benefit value between MIN_BENEFIT and MAX_BENEFIT.
 * "Magic Pill" is exempt from these limits as its benefit is constant.
 * @param {Drug} drug - The drug object.
 * @returns {Drug} The drug object with benefit potentially adjusted.
 */
const enforceBenefitLimits = (drug: Drug) => {
  drug.benefit = Math.max(MIN_BENEFIT, Math.min(MAX_BENEFIT, drug.benefit));
  return drug;
};

/**
 * Collection of specific update logic functions for special drug types.
 * Each function takes a drug, modifies its expiresIn and benefit based on its specific rules,
 * and returns the modified drug. General rules like benefit clamping are applied separately.
 */
const drugUpdaters: Record<string, (drug: Drug) => Drug> = {
  /**
   * Updates "Herbal Tea":
   * - ExpiresIn decreases by 1.
   * - Benefit increases by 1.
   * - If expired, Benefit increases by an additional 1.
   */
  "Herbal Tea": (drug: Drug) => {
    drug.expiresIn--;
    drug.benefit += BENEFIT_VARIATION;
    // Benefit increases twice as fast after expiration
    if (drug.expiresIn < 0) {
      drug.benefit += BENEFIT_VARIATION;
    }
    return drug;
  },

  /**
   * Updates "Magic Pill":
   * - No changes to ExpiresIn or Benefit.
   */
  "Magic Pill": (drug: Drug) => {
    // "Magic Pill" never expires nor decreases in Benefit.
    return drug;
  },

  /**
   * Updates "Fervex":
   * - ExpiresIn decreases by 1.
   * - Benefit increases based on proximity to expiration date:
   *   - Base increase: +1
   *   - ExpiresIn <= 10 days: +1 more (total +2)
   *   - ExpiresIn <= 5 days: +1 more (total +3)
   * - If expired, Benefit drops to 0.
   */
  Fervex: (drug: Drug) => {
    drug.expiresIn--;
    // Benefit increases as expiration approaches
    drug.benefit += BENEFIT_VARIATION;
    if (drug.expiresIn < 10) {
      drug.benefit += BENEFIT_VARIATION;
    }
    if (drug.expiresIn < 5) {
      drug.benefit += BENEFIT_VARIATION;
    }
    // Benefit drops to 0 after expiration
    if (drug.expiresIn < 0) {
      drug.benefit = 0;
    }
    return drug;
  },

  /**
   * Updates "Dafalgan":
   * - ExpiresIn decreases by 1.
   * - Benefit decreases by 2.
   * - If expired, Benefit decreases by an additional 2.
   */
  Dafalgan: (drug: Drug) => {
    drug.expiresIn--;
    drug.benefit -= BENEFIT_VARIATION * 2;
    if (drug.expiresIn < 0) {
      drug.benefit -= BENEFIT_VARIATION * 2;
    }
    return drug;
  },
};

/**
 * Default update logic for normal drugs.
 * - ExpiresIn decreases by 1.
 * - Benefit decreases by 1.
 * - If expired, Benefit decreases by an additional 1.
 * @param {Drug} drug - The drug object.
 * @returns {Drug} The modified drug object.
 */
const defaultUpdater = (drug: Drug) => {
  drug.expiresIn--;
  drug.benefit -= BENEFIT_VARIATION;
  // Benefit degrades twice as fast after expiration
  if (drug.expiresIn < 0) {
    drug.benefit -= BENEFIT_VARIATION;
  }
  return drug;
};

/**
 * Manages a collection of drugs and updates their benefit values daily based on defined rules.
 * @param {Drug[]} [drugs=[]] - An array of Drug objects.
 */
export class Pharmacy {
  drugs: Drug[];

  constructor(drugs: Drug[]) {
    this.drugs = drugs;
  }

  /**
   * Updates the benefit and expiresIn values for each drug in the pharmacy
   * by applying the appropriate update logic based on the drug's name.
   * Applies general rules like benefit limits after specific logic.
   * @returns {Drug[]} The updated array of Drug objects.
   */
  updateBenefitValue() {
    this.drugs = this.drugs.map((drug) => {
      // Find the specific updater function for the drug name, or use the default updater
      const updater = drugUpdaters[drug.name] ?? defaultUpdater;

      // Apply the chosen update logic
      let updatedDrug = updater(drug); // The updater modifies the drug object directly

      // Apply general rules (benefit limits) after specific updates
      updatedDrug = enforceBenefitLimits(updatedDrug);

      return updatedDrug;
    });

    return this.drugs;
  }
}
