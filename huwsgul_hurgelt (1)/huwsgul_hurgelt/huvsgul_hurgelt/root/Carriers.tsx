import { useCarriers } from "@/hooks/use-carriers";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CarrierCard } from "@/components/CarrierCard";
import { ArrowLeft, PackageSearch, Loader2 } from "lucide-react";

export default function Carriers() {
  const { data: carriers, isLoading, error } = useCarriers();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Home
          </Link>
          <div className="font-display font-bold text-xl text-slate-900">
            <span className="text-emerald-600">Available</span> Carriers
          </div>
          <Link href="/signup">
            <Button size="sm" variant="outline" className="hidden sm:flex border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Join as Carrier
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Finding carriers nearby...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-600 font-medium">Failed to load carriers.</p>
            <p className="text-sm text-red-400 mt-2">Please try refreshing the page.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && carriers?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-enter">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <PackageSearch className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No carriers found</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              There are no delivery people registered at the moment. Be the first one!
            </p>
            <Link href="/signup" className="mt-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Register Now</Button>
            </Link>
          </div>
        )}

        {/* Grid List */}
        {!isLoading && carriers && carriers.length > 0 && (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {carriers.length} Active {carriers.length === 1 ? 'Carrier' : 'Carriers'}
              </h2>
              <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                Live Updates
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carriers.map((carrier, index) => (
                <CarrierCard 
                  key={carrier.id} 
                  carrier={carrier} 
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
