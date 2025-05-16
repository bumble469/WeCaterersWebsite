import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateCatererProfile = async (token,cateringname,ownername,contact,email,address,description,cateringimage,cateringbannerimage) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const dataToUpdate = {};

    if (cateringname !== undefined && cateringname !== null) dataToUpdate.cateringname = cateringname;
    if (ownername !== undefined && ownername !== null) dataToUpdate.ownername = ownername;
    if (contact !== undefined && contact !== null) dataToUpdate.contact = contact;
    if (email !== undefined && email !== null) dataToUpdate.email = email;
    if (address !== undefined && address !== null) dataToUpdate.address = address;
    if (description !== undefined && description !== null) dataToUpdate.description = description;

    if (cateringimage) {
      const base64Image = cateringimage.split(',')[1] || cateringimage;
      dataToUpdate.cateringimage = Buffer.from(base64Image, 'base64');
    }

    if (cateringbannerimage) {
      const base64Banner = cateringbannerimage.split(',')[1] || cateringbannerimage;
      dataToUpdate.cateringbannerimage = Buffer.from(base64Banner, 'base64');
    }

    const caterer = await prisma.caterer.update({
      where: {
        cateringid: BigInt(decoded.cateringid),
      },
      data: dataToUpdate,
    });

    if (!caterer) {
      return { status: 404, data: { error: 'Caterer not found!' } };
    }

    return {
      status: 200,
      message: 'Caterer profile updated successfully!',
    };
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token!' } };
  }
};
