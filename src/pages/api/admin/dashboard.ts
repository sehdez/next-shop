import { db } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { connect } from '../../../database/db';

type Data = 
{
    numberOfOrders         : number;
    paidOrders             : number;
    notPaidOrders          : number;
    numberOfClients        : number;
    numberOfProducts       : number;
    productsWithNoInventory: number;
    lowInventory           : number;
} | { ok:boolean, msg: string; }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET':
            getDataOfDashboard(req, res);
            break;
        default:
            res.status(400).json({ok: false, msg: 'Bad request'});
    }



}

const  getDataOfDashboard = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const [
        numberOfOrders, 
        paidOrders, 
        numberOfClients, 
        numberOfProducts, 
        productsWithNoInventory,
        lowInventory
    ] =  await Promise.all([
        Order.count(),
        Order.count({ isPaid: true }),
        User.count({ role: 'client' }),
        Product.count(),
        Product.count({ inStock: 0 }),
        Product.count({ inStock:{ $gt:0, $lt: 11 }})
    ])
    await db.disconnect();

    res.json({ 
        numberOfOrders, 
        paidOrders, 
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts, 
        productsWithNoInventory,
        lowInventory
    })
}
