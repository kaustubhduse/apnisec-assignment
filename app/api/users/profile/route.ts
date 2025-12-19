import UserController from '@/lib/controllers/UserController';

export async function GET(request: Request) {
  return UserController.getProfile(request);
}
export async function PUT(request: Request) {
  return UserController.updateProfile(request);
}
