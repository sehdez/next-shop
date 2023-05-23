import { createContext } from 'react'
import { ICartProduct } from '@/interfaces'
import { ShippingAddress } from './';

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
}


export const CartContext = createContext({} as ContextProps)