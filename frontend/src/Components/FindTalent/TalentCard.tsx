import { Avatar, Badge, Button, Modal, Stack, Text } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarMonth, IconHeart, IconMapPin, IconBriefcase } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfile } from "../../Services/ProfileService";
import { formatInterviewTime, openPDF } from "../../Services/Utilities";
import { changeAppStatus } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { getApplicantDetail } from "../../Services/ApplicantService";

const TalentCard = (props: any) => {
    const { id } = useParams();
    const ref = useRef<HTMLInputElement>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [app, { open: openApp, close: closeApp }] = useDisclosure(false);
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<string>("");
    const [profile, setProfile] = useState<any>(null);
    const [applicationDetail, setApplicationDetail] = useState<any>(null);
    const [loadingApplication, setLoadingApplication] = useState<boolean>(false);
    const [previewType, setPreviewType] = useState<"resume" | "extracted" | null>(null);

    const displayProfile = profile ?? props;
    const application = applicationDetail ?? props;

    const applicantId = useMemo(() => {
        return props?.applicantId ?? displayProfile?.id ?? null;
    }, [props?.applicantId, displayProfile?.id]);

    const previewPdfData = useMemo(() => {
        if (!application) return null;
        if (previewType === "resume" && application?.resume) return `data:application/pdf;base64,${application.resume}`;
        if (previewType === "extracted" && application?.extractedResume) return `data:application/pdf;base64,${application.extractedResume}`;
        return null;
    }, [application, previewType]);

    const handleOffer = (status: string) => {
        if (!applicantId) {
            errorNotification("Error", "Applicant ID is missing");
            return;
        }

        let interview: any = { id, applicantId, applicationStatus: status };

        if (status === "INTERVIEWING") {
            if (!date || !time) {
                errorNotification("Missing information", "Please select both date and time");
                return;
            }

            const [hours, minutes] = time.split(":").map(Number);
            const interviewDate = new Date(date);
            interviewDate.setHours(hours);
            interviewDate.setMinutes(minutes);

            interview = { ...interview, interviewTime: interviewDate };
        }

        changeAppStatus(interview)
            .then(() => {
                if (status === "INTERVIEWING") successNotification("Interview Scheduled", "Interview has been scheduled successfully");
                else if (status === "OFFERED") successNotification("Offered", "Offer has been sent successfully");
                else successNotification("Rejected", "Offer has been rejected");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                errorNotification("Error", err?.response?.data?.errorMessage || "Something went wrong");
            });
    };

    const handleViewApplication = async () => {
        const idCandidates = [
            props?.id,
            props?.applicationId,
            props?.applicantId,
            displayProfile?.id,
        ].filter(Boolean);

        const uniqueCandidates = idCandidates.filter((item: any, index: number, arr: any[]) => arr.indexOf(item) === index);

        if (!uniqueCandidates.length) {
            errorNotification("Error", "Application ID is missing");
            return;
        }

        setLoadingApplication(true);
        let loaded = false;

        try {
            for (const candidateId of uniqueCandidates) {
                try {
                    const res = await getApplicantDetail(candidateId);
                    setApplicationDetail(res);
                    if (res?.resume) setPreviewType("resume");
                    else if (res?.extractedResume) setPreviewType("extracted");
                    else setPreviewType(null);
                    openApp();
                    loaded = true;
                    break;
                } catch {
                    // thử id khác
                }
            }

            if (!loaded) {
                errorNotification("Error", "Failed to load application detail");
            }
        } finally {
            setLoadingApplication(false);
        }
    };

    useEffect(() => {
        if (props.applicantId) {
            getProfile(props.applicantId)
                .then((res) => {
                    setProfile(res);
                })
                .catch((err) => console.log(err));
        } else {
            setProfile(props);
        }
    }, [props]);

    return (
    <div
        data-aos="fade-up"
        className="group w-full flex flex-row items-center gap-5 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-oceanTeal-200/50 transition-all duration-300"
    >
        {/* Left: Avatar */}
        <div className="shrink-0">
            <Avatar
                className="rounded-lg border-2 border-slate-100"
                size="lg"
                src={displayProfile?.picture ? `data:image/jpeg;base64,${displayProfile?.picture}` : '/Avatar.png'}
            />
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg text-slate-900 truncate">{displayProfile?.name}</h3>
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-rose-400 shrink-0">
                    <IconHeart className="w-4 h-4" stroke={1.5} />
                </button>
            </div>
            <p className="text-sm font-medium text-slate-600 truncate">
                {displayProfile?.jobTitle}
                {displayProfile?.company && <span className="text-slate-400"> • {displayProfile.company}</span>}
            </p>
            {displayProfile?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {displayProfile.skills.slice(0, 4).map((skill: string, index: number) => (
                        <Badge key={index} variant="light" color="oceanTeal" size="xs" radius="md" className="font-medium">
                            {skill}
                        </Badge>
                    ))}
                </div>
            )}
            {displayProfile?.about && (
                <Text className="text-xs text-slate-500 line-clamp-1" lineClamp={1}>{displayProfile.about}</Text>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-500">
                {props.invited ? (
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <IconCalendarMonth className="w-3.5 h-3.5 text-oceanTeal-500" stroke={2} />
                        PV: {formatInterviewTime(props.interviewTime)}
                    </span>
                ) : (
                    <>
                        <span className="flex items-center gap-1.5">
                            <IconBriefcase className="w-3.5 h-3.5 text-oceanTeal-500" stroke={2} />
                            {displayProfile?.totalExp ?? 1} năm KN
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                            <IconMapPin className="w-3.5 h-3.5 text-oceanTeal-500 shrink-0" stroke={2} />
                            {displayProfile?.location || "—"}
                        </span>
                    </>
                )}
            </div>
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex flex-col gap-2 items-end">
            {!props.invited && (
                <div className="flex gap-2">
                    <Link to={`/talent-profile/${displayProfile?.id}`}>
                        <Button color="oceanTeal.4" variant="outline" size="sm" radius="md" className="font-semibold">
                            Profile
                        </Button>
                    </Link>
                    {props.posted ? (
                        <Button
                            color="oceanTeal.4"
                            variant="light"
                            size="sm"
                            radius="md"
                            onClick={open}
                            leftSection={<IconCalendarMonth className="w-3.5 h-3.5" />}
                            className="font-semibold"
                        >
                            Lịch hẹn
                        </Button>
                    ) : (
                        <Button color="oceanTeal.4" variant="light" size="sm" radius="md" className="font-semibold">
                            Nhắn tin
                        </Button>
                    )}
                </div>
            )}
            {props.invited && (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleOffer("OFFERED")}
                        color="green"
                        variant="filled"
                        size="sm"
                        radius="md"
                        className="font-semibold bg-emerald-500 hover:bg-emerald-600"
                    >
                        Chấp nhận
                    </Button>
                    <Button
                        onClick={() => handleOffer("REJECTED")}
                        color="red"
                        variant="light"
                        size="sm"
                        radius="md"
                        className="font-semibold"
                    >
                        Từ chối
                    </Button>
                </div>
            )}
            {(props.invited || props.posted) && (
                <Button
                    color="oceanTeal.4"
                    variant="filled"
                    size="sm"
                    onClick={handleViewApplication}
                    loading={loadingApplication}
                    radius="md"
                    className="font-bold"
                >
                    Xem hồ sơ
                </Button>
            )}
        </div>

        <Modal opened={opened} onClose={close} radius="xl" title="Đặt lịch phỏng vấn" centered>
            <Stack gap="md">
                <DateInput
                    value={date}
                    onChange={setDate}
                    minDate={new Date()}
                    label="Ngày"
                    placeholder="Chọn ngày"
                    size="md"
                    radius="md"
                />
                <TimeInput
                    label="Giờ"
                    ref={ref}
                    value={time}
                    onChange={(e) => setTime(e.currentTarget.value)}
                    onClick={() => ref.current?.showPicker()}
                    size="md"
                    radius="md"
                />
                <Button
                    onClick={() => handleOffer("INTERVIEWING")}
                    color="oceanTeal.4"
                    variant="filled"
                    fullWidth
                    size="md"
                    className="font-semibold"
                >
                    Xác nhận lịch hẹn
                </Button>
            </Stack>
        </Modal>

        <Modal
            opened={app}
            onClose={closeApp}
            radius="xl"
            title="Chi tiết hồ sơ ứng tuyển"
            centered
            size="80%"
            classNames={{ header: "border-b border-slate-200 pb-4", body: "pt-5" }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</div>
                        <a className="text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:underline break-all" href={`mailto:${application?.email}`}>
                            {application?.email || "—"}
                        </a>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Website</div>
                        {application?.website ? (
                            <a className="text-sm font-medium text-oceanTeal-600 hover:underline break-all" target="_blank" rel="noreferrer" href={application.website}>
                                {application.website}
                            </a>
                        ) : (
                            <span className="text-sm text-slate-400">—</span>
                        )}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Thư xin việc</div>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap max-h-40 overflow-auto leading-relaxed">
                            {application?.coverLetter || "Chưa có thư xin việc"}
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">CV</div>
                        <div className="flex flex-wrap gap-2">
                            <Button size="xs" variant={previewType === "resume" ? "filled" : "light"} color="oceanTeal.4" disabled={!application?.resume} onClick={() => setPreviewType("resume")}>
                                Resume
                            </Button>
                            <Button size="xs" variant={previewType === "extracted" ? "filled" : "light"} color="oceanTeal.4" disabled={!application?.extractedResume} onClick={() => setPreviewType("extracted")}>
                                Extracted
                            </Button>
                            <Button size="xs" variant="outline" color="oceanTeal.4" disabled={!previewPdfData} onClick={() => previewPdfData && window.open(previewPdfData, "_blank")}>
                                Mở tab mới
                            </Button>
                            <Button size="xs" variant="outline" color="gray" disabled={!application?.resume} onClick={() => application?.resume && openPDF(application.resume)}>
                                Tải xuống
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50/30 p-4 min-h-[520px]">
                    {previewPdfData ? (
                        <iframe
                            title="Preview CV"
                            src={previewPdfData}
                            className="w-full h-[520px] rounded-lg border border-slate-200 bg-white"
                        />
                    ) : (
                        <div className="h-[520px] flex flex-col items-center justify-center gap-3 text-slate-500">
                            <IconBriefcase className="w-16 h-16 opacity-40" stroke={1} />
                            <p className="text-sm font-medium">Ứng viên chưa có CV để xem trực tiếp</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    </div>
    );
};

export default TalentCard;
