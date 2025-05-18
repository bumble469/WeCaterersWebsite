import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCatererService = async (token, cateringid) => {
    if (!token) {
        return { status: 401, data: { error: 'Authorization token is required!' } };
    }
    if (!cateringid) {
        return { status: 400, data: { error: 'Catering ID is required!' } };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
        return { status: 401, data: { error: 'Invalid or expired token' } };
        }

        const services = await prisma.service.findMany({
        where: {
            cateringid: parseInt(cateringid, 10),
        },
        select: {
            serviceid: true,
            cateringid: true,
            name: true,
            description: true,
            price: true,
            capacity: true,
        },
        });

        // You can format menu if needed, else return as is:
        const formattedServices = services.map(item => ({
        serviceId: parseInt(item.serviceid),
        cateringId: parseInt(item.cateringid),
        name: item.name,
        description: item.description,
        price: item.price,
        capacity: item.capacity,
        }));

        return {
            status: 200,
            formattedServices,
        };

    } catch (err) {
        console.error("Error in getCatererService:", err.message);
        return { status: 500, data: { error: 'Server error: ' + err.message } };
    }
};
