import { NextResponse } from "next/server";
import { sendEmailVerification, verifyEmail } from "@/lib/controllers/auth/user/SignUpUserController";

export async function POST(req){
    const body = await req.json();
    try{
        if(body.mode === 'send'){
            const {status,data} = await sendEmailVerification(body);
            return NextResponse.json(data,{status});
        }
        if(body.mode === 'verify'){
            const {status,data} = await verifyEmail(body);
            return NextResponse.json(data,{status});
        }
        return NextResponse.json({error:'Invalid mode'},{status:400})
    }
    catch(err){
        return NextResponse.json({error:'Server error'},{status:500})
    }
}