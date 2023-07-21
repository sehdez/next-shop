import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary'

import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';

cloudinary.config(process.env.CLOUDINARY_URL || '' );

type Data = 
    | { msg: string }
    | IProduct[]
    | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers( req, res )
        case 'PUT':
            return updateProduct( req, res )
        case 'POST':
            return createProduct(req, res)
        case 'DELETE':
    
        default:
            return res.status(400).json({ msg: 'Bad request' })
    }

}

const getUsers =  async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect()
    const products = await Product.find()
        .sort('asc')
        .lean();
    await db.disconnect()

    return res.status(200).json(products)

}
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id, images = [] } = req.body as IProduct;

    if (!isValidObjectId) {
        return res.status(400).json({msg:`${_id} no es un id válido`})
    }

    if( images.length < 2 ){
        return res.status(400).json({ msg: 'Es necesario por lo menos 2 imágenes' })
    }

    // TODO: posiblemente tendremos un localhost:3000/productos/...

    try {
        await db.connect()
        const productEdit = await Product.findById(_id);

        if(!productEdit){
            await db.disconnect();
            return res.status(400).json({ msg: 'No existe un producto con el id: ' + _id })
        }
        
        productEdit.images.forEach( async( image ) =>  {
            if(!images.includes(image) && image.includes('https') ) {
                // https://res.cloudinary.com/sehdez1/image/upload/v1689897706/i2sxwyscximpdmxvlupz.jpg
                // Borrar de Cloudinary
                const [ fileId, fileExtension ] = image.substring(image.lastIndexOf('/') + 1).split('.');
                await cloudinary.uploader.destroy( fileId )
            }
        })

        await productEdit.updateOne( req.body );

        await db.disconnect()
        res.status(200).json( productEdit );

        
    } catch (error) {
        await db.disconnect();
        console.log(error)
        return res.status(500).json({ msg: 'Error del servidor' })

    }

}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [], slug } = req.body as IProduct;
    
    if( images.length < 2 ) {
        return res.status(400).json({ msg: 'El producto necesita al menos 2 imágenes' })
    }
    // TODO: posiblemente tendremos un localhost:3000/productos/...

    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug });

        if( productInDB ){
            await db.disconnect();
            return res.status(400).json({ msg: `El slug: '${ slug }' ya existe` })
        }

        const producto = new Product(req.body);
        await producto.save();
        await db.disconnect();
        res.status(201).json(producto);
    } catch (error) {
        await db.disconnect();
        console.log({error})
        return res.status(500).json({ msg: 'Error del servidor' })
    }
}

