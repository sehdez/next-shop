import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';

type Data =
    | { message: string }
    | IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return await getProducts(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }

}


const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { gender = 'all', page = 1, limit = 12 } = req.query;
    if (!SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        return res.status(400).json({ message: `${gender} no es un género permitido intenta con: ${SHOP_CONSTANTS.validGenders}` })
    }
    const pageNumber = parseInt(`${page}`);
    const limitNumber = parseInt(`${limit}`);
    let condition = {}
    if (gender !== 'all') {
        condition = { gender };
    }
    try{
        await db.connect()


        const products = await Product.find(condition)
            .select('title images price inStock slug -_id')
            .skip(pageNumber * limitNumber - limitNumber)
            .limit(limitNumber)
            .lean(); // lean es para traer menos información

        // await db.disconnect()

        return res.json(products);
    }catch(error){
        console.log(error)
        await db.disconnect()
        return res.status(500).json({message:'Error del servidor'})
    }
    


}
