import AuthController from "@/lib/controllers/AuthController";
import '@/lib/queue/consumer-init';

export const runtime = "nodejs";

export async function POST(request: Request) {
  return AuthController.register(request);
}
