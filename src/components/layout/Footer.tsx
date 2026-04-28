import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-background py-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <span className="text-background font-bold text-sm">S</span>
                            </div>
                            <span className="text-lg font-bold text-white">SmashClub</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Jakarta Selatan Tennis Community. Pusat olahraga tennis dengan fasilitas booking lapangan dan toko peralatan terlengkap.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-primary"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-primary"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-primary"><Facebook className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Layanan Utama</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/booking" className="hover:text-primary">Booking Lapangan</Link></li>
                            <li><Link to="/shop" className="hover:text-primary">Toko Peralatan</Link></li>
                            <li><Link to="/community" className="hover:text-primary">Turnamen Member</Link></li>
                            <li><Link to="/training" className="hover:text-primary">Pelatihan Tennis</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Tentang Kami</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary">Lokasi Jakarta Selatan</a></li>
                            <li><a href="#" className="hover:text-primary">Kebijakan Privasi</a></li>
                            <li><a href="#" className="hover:text-primary">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-primary">Hubungi Kami</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2024 SmashClub Tennis Community. Seluruh hak cipta dilindungi.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
                        <a href="#" className="hover:text-white">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-white">Pusat Bantuan</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
