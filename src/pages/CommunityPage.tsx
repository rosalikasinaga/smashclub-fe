import { Link } from "react-router-dom"
import { Users, Trophy, Flag, ShieldCheck, Heart, Star, Instagram, Twitter, Facebook } from "lucide-react"

export default function CommunityPage() {
    const heroImage = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2072&auto=format&fit=crop"

    const achievements = [
        {
            icon: <Trophy className="w-6 h-6" />,
            value: "50+ Trofi Regional",
            desc: "Anggota kami telah memenangkan berbagai kompetisi tingkat kota dan provinsi selama 10 tahun terakhir."
        },
        {
            icon: <Flag className="w-6 h-6" />,
            value: "Juara Liga Amatir",
            desc: "Tim ganda SmashClub berhasil mempertahankan gelar Juara Liga Bulu Tangkis Amatir Nasional selama 3 tahun berturut-turut."
        },
        {
            icon: <Heart className="w-6 h-6" />,
            value: "120+ Event Sosial",
            desc: "Bukan sekadar poin, kami telah mengadakan ratusan aksi sosial dan coaching clinic untuk anak-anak kurang mampu."
        },
        {
            icon: <Users className="w-6 h-6" />,
            value: "1,000+ Anggota",
            desc: "Pertumbuhan stabil dari komunitas kecil menjadi ekosistem olahraga yang inklusif bagi semua kalangan."
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            value: "Fasilitas Standar Int",
            desc: "Bekerja sama dengan 8 pusat olahraga untuk menyediakan lapangan berkualitas bagi seluruh anggota."
        },
        {
            icon: <Star className="w-6 h-6" />,
            value: "Komunitas Terfavorit",
            desc: "Dinobatkan sebagai \"Community of the Year\" oleh Asosiasi Olahraga Rekreasi Regional tahun 2022."
        }
    ]

    const timeline = [
        {
            year: "2014",
            title: "Pendirian SmashClub",
            desc: "Berawal dari 5 anggota aktif di lapangan lokal.",
            icon: <Users className="w-4 h-4" />
        },
        {
            year: "2016",
            title: "Turnamen Pertama",
            desc: "Menyelenggarakan liga internal dengan 50 peserta.",
            icon: <Trophy className="w-4 h-4" />
        },
        {
            year: "2019",
            title: "Ekspansi Tenis",
            desc: "Membuka divisi baru untuk olahraga Tenis lapangan.",
            icon: <Users className="w-4 h-4" />
        },
        {
            year: "2024",
            title: "Satu Dekade",
            desc: "Mencapai tonggak sejarah 1,000+ anggota aktif.",
            icon: <Star className="w-4 h-4" />
        }
    ]

    return (
        <div className="bg-background min-h-screen text-white pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-8 pb-16">
                <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/5">
                    <img
                        src={heroImage}
                        alt="SmashClub Community"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 text-center">
                        <div className="inline-block px-4 py-1.5 bg-primary text-background text-[10px] font-black tracking-widest uppercase rounded-full mb-6">
                            EST. 2014
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
                            Perjalanan 10 Tahun <span className="text-primary">SmashClub</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-300 font-medium text-sm md:text-lg leading-relaxed">
                            Membangun semangat olahraga, kompetisi sehat, dan kebersamaan keluarga besar sejak hari pertama.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sejarah Section */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Sejarah Kami</div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-tight">
                            Cerita di Balik <br /> <span className="text-primary">Raket</span>
                        </h2>
                        <div className="space-y-6 text-gray-400 font-medium leading-relaxed">
                            <p>
                                SmashClub dimulai dari sekumpulan kecil pecinta bulu tangkis yang rutin berkumpul di lapangan lokal setiap Sabtu sore. Kesamaan visi untuk menjadikan olahraga sebagai sarana mempererat tali persaudaraan membawa kami melangkah lebih jauh.
                            </p>
                            <p>
                                Dalam sepuluh tahun terakhir, kami telah tumbuh menjadi salah satu komunitas olahraga terbesar, menyatukan ribuan pemain dari berbagai latar belakang, level kemampuan, dan rentang usia.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Vertical line for timeline */}
                        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-white/5" />

                        {timeline.map((item, index) => (
                            <div key={index} className="flex gap-8 group relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-card border border-white/5 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-all shadow-xl">
                                    <div className="text-primary">{item.icon}</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-white italic">{item.title}</h3>
                                        <span className="text-[10px] font-black text-primary tracking-widest">({item.year})</span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pencapaian Section */}
            <div className="container mx-auto px-4 py-24 relative">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="text-center mb-16 relative z-10">
                    <div className="text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Pencapaian Kami</div>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                        Dedikasi dan <span className="text-primary">Kebanggaan</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {achievements.map((item, index) => (
                        <div key={index} className="bg-card border border-white/5 p-10 rounded-[2.5rem] hover:border-primary/30 transition-all group shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-background border border-white/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white italic mb-4 uppercase tracking-tight">{item.value}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-24">
                <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-[0_20px_50px_rgba(0,214,181,0.2)]">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-80 h-80 border-[40px] border-background rounded-full" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 border-[30px] border-background rounded-full" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-background mb-6 leading-tight">
                            Siap Menjadi Bagian <br /> Dari Sejarah Kami?
                        </h2>
                        <p className="text-background/80 font-bold mb-12 max-w-xl mx-auto">
                            Mari bergabung dengan 1,000+ pemain lainnya dan mulai perjalanan olahragamu bersama SmashClub hari ini.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-10 py-5 bg-background text-white font-black rounded-2xl hover:bg-background/90 transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Daftar Member Sekarang
                            </Link>
                            <button
                                className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-background/20 text-background font-black rounded-2xl hover:bg-background/5 transition-all active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Hubungi Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer-like Branding (Optional since we have a global footer) */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                    <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-background font-black text-xl tracking-tighter">S</span>
                        </div>
                        <span className="font-black italic uppercase tracking-tighter text-xl">SmashClub</span>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="p-3 bg-card border border-white/5 rounded-xl text-gray-500 hover:text-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-3 bg-card border border-white/5 rounded-xl text-gray-500 hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-3 bg-card border border-white/5 rounded-xl text-gray-500 hover:text-primary transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
