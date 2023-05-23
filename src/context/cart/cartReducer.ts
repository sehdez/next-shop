import { ICartProduct } from '@/interfaces'
import { CartState } from './'
import { ShippingAddress } from './CartProvider';

type CartActionType =
    | { type: '[CART] - LoadCart from cookies | storage', payload: {cart: ICartProduct[], numberOfItems: number} }
    | { type: '[CART] - LoadAddress from cookies | storage', payload: ShippingAddress }
    | { type: '[CART] - Update ShipingAddress', payload: ShippingAddress }
    | { type: '[CART] - Updated products in cart', payload: ICartProduct[] }
    | { type: '[CART] - Updated quantity in cart', payload: ICartProduct }
    | {
        type: '[CART] - Updated order summary',
        payload: {
            numberOfItems : number;
            subtotal      : number;
            taxRate       : number;
            total         : number;
        }
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    switch (action.type) {
        case '[CART] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                numberOfItems: action.payload.numberOfItems,
                cart: [...action.payload.cart]
            }

        case '[CART] - LoadAddress from cookies | storage':
        case '[CART] - Update ShipingAddress':
            return {
                ...state,
                shippingAddress: action.payload
            }

        case '[CART] - Updated products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }

        case '[CART] - Updated quantity in cart':
            const productInCart = action.payload;
            const updatedCart = state.cart.map(p => {
                if (productInCart._id === p._id && productInCart.size === p.size) {
                    return productInCart
                } else {
                    return p
                }
            })
            return {
                ...state,
                cart: [...updatedCart]
            }

        case '[CART] - Updated order summary':
            return {
                ...state,
                ...action.payload
            }

        default: return state
    }
}