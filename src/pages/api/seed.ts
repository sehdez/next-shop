import type { NextApiRequest, NextApiResponse } from 'next'

import { db, seedDatabase } from '@/database';
import { Product, User } from '@/models'
type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {

        if (process.env.NODE_ENV === 'production') {
            return res.status(401).json({ message: 'No tienes acceso a este servicio' })
        }
        await db.connect();
        
        await Product.deleteMany();
        await Product.insertMany(seedDatabase.initialData.products)

        await User.deleteMany();
        await User.insertMany( seedDatabase.initialData.users );
        
        await db.disconnect();
        
        res.status(200).json({ message: 'Proceso realizado correctamente' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Ocurrió un error' })
    }
}
