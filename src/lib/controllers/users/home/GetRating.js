import jwt from "jsonwebtoken";
import prisma from '@/lib/prisma/client';

export const getUserRating = async (token, cateringid) => {
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

    const ratingRecord = await prisma.caterer_ratings.findUnique({
      where: {
        userid_cateringid: {
          userid: userid,
          cateringid: cateringId,
        },
      },
      select: {
        rating: true,
        created_at: true,
      },
    });

    if (!ratingRecord) {
      return { status: 404, data: { error: 'Rating not found for this user and catering service' } };
    }

    return { status: 200, data: ratingRecord };

  } catch (err) {
    console.error("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
