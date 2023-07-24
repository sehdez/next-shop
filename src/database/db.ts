import mongoose from 'mongoose';


/** 
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
**/


const mongoConnection = {
    isConnected: 0
}

export const connect = async () => {
    if (mongoConnection.isConnected === 1) {
        console.log('Ya estaba conectado1')
        return;
    }

    if (mongoConnection.isConnected > 0) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;

        if (mongoConnection.isConnected === 1) {
            console.log('Usando conexión anterior')
            return;
        }
        console.log('Me desconecté')
        await mongoose.disconnect();
    }
    const urlDB = process.env.MONGO_URL;
    const dbName = process.env.MONGO_DB_NAME;
    try {
        await mongoose.connect(urlDB || '', { dbName });
        
        mongoConnection.isConnected = 1;
        console.log('Conectado a MongoDB:', process.env.MONGO_URL, dbName);
        
    } catch (error) {
        throw new Error('Falló la conexión')
    }
}


export const disconnect = async () => {

    // return
    if (process.env.NODE_ENV === 'development') return;

    if (mongoConnection.isConnected === 0) return;

    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
}