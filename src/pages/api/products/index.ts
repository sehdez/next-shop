import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';

type Data =
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }

}


const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { gender = 'all' } = req.query;
    if (!SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        return res.status(400).json({ message: `${gender} no es un género permitido intenta con: ${SHOP_CONSTANTS.validGenders}` })
    }
    let condition = {}
    if (gender !== 'all') {
        condition = { gender };
    }

    await db.connect()

    const products = await Product.find(condition)
        .select('title images price inStock slug -_id')
        .lean(); // lean es para traer menos información

    await db.disconnect()

    return res.json(products);


}
