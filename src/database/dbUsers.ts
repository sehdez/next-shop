import { db } from '@/database';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { connect, disconnect } from './db';

export const checkEmailPassword = async(email: string = '', pass: string = '') => {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if(!user)
        return null;
    
    if (!bcrypt.compareSync( pass, user.password! ))
        return null;

    const { role, name, _id } = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        name,
        role
    }
    
}

// Esta función crea o verifica el usuario de OAuth
export const oAuthDbUser = async ( oAuthEmail: string = '', oAuthName: string = '' ) => {
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if(user){
        await disconnect()
        const { role, name, _id } = user;
        return { role, name, _id };
    }
    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role:'client' })
    try{
        await newUser.save()
        await db.disconnect()
        const { role, name, _id, email } = newUser;
        return { role, name, _id, email };

    }catch(error){
        await db.disconnect()
        console.log(error)
        return null
    }
}