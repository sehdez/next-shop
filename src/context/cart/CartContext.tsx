import { ICartProduct } from '@/interfaces'
import { createContext } from 'react'

interface ContextProps {
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;

    // Métodos
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductInCart: (product: ICartProduct) => void;
}


export const CartContext = createContext({} as ContextProps)