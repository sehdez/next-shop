import React, { FC }   from 'react'
import { 
    FieldErrors, 
    UseFormGetValues, 
    UseFormRegister, 
    UseFormSetValue  } from 'react-hook-form';
    
import { Grid, 
    TextField, 
    Divider, 
    FormControl, 
    FormLabel, 
    RadioGroup, 
    FormControlLabel, 
    Radio, 
    capitalize, 
    FormGroup, 
    Checkbox }      from '@mui/material';

import { FormDataInterface } from '@/pages/admin/products/[slug]';

interface Props{
    getValues   : UseFormGetValues<FormDataInterface>;
    register    : UseFormRegister <FormDataInterface>;
    setValue    : UseFormSetValue <FormDataInterface>;
    errors      : FieldErrors     <FormDataInterface>;
}
const validTypes  = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']


export const FormProductLeft: FC<Props> = ({ register,  errors, getValues, setValue } ) => {

    const onChangeSizes = (size: string) => {
        const currentValues = getValues('sizes');
        if (currentValues?.includes(size)) {
            return setValue('sizes', currentValues.filter(s => s !== size), { shouldValidate: true })
        }
        setValue('sizes', [...currentValues, size], { shouldValidate: true })
    }

    return (
        <Grid item xs={12} sm={6}>

            <TextField
                label="Título"
                variant="filled"
                fullWidth
                sx={{ mb: 2 }}
                {...register('title', {
                    required: 'Este campo es requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
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
                    value={getValues('type')}
                    onChange={({ target }) => setValue('type', target.value, { shouldValidate: true })}
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
                    value={getValues('gender')}
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
                            control={<Checkbox checked={getValues('sizes')?.includes(size)} />}
                            label={size}
                            onChange={() => onChangeSizes(size)}
                        />
                    ))
                }
            </FormGroup>
        </Grid>
    )
}
