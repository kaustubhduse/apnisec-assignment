import AuthController from '@/lib/controllers/AuthController';

export async function GET(request: Request) {
  return AuthController.me(request);
}
