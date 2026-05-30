import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(["8.8.8.8", "8.8.4.4"]);
export const connectDB = async ()=>{
    try {
      const conn =  await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
       console.log("MongoDB connection Error: ",error) ;
    }
}