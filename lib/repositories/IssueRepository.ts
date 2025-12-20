import prisma from '../prisma';

export default class IssueRepository {
  async getAllIssues(userId: string, type?: string, search?: string) {
    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    return prisma.issue.findMany({ where });
  }

  async getIssueById(id: string, userId: string) {
    return prisma.issue.findFirst({ where: { id, userId } });
  }

  async createIssue(userId: string, issueData: any) {
    return prisma.issue.create({
      data: { ...issueData, userId },
    });
  }

  async updateIssue(id: string, userId: string, issueData: any) {
    return prisma.issue.updateMany({
      where: { id, userId },
      data: issueData,
    });
  }

  async deleteIssue(id: string, userId: string) {
    return prisma.issue.deleteMany({ where: { id, userId } });
  }
}
