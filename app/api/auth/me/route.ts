import AuthController from "@/lib/controllers/AuthController";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return AuthController.me(request);
}
