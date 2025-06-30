import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { PropertyDetailsPage } from '../pages/PropertyDetailsPage';

let propertyDetailsPage: PropertyDetailsPage;
let searchPage: SearchPage;

test.beforeEach(async ({ page }) => {
  propertyDetailsPage = new PropertyDetailsPage(page);
  searchPage = new SearchPage(page);

  // Open the property details page directly (to avoid CAPTCHA)
  await propertyDetailsPage.navigateToPropertyDetails(
    'https://www.zoopla.co.uk/for-sale/details/70477782/?search_identifier=42465211c8c44bf6df11746b330a2dd07c5b564906499db44e943defcc0d3ba0'
  );

  // Accept cookie consent (if shown)
  await searchPage.clickAccept();
});

test.afterEach(async ({ page }) => {
  console.log('Test finished. Cleaning up if necessary...');
});

test('Property details page displays comprehensive information', async ({ page }) => {
  // 1. Verify that the main title is visible
  await propertyDetailsPage.verifyMainTitleVisible();

  // 2. Verify that the location/address is displayed below the title
  await propertyDetailsPage.verifyAddressVisible();

  // 3. Verify that the price is visible and includes "£"
  await propertyDetailsPage.verifyPriceVisible();

  // 4. Verify that the property features are listed
  await propertyDetailsPage.verifyPropertyFeaturesAreListed();

  // 5. Verify that the description paragraph is present
  await propertyDetailsPage.verifyDetailedDescriptionIsPresent();

  // 6. Verify that agent contact info or call-to-action is visible
  await propertyDetailsPage.verifyContactButtonsAreVisible();
});
