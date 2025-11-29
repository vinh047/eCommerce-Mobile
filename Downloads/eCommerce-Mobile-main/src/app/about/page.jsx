"use client";
import Image from "next/image";
import HeaderUser from "@/components/Layout/HeaderUser";
import FooterUser from "@/components/Layout/FooterUser";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <HeaderUser />

            {/* Banner */}
            <section
                className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://fontawesome.com/images/icons.svg')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative text-4xl md:text-5xl font-bold text-white text-center z-10"
                >
                    Về TechMobile
                </motion.h1>
            </section>

            {/* Giới thiệu */}
            <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                        Công nghệ trong tầm tay bạn
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Tại <strong>TechMobile</strong>, chúng tôi không chỉ bán điện thoại – chúng tôi mang đến trải nghiệm công nghệ hiện đại,
                        tinh tế và đáng tin cậy. Khách hàng của chúng tôi là những người yêu công nghệ, yêu sự tiện lợi,
                        và mong muốn tận hưởng sản phẩm chính hãng chất lượng cao.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Với hơn 10 năm kinh nghiệm trong lĩnh vực thiết bị di động, TechMobile tự hào là đơn vị tiên phong
                        trong việc phân phối các sản phẩm đến từ Apple, Samsung, Xiaomi, và nhiều thương hiệu uy tín khác.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Image
                        src="https://fontawesome.com/images/svg-icons-banner.webp"
                        alt="TechMobile Store"
                        width={600}
                        height={400}
                        className="rounded-2xl shadow-lg object-cover"
                    />
                </motion.div>
            </section>

            {/* Sứ mệnh */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl font-bold text-gray-900 mb-4"
                    >
                        Sứ mệnh & Giá trị cốt lõi
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto text-gray-700 leading-relaxed mb-10"
                    >
                        Chúng tôi tin rằng công nghệ không chỉ phục vụ cuộc sống – mà còn truyền cảm hứng.
                        Sứ mệnh của TechMobile là mang lại giá trị thực thông qua dịch vụ tận tâm, sản phẩm chính hãng,
                        và tinh thần sáng tạo không ngừng.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Chính hãng & Uy tín",
                                desc: "Tất cả sản phẩm đều có nguồn gốc rõ ràng, đảm bảo 100% chính hãng.",
                                img: "https://fontawesome.com/images/icons-preview.svg",
                            },
                            {
                                title: "Trải nghiệm tốt nhất",
                                desc: "Tư vấn tận tâm, giao hàng nhanh, bảo hành chuyên nghiệp và minh bạch.",
                                img: "https://fontawesome.com/images/open-graph.png",
                            },
                            {
                                title: "Đổi mới & Phát triển",
                                desc: "Không ngừng cập nhật xu hướng công nghệ mới để mang lại giá trị vượt trội.",
                                img: "https://fontawesome.com/images/logo.png",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="rounded-xl overflow-hidden shadow-lg bg-gray-50 hover:-translate-y-2 transition-transform duration-300"
                            >
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    width={400}
                                    height={250}
                                    className="object-cover w-full h-56"
                                />
                                <div className="p-6">
                                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-700 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <FooterUser />
        </div>
    );
}
