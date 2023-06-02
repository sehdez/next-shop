import { IUser } from '@/interfaces';
export interface IOrder {
    _id?           : string;
    user?          : IUser | string;
    orderItems     : IOrderItem[];
    shippingAddress: ShippingAddress;
    paymentResult? : string;

    numberOfItems  : number;
    subtotal       : number;
    taxRate        : number;
    total          : number;
    
    isPaid         : boolean;
    paidAt?        : string
}

export interface IOrderItem {
    _id     : string;
    title   : string;
    size    : string;
    quantity: number;
    slug    : string;
    price   : number;
    gender  : string
}

export interface ShippingAddress {
    firstName: string;
    lastName : string;
    address  : string;
    address2?: string;
    zipCode  : string;
    city     : string;
    country  : string;
    phone    : string;

}