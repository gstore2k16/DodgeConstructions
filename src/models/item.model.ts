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
        public image: string
    ) {
        super();
    }

    /**
     * Factory method to create a ProductItem from a plain JSON object.
     */
    static fromJson(json: Record<string, unknown>): ProductItem {
        return new ProductItem(
            json['id'] as number,
            json['name'] as string,
            json['category'] as string,
            json['price'] as number,
            json['description'] as string,
            json['inStock'] as boolean,
            json['stockCount'] as number,
            json['image'] as string
        );
    }
}
