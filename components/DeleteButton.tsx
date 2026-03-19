// src/components/DeleteButton.tsx
"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/actions";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Standard confirm dialog so users don't delete by accident
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
    } catch {
      alert("Failed to delete product.");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}