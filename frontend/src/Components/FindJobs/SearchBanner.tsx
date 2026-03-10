import { TextInput, Button } from "@mantine/core";
import { IconSearch, IconBriefcase, IconMapPin } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { useNavigate } from "react-router-dom";

const SearchBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "/images/banners/banner-1.jpg",
        "/images/banners/banner-2.jpg",
        "/images/banners/banner-3.jpg",
    ];

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const handleSearch = () => {
        dispatch(
            updateFilter({
                "Chức danh": jobTitle ? [jobTitle] : null,
                "Địa điểm": location ? [location] : null,
                page: 1,
            })
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="relative overflow-hidden" style={{ height: "350px" }}>
            {/* Background slider */}
            <div className="absolute inset-0 overflow-hidden">

                {/* SLIDES */}
                {slides.map((src, index) => (
                    <div
                        key={src}
                        className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                ))}

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-r
                    from-[#0f172a]/95
                    via-[#0f172a]/80
                    to-[#0f172a]/40"
                />

                {/* AI GLOW EFFECT */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(37,99,235,0.15),rgba(6,182,212,0.1),transparent_70%)]" />

            </div>

            {/* Content */}
            <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-12">
             <div className="text-center mb-6">

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                     Tìm kiếm công việc phù hợp với bạn
                    </h1>

                 <p className="text-lg text-white/90 max-w-2xl mx-auto">
                         Khám phá hàng nghìn cơ hội việc làm từ các doanh nghiệp hàng đầu 
                         trong nhiều lĩnh vực như công nghệ, tài chính, marketing và nhiều ngành nghề khác.
                     </p>

                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Job Title Input */}
                        <div className="flex-1">
                            <TextInput
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.currentTarget.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Vị trí công việc, kỹ năng, công ty..."
                                leftSection={<IconBriefcase className="text-blue-600" size={20} stroke={2} />}
                                size="lg"
                                classNames={{
                                    input: "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl h-12 text-base font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200",
                                }}
                                variant="default"
                            />
                        </div>

                        {/* Location Input */}
                        <div className="flex-1">
                            <TextInput
                                value={location}
                                onChange={(e) => setLocation(e.currentTarget.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Thành phố, tỉnh..."
                                leftSection={<IconMapPin className="text-blue-600" size={20} stroke={2} />}
                                size="lg"
                                classNames={{
                                    input: "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl h-12 text-base font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200",
                                }}
                                variant="default"
                            />
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={handleSearch}
                            size="lg"
                            className="h-12 px-8 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                                backgroundSize: '200% 200%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundPosition = '100% 0%';
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundPosition = '0% 0%';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <IconSearch size={20} stroke={2} />
                            <span className="ml-2">Tìm kiếm</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBanner;
