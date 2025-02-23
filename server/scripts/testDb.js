import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    // Test creating a document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ test: String }));
    await TestModel.create({ test: 'test' });
    console.log('✅ Database write test successful!');
    
    // Clean up
    await TestModel.deleteMany({});
    await mongoose.connection.close();
    
    console.log('✅ All tests passed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection test failed:', err);
    process.exit(1);
  }
};

testConnection(); 