import prisma from '../prisma';

export default class UserRepository {
  async createUser(name: string, email: string, password: string) {
    return prisma.user.create({
      data: { name, email, password },
    });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({ 
      where: { id },
      include: { refreshTokens: true }
    });
  }

  async updateUser(id: string, data: object) {
    return prisma.user.update({ where: { id }, data });
  }
  
  async addRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  async removeRefreshToken(userId: string, token: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
        token
      }
    });
  }
}
