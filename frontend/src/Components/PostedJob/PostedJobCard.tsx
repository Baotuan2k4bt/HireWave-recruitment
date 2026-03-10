import { Link, useParams } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";

const PostedJobCard = (props: any) => {
    const { id } = useParams();
    const isActive = String(props.id) === String(id);

    const statusLabel =
        props.jobStatus === "DRAFT"
            ? "Nháp"
            : props.jobStatus === "CLOSED"
            ? "Đã đóng"
            : "Đang đăng";

    const statusClass =
        props.jobStatus === "DRAFT"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : props.jobStatus === "CLOSED"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

    const companyName = props.companyName || props.company || "Công ty";
    const initials = (companyName || props.jobTitle || "?")
        .trim()
        .charAt(0)
        .toUpperCase();

    const applicantsCount = props.applicants?.length ?? 0;

    return (
        <Link
            data-aos="fade-up"
            to={`/posted-jobs/${props.id}`}
            className={`group rounded-2xl p-3 w-60 lg-mx:w-56 bs-mx:w-52 cursor-pointer transition-all duration-200 border ${
                isActive
                    ? "bg-oceanTeal-50 border-oceanTeal-400 shadow-md"
                    : "bg-deepSlate-100/80 border-transparent hover:border-oceanTeal-300 hover:bg-deepSlate-100"
            }`}
        >
            <div className="flex gap-3 items-start">
                <div className="h-10 w-10 rounded-xl bg-oceanTeal-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-semibold text-deepSlate-900 truncate group-hover:text-oceanTeal-600">
                            {props.jobTitle}
                        </div>
                        <span
                            className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${statusClass}`}
                        >
                            {statusLabel}
                        </span>
                    </div>
                    <div className="text-[11px] font-medium text-deepSlate-400 truncate">
                        {companyName} • {props.location}
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-deepSlate-400 mt-1">
                        <span>{timeAgo(props.postTime)}</span>
                        <span>
                            {applicantsCount > 0
                                ? `${applicantsCount} ứng viên`
                                : "Chưa có ứng viên"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostedJobCard;