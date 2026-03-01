// src/app/page.tsx
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 1. FETCH DATA DIRECTLY FROM THE DB!
  // Notice there is no 'fetch', no 'useEffect', no API routes.
  const products = await prisma.product.findMany({
    include: {
      category: true, // Join the Category table
      seller: true,   // Join the User table
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold tracking-tight mb-12">
        CampusConnect <span className="text-blue-500">2.0</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {products.map((product) => (
          <div key={product.id} className="border border-slate-800 bg-slate-900 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-slate-400 text-sm mb-4">{product.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              {/* Prisma returns Decimals as objects, so we call .toString() */}
              <span className="text-xl font-bold text-emerald-400">
                ${product.price.toString()}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            </div>
            
            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Seller: <span className="text-slate-300">{product.seller.name}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}