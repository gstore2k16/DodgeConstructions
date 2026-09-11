/**
 * Abstract base class representing a product item.
 * Used instead of an interface to allow runtime type information
 * and potential shared method logic in subclasses.
 */
export abstract class Item {
    abstract id: number;
    abstract name: string;
    abstract category: string;
    abstract price: number;
    abstract description: string;
    abstract inStock: boolean;
    abstract stockCount: number;
    abstract image: string;
    abstract features: string[];
}

/**
 * Concrete implementation of the Item abstract class.
 * Maps directly to the shape of objects in assets/items.json.
 */
export class ProductItem extends Item {
    constructor(
        public id: number,
        public name: string,
        public category: string,
        public price: number,
        public description: string,
        public inStock: boolean,
        public stockCount: number,
        public image: string,
        public features: string[]
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
            Array.isArray(json['features']) ? json['features'].map((f: unknown) => String(f)) : []
        );
    }
}
