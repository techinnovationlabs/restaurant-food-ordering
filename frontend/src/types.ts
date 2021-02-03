export interface Item {
    id: number,
    name: string,
    price: number,
    category: string;
}

export interface OrderItem {
    id: number,
    count: number,
    category: string;
}

export interface OfferItems {
    offer1: Item[],
    offer2: Item[];
}

export interface ItemInfo {
    item_id: number;
    count: number;
}

export interface Orders {
    id: number,
    status: string,
    total: number,
    deal: string;
    items: ItemInfo[];
}
