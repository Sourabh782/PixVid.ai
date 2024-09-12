import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function GET(request: NextRequest){
    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json({
            success: true,
            data: videos
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Error fetching Videos"
        }, {
            status: 500
        })
    } finally {
        await prisma.$disconnect()
    }
}