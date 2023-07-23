import { FC, useState, useEffect } from 'react'
import { GetServerSideProps }      from 'next'
import { useRouter }               from 'next/router';
import { useForm }                 from 'react-hook-form';

import { DriveFileRenameOutline, SaveOutlined } from '@mui/icons-material';
import { Box, Grid }                            from '@mui/material';


import { FormProductLeft, FormProductRight }    from '@/components/admin';
import { AdminLayout }      from '@/components/layouts'
import { IProduct }         from '@/interfaces';
import { dbProducts }       from '@/database';
import shopApi              from '@/api/shopApi';
import { Product }          from '@/models';
import { AlertSnackbar, ButtonWithLoader } from '@/components/ui';

interface Props {
    product: IProduct;
}

export interface FormDataInterface {
    _id?       : string;
    description: string;
    images     : string[];
    inStock    : number;
    price      : number;
    sizes      : string[];
    slug       : string;
    tags       : string[];
    title      : string;
    type       : string;
    gender     : string
}


const ProductAdminPage: FC<Props> = ({ product }) => {

    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false)
    const [alertSnackbar, setAlertSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })
    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormDataInterface>({
        defaultValues: product
    })
    
    const onSubmit = async (form: FormDataInterface ) => {
        if(form.images.length < 2) {
            return setAlertSnackbar({
                open: true,
                message: 'El producto necesita al menos dos imagenes',
                severity: 'error'
            })
        }
        setIsSaving(true)
        try {
            const { data } = await shopApi<IProduct>({
                url: '/admin/products',
                method:  form._id ? 'PUT' : 'POST',
                data: form
            })
            if( !form._id ) {
                setIsSaving(false)
                setAlertSnackbar({
                    open: true,
                    message: 'Se creo el producto con éxito',
                    severity: 'success'
                })
                router.replace(`/admin/products/${ data.slug }`)
            }else {
                setIsSaving(false)
                setAlertSnackbar({
                    open: true,
                    message: 'Se actualizó con éxito el producto',
                    severity: 'success'
                })
            }

        } catch (error: any) {
            console.log(error)
            setIsSaving(false)
            setAlertSnackbar({
                open: true,
                message: error?.response?.data?.msg || 'Ocurrió un error intente de nuevo',
                severity: 'error'
            })
        }

    }

    useEffect(()=> {
        const subscription = watch(( value, { name, type } ) => {
            if( name === 'title' ) {
                const newSlug = value.title?.trim()
                        .replaceAll(' ', '_')
                        .replaceAll("'", '')
                        .replaceAll("´", '')
                        .replaceAll("`", '')
                        .replaceAll("á", 'a')
                        .replaceAll("é", 'e')
                        .replaceAll("í", 'i')
                        .replaceAll("ó", 'o')
                        .replaceAll("ú", 'u')
                        .replaceAll("Á", 'a')
                        .replaceAll("É", 'e')
                        .replaceAll("Í", 'i')
                        .replaceAll("Ó", 'o')
                        .replaceAll("Ú", 'u')
                        .toLowerCase() || '';
                setValue('slug', newSlug, { shouldValidate:true })
            }
        })
        return () =>  subscription.unsubscribe();

    },[watch, setValue])


    return (
        <AdminLayout
            title={'Producto'}
            subtitle={`${ product._id ? 'Editando': 'Nuevo'}: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            <AlertSnackbar
                alertSnackbar={alertSnackbar}
                setAlertSnackbar={ setAlertSnackbar }
             />
            
            <form onSubmit={ handleSubmit(onSubmit) } >
                <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                    <ButtonWithLoader
                        label='Guardar'
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        isLoading={ isSaving }
                    />
                </Box>

                <Grid container spacing={4}>

                    {/* Data */}
                    <FormProductLeft
                        errors={ errors }
                        getValues={ getValues }
                        register={ register }
                        setValue={ setValue }
                    />

                    {/* Tags e imagenes */}
                    <FormProductRight 
                        errors={errors}
                        getValues={ getValues }
                        register={ register }
                        setValue={ setValue }
                    />

                </Grid>
            </form>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = '' } = query;

    let product : IProduct | null;

    if( slug === 'new' ) {
        const temProduct = JSON.parse( JSON.stringify( new Product() ) )
        delete temProduct._id;
        temProduct.images = [ 
            `${ process.env.NEXTAUTH_URL }/icon.png`,
            `${ process.env.NEXTAUTH_URL }/icon2.png`
        ];
        product = temProduct;
    }else {
        product = await dbProducts.getProductBySlug(slug.toString());
    }

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    return {
        props: {
            product
        }
    }
}

export default ProductAdminPage