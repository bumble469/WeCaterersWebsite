import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const addMenu = async (token, name, description, price, cuisinetype, dietarypreference, image) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const cateringid = parseInt(decoded.cateringid);
    if (!cateringid) {
      return { status: 403, data: { error: 'Invalid token: cateringid missing' } };
    }

    if (!name || !price) {
      return { status: 400, data: { error: 'Name and price are required' } };
    }

    let imageBuffer = null;
    if (image) {
      try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
      } catch (e) {
        console.error('Error parsing image base64:', e);
        imageBuffer = null;
      }
    }

    const newMenuItem = await prisma.menu.create({
      data: {
        cateringid,
        name,
        description: description || '',
        price: Number(price),
        rating: null,
        cuisinetype: cuisinetype || '',
        dietarypreference: dietarypreference || '',
        image_data: imageBuffer || null,
        isdeleted: false
      },
    });

    return {
      status: 200,
      message: 'Menu item added successfully',
    };
  } catch (err) {
    console.error('Error adding menu item:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};
