import { Carousel } from "@mantine/carousel";
import { Badge } from "@mantine/core";
import { jobCategory } from "../../Data/Data";
import { IconArrowLeft, IconArrowRight, IconBriefcase } from "@tabler/icons-react";

const JobCategory = () => {
    return (
        <div className="mt-20 pb-12 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div 
                        data-aos="zoom-out" 
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900"
                    >
                        Khám phá{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                                Danh mục việc làm
                            </span>
                            <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-200/60 via-cyan-200/60 to-indigo-200/60 -rotate-1 rounded-md"></span>
                        </span>
                    </div>
                    <p 
                        data-aos="zoom-out" 
                        className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Khám phá hàng nghìn cơ hội việc làm đa dạng phù hợp với kỹ năng của bạn. Bắt đầu hành trình sự nghiệp ngay hôm nay!
                    </p>
                </div>

                {/* Carousel Section */}
                <Carousel 
                    slideSize={{ base: "100%", sm: "50%", md: "33.333%", lg: "25%" }}
                    slideGap="lg" 
                    loop 
                    align="start"
                    className="focus-visible:[&_button]:!outline-none"
                    classNames={{
                        control: "!bg-white !border-2 !border-gray-200 !text-blue-600 hover:!bg-blue-50 hover:!border-blue-400 !shadow-lg hover:!shadow-xl transition-all duration-200",
                        indicator: "!bg-blue-200 hover:!bg-blue-400 !transition-all !duration-200"
                    }}
                    nextControlIcon={<IconArrowRight className="h-6 w-6" stroke={2} />}
                    previousControlIcon={<IconArrowLeft className="h-6 w-6" stroke={2} />}
                    controlsOffset="xl"
                >
                    {jobCategory.map((category, index) => (
                        <Carousel.Slide key={index}>
                            <div 
                                data-aos="zoom-out" 
                                data-aos-delay={index * 50}
                                className="group h-full"
                            >
                                <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                                    {/* Icon Container */}
                                    <div className="relative mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center border-2 border-blue-100 group-hover:border-blue-300 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                                            <img 
                                                className="h-8 w-8 object-contain" 
                                                src={`/Category/${category.name}.png`} 
                                                alt={category.name}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const icon = document.createElement('div');
                                                        icon.className = 'text-blue-600';
                                                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
                                                        parent.appendChild(icon);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                        {category.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed flex-grow">
                                        {category.desc}
                                    </p>

                                    {/* Job Count Badge */}
                                    <div className="flex items-center justify-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                        <IconBriefcase className="h-4 w-4 text-blue-600" stroke={2} />
                                        <Badge
                                            variant="light"
                                            color="blue"
                                            size="lg"
                                            className="bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                                        >
                                            {category.jobs}+ việc làm mới
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default JobCategory;