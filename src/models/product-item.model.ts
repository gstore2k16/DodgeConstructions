import { Item } from './item.model';

/**
 * Concrete implementation of the Item abstract class.
 * Maps directly to the shape of objects in assets/items.json.
 */
export class ProductItem extends Item {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly category: string,
    public readonly price: number,
    public readonly description: string,
    public readonly inStock: boolean,
    public readonly stockCount: number,
    public readonly image: string,
    public readonly features: readonly string[],
  ) {
    super();
  }

  /**
   * Factory method to create a ProductItem from a plain JSON object.
   */
  static fromJson(json: Record<string, unknown>): ProductItem {
    let rawImage = String(json['image'] ?? '');

    // Security: Neutralize XSS protocol execution vectors (javascript: / data:text/html)
    const lowerImg = rawImage.trim().toLowerCase();
    if (lowerImg.startsWith('javascript:') || lowerImg.startsWith('data:text/html')) {
      rawImage = '';
    } else if (rawImage && !rawImage.startsWith('/') && !rawImage.startsWith('http')) {
      rawImage = '/' + rawImage;
    }

    return new ProductItem(
      Number(json['id'] ?? 0),
      String(json['name'] ?? ''),
      String(json['category'] ?? 'General'),
      Number(json['price'] ?? 0),
      String(json['description'] ?? ''),
      Boolean(json['inStock']),
      Number(json['stockCount'] ?? 0),
      rawImage,
      Array.isArray(json['features']) ? json['features'].map((f: unknown) => String(f)) : [],
    );
  }
}
