import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const DB_DATABASE = process.env.DB_DATABASE
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

const DBconnection = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
    logging: false
})

const testConnection = async () => {
    try {
        await DBconnection.authenticate()
        console.log('Database connected successfully')
    } catch (error) {
        console.log('Ocurred a error trying to connect in Database: ' + error)
    }
}

testConnection()

export default DBconnection