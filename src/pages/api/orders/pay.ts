import { db } from '@/database'
import { IPaypal } from '@/interfaces'
import { Order } from '@/models'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method) {
        case 'POST':
            return payOrder( req, res )

        default:
            return res.status(400).json({ message: 'Bad request' })

    }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
    const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');
    
    // PAYPAL_OAUTH_URL
    // PAYPAL_ORDERS_URL
    try{
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': `Basic ${base64Token}`
            }
        });
        return `${data.access_token}`;
    }catch(error){
        if( axios.isAxiosError(error) ) {
            console.log(error.response?.data);
        }else {
            console.log(error);
        }
        return null;
    }
}

const  payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Validar Sesión del usuario
    // Validar MongoID
    const paypalBearerToken = await getPaypalBearerToken();
    if(!paypalBearerToken){
        return res.status(400).json({message: 'No se pudo confirmar el token de paypal'})
    }

    const { transactionId  = '', orderId = ''} = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL || ''}/${transactionId}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    })
    if( data.status !== 'COMPLETED' ){
        return res.status(401).json({message:'Orden no reconocida'})
    }
    await db.connect()
    
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder){
        await db.disconnect()
        return res.status(400).json({message: 'La orden no existe en la base de datos'})
    }
    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        console.log({total: dbOrder.total, paypal: Number(data.purchase_units[0].amount.value)})
        await db.disconnect();
        return res.status(400).json({message:'Los montos de paypal y nuestra orden no son iguales'})
    }
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();


    return res.json({ message: 'Orden Pagada' })
}
