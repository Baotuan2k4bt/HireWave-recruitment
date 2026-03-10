import { useEffect, useState } from "react";
import JobCard from "../FindJobs/JobCard";
import { getAllJobs } from "../../Services/JobService";
import { useParams, Link } from "react-router-dom";
import { Skeleton } from "@mantine/core";

const RecommendedJob = () => {
    const [jobList, setJobList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        getAllJobs()
            .then((res) => setJobList(res))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="relative bg-gradient-to-br from-oceanTeal-50 via-white to-indigo-50 py-14 overflow-hidden">

            {/* Background blur decoration */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-oceanTeal-200 rounded-full blur-3xl opacity-20" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20" />

            <div className="relative max-w-4xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-oceanTeal-500 to-indigo-500 bg-clip-text text-transparent">
                            Việc làm đề xuất
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Gợi ý phù hợp với hồ sơ của bạn
                        </p>
                    </div>

                    <Link
                        to="/find-jobs"
                        className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 
                                   hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
                                   text-oceanTeal-600 font-medium"
                    >
                        Xem tất cả
                    </Link>
                </div>

                {/* Vertical Scroll Container */}
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl 
                                shadow-xl border border-white/40 
                                p-5 h-[600px] overflow-y-auto space-y-5
                                scrollbar-thin scrollbar-thumb-oceanTeal-300 scrollbar-track-transparent">

                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <Skeleton key={i} height={130} radius="xl" />
                        ))
                    ) : (
                        jobList
                            .filter((job: any) => job.id != id)
                            .slice(0, 8)
                            .map((job: any) => (
                                <div
                                    key={job.id}
                                    className="relative group transition-all duration-300 
                                               hover:-translate-y-1 hover:shadow-lg 
                                               rounded-2xl"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-2xl 
                                                    bg-gradient-to-r from-oceanTeal-200/0 
                                                    via-oceanTeal-100/30 to-indigo-200/0 
                                                    opacity-0 group-hover:opacity-100 
                                                    transition duration-500 blur-xl" />

                                    <JobCard {...job} />
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendedJob;