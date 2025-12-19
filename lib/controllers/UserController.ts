import { NextResponse } from 'next/server';
import UserService from '../services/UserService';
import { UnauthorizedError } from '../utils/Errors';
import { UpdateProfileSchema } from '../validators/UserValidator';
import RateLimiter from '../services/RateLimiter';

export default class UserController {
  static async getProfile(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1])); // decode payload
      const service = new UserService();
      const user = await service.getProfile(userId);
      return NextResponse.json({ user }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }

  static async updateProfile(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      const body = await request.json();
      const data = UpdateProfileSchema.parse(body);
      const service = new UserService();
      const updatedUser = await service.updateProfile(userId, data);
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }
}
