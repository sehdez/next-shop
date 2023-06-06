import { ICartProduct, ShippingAddress } from '@/interfaces'
import { CartState } from './'

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
    | { type: '[CART] - Order Complete' }

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
        case '[CART] - Order Complete':
            return {
                ...state,
                cart : [],
                numberOfItems: 0,
                subtotal: 0,
                total: 0,
                taxRate: 0
            }

        default: return state
    }
}