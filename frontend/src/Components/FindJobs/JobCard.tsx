import { Badge } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";

const JobCard = (props: any) => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    
    const handleSaveJob = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let savedJobs: any = profile.savedJobs ? [...profile.savedJobs] : [];
        if (savedJobs.includes(props.id)) {
            savedJobs = savedJobs.filter((job: any) => job != props.id);
        } else {
            savedJobs.push(props.id);
        }
        let updatedProfile = { ...profile, savedJobs: savedJobs };
        dispatch(changeProfile(updatedProfile));
    }

    const isSaved = profile.savedJobs?.includes(props.id);
    
    // Format salary
    const formatSalary = (salary: string | null | undefined) => {
        if (!salary) return "Thoả thuận";
        if (typeof salary === 'string') {
            // If already formatted, return as is
            if (salary.includes('triệu') || salary.includes('USD') || salary.includes('VNĐ')) {
                return salary;
            }
            // Try to parse and format
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
        <Link to={`/jobs/${props.id}`} className="block">
            <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                {/* Heart Icon - Top Right */}
                <button
                    onClick={handleSaveJob}
                    className="absolute top-3 right-3 z-10 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                    {isSaved ? (
                        <IconHeartFilled className="text-red-500" size={18} stroke={2} fill="currentColor" />
                    ) : (
                        <IconHeart className="text-gray-400 group-hover:text-red-500" size={18} stroke={2} />
                    )}
                </button>

                {/* Company Logo */}
                <div className="flex justify-center mb-3">
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {props.companyLogo ? (
                            <img 
                                className="w-full h-full object-contain p-2" 
                                src={props.companyLogo} 
                                alt={props.companyName || props.company}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${props.companyName || props.company}`;
                                }}
                            />
                        ) : (
                            <img 
                                className="w-full h-full object-contain p-2" 
                                src={`/Icons/${props.company}.png`} 
                                alt={props.company}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = '<div class="text-blue-600 font-bold text-sm">' + (props.company?.substring(0, 2).toUpperCase() || 'CO') + '</div>';
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Job Title */}
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                    {props.jobTitle}
                </h3>

                {/* Company Name */}
                <div className="mb-3">
                    <Link 
                        to="/company" 
                        className="text-xs text-gray-600 hover:text-blue-600 transition-colors line-clamp-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {props.company}
                    </Link>
                </div>

                {/* Salary */}
                <div className="mb-2">
                    <span className="text-sm font-bold text-blue-600">
                        {formatSalary(props.packageOffered)}
                    </span>
                </div>

                {/* Location */}
                <div className="mt-auto pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600">
                        {props.location || "Hà Nội"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default JobCard;