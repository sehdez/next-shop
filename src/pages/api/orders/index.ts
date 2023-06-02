import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next';
import { IOrder } from '../../../interfaces/order';
import { authOption } from '../auth/[...nextauth]';
import { db } from '@/database';
import { Product } from '@/models';

type Data = {
    message: string;
    order?: IOrder;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ){
        case 'POST':
            return createOrder(req, res)
        default:
            return res.status(404).json({message: 'Bad request'})
    }
}

const createOrder = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { orderItems, total } = req.body as IOrder;

    // verificar qie tengamos usuario
    const session = await getServerSession(req, res, authOption)

    if(!session){
        return res.status(401).json({message: 'Debe estar autenticado'})
    }

    // Crear arreglo con los id de los productos
    const productsIds = orderItems.map((product) => product._id);
    
    try {
        
        await db.connect();
    
        // Regresa un arreglo de todos los productos que tienen esos id
        const dbProducts = await Product.find({ _id: { $in: productsIds } }).lean();

        const subTotal = orderItems.reduce(( prev, current ) => {

            const currentPrice = dbProducts.find( prod => prod._id === current._id )?.price;

            if( !currentPrice ){
                throw new Error('Verifique de nuevo el carrito, el producto no existe');
            }

            return (currentPrice * current.quantity ) + prev;
        }, 0 )
        
    } catch (error) {
        
    }


    await db.disconnect();


    return res.status(201).json({message:'ok'})
}