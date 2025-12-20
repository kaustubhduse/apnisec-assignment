import IssueRepository from "../repositories/IssueRepository";
import UserRepository from "../repositories/UserRepository";
import { NotFoundError } from "../utils/Errors";
import { EmailService } from "./EmailService";

export default class IssueService {
  private issueRepo: IssueRepository;
  private userRepo: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.issueRepo = new IssueRepository();
    this.userRepo = new UserRepository();
    this.emailService = new EmailService();
  }

  async listIssues(userId: string, type?: string, search?: string) {
    return this.issueRepo.getAllIssues(userId, type, search);
  }

  async getIssue(userId: string, issueId: string) {
    const issue = await this.issueRepo.getIssueById(issueId, userId);
    if (!issue) {
      throw new NotFoundError("Issue not found");
    }
    return issue;
  }

  async createIssue(userId: string, issueData: any) {
    const issue = await this.issueRepo.createIssue(userId, issueData);

    const user = await this.userRepo.getUserById(userId);
    if (user) {
      try {
        await this.emailService.sendIssueCreatedEmail(user.email, {
          type: issue.type,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          status: issue.status,
        });
      } catch (error) {
        console.error("Failed to send issue notification email:", error);
      }
    }

    return issue;
  }

  async updateIssue(userId: string, issueId: string, data: any) {
    const updated = await this.issueRepo.updateIssue(issueId, userId, data);
    return updated;
  }

  async deleteIssue(userId: string, issueId: string) {
    await this.issueRepo.deleteIssue(issueId, userId);
  }
}
