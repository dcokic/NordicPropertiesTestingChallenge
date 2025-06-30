import { test, expect } from '@playwright/test';
import testData from '../fixtures/testData.json';
import { SearchPage } from '../pages/SearchPage';
import { ContactFormPage } from '../pages/ContactFormPage';

let contactFormPage: ContactFormPage;

test.beforeEach(async ({ page }) => {
  contactFormPage = new ContactFormPage(page);

  // 1. Navigate to a specific property details page (to avoid CAPTCHA)
  await page.goto(testData.contactForm.url);

  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
});

test.afterEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
});


test('Contact form submission works correctly', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const contactFormPage = new ContactFormPage(page);

  // 2. Verify user is on the contact form page
  await contactFormPage.verifyOnContactFormPage();

  // 3. Accept cookie consent
  await searchPage.clickAccept();

  // 4. Fill in the contact form fields
  await contactFormPage.fillFullName(testData.contactForm.name);
  await contactFormPage.fillPhoneNumber(testData.contactForm.phone);
  await contactFormPage.fillEmailAddress(testData.contactForm.email);
  await contactFormPage.fillPostcode(testData.contactForm.postcode);
  await contactFormPage.selectPropertyStatus(testData.contactForm.propertyStatus);
  await contactFormPage.fillMessage(testData.contactForm.message);

  await contactFormPage.verifyNoValidationErrors();

  // 5. Confirm "I would like to view this property"
  await contactFormPage.selectInterestCheckbox();

  // 6. Confirm "I do not wish to know what Zoopla can do for me or hear about breaking property news"
  await contactFormPage.selectfirstPartyOptInConsentCheckbox();

  // 8. Submit the form
  await contactFormPage.verifySubmitButtonIsEnabled();
  // await contactFormPage.submitContactForm();

});  