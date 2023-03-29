import { IProduct } from "@/interfaces";
import { db } from "."
import Product from '../models/Product';


export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();

    await db.disconnect();

    if (!product) {
        return null
    }
    return JSON.parse(JSON.stringify(product));

}


interface ProductSlug {
    slug: string;
}
export const getAllProductSlug = async () => {
    await db.connect()
    const slugs = await Product.find().select('slug -_id').lean();

    await db.disconnect()

    return slugs;
}

export const getProductByTerm = async (term: string): Promise<IProduct[]> => {
    term = term.toString().toLowerCase();
    // TODO: cambiar la búsqueda
    await db.connect()
    const products = await Product.find({
        $text: { $search: term }
    })
        .select('title images price inStock slug -_id')
        .lean();
    await db.disconnect()
    return products;
}

export const getAllProducts = async (): Promise<IProduct[]> => {
    await db.connect()
    const products = await Product.find().select('title images price inStock slug -_id -_id').lean();

    await db.disconnect()

    return products;
}