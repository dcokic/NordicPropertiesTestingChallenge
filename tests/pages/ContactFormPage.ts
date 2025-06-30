import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactFormPage extends BasePage {  
  // ========================================
  // LOCATORS
  // ========================================
  private readonly contactFormTitle = this.page.locator('h1._194zg6t6');
  private readonly fullNameInput = this.page.locator('#name');
  private readonly emailAdressInput = this.page.locator('#email');
  private readonly phoneNumberInput = this.page.locator('#phone');
  private readonly yourPostcodeInput = this.page.locator('#postcode');
  private readonly yourSituationDropdown = this.page.locator('#senderPropertyStatus-toggle-button');
  private readonly propertyStatusOption = (status: string) =>
    this.page.getByRole('option', { name: status });
  private readonly selectedPropertyStatus = this.page.locator('#senderPropertyStatus-toggle-button >> div.r7fft17');
  private readonly yourMessageInput = this.page.locator('#message');
  private readonly IWouldLikeToViewThisPropertyCheckbox = this.page.locator('#interest');
  private readonly firstPartyOptInConsentCheckbox = this.page.locator('#firstPartyOptInConsent');
  private readonly submitButton = this.page.getByRole('button', { name: /Send enquiry/i });


  constructor(page: Page) {
    super(page);
  }

// ========================================
// ACTION METHODS
// ========================================

  async navigateToContactFormPage(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyOnContactFormPage() {
    await expect(
      this.contactFormTitle,
      'Expected to be on the contact form page, but the title was not "Email agent"'
    ).toHaveText(/Email\s+agent/i);
  }

  async fillFullName(name: string) {
    await this.fullNameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.fullNameInput.fill(name);
  }

  async fillPhoneNumber(phone: string) {
    await this.phoneNumberInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.phoneNumberInput.fill(phone);
  }

  async fillEmailAddress(email: string) {
    await this.emailAdressInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.emailAdressInput.fill(email);
  }

  async fillPostcode(postcode: string) {
    await this.yourPostcodeInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.yourPostcodeInput.fill(postcode);
  }
  
  async selectPropertyStatus(status: string) {
    await this.yourSituationDropdown.click();
    await this.propertyStatusOption(status).click();
    await expect(this.selectedPropertyStatus, `Expected selected property status to be "${status}"`)
      .toHaveText(status);
  }

  async fillMessage(message: string) {
    await this.yourMessageInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.yourMessageInput.fill(message);
  }

  async verifyNoValidationErrors() {
    const invalidFields = this.page.locator('[aria-invalid="true"]');
    await expect(invalidFields, 'Expected no validation errors, but some fields are marked as invalid')
      .toHaveCount(0);
  }

  async selectInterestCheckbox() {
    await this.IWouldLikeToViewThisPropertyCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await this.IWouldLikeToViewThisPropertyCheckbox.click();
  }

  async selectfirstPartyOptInConsentCheckbox() {
    await this.firstPartyOptInConsentCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await this.firstPartyOptInConsentCheckbox.click();
  }

  async verifySubmitButtonIsEnabled() {
    await expect(this.submitButton, 'Submit button should be enabled before form submission')
      .toBeEnabled({ timeout: 5000 });
  }

  async submitContactForm() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

}

  
