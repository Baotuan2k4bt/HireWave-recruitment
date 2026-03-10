import { Avatar, TextInput } from "@mantine/core";
import { IconSearch, IconBriefcase, IconClock } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { useNavigate } from "react-router-dom";

const DreamJob = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState("");
    const [type, setType] = useState("");

    const handleClick = () => {
        dispatch(
            updateFilter({
                "Chức danh": jobTitle ? [jobTitle] : null,
                "Hình thức": type ? [type] : null,
                page: 1,
            })
        );
        navigate("/find-jobs");
    };

        return (
        <div className="min-h-[90vh] flex items-center bg-slate-50 px-4 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left Section - Hero Content */}
                    <div className="flex flex-col w-full lg:w-[48%] gap-6 lg:gap-8">
                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] tracking-tight text-slate-900">
                                Tìm{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10 bg-gradient-to-r from-oceanTeal-500 via-teal-400 to-sky-400 bg-clip-text text-transparent">
                                        công việc mơ ước
                                    </span>
                                    <span className="absolute bottom-1 left-0 right-0 h-3 bg-oceanTeal-100/70 -rotate-1 rounded-sm"></span>
                                </span>{" "}
                                cùng HireWave
                            </h1>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
                                Bắt đầu hành trình sự nghiệp của bạn với hàng nghìn cơ hội việc làm chất lượng,
                                được tuyển chọn từ những nhà tuyển dụng uy tín.
                            </p>
                        </div>

                        {/* Search Form Card */}
                        <div className="mt-4 lg:mt-6">
  <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 lg:p-8 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300">
    
    <div className="flex flex-col sm:flex-row gap-4 sm:items-end">

      {/* Job Title */}
      <div className="flex-1 flex flex-col">
        <label className="text-gray-700 text-sm font-semibold mb-2">
          Chức danh
        </label>
        <TextInput
          value={jobTitle}
          onChange={(e) => setJobTitle(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          placeholder="Lập trình viên, Thiết kế UI/UX..."
          leftSection={<IconBriefcase className="text-oceanTeal-500" size={20} />}
          classNames={{
            input:
              "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl h-14 text-base font-medium focus:border-oceanTeal-400 focus:ring-2 focus:ring-oceanTeal-400/20 hover:border-gray-300 transition-all duration-200",
          }}
        />
      </div>

      {/* Job Type */}
      <div className="flex-1 flex flex-col">
        <label className="text-gray-700 text-sm font-semibold mb-2">
          Hình thức
        </label>
        <TextInput
          value={type}
          onChange={(e) => setType(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          placeholder="Toàn thời gian, Remote, Thực tập..."
          leftSection={<IconClock className="text-oceanTeal-500" size={20} />}
          classNames={{
            input:
              "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl h-14 text-base font-medium focus:border-oceanTeal-400 focus:ring-2 focus:ring-oceanTeal-400/20 hover:border-gray-300 transition-all duration-200",
          }}
        />
      </div>

      {/* Search Button */}
      <div className="flex flex-col sm:self-end">
  {/* Fake label spacer để đồng bộ chiều cao */}
  <div className="mb-1 invisible text-sm font-semibold">
    Placeholder
  </div>

  <button
    onClick={handleClick}
    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-oceanTeal-400 via-oceanTeal-500 to-sky-400 hover:from-oceanTeal-600 hover:via-oceanTeal-500 hover:to-sky-500 text-white font-semibold rounded-xl px-8 lg:px-10 h-9 shadow-lg shadow-oceanTeal-400/30 hover:shadow-xl hover:shadow-oceanTeal-400/40 hover:scale-105 active:scale-100 transition-all duration-200 whitespace-nowrap text-base"
  >
    <IconSearch size={15} className="group-hover:rotate-12 transition-transform duration-200" />
    <span>Tìm kiếm</span>
  </button>
</div>

    </div>
  </div>
</div>

                        {/* Trust Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-oceanTeal-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-gray-700">10K+</span>
                                <span>ứng viên đã trúng tuyển</span>
                            </div>
                            <div className="w-px h-6 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-oceanTeal-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-gray-700">5K+</span>
                                <span>doanh nghiệp đồng hành</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Illustration */}
                    <div
                        data-aos="zoom-out-left"
                        className="w-full lg:w-[52%] flex items-center justify-center relative"
                    >
                        <div className="w-full max-w-[32rem] relative">
                            <img
                                src="/Boy.png"
                                alt="Job seeker illustration"
                                className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                            />

                           
                            {/* Floating Card - Job Preview */}
                            <div className="absolute -left-4 sm:-left-8 lg:-left-12 top-[25%] sm:top-[28%] w-fit bg-white/95 backdrop-blur-xl border-2 border-oceanTeal-100 rounded-2xl p-5 shadow-2xl shadow-gray-900/10 hover:shadow-oceanTeal-400/20 hover:scale-105 transition-all duration-300 z-10">
                                <div className="flex gap-4 items-start mb-4">
                                        <div className="w-14 h-14 p-2 bg-white border-2 border-gray-100 rounded-xl shadow-sm flex-shrink-0">
                                        <img src="/Google.png" alt="Google logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-900 text-sm mb-1">Kỹ sư Phần mềm</div>
                                        <div className="text-gray-600 text-xs flex items-center gap-1">
                                            <span>📍</span>
                                            <span>Hà Nội, Việt Nam</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 justify-between text-gray-600 text-xs pt-4 border-t border-gray-100">
                                    <span className="flex items-center gap-2 font-medium">
                                        <IconClock size={14} className="text-oceanTeal-500" />
                                        1 ngày trước
                                    </span>
                                    <span className="flex items-center gap-2 font-medium">
                                        <IconBriefcase size={14} className="text-oceanTeal-500" />
                                        120 ứng viên
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DreamJob;