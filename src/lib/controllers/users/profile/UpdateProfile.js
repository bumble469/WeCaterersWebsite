import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const updateUserProfile = async (token, updatedData) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {
      fullname,
      email,
      address,
      contact,
      bio,
      profilephoto,
      sociallink1,
      sociallink2,
      sociallink3,
    } = updatedData;

    const dataToUpdate = {};

    if (fullname !== undefined && fullname !== null) dataToUpdate.fullname = fullname;
    if (email !== undefined && email !== null) dataToUpdate.email = email;
    if (address !== undefined && address !== null) dataToUpdate.address = address;
    if (contact !== undefined && contact !== null) dataToUpdate.contact = contact;
    if (bio !== undefined && bio !== null) dataToUpdate.bio = bio;
    if (sociallink1 !== undefined && sociallink1 !== null) dataToUpdate.sociallink1 = sociallink1;
    if (sociallink2 !== undefined && sociallink2 !== null) dataToUpdate.sociallink2 = sociallink2;
    if (sociallink3 !== undefined && sociallink3 !== null) dataToUpdate.sociallink3 = sociallink3;

    if (profilephoto) {
      const base64Image = profilephoto.split(',')[1] || profilephoto;
      dataToUpdate.profilephoto = Buffer.from(base64Image, 'base64');
    }

    const user = await prisma.user.update({
      where: {
        userid: BigInt(decoded.userid),
      },
      data: dataToUpdate,
    });

    if (!user) {
      return { status: 404, data: { error: 'User not found!' } };
    }

    return {
      status: 200,
      message: 'User profile updated successfully!',
    };
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token!' } };
  }
};

