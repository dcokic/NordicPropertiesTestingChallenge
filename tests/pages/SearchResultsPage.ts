import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  // ========================================
  // LOCATORS
  // ========================================

  private readonly resultsTitleText = this.page.getByTestId("results-title")
  private readonly priceRangeButton = this.page.getByTestId("select-group-price")
  private readonly priceDropdown = this.page.locator('#select-group-price');
  private readonly priceMin = this.page.locator("#price_min")
  private readonly priceMax = this.page.locator("#price_max")
  private readonly clearButton = this.page.locator('svg:has(use[href="#close-medium"])');
  private readonly locationInput = this.page.locator('#autosuggest-input');
  private readonly propertyTypeButton = this.page.locator('#select-group-property-type');
  private readonly appliedFilters = this.page.locator('button._1qu7ilt4');


  constructor(page: Page) {
    super(page);
  }

  // =========================
  // GETTERS
  // =========================
  getResultsTitle() {
    return this.resultsTitleText;
  }

  // ========================================
  // ACTION METHODS
  // ========================================
  async checkLocationTextInTitle(text: string) {
    await expect(this.resultsTitleText, 'Expected page title to contain the searched location').toContainText(text);
  }

  async goToSearchResultsPage(){
    await this.page.goto('https://www.zoopla.co.uk/for-sale/property/london');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToSearchResultPageByLocationAndPrice(){
    await this.page.goto('https://www.zoopla.co.uk/for-sale/property/london/?price_max=20000')
  }

  async clickOnPriceFilter(){
    await this.priceDropdown.waitFor({ state: 'visible', timeout: 7000 });
    await this.priceDropdown.click();
  }

  async clickOnPriceMin(){
    await this.priceMin.waitFor({ state: 'visible', timeout: 7000 });
    await this.priceMin.click();
  }

  async selectMinPrice(value: string) {
    await this.priceMin.waitFor({ state: 'visible', timeout: 7000 });
    await this.priceMin.selectOption(value);
  }

  async clickOnPriceMax(){
    await this.priceMax.waitFor({ state: 'visible', timeout: 10000 });
    await this.priceMax.click();
  }
  
  async selectMaxPrice(value: string) {
    await this.priceMax.waitFor({ state: 'visible', timeout: 7000 });
    await this.priceMax.selectOption(value);
  }

  async clickOnPropertyTypeButton(){
    await this.propertyTypeButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.propertyTypeButton.click();
  }



  async checkPartialTextInPriceElement(partialText: string) {
  const priceText = await this.page.locator('[data-testid="listing-price"]').textContent();
  expect(priceText).toContain(partialText);
  }

  async clickOnClearButton(){
    await this.clearButton.waitFor({ state: 'visible', timeout: 7000 }); // promeni naziv 
    await this.clearButton.click({ force: true });
    await expect(this.locationInput).toHaveValue('');
  }

  async enterLocation(location: string) {
    await this.locationInput.waitFor({ state: 'visible', timeout: 7000 });
    await this.locationInput.fill(location);
  }

  async selectPropertyType(type: string) {
    const typeLower = type.toLowerCase().replace(/\s+/g, '_'); 
    const checkboxId = `property-type-${typeLower}`;
    const button = this.page.locator(`button#${checkboxId}`);

    await button.waitFor({ state: 'visible', timeout: 5000 });
    await button.click();

    await expect(button).toHaveAttribute("aria-checked", "true");
  }

  async verifyAppliedPropertyTypeIsVisible(propertyType: string) {
    const filterButton = this.page.locator('button', { hasText: propertyType });
    await expect(filterButton, `Expected property type filter '${propertyType}' to be visible on the page.`)
      .toBeVisible({ timeout: 5000 });
  }

  async verifyPriceFilterApplied(expectedRangeText: string) {
    await expect(this.appliedFilters.filter({ hasText: expectedRangeText }),
      `Expected price filter "${expectedRangeText}" to be visible on the page.`
    ).toBeVisible();
  }

}

