// Test script to debug registration
import AuthService from './lib/services/AuthService';

async function test() {
  try {
    console.log('Testing registration...');
    const authService = new AuthService();
    const result = await authService.register('Test User', 'test@test.com', 'password123');
    console.log('✅ Registration successful!', result);
  } catch (error) {
    console.error('❌ Registration failed:', error);
  } finally {
    process.exit(0);
  }
}

test();
