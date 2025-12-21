import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { EmailService } from "@/lib/services/EmailService";

const emailService = new EmailService();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('\n🔐 [FORGOT PASSWORD] Request received for email:', email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('⚠️ [FORGOT PASSWORD] User not found:', email);
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link shortly.",
      });
    }

    console.log('✅ [FORGOT PASSWORD] User found:', user.name, '(', user.email, ')');

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    console.log('🎟️ [FORGOT PASSWORD] Generated token:', resetToken.substring(0, 10) + '...');
    console.log('⏰ [FORGOT PASSWORD] Token expires at:', expiresAt.toISOString());

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    console.log('💾 [FORGOT PASSWORD] Token saved to database');
    console.log('📧 [FORGOT PASSWORD] Sending password reset email...');

    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    console.log('✅ [FORGOT PASSWORD] Process completed successfully\n');

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
