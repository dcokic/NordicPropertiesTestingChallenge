import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PropertyDetailsPage extends BasePage {
  // ========================================
  // LOCATORS
  // ========================================
  
  private readonly title = this.page.getByTestId("autosuggest-input")
  private readonly contactForm = this.page.getByTestId("input-location-options")
  private readonly features = this.page.locator('ul._15a8ens0 li');
  private readonly mainTitle = this.page.locator('h1');
  private readonly address = this.page.locator('h1 address');
  private readonly price = this.page.locator('div.r4q9to0 > p');
  private readonly featureListItems = this.page.locator('ul._15a8ens0 li');
  private readonly propertyDescription = this.page.locator('#detailed-desc');
  private readonly agentCallButton = this.page.getByRole('button', { name: /Call (agent|developer)/i });
  private readonly agentEmailButton = this.page.locator('a:has-text("Send enquiry"), a:has-text("Email agent"), button:has-text("Send enquiry"), button:has-text("Email agent")');



  constructor(page: Page) {
    super(page);
  }

  // ========================================
  // ACTION METHODS
  // ========================================

  async navigateToPropertyDetails(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyMainTitleVisible() {
    await expect(this.mainTitle).toBeVisible({ timeout: 5000 });
  }

  async verifyAddressVisible() {
    await expect(this.address).toBeVisible({ timeout: 5000 });
  }

  async verifyPriceVisible() {
    await expect(this.price).toBeVisible({ timeout: 5000 });
    const text = await this.price.textContent();
    expect(text).toContain('£');
  }

  async verifyPropertyFeaturesAreListed() {
    await expect(this.featureListItems.first()).toBeVisible({ timeout: 5000 });
    const count = await this.featureListItems.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyDetailedDescriptionIsPresent() {
    await expect(this.propertyDescription).toBeVisible({ timeout: 5000 });
    const text = await this.propertyDescription.textContent();
    expect(text?.length).toBeGreaterThan(50);
  }

  async verifyContactButtonsAreVisible() {
    const callVisible = await this.agentCallButton.isVisible();
    const emailVisible = await this.agentEmailButton.isVisible();

    expect(
      callVisible || emailVisible,
      'Expected at least one contact button (Call or Email) to be visible on the property details page.'
    ).toBeTruthy();
  }

  async clickOnContactButton() {
    if (await this.agentEmailButton.isVisible({ timeout: 3000 })) {
        await this.agentEmailButton.click();
    } else if (await this.agentCallButton.isVisible({ timeout: 3000 })) {
        await this.agentCallButton.click();
    } else {
        throw new Error('Neither Email Agent nor Send Enquiry button is visible');
    }
  }
}