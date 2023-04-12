import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt   from 'bcryptjs';
import { db }   from '@/database';
import { User } from '@/models';
import { jwt, validations }  from '@/utils';

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
        case 'POST':
            return register(req, res);

        default:
            res.status(404).json({ message: ' Bad request' })
    }
}

const register = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '', name = '' } = req.body as { email:string, password: string, name: string};

    // Validar email
    if (!validations.isValidEmail(email)) {
        return res.status(400).json({ message: 'El email no es de formato válido' })
    }

    await db.connect();

    const user = await User.findOne({ email }).lean();

    if ( user ) {
        await db.disconnect()
        return res.status(404).json({ message: 'El correo ya está registrado' })
    }
    if ( password.length < 6 ) {
        await db.disconnect()
        return res.status(404).json({ message: 'La contraseña debe ser mayor a 6 caracteres' })
    }

    if (password.length < 2) {
        await db.disconnect()
        return res.status(404).json({ message: 'El nombre debe ser mayor a 2 caracteres' })
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync( password ),
        name,
        role: 'client'
    });

    try {
        await newUser.save({validateBeforeSave: true});
        await db.disconnect()
    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({message:'Error inesperado, revisar los del servidor'})
    }
    
    const { _id } = newUser;
    const token = jwt.signToken(_id, email)
    return res.status(200).json({
        token,
        user: { email, role: 'client', name }
    })


}