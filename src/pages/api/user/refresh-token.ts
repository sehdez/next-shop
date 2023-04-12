import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { db } from '@/database';
import { User } from '@/models';
import { jwt } from '@/utils';

type Data =
    | { message: string }
    | {
        token: string;
        user: {
            email: string;
            name: string;
            role: string;
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return checkJWT(req, res);

        default:
            res.status(404).json({ message: ' Bad request' })
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { token = '' } = req.cookies as { token: string };

    let userId = '';
    try{
        userId = await jwt.isValidToken( token )
    }catch(err){
        console.log(err)
        return res.status(401).json({message: 'Token de autorización no es válido'})
    }
    await db.connect();

    const user = await User.findById(userId).lean();
    await db.disconnect()

    if (!user) {
        return res.status(404).json({ message: 'no existe usuario con ese id' })
    }

    const { name, role, email, _id } = user;
    return res.status(200).json({
        token: jwt.signToken(_id, email),
        user: { email, role, name }
    })


}
