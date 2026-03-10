import {Button, FileInput, LoadingOverlay, Modal, NumberInput, Textarea, TextInput} from "@mantine/core";
import {isNotEmpty, useForm} from "@mantine/form";
import {IconPaperclip, IconEye, IconSend, IconEdit, IconAlertCircle} from "@tabler/icons-react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getBase64} from "../../Services/Utilities";
import {applyJob} from "../../Services/JobService";
import {errorNotification, successNotification} from "../../Services/NotificationService";

const ApplicationForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = useSelector((state: any) => state.user);
    const [preview, setPreview] = useState(false);
    const [submit, setSubmit] = useState(false);

    const handlePreview = () => {
        form.validate();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!form.isValid()) return;
        setPreview(!preview);
    };

    const handleSubmit = async () => {
        // Validate form trước khi submit
        form.validate();
        if (!form.isValid()) {
            errorNotification("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        setSubmit(true);
        try {
            let resume: any = await getBase64(form.getValues().resume);
            let applicant = { ...form.getValues(), applicantId: user.id, resume: resume.split(',')[1] };
            await applyJob(applicant, id);
            setSubmit(false);
            successNotification("Thành Công", "Đã nộp đơn ứng tuyển thành công!");
            form.reset();
            navigate("/job-history");
        } catch (err: any) {
            setSubmit(false);
            const errorMsg = err.response?.data?.errorMessage || "Có lỗi xảy ra, vui lòng thử lại";
            errorNotification("Lỗi", errorMsg);
        }
    };

    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            name: user.name,
            email: user.email,
            phone: '',
            website: '',
            resume: null,
            coverLetter: ''
        },
        validate: {
            name: isNotEmpty('Họ tên không được để trống'),
            email: isNotEmpty('Email không được để trống'),
            phone: isNotEmpty('Số điện thoại không được để trống'),
            website: isNotEmpty('Website không được để trống'),
            resume: isNotEmpty('CV không được để trống'),
        }
    });

    return (
        <>
            <LoadingOverlay
                className="[&>span]:!fixed [&>span]:top-1/2"
                visible={submit}
                zIndex={1000}
                overlayProps={{ radius: "md", blur: 3 }}
                loaderProps={{ color: 'oceanTeal.5', type: 'bars' }}
            />

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-oceanTeal-400 to-oceanTeal-600 rounded-full"></div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-deepSlate-800 to-deepSlate-600 bg-clip-text text-transparent">
                        Gửi Đơn Ứng Tuyển
                    </h1>
                </div>
                <p className="text-deepSlate-500 text-sm ml-4">
                    Hoàn thành thông tin bên dưới để ứng tuyển vị trí công việc
                </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-oceanTeal-50 to-transparent rounded-full blur-2xl -mr-16 -mt-16"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Name & Email Row */}
                    <div className="flex gap-6 md-mx:gap-4 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                        <TextInput
                            {...form.getInputProps("name")}
                            readOnly={true}
                            className={`${preview ? "text-deepSlate-700 font-semibold" : "bg-deepSlate-50/80"} rounded-xl transition-all duration-200 focus:ring-2 focus:ring-oceanTeal-300`}
                            variant={preview ? "unstyled" : "default"}
                            label={
                                <span className="text-sm font-semibold text-deepSlate-700 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Họ và Tên
                                </span>
                            }
                            placeholder="Nhập họ tên"
                        />
                        <TextInput
                            {...form.getInputProps("email")}
                            variant={preview ? "unstyled" : "default"}
                            readOnly={true}
                            className={`${preview ? "text-deepSlate-700 font-semibold" : "bg-deepSlate-50/80"} rounded-xl transition-all duration-200 focus:ring-2 focus:ring-oceanTeal-300`}
                            label={
                                <span className="text-sm font-semibold text-deepSlate-700 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Email
                                </span>
                            }
                            placeholder="Nhập email"
                        />
                    </div>

                    {/* Phone & Website Row */}
                    <div className="flex gap-6 md-mx:gap-4 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                        <NumberInput
                            {...form.getInputProps("phone")}
                            variant={preview ? "unstyled" : "default"}
                            readOnly={preview}
                            className={`${preview ? "text-deepSlate-700 font-semibold" : "bg-deepSlate-50/80"} rounded-xl transition-all duration-200 focus:ring-2 focus:ring-oceanTeal-300`}
                            clampBehavior="strict"
                            min={0}
                            max={9999999999}
                            label={
                                <span className="text-sm font-semibold text-deepSlate-700 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Số Điện Thoại
                                </span>
                            }
                            placeholder="Nhập số điện thoại"
                            hideControls
                        />
                        <TextInput
                            {...form.getInputProps("website")}
                            variant={preview ? "unstyled" : "default"}
                            readOnly={preview}
                            className={`${preview ? "text-deepSlate-700 font-semibold" : "bg-deepSlate-50/80"} rounded-xl transition-all duration-200 focus:ring-2 focus:ring-oceanTeal-300`}
                            label={
                                <span className="text-sm font-semibold text-deepSlate-700 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Website Cá Nhân
                                </span>
                            }
                            placeholder="Nhập URL website (LinkedIn, portfolio...)"
                        />
                    </div>

                    {/* Resume Upload */}
                    <div className="relative">
                        <FileInput
                            {...form.getInputProps("resume")}
                            variant={preview ? "unstyled" : "default"}
                            readOnly={preview}
                            className={`${preview ? "text-deepSlate-700 font-semibold" : "bg-deepSlate-50/80"} rounded-xl transition-all duration-200 focus:ring-2 focus:ring-oceanTeal-300`}
                            withAsterisk
                            leftSection={<IconPaperclip stroke={1.5} className="text-oceanTeal-500" />}
                            accept="application/pdf"
                            label={
                                <span className="text-sm font-semibold text-deepSlate-700 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    CV / Resume
                                    <span className="text-xs font-normal text-deepSlate-500 ml-1">(PDF, tối đa 5MB)</span>
                                </span>
                            }
                            placeholder="Kéo thả file hoặc nhấn để chọn"
                            leftSectionPointerEvents="none"
                        />
                    </div>

                    {/* Cover Letter */}
                    <div className="relative">
                        <Textarea
                            {...form.getInputProps("coverLetter")}
                            variant={preview ? "unstyled" : "default"}
                            readOnly={preview}
                            className={`${preview ? "text-deepSlate-700 font-semibold" : "bg-deepSlate-50/80"} rounded-xl transition-all duration-200 focus:ring-2 focus:ring-oceanTeal-300 resize-none`}
                            placeholder="Giới thiệu về bản thân, lý do bạn phù hợp với vị trí này và động lực làm việc..."
                            label={
                                <span className="text-sm font-semibold text-deepSlate-700">
                                    Thư Xin Việc
                                </span>
                            }
                            autosize
                            minRows={4}
                            maxRows={8}
                        />
                        <div className="text-xs text-deepSlate-400 mt-1 text-right">
                            {form.values.coverLetter.length}/2000 ký tự
                        </div>
                    </div>

                    {/* Required Fields Notice */}
                    <div className="flex items-center gap-2 text-xs text-deepSlate-500 bg-deepSlate-50/50 px-3 py-2 rounded-lg w-fit">
                        <span className="text-red-500 font-semibold">*</span>
                        <span>Thông tin bắt buộc</span>
                    </div>

                    {/* Action Buttons */}
                    {!preview && (
                        <div className="flex gap-4 items-center">
                            <Button
                                onClick={handlePreview}
                                color="oceanTeal.5"
                                variant="light"
                                size="md"
                                className="hover:bg-oceanTeal-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 px-8 shadow-sm hover:shadow-md"
                                leftSection={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>}
                            >
                                Xem Trước Đơn Ứng Tuyển
                            </Button>
                        </div>
                    )}

                    {preview && (
                        <div className="flex gap-4 pt-2 border-t border-gray-100/50">
                            <Button
                                fullWidth
                                onClick={handlePreview}
                                color="gray.6"
                                variant="outline"
                                size="md"
                                className="hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                leftSection={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>}
                            >
                                Chỉnh Sửa
                            </Button>
                            <Button
                                fullWidth
                                onClick={handleSubmit}
                                color="oceanTeal.5"
                                variant="filled"
                                size="md"
                                className="bg-gradient-to-r from-oceanTeal-500 to-oceanTeal-600 hover:from-oceanTeal-600 hover:to-oceanTeal-700 hover:shadow-lg transition-all duration-200 font-semibold px-8 py-3"
                                disabled={submit}
                                leftSection={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>}
                            >
                                {submit ? 'Đang Gửi...' : 'Nộp Đơn Ứng Tuyển'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ApplicationForm;