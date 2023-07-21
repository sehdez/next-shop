import React, { ChangeEvent, FC, useRef, useState }          from 'react'
import { GetServerSideProps } from 'next'
import { useForm }            from 'react-hook-form';

import { 
    Box, Button, capitalize, Card, 
    CardActions, CardMedia, Checkbox, 
    Chip, Divider, FormControl, 
    FormControlLabel, FormGroup, 
    FormLabel, Grid, ListItem, 
    Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined }   from '@mui/icons-material';


import { AdminLayout } from '@/components/layouts'
import { IProduct }    from '@/interfaces';
import { dbProducts }  from '@/database';
import { useEffect } from 'react';
import shopApi from '../../../api/shopApi';
import { Product } from '@/models';
import { useRouter } from 'next/router';


const validTypes  = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface Props {
    product: IProduct;
}

interface FormData {
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

    const [newTag, setNewTag] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    })
    const router = useRouter();
    
    const onSubmit = async ( form: FormData ) => {
        if(form.images.length < 2) return alert('Tienes que envíar dos imagenes por lo menos');
        setIsSaving(true)
        try {
            const { data } = await shopApi<IProduct>({
                url: '/admin/products',
                method:  form._id ? 'PUT' : 'POST',
                data: form
            })
            if( !form._id ) {
                router.replace(`/admin/products/${ data.slug }`)
            }else {
                setIsSaving(false)
            }

        } catch (error) {
            console.log(error)
            alert('Ocurrió un error')
        }

    }

    const onDeleteTag = (tag: string) => {
        const tags = getValues('tags');
        setValue('tags', tags.filter( t => tag !== t  ), { shouldValidate: true })
    }

    const onChangeSizes = ( size: string ) => {
        const currentValues = getValues('sizes');
        if( currentValues?.includes(size) ) {
            return setValue( 'sizes', currentValues.filter( s => s!== size ), { shouldValidate:true })
        }
        setValue('sizes', [...currentValues, size], { shouldValidate: true })
    }

    const onNewTag = () => {
        const newTagValue = newTag.trim();
        setNewTag('');
        const tags = getValues('tags');
        if( tags.includes(newTagValue) || newTagValue.length==0 ){
            return
        }
        tags.push(newTagValue)
        // setValue('tags', [ ...tags, newTagValue ], { shouldValidate:true })
        

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


    const onFilesSelected = async ( { target }: ChangeEvent<HTMLInputElement> ) => {
        if( !target.files || target.files.length === 0 ){
            return;
        }
        try {
            for( const file of target.files ) {
                
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await shopApi.post<{msg: string}>('/admin/upload', formData);
                console.log({data})
                setValue('images', [...getValues('images'), data.msg], { shouldValidate: true })
            }
            
        } catch (error) {
            console.log(error)
            alert('Error al cargar la imagen')
        }
    }

    const onDeleteImage = ( image: string ) => {
        setValue(
            'images', 
            getValues('images').filter(img =>  img!== image),
            { shouldValidate: true } )
    }
    return (
        <AdminLayout
            title={'Producto'}
            subtitle={`Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            <form onSubmit={ handleSubmit( onSubmit ) } >
                <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={4}>

                    {/* Data */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 2 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth
                            multiline
                            rows={6}
                            sx={{ mb: 2 }}
                            {...register('description', {
                                required: 'Este campo es requerido',
                                minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 2 }}
                            {...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de valor 0' }
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />

                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 2 }}
                            {...register('price', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de valor 0' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={({ target }) => setValue('type', target.value, { shouldValidate: true })  }
                            >
                                {
                                    validTypes.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                            
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={({ target }) => setValue('gender', target.value, { shouldValidate: true })}
                            >
                                {
                                    validGender.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={getValues('sizes')?.includes( size )} />} 
                                        label={size} 
                                        onChange={ () => onChangeSizes( size ) }
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 2 }}
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                validate: ( val ) => val.trim()?.includes(' ') ? 'No puede tener espacios en blanco.' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTag}
                            onChange={({ target }) => setNewTag( target.value ) }
                            onKeyUp ={({ code }) => code === 'Space' ? onNewTag(): undefined }
                        />

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                            component="ul">
                            {
                                getValues('tags').map((tag) => {

                                    return (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => onDeleteTag(tag)}
                                            color="primary"
                                            size='small'
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    );
                                })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 2 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3, padding:1 }}
                                onClick={ () => fileInputRef.current?.click() }
                            >
                                Cargar imagen
                            </Button>
                            <input
                                ref={ fileInputRef }
                                type='file'
                                multiple
                                accept='image/png, image/gif, image/jpeg, image/jpg'
                                style={{ display:'none' }}
                                onChange={ onFilesSelected }
                            />

                            <Chip
                                sx={{ padding: 2, display: getValues('images').length >= 2 ? 'none' : 'flex'}}
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                            />

                            <Grid container spacing={2} sx={{ display:'flex' }}>
                                {
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={ () => onDeleteImage(img) }
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = '' } = query;

    let product : IProduct | null;

    if( slug === 'new' ) {
        const temProduct = JSON.parse( JSON.stringify( new Product() ) )
        delete temProduct._id;
        temProduct.images = [ 'img1.jpg', 'img2.jpg' ];
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
