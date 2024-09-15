export interface Video {
    id: string
    title: string
    description: string
    publicId: string
    originalSize: string
    compressedSize: string
    duration: number
    createdAt: Date
    updatedAt: Date
    userId: string
}

export interface ImageData {
    public_id: string,
    width: number,
    height: number
}