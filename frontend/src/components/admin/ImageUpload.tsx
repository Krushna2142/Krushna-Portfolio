'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageUpload({ value, onChange, folder = 'general' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const [urlInput, setUrlInput] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName)

      setPreview(publicUrl)
      setUrlInput(publicUrl)
      onChange(publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput)
      onChange(urlInput)
    }
  }

  const handleRemove = () => {
    setPreview('')
    setUrlInput('')
    onChange('')
  }

  return (
    <div className="space-y-3 w-full">
      {/* Preview */}
      {preview && (
        <div className="relative group rounded-xl overflow-hidden border border-white/10">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={() => {
              setPreview('')
              alert('Invalid image URL')
            }}
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? '⏳ Uploading...' : '📁 Upload Image (max 5MB)'}
      </button>

      {/* Or paste URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL..."
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
        />
        <button
          onClick={handleUrlSubmit}
          className="px-4 py-2 rounded-xl bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-all text-sm"
        >
          Set
        </button>
      </div>
    </div>
  )
}