import { Button, Divider, Text } from "@mantine/core";
import {
    IconBookmark,
    IconBookmarkFilled,
    IconCalendarMonth,
    IconClockHour3,
    IconBuilding,
    IconMapPin,
    IconCurrencyDollar,
} from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { changeAppStatus } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { changeProfile } from "../../Slices/ProfileSlice";
import { timeAgo } from "../../Services/Utilities";

const Card = (props: any) => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const [pendingAction, setPendingAction] = useState<"OFFERED" | "REJECTED" | null>(null);
    const [decidedAction, setDecidedAction] = useState<"OFFERED" | "REJECTED" | null>(null);

    const handleSaveJob = () => {
        let savedJobs: any = [...profile.savedJobs];
        if (savedJobs.includes(props.id)) {
            savedJobs = savedJobs.filter((job: any) => job != props.id);
        } else {
            savedJobs.push(props.id);
        }
        let updatedProfile = { ...profile, savedJobs: savedJobs };
        dispatch(changeProfile(updatedProfile));
    }

    const isSaved = profile.savedJobs?.includes(props.id);
    const applicantsCount = props.applicants ? props.applicants.length : 0;
    const statusLabel =
        props.applied || props.interviewing
            ? "Đã ứng tuyển"
            : props.offered
            ? "Được đề nghị"
            : "Tin đăng";

    const handleOfferAction = async (status: "OFFERED" | "REJECTED") => {
        if (!props?.id || !profile?.id) {
            errorNotification("Lỗi", "Thiếu thông tin để cập nhật trạng thái offer");
            return;
        }

        try {
            setPendingAction(status);
            await changeAppStatus({
                id: props.id,
                applicantId: profile.id,
                applicationStatus: status,
            });
            setDecidedAction(status);
            successNotification(
                "Thành công",
                status === "OFFERED" ? "Bạn đã chấp nhận offer" : "Bạn đã từ chối offer"
            );
            if (typeof props?.onStatusUpdated === "function") {
                props.onStatusUpdated();
            }
        } catch (err: any) {
            errorNotification(
                "Lỗi",
                err?.response?.data?.errorMessage || "Không thể cập nhật trạng thái offer"
            );
        } finally {
            setPendingAction(null);
        }
    };

    return (
        <div
            data-aos="zoom-out"
            className="group relative flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-oceanTeal-200 hover:shadow-lg"
        >
            {/* Góc trên: logo + tên job + nút lưu */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-oceanTeal-50">
                        {props.companyLogo ? (
                            <img
                                className="h-8 w-8 object-contain"
                                src={props.companyLogo}
                                alt={props.company}
                            />
                        ) : (
                            <span className="text-sm font-bold text-oceanTeal-600">
                                {props.company?.[0] || "C"}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {props.jobTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                            <IconBuilding size={14} className="text-gray-400" />
                            <Link
                                className="hover:text-oceanTeal-600 font-medium"
                                to="/company"
                            >
                                {props.company}
                            </Link>
                            <span className="mx-1">•</span>
                            <span>{applicantsCount} ứng viên</span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSaveJob}
                    className="rounded-full p-1.5 text-gray-400 hover:bg-oceanTeal-50 hover:text-oceanTeal-500 transition"
                >
                    {isSaved ? (
                        <IconBookmarkFilled className="h-5 w-5 text-oceanTeal-500" stroke={1.7} />
                    ) : (
                        <IconBookmark className="h-5 w-5" stroke={1.7} />
                    )}
                </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                {props.experience && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                        {props.experience}
                    </span>
                )}
                {props.jobType && (
                    <span className="rounded-full bg-oceanTeal-50 px-3 py-1 font-medium text-oceanTeal-700">
                        {props.jobType}
                    </span>
                )}
                {props.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                        <IconMapPin size={14} className="text-gray-400" />
                        {props.location}
                    </span>
                )}
            </div>

            {/* Mô tả ngắn */}
            {props.about && (
                <Text
                    className="!text-xs !text-gray-600 leading-relaxed"
                    lineClamp={3}
                >
                    {props.about}
                </Text>
            )}

            <Divider color="gray.2" size="xs" />

            {/* Thông tin phụ: lương + thời gian */}
            <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                    <IconCurrencyDollar size={16} className="text-oceanTeal-500" />
                    <span>
                        {props.packageOffered} USD
                    </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                    <IconClockHour3 className="h-4 w-4" stroke={1.5} />
                    <span>
                        {statusLabel} • {timeAgo(props.postTime)}
                    </span>
                </div>
            </div>

            {(props.offered || props.interviewing) && (
                <>
                    <Divider color="gray.2" size="xs" />
                    {props.offered && (
                        <div className="flex gap-2">
                            {decidedAction !== "REJECTED" && (
                                <Button
                                    color="green"
                                    variant="filled"
                                    fullWidth
                                    loading={pendingAction === "OFFERED"}
                                    disabled={pendingAction !== null}
                                    onClick={() => handleOfferAction("OFFERED")}
                                    className="!text-sm !font-semibold"
                                >
                                    Chấp nhận offer
                                </Button>
                            )}
                            {decidedAction !== "OFFERED" && (
                                <Button
                                    color="red"
                                    variant="outline"
                                    fullWidth
                                    loading={pendingAction === "REJECTED"}
                                    disabled={pendingAction !== null}
                                    onClick={() => handleOfferAction("REJECTED")}
                                    className="!text-sm !font-semibold"
                                >
                                    Từ chối
                                </Button>
                            )}
                        </div>
                    )}
                    {props.interviewing && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <IconCalendarMonth
                                className="text-oceanTeal-500 w-5 h-5"
                                stroke={1.5}
                            />
                            <span>Sun, 25 August •</span>
                            <span className="text-gray-500">10:00 - 11:00</span>
                        </div>
                    )}
                </>
            )}

            <Link to={`/jobs/${props.id}`} className="mt-3">
                <Button
                    color="oceanTeal.4"
                    variant="light"
                    fullWidth
                    className="!text-sm !font-semibold group-hover:bg-oceanTeal-50"
                >
                    Xem chi tiết công việc
                </Button>
            </Link>
        </div>
    )
}
export default Card;