import { Calendar, Users, Trophy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop"
                        alt="Tennis Court"
                        className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-[20s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30 mb-6 uppercase">
                            Indonesia's #1 Community
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Gabung Komunitas <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                                Tennis
                            </span> Terbesar
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
                            Temukan teman main, booking lapangan, dan tingkatkan skill Anda melalui platform terintegrasi SmashClub.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1">
                                Mulai Sekarang
                            </button>
                            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all hover:border-slate-500">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan Kami</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Semua yang Anda butuhkan untuk pengalaman tennis terbaik ada di sini dalam satu aplikasi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Booking Lapangan</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Pesan lapangan favorit Anda secara instan tanpa antri. Konfirmasi otomatis dan pembayaran mudah.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Cari Lawan</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Temukan partner atau lawan main sesuai level kemampuan Anda. Matchmaking cerdas untuk permainan yang adil.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Program Latihan</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Akses pelatih profesional untuk meningkatkan teknik bermain Anda dari level pemula hingga mahir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-slate-900/50 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <h5 className="text-emerald-500 font-semibold tracking-wider text-sm mb-2 uppercase">Testimonials</h5>
                        <h2 className="text-3xl md:text-4xl font-bold">Apa Kata Mereka?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Testimonial 1 */}
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-slate-800" />
                                <div>
                                    <h4 className="font-bold text-white">Budi Santoso</h4>
                                    <p className="text-xs text-emerald-400">Regular Member</p>
                                </div>
                            </div>
                            <p className="text-slate-400 italic text-sm">
                                "Komunitas yang luar biasa! Saya jadi lebih mudah cari teman main yang levelnya seimbang setiap akhir pekan."
                            </p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-slate-800" />
                                <div>
                                    <h4 className="font-bold text-white">Siti Aminah</h4>
                                    <p className="text-xs text-cyan-400">Club Owner</p>
                                </div>
                            </div>
                            <p className="text-slate-400 italic text-sm">
                                "Booking lapangan jadi praktis banget lewat aplikasi ini. Manajemen lapangan kami jadi jauh lebih teratur sekarang."
                            </p>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-slate-800" />
                                <div>
                                    <h4 className="font-bold text-white">Andi Wijaya</h4>
                                    <p className="text-xs text-purple-400">Tennis Coach</p>
                                </div>
                            </div>
                            <p className="text-slate-400 italic text-sm">
                                "Skill murid-murid saya meningkat drastis berkat modul latihan yang bisa mereka akses kapan saja di SmashClub."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 text-center shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap Bertanding Hari Ini?</h2>
                            <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
                                Dapatkan akses ke ratusan lapangan dan ribuan teman main di seluruh Indonesia sekarang juga.
                            </p>
                            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl">
                                Gabung SmashClub Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
