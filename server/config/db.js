import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState === 1 ) {
        console.log('MongoDB is already connected');
        return;
    }
    const mongoURI = process.env.MONGODB_URI 
    if (!mongoURI) {
        console.error('MongoDB URI is not defined in environment variables');
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoURI, {})
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);    
    }
}

export default connectDB;