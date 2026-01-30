import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="max-w-4xl w-full text-center space-y-12">
          
          <div className="space-y-4 animate-enter">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide mb-4">
              SCHOOL PROJECT • PROTOTYPE
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              Хөвсгөл <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Хүргэлт</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto text-balance">
              Энэ бол зөвхөн зуучлах сайт. Find reliable carriers or earn money delivering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full animate-enter delay-100">
            {/* User Option */}
            <Link href="/carriers" className="group">
              <div className="relative h-full bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Package className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Хэрэглэгч</h2>
                  <p className="text-slate-500">Find someone to deliver your items safely.</p>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-lg shadow-lg shadow-emerald-500/20">
                  View Carriers
                </Button>
              </div>
            </Link>

            {/* Carrier Option */}
            <Link href="/signup" className="group">
              <div className="relative h-full bg-white p-8 rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Truck className="w-10 h-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Хүргэгч</h2>
                  <p className="text-slate-500">Register as a carrier and earn money.</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-lg shadow-lg shadow-blue-500/20">
                  Sign Up
                </Button>
              </div>
            </Link>
          </div>

        </div>
      </main>

      <footer className="p-8 text-center text-slate-400 text-sm font-medium relative z-10">
        <p>© {new Date().getFullYear()} School Project. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}
