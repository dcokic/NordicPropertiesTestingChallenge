import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  // ========================================
  // LOCATORS
  // ========================================
  
  private readonly searchInput = this.page.getByRole("combobox")
  private readonly searchButton = this.page.getByTestId("search-button")
  private readonly searchResults = this.page.getByTestId("input-location-options")
  private readonly listingCartContent = this.page.getByTestId("listing-card-content")
  private readonly acceptButton = this.page.getByRole('button', { name: 'Accept all' });
  private readonly input = this.page.locator('input[placeholder^="Search"]');



constructor(page: Page) {
    super(page);
  }


  // ========================================
  // ACCESSORS
  // ========================================
  
  getSearchResults(): Locator {
    return this.searchResults;
  }

// ====

// ========================================
  // ACTION METHODS
  // ========================================

  async search(query: string): Promise<void> {
    // await this.searchInput.fill(query);
    // await this.page.getByRole("combobox", { name: "Enter a location" }).fill("London");
    await this.input.click();
    await this.input.fill("London");
    await this.searchButton.click();
    await expect(this.searchResults.first()).toBeVisible({ timeout: 5000 });
  }

  async selectFirstSearch(){
    this.getSearchResults().first().click();
  }

  async clickSearchButton(){
    this.searchButton.click();
  }

  async clickFirstListing(){
    this.listingCartContent.first().click();
  }

  async clickAccept(){
    await this.acceptButton.waitFor({ state: 'visible', timeout: 7000 });
    await this.acceptButton.click();
  }

// export class SearchPage extends BasePage {
//   readonly searchInput: Locator;
//   readonly searchButton: Locator;
//   readonly results: Locator;

//   constructor(page: Page) {
//     super(page);
//     this.searchInput = page.locator('input[data-testid="search-input"]');
//     this.searchButton = page.getByRole('button', { name: /Search/i });
//     this.results = page.locator('ul[class*="listing-results"] li');
//   }

//   async search(query: string) {
//     await this.searchInput.fill(query);
//     await this.searchButton.click();
//     await expect(this.results.first()).toBeVisible({ timeout: 5000 });
//   }
// }
}
