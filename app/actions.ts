// src/app/actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client using your new API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function createProduct(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageUrl = formData.get("imageUrl") as string;

    const category = await prisma.category.findFirst();
    if (!category) throw new Error("Categories not seeded");

    // ==========================================
    // 1. GENERATE THE AI VECTOR EMBEDDING
    // ==========================================
    // We combine title and description to give the AI maximum context
    const textToEmbed = `Title: ${title}. Description: ${description}.`;

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(textToEmbed);
    // THE FIX: Slice the 3072-dimension array down to 768 to fit our database schema
    const embedding = result.embedding.values.slice(0, 768);

    // ==========================================
    // 2. CREATE THE PRODUCT IN POSTGRESQL
    // ==========================================
    const product = await prisma.product.create({
        data: {
            title,
            description,
            price,
            condition: "USED",
            sellerId: user.id,
            categoryId: category.id,
            images: imageUrl ? {
                create: [{ url: imageUrl, altText: title }]
            } : undefined
        }
    });

    // ==========================================
    // 3. INJECT THE VECTOR (The SDE Way)
    // ==========================================
    // Because 'vector' is a highly specialized PostgreSQL extension, 
    // standard ORM methods struggle with it. We use raw SQL to inject it perfectly.
    const embeddingString = `[${embedding.join(',')}]`;

    await prisma.$executeRaw`
    UPDATE "Product" 
    SET embedding = ${embeddingString}::vector 
    WHERE id = ${product.id}
  `;

    revalidatePath("/");
}
//delete
// Add this to the bottom of src/app/actions.ts

export async function deleteProduct(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Unauthorized");

  // 1. Find the logged-in user
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email } 
  });
  
  // 2. Find the product
  const product = await prisma.product.findUnique({ 
    where: { id: productId } 
  });

  if (!user || !product) throw new Error("Not found");

  // 3. SECURITY CHECK: Ensure the person deleting it actually owns it
  if (product.sellerId !== user.id) {
    throw new Error("You do not have permission to delete this item.");
  }

  // 4. Delete from PostgreSQL
  await prisma.product.delete({
    where: { id: productId }
  });

  // 5. Refresh the page instantly
  revalidatePath("/");
}

//aisearch bar 

export async function searchProducts(searchTerm: string) {
    // 1. Convert the user's search query into an AI vector
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(searchTerm);
    const embedding = result.embedding.values.slice(0, 768);
    const embeddingString = `[${embedding.join(',')}]`;

    // 2. Perform a nearest-neighbor mathematical search in PostgreSQL
  // We removed the strict distance threshold, but kept the IS NOT NULL filter
  // to safely ignore old products that lack AI embeddings.
  const rawResults = await prisma.$queryRaw<{id: string}[]>`
    SELECT id FROM "Product"
    WHERE embedding IS NOT NULL 
    ORDER BY embedding <=> ${embeddingString}::vector
    LIMIT 6
  `;

    const ids = rawResults.map(r => r.id);

    if (ids.length === 0) return [];

    // 3. Fetch the full product details for those matching IDs
    const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        include: { category: true, seller: true, images: true }
    });

    // 4. Return them strictly in the order of AI relevance (closest match first)
    return ids.map(id => products.find(p => p?.id === id)).filter(Boolean);
}