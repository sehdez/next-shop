import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import Cookie from 'js-cookie'

import { ICartProduct, ShippingAddress } from '@/interfaces';
import { CartContext, cartReducer } from './';
import { shopApi } from '@/api';
import { IOrder, IOrderItem } from '../../interfaces/order';

export interface CartState {
    isLoaded         : boolean;
    cart             : ICartProduct[];
    numberOfItems    : number;
    subtotal         : number;
    taxRate          : number;
    total            : number;
    shippingAddress? : ShippingAddress,
}

const CART_INITIAL_STATE: CartState = {
    isLoaded        : false,
    cart            : [],
    numberOfItems   : 0,
    subtotal        : 0,
    taxRate         : 0,
    total           : 0,
    shippingAddress : undefined,
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);


    useEffect(() => {
        if (Cookie.get('firstName')){
            const shippingAddress = {
                firstName : Cookie.get('firstName') ||'',
                lastName  : Cookie.get('lastName')  ||'',
                address   : Cookie.get('address')   ||'',
                address2  : Cookie.get('address2')  ||'',
                zipCode   : Cookie.get('zipCode')   ||'',
                city      : Cookie.get('city')      ||'',
                country   : Cookie.get('country')   ||'',
                phone     : Cookie.get('phone')     ||''
            }
            dispatch({ type: '[CART] - LoadAddress from cookies | storage', payload: shippingAddress })
        }
    }, [])


    useEffect(() => {
        if (state.isLoaded)
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

    useEffect(() => {
        const cartInCookie: ICartProduct[] = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
        const numberOfItems = cartInCookie.reduce((prev, current) => current.quantity + prev, 0)
        try {
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: { cart: cartInCookie, numberOfItems } })

        } catch (error) {

            console.log(error);
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: {cart:[], numberOfItems:0} })
        }
    }, [])


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

    const updateAddress = ( address: ShippingAddress ) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2 || '');
        Cookie.set('zipCode', address.zipCode);
        Cookie.set('city', address.city);
        Cookie.set('country', address.country);
        Cookie.set('phone', address.phone);
        dispatch({ type: '[CART] - Update ShipingAddress', payload: address })
    }

    const createOrder = async ()=> {

        if( !state.shippingAddress ) {
            throw new Error('No hay dirección de entrega');
        }
        const body: IOrder = {
            orderItems: state.cart as IOrderItem[],
            shippingAddress: state.shippingAddress,
            numberOfItems  : state.numberOfItems,
            subtotal       : state.subtotal,
            taxRate        : state.taxRate,
            total          : state.total,
            isPaid         : false,
        }

        try {
            const { data } = await shopApi.post('/orders', body)

            console.log({data})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            updateCartQuantity,
            removeProductInCart,
            updateAddress,

            // Ordenes
            createOrder
        }}
        >
            {children}
        </CartContext.Provider >
    )
}
