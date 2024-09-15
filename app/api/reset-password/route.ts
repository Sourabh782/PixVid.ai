import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

prisma.$connect();

export async function POST(request: NextRequest){
    try {
        const {email, username, password} = await request.json();

        if(!email || !username || !password){
            return NextResponse.json({
                success: false,
                message: "All credentials required"
            }, {
                status: 400
            })
        }

        const user = await prisma.user.findFirst({
            where :{
                AND: [{
                    email,
                    username
                }]
            }
        })

        console.log(user)

        if(!user){
            return NextResponse.json({
                success: false,
                message: "Account not found"
            }, {
                status: 404
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: {
                email: email,
                username: username
            },
            data: {
                password: hashedPassword
            }
        })

        if(!updatedUser){
            return NextResponse.json({
                success: false,
                message: "Password not updated"
            }, {
                status: 500
            })
        }

        return NextResponse.json({
            success: true,
            message: "Password successfully reset"
        }, {
            status: 200
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Unable to reset password, Try again later"
        }, {
            status: 500
        })
    } finally {
        prisma.$disconnect()
    }
    
}