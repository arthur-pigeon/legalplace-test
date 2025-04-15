import { Drug, Pharmacy } from "../pharmacy";

describe("Pharmacy", () => {
  describe("Normal Drug", () => {
    it("should decrease benefit and expiresIn", () => {
      const initialDrugs = [new Drug("Normal Drug", 10, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(9);
      expect(updatedDrugs[0].benefit).toBe(19);
    });

    it("should decrease benefit twice as fast after expiration date", () => {
      const initialDrugs = [new Drug("Normal Drug", 0, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(-1);
      expect(updatedDrugs[0].benefit).toBe(18);
    });

    it("should not decrease benefit below zero", () => {
      const initialDrugs = [new Drug("Normal Drug", 10, 0)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(9);
      expect(updatedDrugs[0].benefit).toBe(0);

      // Test expired case as well
      const initialDrugsExpired = [new Drug("Normal Drug", 0, 1)];
      const pharmacyExpired = new Pharmacy(initialDrugsExpired);
      const updatedDrugsExpired = pharmacyExpired.updateBenefitValue();
      expect(updatedDrugsExpired[0].expiresIn).toBe(-1);
      expect(updatedDrugsExpired[0].benefit).toBe(0); // Should go 1 -> -1 (which is 0), not 1 -> -1 -> -3
    });
  });

  describe("Herbal Tea", () => {
    it("should increase benefit", () => {
      const initialDrugs = [new Drug("Herbal Tea", 10, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(9);
      expect(updatedDrugs[0].benefit).toBe(21);
    });

    it("should increase benefit twice as fast after expiration date", () => {
      const initialDrugs = [new Drug("Herbal Tea", 0, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(-1);
      expect(updatedDrugs[0].benefit).toBe(22);
    });

    it("should not increase benefit over 50", () => {
      const initialDrugs = [new Drug("Herbal Tea", 10, 50)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(9);
      expect(updatedDrugs[0].benefit).toBe(50);

      const initialDrugsExpired = [new Drug("Herbal Tea", 0, 49)];
      const pharmacyExpired = new Pharmacy(initialDrugsExpired);
      const updatedDrugsExpired = pharmacyExpired.updateBenefitValue();
      expect(updatedDrugsExpired[0].expiresIn).toBe(-1);
      expect(updatedDrugsExpired[0].benefit).toBe(50); // Increases by 2, but capped at 50
    });
  });

  describe("Magic Pill", () => {
    it("should not change expiresIn or benefit", () => {
      const initialDrugs = [new Drug("Magic Pill", 10, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(10);
      expect(updatedDrugs[0].benefit).toBe(20);

      // Test expired case (though it shouldn't expire)
      const initialDrugsExpired = [new Drug("Magic Pill", 0, 20)];
      const pharmacyExpired = new Pharmacy(initialDrugsExpired);
      const updatedDrugsExpired = pharmacyExpired.updateBenefitValue();
      expect(updatedDrugsExpired[0].expiresIn).toBe(0);
      expect(updatedDrugsExpired[0].benefit).toBe(20);
    });
  });

  describe("Fervex", () => {
    it("should increase benefit normally", () => {
      const initialDrugs = [new Drug("Fervex", 15, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(14);
      expect(updatedDrugs[0].benefit).toBe(21);
    });

    it("should increase benefit by 2 when expiresIn is 10 or less", () => {
      const initialDrugs10 = [new Drug("Fervex", 10, 20)];
      const pharmacy10 = new Pharmacy(initialDrugs10);
      const updatedDrugs10 = pharmacy10.updateBenefitValue();
      expect(updatedDrugs10[0].expiresIn).toBe(9);
      expect(updatedDrugs10[0].benefit).toBe(22);

      const initialDrugs6 = [new Drug("Fervex", 6, 20)];
      const pharmacy6 = new Pharmacy(initialDrugs6);
      const updatedDrugs6 = pharmacy6.updateBenefitValue();
      expect(updatedDrugs6[0].expiresIn).toBe(5);
      expect(updatedDrugs6[0].benefit).toBe(22);
    });

    it("should increase benefit by 3 when expiresIn is 5 or less", () => {
      const initialDrugs5 = [new Drug("Fervex", 5, 20)];
      const pharmacy5 = new Pharmacy(initialDrugs5);
      const updatedDrugs5 = pharmacy5.updateBenefitValue();
      expect(updatedDrugs5[0].expiresIn).toBe(4);
      expect(updatedDrugs5[0].benefit).toBe(23);

      const initialDrugs1 = [new Drug("Fervex", 1, 20)];
      const pharmacy1 = new Pharmacy(initialDrugs1);
      const updatedDrugs1 = pharmacy1.updateBenefitValue();
      expect(updatedDrugs1[0].expiresIn).toBe(0);
      expect(updatedDrugs1[0].benefit).toBe(23);
    });

    it("should drop benefit to 0 after expiration date", () => {
      const initialDrugs = [new Drug("Fervex", 0, 20)];
      const pharmacy = new Pharmacy(initialDrugs);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toBe(-1);
      expect(updatedDrugs[0].benefit).toBe(0);
    });

    it("should not increase benefit over 50", () => {
      // Test case: 15 days left, benefit 50
      const initialDrugs15 = [new Drug("Fervex", 15, 50)];
      const pharmacy15 = new Pharmacy(initialDrugs15);
      const updatedDrugs15 = pharmacy15.updateBenefitValue();
      expect(updatedDrugs15[0].expiresIn).toBe(14);
      expect(updatedDrugs15[0].benefit).toBe(50);

      // Test case: 10 days left, benefit 49
      const initialDrugs10 = [new Drug("Fervex", 10, 49)];
      const pharmacy10 = new Pharmacy(initialDrugs10);
      const updatedDrugs10 = pharmacy10.updateBenefitValue();
      expect(updatedDrugs10[0].expiresIn).toBe(9);
      expect(updatedDrugs10[0].benefit).toBe(50); // 49 + 2 capped at 50

      // Test case: 5 days left, benefit 48
      const initialDrugs5 = [new Drug("Fervex", 5, 48)];
      const pharmacy5 = new Pharmacy(initialDrugs5);
      const updatedDrugs5 = pharmacy5.updateBenefitValue();
      expect(updatedDrugs5[0].expiresIn).toBe(4);
      expect(updatedDrugs5[0].benefit).toBe(50); // 48 + 3 capped at 50

      // Test case: 5 days left, benefit 49
      const initialDrugs5_49 = [new Drug("Fervex", 5, 49)];
      const pharmacy5_49 = new Pharmacy(initialDrugs5_49);
      const updatedDrugs5_49 = pharmacy5_49.updateBenefitValue();
      expect(updatedDrugs5_49[0].expiresIn).toBe(4);
      expect(updatedDrugs5_49[0].benefit).toBe(50); // 49 + 3 capped at 50
    });
  });

  // describe("Dafalgan", () => {
  //   it("should decrease benefit twice as fast", () => {
  //     const initialDrugs = [new Drug("Dafalgan", 10, 20)];
  //     const pharmacy = new Pharmacy(initialDrugs);
  //     const updatedDrugs = pharmacy.updateBenefitValue();
  //     expect(updatedDrugs[0].expiresIn).toBe(9);
  //     expect(updatedDrugs[0].benefit).toBe(18); // Normal drug decreases by 1, Dafalgan by 2
  //   });

  //   it("should decrease benefit twice as fast (x4) after expiration date", () => {
  //     const initialDrugs = [new Drug("Dafalgan", 0, 20)];
  //     const pharmacy = new Pharmacy(initialDrugs);
  //     const updatedDrugs = pharmacy.updateBenefitValue();
  //     expect(updatedDrugs[0].expiresIn).toBe(-1);
  //     expect(updatedDrugs[0].benefit).toBe(16); // Normal drug decreases by 2 post-expiry, Dafalgan by 4
  //   });

  //   it("should not decrease benefit below zero", () => {
  //     // Test before expiry
  //     const initialDrugs = [new Drug("Dafalgan", 10, 1)];
  //     const pharmacy = new Pharmacy(initialDrugs);
  //     const updatedDrugs = pharmacy.updateBenefitValue();
  //     expect(updatedDrugs[0].expiresIn).toBe(9);
  //     expect(updatedDrugs[0].benefit).toBe(0); // 1 - 2 = -1, capped at 0

  //     // Test after expiry
  //     const initialDrugsExpired = [new Drug("Dafalgan", 0, 3)];
  //     const pharmacyExpired = new Pharmacy(initialDrugsExpired);
  //     const updatedDrugsExpired = pharmacyExpired.updateBenefitValue();
  //     expect(updatedDrugsExpired[0].expiresIn).toBe(-1);
  //     expect(updatedDrugsExpired[0].benefit).toBe(0); // 3 - 4 = -1, capped at 0
  //   });
  // });
});
