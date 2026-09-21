import dotenv from "dotenv"
import mongoose from "mongoose"
import { beforeAll, afterAll } from "vitest"

dotenv.config()

export const test_connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.TEST_MONGO_URI)
        console.log(`✅ MongoDB Connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

beforeAll(async()=>{
    await test_connectDB()
})

afterAll(async()=>{
    await mongoose.connection.close()
})
