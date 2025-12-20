import UserRepository from '../repositories/UserRepository';
import { NotFoundError } from '../utils/Errors';
import { notificationQueue } from '../queue/NotificationQueue';

export default class UserService {
  private userRepo = new UserRepository();

  async getProfile(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new NotFoundError('User not found');
    const { password, refreshTokens, ...rest } = user as any;
    return rest;
  }

  async updateProfile(userId: string, data: { name?: string }) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new NotFoundError('User not found');
    const updated = await this.userRepo.updateUser(userId, data);
    
    try {
      await notificationQueue.publishEmailNotification({
        type: 'profile_updated',
        to: user.email,
        data: { name: data.name || user.name }
      });
    } catch (error) {
      console.error("Failed to queue profile update email:", error);
    }
    
    return updated;
  }
}
