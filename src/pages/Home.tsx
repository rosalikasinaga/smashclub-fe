import { Search, ShoppingBag, Users, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <div className="flex flex-col gap-0">
            {/* HERO SECTION */}
            <section className="relative min-h-[600px] flex items-center pt-20 md:pt-0 bg-[#0a1a1a] overflow-hidden">
                {/* Background Gradient/Image Placeholder */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b1e] via-[#0d1b1e]/90 to-transparent z-10" />
                    {/* Mock Background Image */}
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                </div>

                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-900/50 border border-teal-800 text-primary text-xs font-bold tracking-wide mb-6">
                            JAKARTA SELATAN TENNIS COMMUNITY
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                            Main Tennis Jadi <br />
                            <span className="text-gray-300">Lebih Mudah</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                            Komunitas Tennis eksklusif di Jakarta Selatan. Booking lapangan tennis outdoor/indoor, temukan partner sparring, dan lengkapi gear tennis Anda.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/booking" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-all">
                                <Calendar className="w-5 h-5 mr-2" />
                                Booking Lapangan
                            </Link>
                            <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white font-medium rounded-lg hover:border-gray-400 hover:text-white transition-all">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Toko Peralatan
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-20 bg-background relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Tennis Terpadu</h2>
                        <p className="text-gray-400">Satu platform untuk semua kebutuhan tennis Anda di lokasi Jakarta Selatan.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={<Search className="w-6 h-6 text-primary" />}
                            title="Booking Lapangan"
                            desc="Pilih jadwal main Anda di lapangan gravel atau keras kami di Jakarta Selatan secara instan."
                        />
                        <ServiceCard
                            icon={<ShoppingBag className="w-6 h-6 text-primary" />}
                            title="Toko Peralatan"
                            desc="Dapatkan raket terbaru, bola tennis premium, dan jasa pasang senar profesional langsung di lokasi."
                        />
                        <ServiceCard
                            icon={<Users className="w-6 h-6 text-primary" />}
                            title="Kenalan dengan Pelatih"
                            desc="Anda dapat menemukan pelatih tenis berpengalaman yang menawarkan program untuk semua tingkat kemampuan."
                        />
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20 bg-[#0f2226]">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <span className="text-primary text-xs font-bold tracking-widest uppercase mb-2 block">Tennis Community Members</span>
                        <h2 className="text-3xl font-bold">Apa Kata Mereka?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TestimonialCard
                            name="Budi Santoso"
                            role="NTRP 3.5 Player"
                            text="Lapangan tennis di sini perawatannya sangat bagus. Booking lewat app juga nggak ribet, tinggal klik-klik aja."
                            img="https://i.pravatar.cc/150?u=budi"
                        />
                        <TestimonialCard
                            name="Siti Aminah"
                            role="Weekend Warrior"
                            text="Senang banget ada komunitas tennis di Jakarta Selatan yang terorganisir. Toko alat tennisnya juga lengkap banget!"
                            img="https://i.pravatar.cc/150?u=siti"
                        />
                        <TestimonialCard
                            name="Andi Wijaya"
                            role="Tournament Finalist"
                            text="Program latihan dan turnamen internalnya sangat menantang. Gear tennis yang dijual juga selalu up-to-date."
                            img="https://i.pravatar.cc/150?u=andi"
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 container mx-auto px-4">
                <div className="bg-primary rounded-3xl p-12 text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#08332a] mb-6">Gabung Komunitas Tennis Kami</h2>
                        <p className="text-[#08332a]/80 mb-8 font-medium">Jadilah bagian dari Jakarta Selatan Tennis Community hari ini.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="px-8 py-3 bg-[#08332a] text-white font-bold rounded-lg hover:bg-black transition-all flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Booking Sekarang
                            </Link>
                            <Link to="/shop" className="px-8 py-3 bg-white text-[#08332a] font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Kunjungi Toko
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-8 border border-gray-800 rounded-2xl bg-card/30 hover:bg-card hover:border-gray-700 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-[#0f2226] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

function TestimonialCard({ name, role, text, img }: { name: string, role: string, text: string, img: string }) {
    return (
        <div className="p-6 border border-gray-800 rounded-xl bg-card/50">
            <div className="flex items-center gap-4 mb-4">
                <img src={img} alt={name} className="w-12 h-12 rounded-full border-2 border-primary/20" />
                <div>
                    <h4 className="font-bold text-white text-sm">{name}</h4>
                    <span className="text-xs text-primary">{role}</span>
                </div>
            </div>
            <p className="text-gray-400 text-sm italic">"{text}"</p>
        </div>
    )
}
