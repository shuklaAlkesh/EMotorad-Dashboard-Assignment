import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');
    
    // Create a test document
    const Test = mongoose.model('Test', { name: String });
    await Test.create({ name: 'test' });
    console.log('Test document created!');
    
    // Clean up
    await mongoose.connection.dropCollection('tests');
    await mongoose.connection.close();
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection(); 