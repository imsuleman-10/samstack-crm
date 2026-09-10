/**
 * Client-side image compression utility
 * Compresses images larger than maxSizeMB using canvas API
 * No external dependencies — works in all modern browsers
 */

const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
const MAX_DIMENSION = 1200             // max width/height after resize
const OUTPUT_TYPE = 'image/webp'       // smallest format

/**
 * Compresses an image File if it exceeds 2MB.
 * Returns the original file if already small enough.
 */
export async function compressImage(file: File): Promise<File> {
  // If already under 2MB and is an acceptable type, return as-is
  if (file.size <= MAX_SIZE_BYTES && file.type !== 'image/bmp') {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width / height) * MAX_DIMENSION)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Try quality levels from 0.85 down to 0.5 until under 2MB
      let quality = 0.85
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'))
              return
            }

            if (blob.size <= MAX_SIZE_BYTES || quality <= 0.5) {
              const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
                type: OUTPUT_TYPE,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              quality -= 0.1
              tryCompress()
            }
          },
          OUTPUT_TYPE,
          quality
        )
      }

      tryCompress()
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Validates that the file is an acceptable image type
 */
export function validateImageFile(file: File): string | null {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
  if (!allowed.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, or GIF images are allowed.'
  }
  if (file.size > 10 * 1024 * 1024) {
    return 'Image must be under 10MB before compression.'
  }
  return null
}
