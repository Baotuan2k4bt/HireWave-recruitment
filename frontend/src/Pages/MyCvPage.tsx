import { useEffect, useState } from "react";
import {
    Container,
    Title,
    Text,
    Paper,
    Stack,
    Group,
    Button,
    Badge,
    FileButton,
    TextInput,
    Loader,
} from "@mantine/core";
import { IconFileText, IconUpload, IconTrash, IconCheck } from "@tabler/icons-react";
import { deleteCv, fetchMyCvs, setDefaultCv, uploadCv, UserResumeDTO } from "../Services/CvService";
import { successNotification, errorNotification } from "../Services/NotificationService";
import axiosInstance from "../Interceptor/AxiosInterceptor";

const MyCvPage = () => {
    const [cvs, setCvs] = useState<UserResumeDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const loadCvs = async () => {
        setLoading(true);
        try {
            const data = await fetchMyCvs();
            setCvs(data);
        } catch (e: any) {
            errorNotification("Lỗi", e.message || "Không thể tải danh sách CV");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCvs();
    }, []);

    useEffect(() => {
        // cleanup object URL khi unmount hoặc đổi preview
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const previewCv = async (cv: UserResumeDTO) => {
        setPreviewLoading(true);
        try {
            const response = await axiosInstance.get(`/cv/file/${cv.id}`, {
                responseType: "blob",
            });
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const blob = new Blob([response.data], { type: cv.mimeType || "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (e: any) {
            errorNotification("Lỗi", e.message || "Không thể xem trước CV");
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            errorNotification("Lỗi", "Vui lòng chọn file CV (PDF)");
            return;
        }
        if (selectedFile.type !== "application/pdf") {
            errorNotification("Lỗi", "Chỉ hỗ trợ file PDF");
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            errorNotification("Lỗi", "File quá lớn (tối đa 5MB)");
            return;
        }
        setUploading(true);
        try {
            await uploadCv(selectedFile, title.trim() || undefined);
            successNotification("Thành công", "Upload CV thành công");
            setSelectedFile(null);
            setTitle("");
            await loadCvs();
        } catch (e: any) {
            errorNotification("Lỗi", e.message || "Upload CV thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleSetDefault = async (id: number) => {
        setSettingDefaultId(id);
        try {
            await setDefaultCv(id);
            successNotification("Thành công", "Đã đặt CV làm mặc định");
            await loadCvs();
        } catch (e: any) {
            errorNotification("Lỗi", e.message || "Không thể đặt CV mặc định");
        } finally {
            setSettingDefaultId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xoá CV này?")) return;
        setDeletingId(id);
        try {
            await deleteCv(id);
            successNotification("Thành công", "Đã xoá CV");
            await loadCvs();
        } catch (e: any) {
            errorNotification("Lỗi", e.message || "Không thể xoá CV");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-[90vh] bg-[#f5f7fb] py-10">
            <Container size="lg">
                <Stack gap="xl">
                    {/* Hero banner */}
                    <Paper
                        shadow="lg"
                        radius="lg"
                        p="xl"
                        className="bg-gradient-to-r from-oceanTeal-500 via-oceanTeal-400 to-sky-400 text-white overflow-hidden relative min-h-[180px] md:min-h-[220px] flex items-center"
                    >
                        <div className="w-full rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 p-10 shadow-xl overflow-hidden">

  <div className="grid md:grid-cols-2 gap-10 items-center">

    {/* LEFT */}
    <div className="text-white">

      <p className="uppercase tracking-[0.25em] text-sm opacity-80 mb-3">
        Trung tâm hồ sơ ứng viên
      </p>

      <h1 className="text-4xl font-bold mb-4 leading-tight">
        Quản lý CV chuyên nghiệp
      </h1>

      <p className="text-white/90 max-w-lg mb-6">
        Upload, chỉnh sửa và quản lý hồ sơ ứng tuyển.
        Hệ thống AI phân tích CV và gợi ý công việc phù hợp.
      </p>

      <div className="flex gap-4">


      </div>

    </div>

    {/* RIGHT IMAGE */}
    <div className="flex justify-center md:justify-end">

      <img
        src="/Profile/banner.png"
        className="w-[420px] drop-shadow-2xl hover:scale-105 transition"
      />

    </div>

  </div>

</div>
                    </Paper>

                    {/* Main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Upload CV */}
                        <div className="lg:col-span-1">
                            <Paper
                                shadow="md"
                                p="lg"
                                radius="md"
                                className="bg-white border border-gray-200"
                            >
                                <Stack gap="md">
                                    <Group gap="sm">
                                        <IconFileText size={26} className="text-oceanTeal-500" />
                                        <div>
                                            <Text fw={600} className="text-deepSlate-900">
                                                Tải lên CV mới
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Định dạng PDF, dung lượng tối đa 5MB
                                            </Text>
                                        </div>
                                    </Group>

                                    <Stack gap="xs">
                                        <FileButton
                                            onChange={(file) => setSelectedFile(file)}
                                            accept="application/pdf"
                                        >
                                            {(props) => (
                                                <Button
                                                    {...props}
                                                    fullWidth
                                                    leftSection={<IconUpload size={18} />}
                                                    variant="outline"
                                                    color="oceanTeal.4"
                                                    className="justify-center"
                                                >
                                                    {selectedFile ? "Chọn file khác" : "Chọn file CV (PDF)"}
                                                </Button>
                                            )}
                                        </FileButton>
                                        {selectedFile && (
                                            <Text size="xs" c="dimmed">
                                                Đã chọn:{" "}
                                                <span className="font-medium text-deepSlate-800">
                                                    {selectedFile.name}
                                                </span>{" "}
                                                ({(selectedFile.size / 1024).toFixed(1)} KB)
                                            </Text>
                                        )}
                                    </Stack>

                                    <TextInput
                                        label="Tiêu đề CV (tuỳ chọn)"
                                        placeholder="Ví dụ: CV Backend Java, CV Fresher"
                                        value={title}
                                        onChange={(e) => setTitle(e.currentTarget.value)}
                                    />

                                    <Button
                                        onClick={handleUpload}
                                        loading={uploading}
                                        fullWidth
                                        color="oceanTeal.4"
                                        className="font-semibold"
                                    >
                                        Lưu CV vào hệ thống
                                    </Button>

                                    <Text size="xs" c="dimmed">
                                        Mẹo: Hãy đặt tên CV rõ ràng theo vị trí ứng tuyển để dễ dàng quản lý và chọn
                                        CV phù hợp cho từng công việc.
                                    </Text>
                                </Stack>
                            </Paper>
                        </div>

                        {/* List CV + Preview */}
                        <div className="lg:col-span-2 space-y-4">
                            <Paper
                                shadow="md"
                                p="lg"
                                radius="md"
                                className="bg-white border border-gray-200"
                            >
                                <Group justify="space-between" mb="md">
                                    <div>
                                        <Text fw={600} className="text-deepSlate-900">
                                            Danh sách CV của bạn
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Nhấn vào tên CV để xem trước, hoặc đặt CV mặc định cho các lần ứng tuyển sau.
                                        </Text>
                                    </div>
                                    {loading && <Loader size="sm" />}
                                </Group>

                                {cvs.length === 0 && !loading && (
                                    <Paper
                                        withBorder
                                        radius="md"
                                        p="md"
                                        className="bg-deepSlate-50 text-center"
                                    >
                                        <Text size="sm" c="dimmed">
                                            Bạn chưa có CV nào. Hãy tải lên CV đầu tiên của bạn ở khung bên trái.
                                        </Text>
                                    </Paper>
                                )}

                                <Stack gap="sm">
                                    {cvs.map((cv) => (
                                        <Paper
                                            key={cv.id}
                                            withBorder
                                            radius="md"
                                            p="md"
                                            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition-shadow shadow-sm hover:shadow-md ${
                                                cv.isDefault ? "border-oceanTeal-300 bg-oceanTeal-50/60" : "bg-white"
                                            }`}
                                        >
                                            <div>
                                                <Group gap="xs" wrap="wrap">
                                                    <button
                                                        onClick={() => previewCv(cv)}
                                                        className="text-oceanTeal-600 hover:underline font-medium text-left"
                                                    >
                                                        {cv.title || cv.originalFilename}
                                                    </button>
                                                    {cv.isDefault && (
                                                        <Badge
                                                            color="green"
                                                            variant="light"
                                                            leftSection={<IconCheck size={14} />}
                                                        >
                                                            Đang dùng (mặc định)
                                                        </Badge>
                                                    )}
                                                </Group>
                                                <Text size="xs" c="dimmed" className="mt-1">
                                                    Cập nhật: {new Date(cv.createdAt).toLocaleString()} •{" "}
                                                    {(cv.size / 1024).toFixed(1)} KB
                                                </Text>
                                            </div>

                                            <Group gap="xs" justify="flex-end">
                                                {!cv.isDefault && (
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        color="oceanTeal.4"
                                                        onClick={() => handleSetDefault(cv.id)}
                                                        loading={settingDefaultId === cv.id}
                                                    >
                                                        Đặt làm mặc định
                                                    </Button>
                                                )}
                                                <Button
                                                    size="xs"
                                                    color="red"
                                                    variant="subtle"
                                                    leftSection={<IconTrash size={14} />}
                                                    onClick={() => handleDelete(cv.id)}
                                                    loading={deletingId === cv.id}
                                                >
                                                    Xoá
                                                </Button>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Paper>

                            {previewUrl && (
                                <Paper
                                    shadow="md"
                                    p="md"
                                    radius="md"
                                    className="bg-white border border-gray-200"
                                >
                                    <Group justify="space-between" mb="sm">
                                        <Text fw={600} className="text-deepSlate-900">
                                            Xem trước CV
                                        </Text>
                                        <Group gap="xs">
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                color="oceanTeal.4"
                                                onClick={() => window.open(previewUrl, "_blank", "noopener,noreferrer")}
                                            >
                                                Mở trong tab mới
                                            </Button>
                                        </Group>
                                    </Group>
                                    {previewLoading ? (
                                        <div className="flex items-center justify-center h-[400px]">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <iframe
                                            src={previewUrl}
                                            title="CV Preview"
                                            className="w-full h-[500px] md:h-[600px] rounded-md border border-gray-200 bg-white"
                                        />
                                    )}
                                </Paper>
                            )}
                        </div>
                    </div>
                </Stack>
            </Container>
        </div>
    );
};

export default MyCvPage;

