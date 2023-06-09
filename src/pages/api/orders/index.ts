import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next';
import { IOrder } from '../../../interfaces/order';
import { authOption } from '../auth/[...nextauth]';
import { db } from '@/database';
import { Order, Product } from '@/models';

type Data = 
    | {message: string}
    | IOrder;


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
    const session: any = await getServerSession(req, res, authOption)

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

            const currentPrice = dbProducts.find( prod => prod._id == current._id )?.price;

            if( !currentPrice ){
                throw new Error('Verifique de nuevo el carrito, el producto no existe');
            }

            return (currentPrice * current.quantity ) + prev;
        }, 0 )
        const taxRate = Number(`0.${process.env.NEXT_PUBLIC_TAX_RATE}` || 0);
        
        const backendTotal = (subTotal * taxRate) + subTotal ;

        if( total !== backendTotal ) {
            throw new Error('El total no cuadra con el monto');
        }
        // Si no hay manipulación en los datos se ejecuta los siguiente
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        
        // Redondear a dos decimales
        newOrder.total = Math.round( newOrder.total *100 ) / 100;
        
        await newOrder.save();
        await db.disconnect();
        return res.status(201).json( newOrder )



        
    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({ 
            message: error.message || 'Revise Logs del servidor' 
        });

    }




    return res.status(201).json({message:'ok'})
}