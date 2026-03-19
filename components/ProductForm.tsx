// src/components/ProductForm.tsx
"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { createProduct } from "@/app/actions";
import Image from "next/image";

export default function ProductForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={createProduct} className="space-y-4">
      {/* 1. THE IMAGE UPLOADER */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Product Image</label>
        
        {imageUrl ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-700">
            <Image src={imageUrl} alt="Uploaded preview" fill className="object-cover" />
            <button 
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded hover:bg-red-500"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
            <UploadDropzone
              endpoint="productImage"
              onUploadBegin={() => setIsUploading(true)}
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].url); // Save the cloud URL to state!
                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
                setIsUploading(false);
              }}
              className="ut-button:bg-indigo-600 ut-button:ut-readying:bg-indigo-500/50 ut-label:text-indigo-400 border-slate-800"
            />
          </div>
        )}
        
        {/* HIDDEN INPUT: This sneaks the Cloud URL into the Server Action formData */}
        {imageUrl && <input type="hidden" name="imageUrl" value={imageUrl} />}
      </div>

      {/* 2. THE TEXT FIELDS (Only show if image is uploaded to force them to upload one) */}
      <div className={`space-y-4 transition-all duration-500 ${!imageUrl ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
          <input name="title" required placeholder="e.g., Raspberry Pi 4" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
          <textarea name="description" required placeholder="Condition, specs, etc." rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Price (₹)</label>
          <input name="price" type="number" step="0.01" required placeholder="3500" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" disabled={isUploading || !imageUrl} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-medium py-2.5 rounded-lg mt-4 transition-colors">
          List Product
        </button>
      </div>
    </form>
  );
}