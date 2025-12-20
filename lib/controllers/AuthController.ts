import { NextResponse } from 'next/server';
import AuthService from '../services/AuthService';
import { BadRequestError } from '../utils/Errors';
import { LoginSchema, RegisterSchema } from '../validators/AuthValidator';
import RateLimiter from '../services/RateLimiter';

export default class AuthController {
  static async register(request: Request){
    try{
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      RateLimiter.check(ip);

      const body = await request.json();
      const data = RegisterSchema.parse(body);
      const service = new AuthService();
      const user = await service.register(data.name, data.email, data.password);
      return NextResponse.json({ user },{ status: 201 });
    } 
    catch(err: any){
      console.error('Registration error:', err);
      
      if(err instanceof BadRequestError){
        return NextResponse.json({ error: err.message }, { status: err.statusCode });
      }
      if(err instanceof SyntaxError){
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      }
      if(err.name === 'ZodError'){
        return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
      }
      return NextResponse.json({ error: err.message || 'Registration failed' }, { status: err.statusCode || 500 });
    }
  }

  static async login(request: Request){
    try{
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      RateLimiter.check(ip);

      const body = await request.json();
      const data = LoginSchema.parse(body);
      const service = new AuthService();
      const { accessToken, refreshToken } = await service.login(data.email, data.password);
      return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
    } 
    catch(err: any){
      if(err.name === 'UnauthorizedError'){
        return NextResponse.json({ error: err.message }, { status: 401 });
      }
      return NextResponse.json({ error: 'Login failed' }, { status: 400 });
    }
  }

  static async logout(request: Request){
    try{
      const { refreshToken } = await request.json();
      const service = new AuthService();
      const payload: any = JSON.parse(atob(refreshToken.split('.')[1]));
      await service.logout(payload.userId, refreshToken);
      return NextResponse.json({ message: 'Logged out' }, { status: 200 });
    } 
    catch(err: any){
      return NextResponse.json({ error: 'Logout failed' }, { status: 400 });
    }
  }

  static async me(request: Request){
    try{
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if(!token) throw new BadRequestError('No token provided');
      const service = new AuthService();
      const user = await service.getCurrentUser(token);
      const { password, refreshTokens, ...safeUser } = user;
      return NextResponse.json({ user: safeUser }, { status: 200 });
    } 
    catch(err: any){
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }

  static async refresh(request: Request){
    try{
      const { refreshToken } = await request.json();
      const service = new AuthService();
      const tokens = await service.refreshToken(refreshToken);
      return NextResponse.json(tokens, { status: 200 });
    } 
    catch(err: any){
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }
}
