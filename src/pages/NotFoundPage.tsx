import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[#0a1618] flex items-center justify-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                {/* Tennis Ball Graphic Animation */}
                <div className="relative w-48 h-48 mx-auto mb-12">
                    {/* Court Lines */}
                    <div className="absolute inset-0 border-r-2 border-b-2 border-gray-700/50 w-full h-full transform -skew-x-12 translate-x-8" />
                    <div className="absolute inset-0 border-r-2 border-dashed border-gray-700/50 w-full h-full transform -skew-x-12 -translate-x-8" />

                    {/* Ball */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary rounded-full shadow-[0_0_50px_rgba(210,255,0,0.5)] flex items-center justify-center animate-bounce-slow">
                        <div className="absolute w-full h-full border-[6px] border-white/80 rounded-full opacity-60" style={{ clipPath: "path('M 15 15 Q 64 64 113 15')" }}></div>
                        <div className="absolute w-full h-full border-[6px] border-white/80 rounded-full opacity-60 rotate-180" style={{ clipPath: "path('M 15 15 Q 64 64 113 15')" }}></div>
                        <span className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg transform rotate-12">OUT!</span>
                    </div>
                </div>

                <div className="relative">
                    <h1 className="text-[120px] leading-none font-bold text-[#16282a] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">404</h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Waduh! <span className="text-primary">Bola</span> Keluar <br /> Lapangan
                    </h2>
                </div>

                <p className="text-gray-400 text-lg mb-10">
                    Halaman yang Anda cari tidak ditemukan atau mungkin sudah dipindahkan ke court lain.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-[#0a1a1a] font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(0,214,181,0.3)] hover:shadow-[0_6px_30px_rgba(0,214,181,0.4)] hover:-translate-y-1"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Kembali ke Beranda
                </Link>
            </div>

            <div className="absolute bottom-8 text-center w-full text-xs text-gray-600 font-bold tracking-widest uppercase">
                Tennis Out Community Center
            </div>
        </div>
    )
}
