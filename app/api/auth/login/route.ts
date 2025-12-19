import AuthController from '@/lib/controllers/AuthController';

export async function POST(request: Request) {
  return AuthController.login(request);
}
