// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Define the route for product images
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Middleware runs on your server BEFORE the upload happens
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) throw new Error("Unauthorized");
      return { userEmail: session.user.email };
    })
    // This runs AFTER the file is successfully uploaded to the cloud
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userEmail);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userEmail };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;