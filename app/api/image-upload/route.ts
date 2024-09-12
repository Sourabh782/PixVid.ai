import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

prisma.$connect()

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult{
    public_id: string;
    [key: string]: any
}

export async function POST(request: NextRequest){
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({
            success: false,
            error: "Unauthorized"
        }, {
            status: 401
        })
    }

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

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
                    folder: "image_uploads",
                    resource_type: "image"
                },
                (error, result)=> {
                    if(error) reject(error)
                    else resolve(result as CloudinaryUploadResult)
                }
            )

            uploadStream.end(buffer);
        })

        return NextResponse.json({
            status: true,
            publicId: result.public_id,
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Uploading image failed" ,error)
        return NextResponse.json({
            success: false,
            error: "Uploading image failed"
        }, {
            status: 500
        })
    } finally{
        await prisma.$disconnect()
    }
}