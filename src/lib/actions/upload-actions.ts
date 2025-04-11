"use server";
import { z } from "zod"
import { adminAction } from "@/lib/actions/safe-action"
import { cloudinary } from "@/lib/cloudinary"

// Schema for the upload signature request
const signUploadSchema = z.object({
  folder: z.string().default("products"),
})

// Schema for the upload completion
const uploadCompleteSchema = z.object({
  publicId: z.string(),
  url: z.string().url(),
})

// Generate a signature for client-side upload
export const getUploadSignature = adminAction.schema(signUploadSchema).action( async ({parsedInput:{ folder }}) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET as string,
    )

    return {
      success: true,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    }
  } catch (error) {
    console.error("Error generating upload signature:", error)
    return {
      success: false,
      message: "Failed to generate upload signature",
    }
  }
})

// Confirm that an upload was completed
export const confirmUpload = adminAction.schema(uploadCompleteSchema).action( async ({parsedInput:{ publicId, url }}) => {
  try {
    // You could perform additional validation here if needed
    return {
      success: true,
      publicId,
      url,
    }
  } catch (error) {
    console.error("Error confirming upload:", error)
    return {
      success: false,
      message: "Failed to confirm upload",
    }
  }
})

// Delete an image from Cloudinary
export const deleteImage = adminAction.schema(z.object({ publicId: z.string() })).action( async ({parsedInput:{publicId}}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)

    return {
      success: result.result === "ok",
      message: result.result === "ok" ? "Image deleted successfully" : "Failed to delete image",
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      success: false,
      message: "Failed to delete image",
    }
  }
})
