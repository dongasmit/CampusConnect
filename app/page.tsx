// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";
import ProductForm from "@/components/ProductForm";
import SearchBar from "@/components/SearchBar";
import { searchProducts } from "@/app/actions";

// Next.js passes URL parameters into the page component
export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await getServerSession(authOptions);
  
  // Await the search parameters
  const params = await searchParams;
  const query = params.q;

  let products;

  // The Brains: Decide which database query to run
  if (query) {
    products = await searchProducts(query);
  } else {
    products = await prisma.product.findMany({
      include: { category: true, seller: true, images: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      
      <header className="max-w-7xl mx-auto mb-12 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            CampusConnect <span className="text-indigo-500">2.0</span>
          </h1>
          <p className="text-slate-500 mt-1">AI-Powered Marketplace</p>
        </div>
        
        {/* Injecting the new Search Bar here! */}
        <SearchBar />
        
        <AuthButton session={session} />
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
          <h2 className="text-xl font-semibold text-white mb-6">Post an Item</h2>
          {session ? <ProductForm /> : (
            <div className="text-center py-10 bg-slate-950 rounded-lg border border-slate-800">
              <p className="text-slate-400 mb-4">You must be signed in to post items for sale.</p>
            </div>
          )}
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6">
            {query ? `Search Results for "${query}"` : "Recent Listings"}
          </h2>
          
          {/* Display warning if AI search found nothing */}
          {products.length === 0 && (
            <p className="text-slate-400">No matching items found. Try searching for something else.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* We map over whatever the database returned (AI Search or Standard Feed) */}
            {products.map((product) => (
              <div key={product?.id} className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-indigo-500/10">
                <div>
                  {product?.images && product.images.length > 0 && (
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-slate-950">
                      <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors">{product?.title}</h3>
                    <span className="text-lg font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">₹{product?.price.toString()}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product?.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center mt-4">
                  <span className="text-xs font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full">{product?.category?.name}</span>
                  <p className="text-xs text-slate-500">Listed by <span className="text-slate-300">{product?.seller?.name}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}