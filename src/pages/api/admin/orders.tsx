import { db } from '@/database';
import { Order } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces/order';

type Data = 
    | { msg: string }
    | IOrder[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ){
        case 'GET':
            return getOrders( req,res );
        
            default:
            return res.status(404).json({ msg: 'Bad Request' })
    }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        await db.connect();
        const order = await Order.find()
            .sort({ createdAt: 'desc' })
            .populate('user', 'name email')
            .lean();
        await db.disconnect();

        return res.json(order)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Hable con el administrador del backend' })
    }

    

    

}
