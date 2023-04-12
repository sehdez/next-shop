import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt   from 'bcryptjs';
import { db }   from '@/database';
import { User } from '@/models';
import { jwt }  from '@/utils';

type Data = 
    | { message: string }
    | { 
        token: string; 
        user: {
            email: string;
            name : string;
            role : string;
    }}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ) {
        case 'POST':
            return login( req, res );

        default:
            res.status(404).json({ message: ' Bad request' })
    }
}

const login = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '', password= '' } = req.body;
     
    await db.connect();

    const user = await User.findOne({ email }).lean();
    await db.disconnect()
    
    if (!user){
        return res.status(404).json({message: 'Correo o contraseña invalidos (email)'})
    }
    if( !bcrypt.compareSync( password, user.password! ) ){
        return res.status(404).json({ message: 'Correo o contraseña invalidos (contraseña)' })
    }

    const { name, role, _id } = user;
    const token = jwt.signToken( _id, email )
    return res.status(200).json({
        token,
        user: { email, role, name }
    })


}
