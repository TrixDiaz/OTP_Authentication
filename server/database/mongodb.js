import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fastlink')
  }  catch (error) {

  }
};

export default connectToDatabase;