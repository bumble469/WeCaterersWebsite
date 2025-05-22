import jwt from "jsonwebtoken";
import prisma from '@/lib/prisma/client';

function convertBigIntToString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'bigint') {
        newObj[key] = value.toString();
      } else if (typeof value === 'object') {
        newObj[key] = convertBigIntToString(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  }
  return obj;
}

export const userRating = async (token, rating, cateringid) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const userid = BigInt(decoded.userid);
    const cateringId = BigInt(cateringid);

    const existing = await prisma.caterer_ratings.findFirst({
      where: {
        userid,
        cateringid: cateringId,
      },
    });

    let result;
    if (existing) {
      // Update by primary key ratingid
      result = await prisma.caterer_ratings.update({
        where: {
          ratingid: existing.ratingid,
        },
        data: {
          rating,
          created_at: new Date(),
        },
      });
    } else {
      result = await prisma.caterer_ratings.create({
        data: {
          userid,
          cateringid: cateringId,
          rating,
        },
      });
    }

    return {
      status: 200,
      data: {
        message: 'Rating saved successfully.',
        rating: convertBigIntToString(result),
      },
    };

  } catch (err) {
    console.error("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
