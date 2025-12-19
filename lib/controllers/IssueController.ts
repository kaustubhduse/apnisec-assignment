import { NextResponse } from 'next/server';
import IssueService from '../services/IssueService';
import { CreateIssueSchema, UpdateIssueSchema } from '../validators/IssueValidator';
import { BadRequestError, UnauthorizedError } from '../utils/Errors';
import RateLimiter from '../services/RateLimiter';

export default class IssueController {
  static async listIssues(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      const { searchParams } = new URL(request.url);
      const type = searchParams.get('type') || undefined;
      const service = new IssueService();
      const issues = await service.listIssues(userId, type);
      return NextResponse.json({ issues }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }

  static async getIssue(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      const issueId = request.headers.get('issue-id') || ''; // expect issue ID header or parse from URL if used
      if (!issueId) throw new BadRequestError('Issue ID is required');
      const service = new IssueService();
      const issue = await service.getIssue(userId, issueId);
      return NextResponse.json({ issue }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }

  static async createIssue(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      const body = await request.json();
      const data = CreateIssueSchema.parse(body);
      const service = new IssueService();
      const issue = await service.createIssue(userId, data);
      return NextResponse.json({ issue }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }

  static async updateIssue(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      const issueId = request.headers.get('issue-id') || '';
      if (!issueId) throw new BadRequestError('Issue ID is required');
      const body = await request.json();
      const data = UpdateIssueSchema.parse(body);
      const service = new IssueService();
      const updated = await service.updateIssue(userId, issueId, data);
      return NextResponse.json({ updated }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }

  static async deleteIssue(request: Request) {
    try {
      const ip = request.headers.get('x-forwarded-for') || '';
      RateLimiter.check(ip);

      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedError('No token provided');
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      const issueId = request.headers.get('issue-id') || '';
      if (!issueId) throw new BadRequestError('Issue ID is required');
      const service = new IssueService();
      await service.deleteIssue(userId, issueId);
      return NextResponse.json({ message: 'Issue deleted' }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
    }
  }
}
