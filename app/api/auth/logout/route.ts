import AuthController from "@/lib/controllers/AuthController";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return AuthController.logout(request);
}
