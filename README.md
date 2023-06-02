

# Shop

## Indicaciones para levantar el proyecto despues de clonar el repositorio
Para correr localmente, se necesita la base de datos, o puedes conectarte a tu BD de mongo en la nube
```
docker-compose up -d
```
## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
* MongoDB URL Local:
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

## Reconstruir los módulos de node y levantar Next
```
yarn install
yarn build
yarn start
```

## Llenar la base de datos con información de pruebas

Llamara:
```
http://localhost:3000/api/seed
```

## Dependencias
- ### [Material UI](https://mui.com/material-ui/getting-started/installation/)
- ### [React slideshow image](https://www.npmjs.com/package/react-slideshow-image)
- ### [React Hook Form](https://react-hook-form.com/)
- ### [Data Grid](https://mui.com/x/react-data-grid/getting-started/#main-content)
- ### [Mongoose](https://www.npmjs.com/package/mongoose)
- ### [SRW](https://swr.vercel.app/es-ES)
- ### [JavaScript Cookie](https://www.npmjs.com/package/js-cookie)
- ### [Node bcryptjs](https://www.npmjs.com/package/bcrypt)
- ### [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)