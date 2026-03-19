// src/components/AuthButton.tsx
"use client";

import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

export default function AuthButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <div className="flex items-center gap-4">
        {/* Display the Google Profile Picture */}
        {session.user?.image && (
          <Image 
            src={session.user.image} 
            alt="Profile" 
            width={40}
            height={40}
            className="rounded-full border-2 border-indigo-500"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{session.user?.name}</span>
          <button 
            onClick={() => signOut()} 
            className="text-xs text-slate-400 hover:text-red-400 text-left transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn("google")} 
      className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-white/10"
    >
      Sign in with Google
    </button>
  );
}