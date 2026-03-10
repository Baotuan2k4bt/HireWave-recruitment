import {
    IconAnchor,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandTelegram,
    IconBrandX,
    IconBrandYoutube,
    IconMail,
    IconPhone,
    IconMapPin,
} from "@tabler/icons-react";
import { useLocation, Link } from "react-router-dom";
import { Container, Divider, Group, Text, Stack } from "@mantine/core";

const Footer = () => {
    const location = useLocation();
    
    const footerLinks = [
        { 
            title: "Sản phẩm", 
            links: [
                { label: "Tìm việc làm", path: "/find-jobs" },
                { label: "Ứng tuyển", path: "/find-talent" },
                { label: "Phân tích CV", path: "/cv-analysis" },
                { label: "Tạo CV", path: "/create-cv" }
            ] 
        },
                { 
                    title: "Công ty", 
                    links: [
                        { label: "Về chúng tôi", path: "/about" },
                        { label: "Phân tích Nghề nghiệp AI", path: "/ai-career-analysis" },
                        { label: "Chính sách bảo mật", path: "/privacy" },
                        { label: "Điều khoản sử dụng", path: "/terms" }
                    ] 
                },
        { 
            title: "Hỗ trợ", 
            links: [
                { label: "Trung tâm trợ giúp", path: "/help" },
                { label: "Gửi phản hồi", path: "/feedback" },
                { label: "Câu hỏi thường gặp", path: "/faq" }
            ] 
        }
    ];

    const currentYear = new Date().getFullYear();

    return location.pathname !== "/signup" && location.pathname !== "/login" ? (
        <footer className="bg-white border-t border-gray-200">
            <Container size="lg" className="py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-8">
                    {/* Brand Section */}
                    <div
                        data-aos="fade-up"
                        data-aos-offset="0"
                        className="lg:col-span-2 flex flex-col gap-4"
                    >
                        <Link to="/" className="flex gap-2 items-center group">
                            <IconAnchor className="h-8 w-8 text-oceanTeal-500 group-hover:text-oceanTeal-600 transition-colors" stroke={2.5} />
                            <div className="text-2xl font-bold bg-gradient-to-r from-oceanTeal-500 to-oceanTeal-600 bg-clip-text text-transparent group-hover:from-oceanTeal-600 group-hover:to-oceanTeal-700 transition-all">
                                HireWave
                            </div>
                        </Link>
                        <Text size="sm" className="text-deepSlate-600 leading-relaxed max-w-md">
                                Nền tảng tuyển dụng thông minh ứng dụng AI hỗ trợ đánh giá mức độ phù hợp 
                            giữa ứng viên và yêu cầu tuyển dụng. Kết nối nhà tuyển dụng và ứng viên một cách hiệu quả.
                        </Text>
                        
                        {/* Contact Info */}
                        <Stack gap="xs" mt="sm">
                            <Group gap="xs" className="text-deepSlate-600">
                                <IconMail size={16} className="text-oceanTeal-500" />
                                <Text size="sm">contact@hirewave.com</Text>
                            </Group>
                            <Group gap="xs" className="text-deepSlate-600">
                                <IconPhone size={16} className="text-oceanTeal-500" />
                                <Text size="sm">+84 123 456 789</Text>
                            </Group>
                            <Group gap="xs" className="text-deepSlate-600">
                                <IconMapPin size={16} className="text-oceanTeal-500" />
                                <Text size="sm">Hà Nội, Việt Nam</Text>
                            </Group>
                        </Stack>

                        {/* Social Media */}
                        <Group gap="xs" mt="md">
                            <a 
                                href="https://www.facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded-full hover:bg-[#166FE5] hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                aria-label="Facebook"
                            >
                                <IconBrandFacebook size={20} />
                            </a>
                            <a 
                                href="https://www.instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                aria-label="Instagram"
                            >
                                <IconBrandInstagram size={20} />
                            </a>
                            <a 
                                href="https://t.me/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-[#0088cc] text-white rounded-full hover:bg-[#0077b5] hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                aria-label="Telegram"
                            >
                                <IconBrandTelegram size={20} />
                            </a>
                            <a 
                                href="https://www.youtube.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-[#FF0000] text-white rounded-full hover:bg-[#CC0000] hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                aria-label="YouTube"
                            >
                                <IconBrandYoutube size={20} />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-[#000000] text-white rounded-full hover:bg-[#1DA1F2] hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                aria-label="Twitter"
                            >
                                <IconBrandX size={20} />
                            </a>
                        </Group>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((item, index) => (
                        <div 
                            data-aos-offset="0" 
                            data-aos="fade-up" 
                            key={index}
                            className="flex flex-col"
                        >
                            <Text 
                                size="lg" 
                                fw={600} 
                                className="text-deepSlate-900 mb-4"
                            >
                                {item.title}
                            </Text>
                            <Stack gap="xs">
                                {item.links.map((link, linkIndex) => (
                                    <Link
                                        key={linkIndex}
                                        to={link.path}
                                        className="text-sm text-deepSlate-600 hover:text-oceanTeal-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Stack>
                        </div>
                    ))}
                </div>

                <Divider color="gray.2" className="my-8" />

                {/* Copyright Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Text size="sm" className="text-deepSlate-600 text-center md:text-left">
                        © {currentYear} <span className="font-semibold text-deepSlate-900">HireWave</span>. 
                        Bảo lưu mọi quyền.
                    </Text>
                    <Group gap="md" className="flex-wrap justify-center">
                        <Link 
                            to="/privacy" 
                            className="text-sm text-deepSlate-600 hover:text-oceanTeal-600 transition-colors"
                        >
                            Chính sách bảo mật
                        </Link>
                        <span className="text-deepSlate-400">•</span>
                        <Link 
                            to="/terms" 
                            className="text-sm text-deepSlate-600 hover:text-oceanTeal-600 transition-colors"
                        >
                            Điều khoản sử dụng
                        </Link>
                        <span className="text-deepSlate-400">•</span>
                        <Link 
                            to="/ai-career-analysis" 
                            className="text-sm text-deepSlate-600 hover:text-oceanTeal-600 transition-colors"
                        >
                            Phân tích Nghề nghiệp AI
                        </Link>
                    </Group>
                </div>
            </Container>
        </footer>
    ) : null;
};

export default Footer;
