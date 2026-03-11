/**
 * Redimensiona una imagen a máximo 2000px en su lado más largo
 * y la convierte a formato WebP antes de subir al storage.
 */
export function useImageOptimizer() {
  const MAX_DIMENSION = 2000
  const WEBP_QUALITY = 0.85

  const optimizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)

        let { width, height } = img

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width >= height) {
            height = Math.round(height * MAX_DIMENSION / width)
            width = MAX_DIMENSION
          } else {
            width = Math.round(width * MAX_DIMENSION / height)
            height = MAX_DIMENSION
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('No se pudo convertir la imagen'))
            return
          }
          const baseName = file.name.replace(/\.[^.]+$/, '')
          const optimizedFile = new File([blob], `${baseName}.webp`, { type: 'image/webp' })
          const preview = canvas.toDataURL('image/webp', WEBP_QUALITY)
          resolve({ file: optimizedFile, preview })
        }, 'image/webp', WEBP_QUALITY)
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('No se pudo cargar la imagen'))
      }

      img.src = objectUrl
    })
  }

  return { optimizeImage }
}
