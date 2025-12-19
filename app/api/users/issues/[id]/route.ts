import IssueController from "@/lib/controllers/IssueController";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Helper to add issue-id while matching Next 16 route types
async function withIssueId(
  request: NextRequest,
  params: { id: string } | Promise<{ id: string }>
) {
  const { id } = await params;
  const cloned = request.clone();
  const headers = new Headers(cloned.headers);
  headers.set("issue-id", id);

  return new Request(cloned.url, {
    method: cloned.method,
    headers,
    body:
      cloned.method === "GET" || cloned.method === "DELETE"
        ? undefined
        : cloned.body,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const newRequest = await withIssueId(request, context.params as any);
  return IssueController.getIssue(newRequest);
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const newRequest = await withIssueId(request, context.params as any);
  return IssueController.updateIssue(newRequest);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const newRequest = await withIssueId(request, context.params as any);
  return IssueController.deleteIssue(newRequest);
}
