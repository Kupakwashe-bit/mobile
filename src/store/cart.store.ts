import { create } from 'zustand';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    shopId: string;
    shopName: string;
}

interface CartState {
    items: CartItem[];
    addItem: (product: any, shop: any) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (product, shop) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === product.id);

        if (existing) {
            set({
                items: items.map((i) =>
                    i.productId === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [
                    ...items,
                    {
                        productId: product.id,
                        name: product.name,
                        price: Number(product.price),
                        quantity: 1,
                        shopId: shop.id,
                        shopName: shop.name,
                    },
                ],
            });
        }
    },
    removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
    updateQuantity: (productId, quantity) =>
        set({
            items: get().items.map((i) =>
                i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i
            ).filter(i => i.quantity > 0),
        }),
    clearCart: () => set({ items: [] }),
    get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
}));
