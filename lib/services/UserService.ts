import UserRepository from "../repositories/UserRepository";
import { NotFoundError } from "../utils/Errors";
import { EmailService } from "./EmailService";

export default class UserService {
  private userRepo = new UserRepository();
  private emailService = new EmailService();

  async getProfile(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    const { password, refreshTokens, ...rest } = user as any;
    return rest;
  }

  async updateProfile(userId: string, data: { name?: string }) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    const updated = await this.userRepo.updateUser(userId, data);

    // Send email asynchronously (don't wait for it)
    try {
      await this.emailService.sendProfileUpdatedEmail(user.email, {
        name: data.name || user.name,
      });
    } catch (error) {
      console.error("Failed to send profile update email:", error);
    }

    return updated;
  }
}
