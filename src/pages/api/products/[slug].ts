import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';

type Data =
    | { message: string }
    | IProduct

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { slug } = req.query;
    await db.connect()
    const product = await Product.findOne({ slug }).lean()
    if (!product) {
        await db.disconnect();
        return res.status(404).json({ message: 'No se encontró el producto' })

    }

    await db.disconnect();
    switch (req.method) {
        case 'GET':
            return res.status(200).json(product)

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}
