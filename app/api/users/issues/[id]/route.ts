import IssueController from '@/lib/controllers/IssueController';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Attach the issue ID to a header for simplicity
  request.headers.set('issue-id', params.id);
  return IssueController.getIssue(request);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  request.headers.set('issue-id', params.id);
  return IssueController.updateIssue(request);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  request.headers.set('issue-id', params.id);
  return IssueController.deleteIssue(request);
}
