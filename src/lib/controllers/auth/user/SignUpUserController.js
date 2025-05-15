import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma/client';
import nodemailer from 'nodemailer';

let verificationCodes = {};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendEmailVerification = async (req) => {
  const { email, fullname, password } = req;

  if (!email || !fullname || !password) {
    return { status: 400, data: { error: 'All fields are required' } };
  }

  const code = generateVerificationCode();

  verificationCodes[email] = {
    code,
    fullname,
    password,
    timestamp: Date.now(),
  };

  setTimeout(() => {
    delete verificationCodes[email];
  }, 60000);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    text: `Your code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);

  return { status: 200, data: { message: 'Verification code sent' } };
};

export const verifyEmail = async (req) => {
  const { email, code } = req;

  if (!email || !code) {
    return { status: 400, data: { error: 'Email and code required' } };
  }

  const stored = verificationCodes[email];

  if (!stored || stored.code !== code) {
    return { status: 400, data: { error: 'Invalid or expired code' } };
  }

  const isExpired = Date.now() - stored.timestamp > 60000;
  if (isExpired) {
    delete verificationCodes[email];
    return { status: 400, data: { error: 'Code expired' } };
  }

  const hashedPassword = await bcrypt.hash(stored.password, 10);

  await prisma.user.create({
    data: {
      fullname: stored.fullname,
      email,
      password: hashedPassword,
    },
  });

  delete verificationCodes[email];

  return { status: 200, data: { message: 'User signup successful' } };
};
