import { ActionIcon, Button, Divider, Skeleton } from "@mantine/core";
import { card} from "../../Data/JobDescData";
import { IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled, IconSend2, IconSparkles } from "@tabler/icons-react";
// @ts-ignore
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { changeProfile } from "../../Slices/ProfileSlice";
import { postJob } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { getCompany, CompanyDTO } from "../../Services/CompanyService";
import { AIMatchingModal } from "./AIMatchingModal";

const Job = (props:any) => {
    const dispatch=useDispatch();
    const user=useSelector((state:any)=>state.user);
    const profile=useSelector((state:any)=>state.profile);

    const [companyDetails, setCompanyDetails] = useState<CompanyDTO | null>(null);
    const [companyLoading, setCompanyLoading] = useState<boolean>(false);
    const isSaved = profile.savedJobs?.includes(props.id);
    const salaryLabel = props.packageOffered || "Thoả thuận";
    const displayCompanyName = companyDetails?.name || props.companyName || props.company;
    const displayCompanyLogo = props.companyLogo || companyDetails?.logoUrl || `/Icons/${props.company}.png`;
    const displayLocation = props.location || companyDetails?.location || "Đang cập nhật";
    const handleSaveJob = () => {
        let savedJobs:any=profile.savedJobs?[...profile.savedJobs]:[];
        if(savedJobs.includes(props.id)){
            savedJobs=savedJobs.filter((job:any)=>job!=props.id);
        }else{ 
            savedJobs.push(props.id);
        }
        let updatedProfile={...profile,savedJobs:savedJobs};
        dispatch(changeProfile(updatedProfile));
    }
    const [applied, setApplied] = useState(false);
    const [aiModalOpened, setAiModalOpened] = useState(false);

    useEffect(()=>{
        // Use hasApplied flag from backend instead of filtering applicants
        if (props.hasApplied) {
            setApplied(true);
        } else {
            setApplied(false);
        }
    }, [props.hasApplied])

    // Load full company info when companyId is available
    useEffect(() => {
        const loadCompany = async () => {
            if (!props.companyId) return;
            try {
                setCompanyLoading(true);
                const data = await getCompany(props.companyId);
                setCompanyDetails(data);
            } catch (e) {
                console.error("Failed to load company details", e);
            } finally {
                setCompanyLoading(false);
            }
        };
        loadCompany();
    }, [props.companyId]);
    const cleanHTML = DOMPurify.sanitize(props.description);

    const handleViewMatching = () => {
        if (!props.id) return;
        setAiModalOpened(true);
    };
    const handleClose = () => {
        if(props.closed)return;
        dispatch(showOverlay())
        postJob({...props, jobStatus:"CLOSED"}).then((res)=>{
            successNotification('Job Closed', 'Job has been closed successfully');
        }).catch((err)=>console.log(err))
        .finally(()=>dispatch(hideOverlay()));
    }

    return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 py-4 pb-10">
    <div
        data-aos="zoom-out"
        className="w-full"
    >
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Hero header (logo nổi bật + nền gradient nhẹ) */}
        <div className="p-6 bg-gradient-to-r from-oceanTeal-50 via-white to-indigo-50">
        {/* Header: job title + company */}
        <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-200 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        className="h-16 w-16 object-contain"
                        src={displayCompanyLogo}
                        alt={displayCompanyName}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayCompanyName || "CO"}`;
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-3xl xs-mx:text-2xl text-slate-900 leading-tight tracking-tight">
                        {props.jobTitle}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-slate-800">
                            {displayCompanyName}
                        </span>
                        <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-200">
                            {salaryLabel}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-700">{displayLocation}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="text-slate-600">{timeAgo(props.postTime||"")}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="font-medium text-slate-700">{props.applicants?props.applicants.length:0} ứng viên</span>
                </div>
                </div>

            </div>
        </div>
        </div>

        <div className="px-6">
            {/* CTA row dưới header */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch -mt-4">
                <div className="flex-1 flex gap-3">
                    {(props.edit || !applied) && (
                        <Link to={props.edit?`/post-job/${props.id}`:`/apply-job/${props.id}`} className="flex-1">
                            <Button
                                fullWidth
                                size="lg"
                                radius="md"
                                className="h-12 text-base font-semibold bg-[#39b449] hover:bg-[#33a040] text-white"
                                leftSection={<IconSend2 size={18} />}
                            >
                                {props.closed ? "Mở lại tin" : props.edit ? "Chỉnh sửa" : "Ứng tuyển ngay"}
                            </Button>
                        </Link>
                    )}
                    {applied && !props.edit && (
                        <Button
                            fullWidth
                            size="lg"
                            radius="md"
                            disabled
                            className="h-12 text-base font-semibold bg-gray-200 text-gray-600"
                        >
                            Đã ứng tuyển
                        </Button>
                    )}
                    {props.edit && !props.closed && (
                        <Button
                            onClick={handleClose}
                            size="lg"
                            radius="md"
                            variant="outline"
                            color="red.4"
                            className="h-12 px-6 font-semibold"
                        >
                            Đóng tin
                        </Button>
                    )}
                    <Button
                        onClick={handleSaveJob}
                        size="lg"
                        radius="md"
                        variant="outline"
                        className="h-12 px-6 text-base font-semibold border-[#8dd8a3] text-[#39b449] bg-white hover:bg-[#e9f9ef]"
                        leftSection={isSaved ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                    >
                        {isSaved ? "Đã lưu tin" : "Lưu tin"}
                    </Button>
                </div>

                {/* Nút: Xem mức độ phù hợp (AI) */}
                <Button
                    size="lg"
                    radius="md"
                    variant="light"
                    color="oceanTeal.4"
                    className="h-12 px-5 font-semibold w-full md:w-auto bg-oceanTeal-50 hover:bg-oceanTeal-100 text-oceanTeal-700"
                    leftSection={<IconSparkles size={18} />}
                    onClick={handleViewMatching}
                >
                    Xem mức độ phù hợp (AI)
                </Button>
            </div>

            <Divider my="xl" />

            {/* Thông tin nhanh: lương, kinh nghiệm, hình thức, địa điểm */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
            {card.map((item, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-center text-center gap-2 text-sm rounded-lg p-3 ${item.id === "packageOffered" ? "bg-emerald-50/80 border border-emerald-100" : ""}`}
                >
                    <ActionIcon
                        className="!h-10 !w-10"
                        variant="light"
                        color="oceanTeal.4"
                        radius="xl"
                    >
                        <item.icon className="h-4/5 w-4/5" />
                    </ActionIcon>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        {item.name}
                    </div>
                    <div className={`font-bold ${item.id === "packageOffered" ? "text-emerald-700 text-base" : "text-slate-800"}`}>
                        {props ? props[item.id] : "NA"}
                        {item.id=="packageOffered" && <> USD</>}
                    </div>
                </div>
            ))}
            </div>
        </div>

        {/* Mô tả công việc */}
        <div className="px-6 pt-6 space-y-2">
            <h2 className="text-xl font-bold text-slate-900 border-b-2 border-oceanTeal-200 pb-2 w-fit">
                Mô tả công việc
            </h2>
            <div className="max-w-3xl [&>h4]:text-lg [&_*]:text-slate-700 [&_li]:marker:text-oceanTeal-500 [&_li]:mb-1 [&>h4]:text-slate-800 [&>h4]:font-bold [&>h4]:my-4 [&_p]:text-justify [&_p]:text-sm [&_p]:text-slate-700 [&_li]:text-sm [&_li]:text-slate-700 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: cleanHTML }}>
            </div>
        </div>

        {/* Kỹ năng yêu cầu */}
        <div className="px-6 pt-6 space-y-2">
            <h2 className="text-xl font-bold text-slate-900 border-b-2 border-oceanTeal-200 pb-2 w-fit">
                Kỹ năng yêu cầu
            </h2>
            <div className="flex flex-wrap gap-2">
                {props.skillsRequired?.map((skill:any, index:number) => (
                    <ActionIcon
                        key={index}
                        className="!h-fit !w-fit font-semibold !text-sm xs-mx:!text-xs !text-slate-800"
                        variant="light"
                        color="oceanTeal.4"
                        p="xs"
                        radius="xl"
                    >
                        {skill}
                    </ActionIcon>
                ))}
            </div>
        </div>

        {/* Thông tin công ty */}
        <div className="px-6 pt-6 pb-6 space-y-2">
            <h2 className="text-xl font-bold text-slate-900 border-b-2 border-oceanTeal-200 pb-2 w-fit">
                Thông tin công ty
            </h2>
            <div className="flex items-center justify-between mb-3 xs-mx:flex-wrap xs-mx:gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                        <img
                            className="h-10 w-10 object-contain"
                            src={companyDetails?.logoUrl || props.companyLogo || `/Icons/${props.company}.png`}
                            alt={displayCompanyName}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayCompanyName || "CO"}`;
                            }}
                        />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-900">
                            {companyDetails?.name || props.companyName || props.company}
                        </div>
                        <div className="text-sm font-medium text-slate-600">
                            {companyDetails?.companySize || "Quy mô đang cập nhật"}
                        </div>
                        {companyDetails?.location && (
                            <div className="text-sm font-medium text-slate-600">
                                {companyDetails.location}
                            </div>
                        )}
                    </div>
                </div>
                <Link to={`/company/${props.companyId || props.company}`}>
                    <Button color="oceanTeal.4" variant="light">
                        Trang công ty
                    </Button>
                </Link>
            </div>
            <div className="text-slate-700 text-sm leading-relaxed font-medium">
                {companyLoading ? (
                    <Skeleton height={80} radius="md" />
                ) : companyDetails?.description ? (
                    companyDetails.description
                ) : (
                    "Thông tin về công ty đang được cập nhật."
                )}
            </div>
        </div>

        <AIMatchingModal
            opened={aiModalOpened}
            onClose={() => setAiModalOpened(false)}
            jobId={props.id}
            jobTitle={props.jobTitle}
            skillsRequired={props.skillsRequired}
            experience={props.experience}
        />
    </div>
    </div>
    </div>
    )
}

export default Job;