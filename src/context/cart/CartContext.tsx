import { createContext } from 'react'
import { ICartProduct, ShippingAddress } from '@/interfaces'

interface ContextProps {
    isLoaded      : boolean;
    cart          : ICartProduct[];
    numberOfItems : number;
    subtotal      : number;
    taxRate       : number;
    total         : number;

    shippingAddress?: ShippingAddress

    // Métodos
    addProductToCart:    (product: ICartProduct) => void;
    updateCartQuantity:  (product: ICartProduct) => void;
    removeProductInCart: (product: ICartProduct) => void;
    updateAddress:       (address: ShippingAddress) => void

    // Ordenes
    createOrder: () => Promise<{ hasError: boolean; message: string }>
}


export const CartContext = createContext({} as ContextProps)