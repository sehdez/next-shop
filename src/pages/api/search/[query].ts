import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { Product } from '@/models'
import { IProduct } from '../../../interfaces/products';
type Data =
    | { message: string }
    | IProduct
    | IProduct[]
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':
            return searchProducts(req, res)
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}
const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { query = '' } = req.query;
    if (query.length == 0) {
        res.status(400).json({ message: 'Debe especificar el query de búsqueda' })
    }
    query = query.toString().toLowerCase();
    // TODO: cambiar la búsqueda
    await db.connect()
    const products = await Product.find({
        $text: { $search: query }
    })
        .select('title images price inStock slug -_id')
        .lean();
    await db.disconnect()

    return res.status(200).json(products);
}

