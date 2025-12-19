import IssueController from "@/lib/controllers/IssueController";
import { NextRequest } from "next/server";

// Helper to attach issue-id header while keeping types compatible with Next 16
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
    // Avoid passing a body for GET/DELETE; clone() gives us a fresh stream for PUT
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
