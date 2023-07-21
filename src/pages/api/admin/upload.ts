import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary'

// Trabaja basado en callbacks
import formidable, { IncomingForm, File } from 'formidable';

cloudinary.config(process.env.CLOUDINARY_URL || '' );

type Data = 
    | { msg: string }

export const config = {
    api: {
        bodyParser: false,
    }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return uploadFile( req, res )            
    
        default:
            return res.status(400).json({ msg: 'Bad Request' })
    }
    
}


const saveFile = async ( file: File): Promise<string> => {
    
        //  // PARA  ALMACENAR LAS IMAGENES EN FILE SYSTEM
        // const data = fs.readFileSync( file.filepath );
        // fs.writeFileSync(`./public/${ file.originalFilename }`, data);
        // fs.unlinkSync( file.filepath )
        // return;
        const { secure_url } = await cloudinary.uploader.upload( file.filepath );
        return secure_url;


}

const parseFiles = async (req: NextApiRequest): Promise<string> => {

    return new Promise( ( resolve, reject ) => {

        const form = new IncomingForm();

        form.parse( req, async ( err, fields, files: any ) => {
            if(err){
                return reject(err)
            }
            const imageURL = await saveFile( files.file[0] as File )
            resolve(imageURL);
        } )
    } )

}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<{ msg: string }>) =>  {
    
    try {
        const imageUrl = await parseFiles( req );
        
        return res.status(200).json({ msg: imageUrl }) 
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Error del servidor'})
    }
}





