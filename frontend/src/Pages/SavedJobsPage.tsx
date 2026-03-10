import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllJobs } from "../Services/JobService";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";
import { useDispatch } from "react-redux";
import { IconHeart, IconHeartFilled, IconMapPin } from "@tabler/icons-react";
import { changeProfile } from "../Slices/ProfileSlice";
import { timeAgo } from "../Services/Utilities";
import { Link } from "react-router-dom";

const SavedJobsPage = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const [savedJobsList, setSavedJobsList] = useState<any[]>([]);

    useEffect(() => {
        if (!profile?.savedJobs || profile.savedJobs.length === 0) {
            setSavedJobsList([]);
            return;
        }
        dispatch(showOverlay());
        getAllJobs()
            .then((res) => {
                const activeJobs = res.filter((job: any) => job.jobStatus === "ACTIVE");
                const savedJobIds = profile?.savedJobs || [];
                const savedJobs = activeJobs.filter((job: any) => 
                    savedJobIds.includes(job.id)
                );
                setSavedJobsList(savedJobs);
            })
            .catch((err) => console.log(err))
            .finally(() => dispatch(hideOverlay()));
    }, [profile?.savedJobs, dispatch]);

    const hasSavedJobs = savedJobsList.length > 0;

    const handleToggleSave = (e: React.MouseEvent, jobId: any) => {
        e.preventDefault();
        e.stopPropagation();
        let savedJobs: any = profile.savedJobs ? [...profile.savedJobs] : [];
        if (savedJobs.includes(jobId)) {
            savedJobs = savedJobs.filter((id: any) => id !== jobId);
        } else {
            savedJobs.push(jobId);
        }
        const updatedProfile = { ...profile, savedJobs };
        dispatch(changeProfile(updatedProfile));
    };

    const formatSalary = (salary: string | null | undefined) => {
        if (!salary) return "Thoả thuận";
        if (typeof salary === "string") {
            if (salary.includes("triệu") || salary.includes("USD") || salary.includes("VNĐ")) {
                return salary;
            }
            const numbers = salary.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                return `${numbers[0]} - ${numbers[1]} triệu`;
            }
            if (numbers && numbers.length === 1) {
                return `Từ ${numbers[0]} triệu`;
            }
        }
        return salary;
    };

    return (
        <div className="min-h-[90vh] bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Header dạng câu giống TopCV */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Danh sách{" "}
                        <span className="text-green-600">
                            {savedJobsList.length}
                        </span>{" "}
                        việc làm đã lưu
                    </h1>
                </div>

                {/* Nội dung chính */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
                    {hasSavedJobs ? (
                        <div className="space-y-4">
                            {savedJobsList.map((job: any) => {
                                const isSaved = profile.savedJobs?.includes(job.id);
                                const applicantsCount = job.applicants ? job.applicants.length : 0;
                                return (
                                    <Link
                                        key={job.id}
                                        to={`/jobs/${job.id}`}
                                        className="block"
                                    >
                                        <div className="relative flex gap-4 rounded-2xl border border-green-100 bg-white px-4 py-4 md:px-6 md:py-5 shadow-sm hover:shadow-md hover:border-green-300 transition">
                                            {/* Logo công ty */}
                                            <div className="flex-shrink-0">
                                                <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-gradient-to-br from-green-50 to-yellow-50 border border-green-100 flex items-center justify-center overflow-hidden">
                                                    {job.companyLogo ? (
                                                        <img
                                                            src={job.companyLogo}
                                                            alt={job.company}
                                                            className="h-full w-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-bold text-green-600">
                                                            {job.company?.substring(0, 2).toUpperCase() ||
                                                                "CO"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Nội dung chính */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col gap-1">
                                                    <h2 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">
                                                        {job.jobTitle}
                                                    </h2>
                                                    <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">
                                                        {job.company}
                                                    </p>
                                                </div>

                                                {/* Tags vị trí / kinh nghiệm */}
                                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                    {job.location && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                                                            <IconMapPin size={14} className="text-gray-400" />
                                                            {job.location}
                                                        </span>
                                                    )}
                                                    {job.experience && (
                                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                                                            {job.experience}
                                                        </span>
                                                    )}
                                                    {job.jobType && (
                                                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
                                                            {job.jobType}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Thông tin phụ dưới cùng bên trái */}
                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                    <span>Cập nhật {timeAgo(job.postTime)}</span>
                                                    {applicantsCount > 0 && (
                                                        <span>• {applicantsCount} ứng viên</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Cột phải: lương + nút trái tim */}
                                            <div className="flex flex-col items-end justify-between gap-2 min-w-[88px]">
                                                <div className="text-right">
                                                    <div className="text-sm md:text-base font-semibold text-green-600">
                                                        {formatSalary(job.packageOffered)}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleSave(e, job.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-green-200 bg-white text-green-500 hover:bg-green-50 hover:border-green-400 transition"
                                                >
                                                    {isSaved ? (
                                                        <IconHeartFilled
                                                            size={18}
                                                            stroke={2}
                                                            className="text-green-500"
                                                            fill="currentColor"
                                                        />
                                                    ) : (
                                                        <IconHeart
                                                            size={18}
                                                            stroke={2}
                                                            className="text-green-500"
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                                <span className="text-3xl">📂</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700">
                                Bạn chưa lưu công việc nào
                            </h3>
                            <p className="text-gray-500 mt-2 mb-6 max-w-md">
                                Hãy khám phá các việc làm phù hợp và lưu lại để dễ dàng theo dõi và ứng tuyển sau này.
                            </p>
                            <Button
                                component="a"
                                href="/find-jobs"
                                radius="xl"
                                size="md"
                                className="px-6 bg-green-600 hover:bg-green-700 text-white font-semibold"
                            >
                                Tìm việc ngay
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedJobsPage;

