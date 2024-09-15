import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDataFromToken } from '@/helper/getDataFromToken';

const prisma = new PrismaClient()

prisma.$connect()

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult{
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: any
}

export async function POST(request: NextRequest){

    try {
        const token = await getDataFromToken(request);
        if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET){
            return NextResponse.json({
                success: false,
                error: "Cloudinary Credentials not found"
            }, {
                status: 500
            })
        }
    
        if(!token){
            return NextResponse.json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 401
            })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File | null
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const originalSize = formData.get("originalSize") as string

        if(!file){
            return NextResponse.json({
                success: false,
                error: "File not found"
            }, {
                status: 404
            })
        }

        // step 1
        const bytes = await file.arrayBuffer()

        // step 2
        const buffer = Buffer.from(bytes);

        // step 3
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "video_uploads",
                    resource_type: "video",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "mp4"
                        }
                    ]
                },
                (error, result)=> {
                    if(error) reject(error)
                    else resolve(result as CloudinaryUploadResult)
                }
            )

            uploadStream.end(buffer);
        })

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize,
                compressedSize: String(result.bytes),
                duration: (result.duration) || 0,
                user: {
                    connect: {
                        id: token
                    }
                }
            }
        })
        

        const user = await prisma.user.update({
            where: { id: token },
            data: {
                videoIds: {
                    push: video.id
                }
            }
        });

        return NextResponse.json({
            success: true,
            video 
        }, {
            status: 200
        })

    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json({
            success: false,
            error: "Uploading video failed"
        }, {
            status: 500
        })
    } finally {
        await prisma.$disconnect()
    }
}