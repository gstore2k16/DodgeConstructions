/**
 * Abstract base class representing a product item.
 * Used instead of an interface to allow runtime type information
 * and potential shared method logic in subclasses.
 */
export abstract class Item {
  abstract readonly id: number;
  abstract readonly name: string;
  abstract readonly category: string;
  abstract readonly price: number;
  abstract readonly description: string;
  abstract readonly inStock: boolean;
  abstract readonly stockCount: number;
  abstract readonly image: string;
  abstract readonly features: readonly string[];
}
