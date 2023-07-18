import { db } from '@/database';
import { User } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from '../../../interfaces/user';

type Data = 
| IUser[]
|{ msg: string}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET':
            return getUsers(req, res)
        case 'PUT':
            return updateUsers(req, res)

        default: res.status(400).json({msg: 'Bad request'})
    }

}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.json( users )



}
const updateUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    const { userId = '', role = '' } = req.body;

    if( !isValidObjectId( userId ) ){
        return res.status(400).json({msg: 'No existe usuario con ese id'});
    }

    const validRoles = ['admin', 'client'];
    if( !validRoles.includes(role) ){
        return res.status(400).json({ msg: 'Rol *' + role  + '* no permitido: ' + validRoles.join(', ') });
    }

    await db.connect();
    const user = await User.findById( userId );

    if(!user){
        await db.disconnect();
        return res.status(400).json({ msg: 'No se encontró el usuario con el id: ' + userId });
    }
    user.role = role;
    await user.save();
    await db.disconnect();
    
    return res.json({ msg: 'Usuario actualizado' });

}

