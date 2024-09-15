import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getDataFromToken } from "@/helper/getDataFromToken";

const prisma = new PrismaClient();

export async function GET(request: NextRequest){
    try {
        const token = await getDataFromToken(request)
        const videos = await prisma.video.findMany({
            where: {
                userId: token
            },
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
    } catch (error: any) {
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