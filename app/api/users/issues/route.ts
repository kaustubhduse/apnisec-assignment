import IssueController from '@/lib/controllers/IssueController';

export async function GET(request: Request) {
  return IssueController.listIssues(request);
}
export async function POST(request: Request) {
  return IssueController.createIssue(request);
}
