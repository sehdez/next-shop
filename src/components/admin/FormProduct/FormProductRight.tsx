import { ChangeEvent, FC, useRef, useState } from 'react'
import { 
    Grid, TextField, Box, Chip, 
    Divider, FormLabel, Card, 
    CardMedia, CardActions } from '@mui/material';

import { 
    FieldErrors, UseFormGetValues, 
    UseFormRegister, UseFormSetValue } from 'react-hook-form';
    
import { UploadOutlined } from '@mui/icons-material';

import { FormDataInterface } from '@/pages/admin/products/[slug]';
import { shopApi } from '@/api';
import { ButtonWithLoader } from '@/components/ui';
import { AlertSnackbar } from '../../ui/AlertSnackbar';

interface Props {
    getValues : UseFormGetValues<FormDataInterface>
    register  : UseFormRegister <FormDataInterface>
    setValue  : UseFormSetValue <FormDataInterface>
    errors    : FieldErrors     <FormDataInterface>
}

export const FormProductRight: FC<Props> = ({ errors, getValues, register, setValue }) => {

    const [newTag, setNewTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUpdateImage, setIsUpdateImage] = useState(false)
    const [alertSnack, setAlertSnack] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const onDeleteTag = (tag: string) => {
        const tags = getValues('tags');
        setValue('tags', tags.filter(t => tag !== t), { shouldValidate: true })
    }

    const onNewTag = () => {
        const newTagValue = newTag.trim();
        setNewTag('');
        const tags = getValues('tags');
        if (tags.includes(newTagValue) || newTagValue.length == 0) {
            return
        }
        tags.push(newTagValue)
        // setValue('tags', [ ...tags, newTagValue ], { shouldValidate:true })
    }
    const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!target.files || target.files.length === 0) {
            return;
        }
        setIsUpdateImage(true);
        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await shopApi.post<{ msg: string }>('/admin/upload', formData);
                setIsUpdateImage(false)
                setValue('images', [...getValues('images'), data.msg], { shouldValidate: true })
            }

        } catch (error: any) {
            setIsUpdateImage(false)
            console.log(error)
            setAlertSnack({
                open: true,
                message: error?.response?.data?.msg || 'Error al cargar la imagen',
                severity: 'error',
            })
        }
    }

    const onDeleteImage = (image: string) => {
        setValue(
            'images',
            getValues('images').filter(img => img !== image),
            { shouldValidate: true })
    }

    return (
        <Grid item xs={12} sm={6}>
            <AlertSnackbar
                alertSnackbar={alertSnack}
                setAlertSnackbar={setAlertSnack}
            />
            <TextField
                label="Slug - URL"
                variant="filled"
                fullWidth
                sx={{ mb: 2 }}
                {...register('slug', {
                    required: 'Este campo es requerido',
                    validate: (val) => val.trim()?.includes(' ') ? 'No puede tener espacios en blanco.' : undefined
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
                onChange={({ target }) => setNewTag(target.value)}
                onKeyUp={({ code }) => code === 'Space' ? onNewTag() : undefined}
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
                <ButtonWithLoader
                    color="secondary"
                    isLoading={ isUpdateImage }
                    label='Cargar imágenes'
                    startIcon={<UploadOutlined />}
                    // sx={{ mb: 3, padding: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                />
                <br/>
                <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='image/png, image/gif, image/jpeg, image/jpg'
                    style={{ display: 'none' }}
                    onChange={onFilesSelected}
                />

                <Chip
                    sx={{ padding: 2, display: getValues('images').length >= 2 ? 'none' : 'flex' }}
                    label="Es necesario al menos 2 imagenes"
                    color='error'
                    variant='outlined'
                />

                <Grid container spacing={2} sx={{ display: 'flex' }}>
                    {
                        getValues('images').map((img, index) => (
                            <Grid item xs={4} sm={3} key={img + index}>
                                <Card>
                                    <CardMedia
                                        component='img'
                                        className='fadeIn'
                                        image={img}
                                        alt={img}
                                    />
                                    <CardActions>
                                        <ButtonWithLoader
                                            isLoading={ isUpdateImage }
                                            label='Borrar'
                                            sx={{ padding:0.5 }}
                                            fullWidth
                                            color="error"
                                            onClick={() => onDeleteImage(img)}
                                        />
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </Grid>
    )
}