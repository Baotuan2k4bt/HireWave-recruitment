import { Button, TextInput } from "@mantine/core";
import { IconMail, IconBell } from "@tabler/icons-react";
import { useState } from "react";

const Subscribe = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = () => {
        if (email && email.includes("@")) {
            // Handle subscription logic here
            console.log("Subscribed:", email);
            setEmail("");
        }
    };

    return (
        <div className="mt-20 mb-12 relative overflow-hidden">
            {/* Background with decorative shapes */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50"></div>
            
            {/* Decorative shapes */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-200 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
                <div 
                    data-aos="zoom-out" 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 lg:p-8"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                        {/* Left Section - Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <IconBell className="h-5 w-5 text-blue-600" stroke={2} />
                                </div>
                                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                    Đăng ký nhận thông báo
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Không muốn bỏ lỡ{" "}
                                <span className="text-blue-600">cơ hội việc làm</span> mới?
                            </h2>
                            <p className="text-base text-gray-600 leading-relaxed">
                                Đăng ký để nhận thông báo về các việc làm mới phù hợp với bạn
                            </p>
                        </div>

                        {/* Right Section - Form */}
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <TextInput
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSubscribe();
                                        }
                                    }}
                                    placeholder="Nhập email của bạn"
                                    leftSection={<IconMail className="text-gray-400" size={18} stroke={2} />}
                                    size="md"
                                    classNames={{
                                        input: "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg h-11 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200 w-full sm:w-64",
                                    }}
                                    variant="default"
                                />
                                <Button
                                    onClick={handleSubscribe}
                                    size="md"
                                    className="h-11 px-6 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    style={{
                                        background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 text-center sm:text-left mt-2">
                                Chúng tôi cam kết bảo vệ thông tin của bạn
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;