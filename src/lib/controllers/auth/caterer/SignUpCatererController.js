import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

let verificationCodes = {};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendEmailVerification({ cateringname, ownername, email, password }) {
  if (!email || !cateringname || !ownername || !password) {
    throw new Error('Email, catering name, owner name, and password are required!');
  }

  const verificationCode = generateVerificationCode();

  verificationCodes[email] = {
    code: verificationCode,
    cateringname,
    ownername,
    email,
    password,
    timestamp: Date.now(),
  };

  setTimeout(() => {
    delete verificationCodes[email];
  }, 60000);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please Verify Your Email Address',
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);

  return { message: 'Verification code sent successfully! Please verify your email!' };
}

export async function verifyEmail({ email, code }) {
  if (!email || !code) {
    throw new Error('Email and verification code are required!');
  }

  const storedCode = verificationCodes[email];

  if (!storedCode) {
    throw new Error('Verification code not found!');
  }

  const isExpired = Date.now() - storedCode.timestamp > 60000;
  if (isExpired) {
    delete verificationCodes[email];
    throw new Error('Verification code has expired!');
  }

  if (storedCode.code !== code) {
    throw new Error('Invalid verification code!');
  }

  const hashedPassword = await bcrypt.hash(storedCode.password, 10);

  try {
    await prisma.caterer.create({
      data: {
        cateringname: storedCode.cateringname,
        ownername: storedCode.ownername,
        email: storedCode.email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error('Prisma create error:', error);
    throw new Error('Failed to create caterer.');
  }

  delete verificationCodes[email];

  return { message: 'Caterer signup successfully!' };
}
