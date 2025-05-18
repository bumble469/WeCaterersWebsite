import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getImageMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;

  const header = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (header.startsWith('89504E47')) return 'image/png';       
  if (header.startsWith('FFD8FFDB') || header.startsWith('FFD8FFE0') || header.startsWith('FFD8FFE1')) return 'image/jpeg';  // JPEG
  if (header.startsWith('47494638')) return 'image/gif';       
  if (header.startsWith('424D')) return 'image/bmp';           

  return 'application/octet-stream';
}
export const getUserProfileDetails = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const profile = await prisma.user.findUnique({
      where: {
        userid: decoded.userid
      },
      select: {
        userid: true,
        fullname: true,
        email: true,
        profilephoto: true,
        address: true,
        contact: true,
        bio: true,
        sociallink1: true,
        sociallink2: true,
        sociallink3: true
      },
    });

    if (!profile) {
      return { status: 404, data: { error: "User not found" } };
    }

    const toBuffer = (data) => {
      if (!data) return null;
      if (Buffer.isBuffer(data)) return data;
      if (Array.isArray(data)) return Buffer.from(data);
      if (typeof data === 'string' && data.includes(',')) {
        const arr = data.split(',').map(s => Number(s.trim()));
        return Buffer.from(arr);
      }
      return Buffer.from(data);
    };

    const profilePhotoBuffer = toBuffer(profile.profilephoto);

    const profilePhotoBase64 = profilePhotoBuffer
      ? `data:${getImageMimeType(profilePhotoBuffer)};base64,${profilePhotoBuffer.toString('base64')}`
      : null;

    const formattedProfile = {
      ...profile,
      userid: profile.userid.toString(),
      profilephoto: profilePhotoBase64
    };

    return {
      status: 200,
      data: formattedProfile
    };

  } catch (err) {
    console.error("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
