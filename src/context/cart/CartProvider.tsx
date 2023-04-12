import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import Cookie from 'js-cookie'

import { ICartProduct } from '@/interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    taxRate: 0,
    total: 0
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);


    useEffect(() => {
        const cartInCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
        try {
                dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: cartInCookie })

        } catch {
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: [] })
        }
    }, [])


    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])



    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)
        const subtotal = state.cart.reduce((prev, current) => (current.quantity * current.price) + prev, 0)
        const taxRate = subtotal * Number(`0.${process.env.NEXT_PUBLIC_TAX_RATE}` || 0.15);
        const orderSummary = {
            numberOfItems,
            subtotal,
            taxRate,
            total: subtotal + taxRate
        }
        dispatch({ type: '[CART] - Updated order summary', payload: orderSummary })

    }, [state.cart])



    const addProductToCart = (newProduct: ICartProduct) => {
        const products = state.cart;
        let productInCart = products.find(product => product._id === newProduct._id && product.size === newProduct.size)
        if (!productInCart)
            return dispatch({ type: '[CART] - Updated products in cart', payload: [...products, newProduct] })

        const updatedProducts = products.map(p => {
            if (p._id === newProduct._id && p.size === newProduct.size) {
                p.quantity + newProduct.quantity > p.inStock
                    ? p.quantity = p.inStock
                    : p.quantity += newProduct.quantity
                return p;
            }
            return p;
        })
        dispatch({ type: '[CART] - Updated products in cart', payload: updatedProducts })

    }


    const removeProductInCart = (product: ICartProduct) => {
        const updatedProducts = state.cart.filter(p => !(product._id === p._id && product.size === p.size))
        dispatch({ type: '[CART] - Updated products in cart', payload: updatedProducts })
    }


    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[CART] - Updated quantity in cart', payload: product })
    }


    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            updateCartQuantity,
            removeProductInCart
        }}
        >
            {children}
        </CartContext.Provider >
    )
}
