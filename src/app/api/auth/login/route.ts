import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/encryption";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { logSuccessfulLogin, logFailedLogin } from "@/lib/audit";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, mfaToken } = validation.data;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        provider: true,
      },
    });

    if (!user) {
      await logFailedLogin(
        email,
        request.headers.get("x-forwarded-for") || "unknown",
        request.headers.get("user-agent") || "unknown",
        "User not found"
      );

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 1000 / 60
      );

      await logFailedLogin(
        email,
        request.headers.get("x-forwarded-for") || "unknown",
        request.headers.get("user-agent") || "unknown",
        "Account locked"
      );

      return NextResponse.json(
        { error: `Account locked. Try again in ${remainingTime} minutes` },
        { status: 429 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment login attempts
      const loginAttempts = user.loginAttempts + 1;
      const updateData: any = { loginAttempts };

      // Lock account if max attempts reached
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      await logFailedLogin(
        email,
        request.headers.get("x-forwarded-for") || "unknown",
        request.headers.get("user-agent") || "unknown",
        "Invalid password"
      );

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return NextResponse.json(
          { error: "MFA token required", requiresMfa: true },
          { status: 401 }
        );
      }

      // Verify MFA token (implement your MFA logic here)
      // const isValidMfa = verifyMFAToken(user.mfaSecret!, mfaToken);
      // if (!isValidMfa) {
      //   return NextResponse.json(
      //     { error: "Invalid MFA token" },
      //     { status: 401 }
      //   );
      // }
    }

    // Reset login attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      },
    });

    // Log successful login
    await logSuccessfulLogin(
      user.id,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown"
    );

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.provider?.firstName || "",
        lastName: user.provider?.lastName || "",
      },
    });

    // Set HTTP-only cookies for security
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    
    // More detailed error response
    return NextResponse.json(
      { 
        error: "Login failed",
        details: error?.message || "Internal server error",
        code: error?.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}
