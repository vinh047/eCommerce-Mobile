import Link from "next/link";
import Image from "next/image";

export default function FooterUser() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-20">
            {/* Nội dung chính */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
                {/* Cột 1: Giới thiệu */}
                <div>
                    <h2 className="text-white text-xl font-semibold mb-4">TechMobile</h2>
                    <p className="text-sm leading-relaxed mb-4">
                        TechMobile mang đến trải nghiệm công nghệ hiện đại, sản phẩm chính hãng
                        và dịch vụ tận tâm cho khách hàng trên toàn quốc.
                    </p>
                    <div className="flex space-x-4 mt-3">
                        <Link href="https://facebook.com" target="_blank">
                            <Image src="https://fontawesome.com/images/facebook-icon.svg" alt="Facebook" width={24} height={24} />
                        </Link>
                        <Link href="https://youtube.com" target="_blank">
                            <Image src="https://fontawesome.com/images/youtube-icon.svg" alt="YouTube" width={24} height={24} />
                        </Link>
                        <Link href="https://www.tiktok.com" target="_blank">
                            <Image src="https://fontawesome.com/images/twitter-icon.svg" alt="Tiktok" width={24} height={24} />
                        </Link>
                        <Link href="https://zalo.me" target="_blank">
                            <Image src="https://fontawesome.com/images/instagram-icon.svg" alt="Zalo" width={24} height={24} />
                        </Link>
                    </div>
                </div>

                {/* Cột 2: Thông tin liên hệ */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Liên hệ với chúng tôi</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <strong>Địa chỉ:</strong> 123 Nguyễn Văn Cừ, Q.5, TP.HCM
                        </li>
                        <li>
                            <strong>Hotline:</strong> <span className="text-blue-400">1900 8888</span>
                        </li>
                        <li>
                            <strong>Email:</strong> support@techmobile.vn
                        </li>
                        <li>
                            <strong>Thời gian làm việc:</strong> 8:00 - 21:00 hàng ngày
                        </li>
                    </ul>
                </div>

                {/* Cột 3: Thông tin hỗ trợ */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Hỗ trợ khách hàng</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-blue-400">Giới thiệu</Link></li>
                        <li><Link href="/products" className="hover:text-blue-400">Sản phẩm</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400">Liên hệ</Link></li>
                        <li><Link href="/faq" className="hover:text-blue-400">Câu hỏi thường gặp</Link></li>
                        <li><Link href="/warranty" className="hover:text-blue-400">Chính sách bảo hành</Link></li>
                    </ul>
                </div>

                {/* Cột 4: Hình thức thanh toán */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Hình thức thanh toán</h3>
                    <div className="flex flex-wrap gap-3">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                            alt="Visa"
                            width={50}
                            height={30}
                            className="bg-white rounded-md p-1"
                        />
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mastercard-logo.png"
                            alt="MasterCard"
                            width={50}
                            height={30}
                            className="bg-white rounded-md p-1"
                        />
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fd/MoMo_Logo.png"
                            alt="MoMo"
                            width={50}
                            height={30}
                            className="bg-white rounded-md p-1"
                        />
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/VNPAY_logo.png"
                            alt="VNPay"
                            width={50}
                            height={30}
                            className="bg-white rounded-md p-1"
                        />
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Cash_payment_icon.png"
                            alt="Tiền mặt"
                            width={50}
                            height={30}
                            className="bg-white rounded-md p-1"
                        />
                    </div>
                </div>
            </div>

            {/* Dòng bản quyền */}
            <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} TechMobile. All rights reserved.
            </div>
        </footer>
    );
}
