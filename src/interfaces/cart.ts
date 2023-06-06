import { ISize } from './';

export interface ICartProduct {
    _id        : string;
    description: string;
    image      : string;
    inStock    : number;
    price      : number;
    size?      : ISize;
    slug       : string;
    tags       : string[];
    title      : string;
    gender     : 'men' | 'women' | 'kid' | 'unisex',
    quantity   : number
}

