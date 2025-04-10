"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getUploadSignature, confirmUpload, deleteImage } from "@/lib/actions/upload-actions"

interface ImageUploaderProps {
  images: { url: string; publicId: string }[]
  onChange: (images: { url: string; publicId: string }[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length >= maxImages) {
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Get the upload signature from the server
        const signatureResponse = await getUploadSignature({ folder: "products" })

        if (!signatureResponse || !signatureResponse.data || !signatureResponse.data.success) {
          throw new Error("Failed to get upload signature")
        }

        const { signature, timestamp, cloudName, apiKey, folder } = signatureResponse.data as {
          success: boolean
          signature: string
          timestamp: number
          cloudName: string | undefined
          apiKey: string | undefined
          folder: string
        }

        // Upload each file to Cloudinary
        for (const file of acceptedFiles) {
          if (images.length + 1 > maxImages) break

          const formData = new FormData()
          formData.append("file", file)
          formData.append("api_key", apiKey as string)
          formData.append("timestamp", timestamp.toString())
          formData.append("signature", signature)
          formData.append("folder", folder)

          // Upload the file to Cloudinary
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Upload failed")
          }

          const data = await response.json()

          // Confirm the upload with our server
          await confirmUpload({
            publicId: data.public_id,
            url: data.secure_url,
          })

          // Add the new image to the list
          onChange([...images, { url: data.secure_url, publicId: data.public_id }])
          setUploadProgress((prev) => prev + 100 / acceptedFiles.length)
        }
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [images, maxImages, onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: maxImages - images.length,
    disabled: isUploading || images.length >= maxImages,
  })

  const handleRemove = async (index: number) => {
    try {
      const imageToRemove = images[index]

      // Delete the image from Cloudinary
      await deleteImage({ publicId: imageToRemove.publicId })

      // Remove the image from the list
      const newImages = [...images]
      newImages.splice(index, 1)
      onChange(newImages)
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
        } ${isUploading || images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Déposez les images ici"
              : `Glissez-déposez des images, ou cliquez pour sélectionner (${images.length}/${maxImages})`}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG ou WEBP jusqu'à 5MB</p>
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <span className="text-sm">{Math.round(uploadProgress)}%</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden aspect-square group">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <span className="absolute left-2 top-2 bg-primary text-white text-xs px-2 py-1 rounded">Principal</span>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
