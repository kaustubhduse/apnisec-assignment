import IssueController from "@/lib/controllers/IssueController";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Add the issue ID to the request headers so the controller can access it
  const newRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
  });
  newRequest.headers.set("issue-id", params.id);

  return IssueController.getIssue(newRequest);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const newRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
  });
  newRequest.headers.set("issue-id", params.id);

  return IssueController.updateIssue(newRequest);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const newRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
  });
  newRequest.headers.set("issue-id", params.id);

  return IssueController.deleteIssue(newRequest);
}
