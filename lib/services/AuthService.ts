import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository";
import { BadRequestError, UnauthorizedError } from "../utils/Errors";
import { EmailService } from "./EmailService";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export default class AuthService {
  private userRepo: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepo = new UserRepository();
    this.emailService = new EmailService();
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepo.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepo.createUser(name, email, hashedPassword);

    // Send welcome email directly
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Continue registration even if email fails
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.getUserByEmail(email);
    console.log("Login attempt for email:", email);
    console.log("User found:", user ? "yes" : "no");

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.userRepo.addRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string, refreshToken: string) {
    await this.userRepo.removeRefreshToken(userId, refreshToken);
  }

  async refreshToken(oldRefreshToken: string) {
    let payload: any;

    try {
      payload = jwt.verify(oldRefreshToken, JWT_SECRET);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await this.userRepo.getUserById(payload.userId);
    if (
      !user ||
      !user.refreshTokens.some(
        (rt: { token: string }) => rt.token === oldRefreshToken
      )
    ) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.userRepo.removeRefreshToken(user.id, oldRefreshToken);
    await this.userRepo.addRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser(accessToken: string) {
    let payload: any;

    try {
      payload = jwt.verify(accessToken, JWT_SECRET);
    } catch {
      throw new UnauthorizedError();
    }

    const user = await this.userRepo.getUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
