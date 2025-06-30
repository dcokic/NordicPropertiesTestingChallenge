import { test, expect } from '@playwright/test';
import testData from '../fixtures/testData.json';
import { SearchPage } from '../pages/SearchPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

let searchPage: SearchPage;
let searchResultsPage: SearchResultsPage;

test.beforeEach(async ({ page }) => {
  searchPage = new SearchPage(page);
  searchResultsPage = new SearchResultsPage(page);

});

test.afterEach(async () => {
  console.log('Test completed. No additional cleanup required for now.');
});

test('User can search properties by location and price range', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const { location, priceRange } = testData.validSearch2;

  // 1. Navigate directly to the search results page (to avoid CAPTCHA)
  await searchResultsPage.goToSearchResultsPage();

  // 2. Accept cookie consent by clicking “Accept all”
  await searchPage.clickAccept();

  // 3. Filter by price
  await searchResultsPage.clickOnPriceFilter();

  //   a) Click on Min and select min price from data
  await searchResultsPage.clickOnPriceMin();
  await searchResultsPage.selectMinPrice(priceRange.min);

  //   b) Click on Max and select max price from data
  await searchResultsPage.clickOnPriceMax();
  await searchResultsPage.selectMaxPrice(priceRange.max);

  // 4. Check if price filter is applied
  await searchResultsPage.verifyPriceFilterApplied(priceRange.label,);

  // 5. Clear location field and enter new location from data
  await searchResultsPage.clickOnClearButton();
  await searchResultsPage.enterLocation(location);

  // 6. Verify that the page title contains new searched location
  await searchResultsPage.checkLocationTextInTitle(location);
});    


test('Search results display accurate property information', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const searchResultsPage = new SearchResultsPage(page);
  
  // 1. Navigate directly to the search results page (to avoid CAPTCHA)
  await searchResultsPage.goToSearchResultsPage();

  // 2. Accept cookie consent by clicking “Accept all”
  await searchPage.clickAccept();

  // 3. Verify that the page title contains the searched location (e.g. “London”)
  await expect(searchResultsPage.getResultsTitle(), 'Expected page title to contain the searched location')
    .toContainText(testData.validSearch.location);

  // 4. Verify that the results container for regular listings is visible
  const listingsContainer = page.locator('[data-testid="regular-listings"]');
  await expect(listingsContainer, 'Expected the search results container to be visible on the page')
    .toBeVisible({ timeout: 10000 });

  // 5. Count the number of property listings and assert that it is greater than zero
  const listingItems = listingsContainer.locator('li');
  const count2 = await listingItems.count();
  expect(count2, 'Expected at least one property listing to be displayed').toBeGreaterThan(0);

  // 6. For each listing:
  //   a) Check that a price is displayed and contains the "£" symbol
  const priceLocators = page.locator('[data-testid="listing-price"]');
  const count = await priceLocators.count();

  for (let i = 0; i < count; i++) {
    const priceText = await priceLocators.nth(i).textContent();
    expect(priceText, `Expected price at index ${i} to contain "£"`).toContain("£");
    }  

  // b) Check that the listing has a non-empty link (href attribute)
  const listings = page.locator('[data-testid="listing-card-content"]');
  const count1 = await listings.count();

  for (let i = 0; i < count1; i++) {
    const href = await listings.nth(i).getAttribute("href");
    expect(href, `Listing at index ${i} is missing href attribute`).toBeTruthy();
  }  

  // 7. Select property type from filters (e.g., "Flats")
  await searchResultsPage.clickOnPropertyTypeButton();
  await searchResultsPage.selectPropertyType(testData.validSearch.propertyType);

  // 8. Check if property type filter is applied
  await searchResultsPage.verifyAppliedPropertyTypeIsVisible(testData.validSearch2.propertyType);

});    


test('Invalid search inputs show appropriate error messages', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const query = encodeURIComponent(testData.invalidSearch.query);
  const expectedError = testData.invalidSearch.errorMessage;

  // 1. Navigate directly to a search page with invalid input
  await page.goto(`https://www.zoopla.co.uk/search/?q=${query}&new_homes=include&retirement_homes=true&shared_ownership=true&include_shared_accommodation=true&search_source=home&section=for-sale&view_type=list`);
  await page.waitForLoadState('networkidle');

  // 2. Accept cookie consent
  await searchPage.clickAccept();

  // 3. Validate the error message is displayed
  const errorMessage = page.locator(`text=${expectedError}`);
  await expect(errorMessage, 'Expected error message for invalid search input to be visible.')
    .toBeVisible({ timeout: 5000 });

  // 4. Validate no search results are shown
  await expect(page.locator('[data-testid="regular-listings"]'), 'Expected no property listings to be shown.')
    .toHaveCount(0, { timeout: 3000 });

  // 5. Validate that the query is present in the URL
  expect(page.url(), 'Expected the URL to contain the invalid query string.').toContain(`q=${query}`);
});


test('Property search works across different browsers', async ({ page }) => {
  // 1. Log the browser being used
  console.log(`Running on: ${test.info().project.name}`);

  // 2. Navigate to the Zoopla search page with price filter applied
  await page.goto('https://www.zoopla.co.uk/for-sale/property/london/?price_max=500000', {
    waitUntil: 'domcontentloaded',
  });

  // 3. Accept cookie consent if the banner is shown
  const cookieButton = page.getByRole('button', { name: /accept all/i });
  if (await cookieButton.isVisible()) {
    await cookieButton.click();
  }

  // 4. Validate that at least one property listing is visible
  const listings = page.locator('[data-testid="regular-listings"] li');
  await expect(listings.first(), 'Expected at least one property listing to be visible').toBeVisible();
});
