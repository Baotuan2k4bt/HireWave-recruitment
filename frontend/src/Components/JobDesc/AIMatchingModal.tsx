import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Divider,
    Group,
    Modal,
    Paper,
    Progress,
    RingProgress,
    Select,
    Skeleton,
    Stack,
    Text,
} from "@mantine/core";
import { IconAlertCircle, IconChartBar, IconFileText, IconSparkles, IconTarget } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { errorNotification } from "../../Services/NotificationService";
import { previewMatchingForJob, MatchingPreviewDTO } from "../../Services/MatchingService";
import { fetchMyCvs, setDefaultCv, UserResumeDTO } from "../../Services/CvService";

type Props = {
    opened: boolean;
    onClose: () => void;
    jobId: number | string;
    jobTitle?: string;
    skillsRequired?: string[];
    experience?: string;
};

export const AIMatchingModal = ({ opened, onClose, jobId, jobTitle, skillsRequired, experience }: Props) => {
    const navigate = useNavigate();
    const numericJobId = Number(jobId);

    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<MatchingPreviewDTO | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const [cvLoading, setCvLoading] = useState(false);
    const [cvs, setCvs] = useState<UserResumeDTO[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<string | null>(null);

    const hasJobSkills = Array.isArray(skillsRequired) && skillsRequired.length > 0;
    const hasJobExperience = typeof experience === "string" && experience.trim().length > 0;

    const scoreMeta = useMemo(() => {
        const score = Math.max(0, Math.min(100, Math.round(aiResult?.finalScore ?? 0)));
        if (score >= 80) return { score, label: "Phù hợp cao", color: "teal" as const };
        if (score >= 60) return { score, label: "Phù hợp khá", color: "blue" as const };
        if (score >= 40) return { score, label: "Trung bình", color: "yellow" as const };
        return { score, label: "Chưa phù hợp", color: "red" as const };
    }, [aiResult?.finalScore]);

    const jdMissing = useMemo(
        () =>
            [
                !hasJobSkills ? "Chưa có danh sách kỹ năng yêu cầu" : null,
                !hasJobExperience ? "Chưa có yêu cầu kinh nghiệm rõ ràng" : null,
            ].filter(Boolean) as string[],
        [hasJobSkills, hasJobExperience]
    );

    const loadMyCvs = async () => {
        try {
            setCvLoading(true);
            const list = await fetchMyCvs();
            setCvs(list);
            const preselect = (list.find((c) => c.isDefault) || list[0])?.id;
            setSelectedCvId(preselect != null ? String(preselect) : null);
        } catch (e: any) {
            errorNotification("Không thể tải danh sách CV", e?.message || "Vui lòng thử lại.");
        } finally {
            setCvLoading(false);
        }
    };

    const runPreview = async () => {
        if (!Number.isFinite(numericJobId) || numericJobId <= 0) {
            setAiError("JOB_ID_INVALID");
            return;
        }
        try {
            setAiLoading(true);
            setAiError(null);
            setAiResult(null);
            const result = await previewMatchingForJob(numericJobId);
            setAiResult(result);
        } catch (e: any) {
            const msg =
                e?.response?.data?.errorMessage ||
                e?.response?.data?.message ||
                e?.message ||
                "Không thể đánh giá. Vui lòng thử lại.";
            setAiError(String(msg));
            if (String(msg).includes("DEFAULT_CV_NOT_FOUND")) {
                await loadMyCvs();
            }
        } finally {
            setAiLoading(false);
        }
    };

    const handleEvaluateWithSelectedCv = async () => {
        if (!selectedCvId) {
            errorNotification("Chưa chọn CV", "Vui lòng chọn 1 CV để đánh giá.");
            return;
        }
        try {
            setAiLoading(true);
            setAiError(null);
            setAiResult(null);
            await setDefaultCv(Number(selectedCvId));
            const result = await previewMatchingForJob(numericJobId);
            setAiResult(result);
        } catch (e: any) {
            const msg =
                e?.response?.data?.errorMessage ||
                e?.response?.data?.message ||
                e?.message ||
                "Không thể đánh giá. Vui lòng thử lại.";
            setAiError(String(msg));
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (!opened) return;
        void runPreview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, numericJobId]);

    const renderCriterion = (label: string, value: number, color: string, disabled?: boolean) => (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <Text size="sm" fw={600} c="gray.8">
                    {label}
                </Text>
                <Text size="sm" fw={700} c="gray.9">
                    {disabled ? "N/A" : `${Math.round(value * 100)}%`}
                </Text>
            </div>
            <Progress value={disabled ? 0 : value * 100} color={disabled ? "gray" : color} radius="xl" />
            {disabled && (
                <Text size="xs" c="dimmed">
                    Tin tuyển dụng chưa cung cấp đủ dữ liệu để tính tiêu chí này.
                </Text>
            )}
        </div>
    );

    return (
        <Modal
            opened={opened}
            onClose={() => {
                onClose();
                setAiError(null);
                setAiResult(null);
            }}
            title={
                <Group gap={8} align="center">
                    <IconTarget size={18} />
                    <Text fw={800} size="md">
                        Mức độ phù hợp (AI)
                    </Text>
                    <Text c="dimmed" size="sm">
                        {jobTitle || ""}
                    </Text>
                </Group>
            }
            size="lg"
            centered
        >
            <Stack gap="md">
                {jdMissing.length > 0 && (
                    <Alert icon={<IconAlertCircle size={16} />} color="yellow" variant="light" radius="md">
                        <Text size="sm" fw={700}>
                            Tin tuyển dụng thiếu thông tin
                        </Text>
                        <Text size="sm" c="dimmed">
                            {jdMissing.join(" • ")}. Kết quả vẫn hiển thị nhưng **độ chính xác có thể giảm**.
                        </Text>
                    </Alert>
                )}

                {aiError?.includes("DEFAULT_CV_NOT_FOUND") && (
                    <Alert icon={<IconFileText size={16} />} color="blue" variant="light" radius="md">
                        <Text size="sm" fw={700}>
                            Chưa có CV mặc định
                        </Text>
                        <Text size="sm" c="dimmed">
                            Chọn một CV bên dưới rồi bấm <Text span fw={700}>“Đánh giá”</Text>.
                        </Text>

                        <Stack gap="sm" mt="sm">
                            <Select
                                label="CV của bạn"
                                placeholder={cvLoading ? "Đang tải..." : cvs.length === 0 ? "Bạn chưa có CV" : "Chọn CV"}
                                value={selectedCvId}
                                onChange={setSelectedCvId}
                                data={cvs.map((c) => ({
                                    value: String(c.id),
                                    label: `${c.title || c.originalFilename}${c.isDefault ? " (Mặc định)" : ""}`,
                                }))}
                                searchable
                                disabled={cvLoading || cvs.length === 0}
                            />

                            <Group justify="space-between" wrap="wrap">
                                <Button variant="outline" color="gray" onClick={() => navigate("/my-cv")}>
                                    Quản lý CV
                                </Button>
                                <Button
                                    leftSection={<IconSparkles size={16} />}
                                    onClick={handleEvaluateWithSelectedCv}
                                    loading={aiLoading}
                                    disabled={cvLoading || cvs.length === 0}
                                >
                                    Đánh giá
                                </Button>
                            </Group>
                        </Stack>
                    </Alert>
                )}

                {aiError && !aiError.includes("DEFAULT_CV_NOT_FOUND") && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
                        <Text size="sm" fw={700}>
                            Không thể đánh giá
                        </Text>
                        <Text size="sm" c="dimmed">
                            {aiError}
                        </Text>
                    </Alert>
                )}

                {aiLoading && (
                    <Stack gap="sm">
                        <Skeleton height={18} radius="md" />
                        <Skeleton height={140} radius="md" />
                        <Skeleton height={90} radius="md" />
                    </Stack>
                )}

                {aiResult && (
                    <>
                        {/* Tổng quan */}
                        <Paper withBorder radius="md" p="md">
                            <Group align="center" justify="space-between" wrap="nowrap">
                                <Group gap="md" wrap="nowrap">
                                    <RingProgress
                                        size={96}
                                        thickness={10}
                                        roundCaps
                                        sections={[{ value: scoreMeta.score, color: scoreMeta.color }]}
                                        label={
                                            <Text ta="center" fw={900} size="xl">
                                                {scoreMeta.score}
                                            </Text>
                                        }
                                    />
                                    <div>
                                        <Text fw={800} size="lg">
                                            {scoreMeta.label}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            Điểm phù hợp tổng thể (0–100)
                                        </Text>
                                    </div>
                                </Group>
                                <Badge color={scoreMeta.color} variant="light" radius="xl" size="lg">
                                    {scoreMeta.label}
                                </Badge>
                            </Group>
                        </Paper>

                        {/* Chi tiết tiêu chí */}
                        <Paper withBorder radius="md" p="md">
                            <Text fw={800} size="sm" mb="xs">
                                Phân tích tiêu chí
                            </Text>
                            <Stack gap="sm">
                                {renderCriterion("Kỹ năng phù hợp", aiResult.skillRatio, "teal", !hasJobSkills)}
                                {renderCriterion("Kinh nghiệm", aiResult.expRatio, "indigo")}
                                {renderCriterion("Độ khớp chức danh", aiResult.titleSimilarity, "blue")}
                                {renderCriterion("Mật độ từ khóa", aiResult.keywordDensity, "grape", !hasJobSkills)}
                            </Stack>
                        </Paper>

                        {/* Kỹ năng */}
                        <Paper withBorder radius="md" p="md">
                            <Text fw={800} size="sm">
                                Kỹ năng
                            </Text>
                            <Divider my="xs" />

                            {!hasJobSkills && (
                                <Text size="sm" c="dimmed">
                                    Tin tuyển dụng chưa có kỹ năng yêu cầu nên không thể đối chiếu matched/missing skills.
                                </Text>
                            )}

                            <Stack gap="xs" mt="xs">
                                <Text size="sm" fw={700}>
                                    Điểm mạnh (phù hợp)
                                </Text>
                                <Group gap={8}>
                                    {(aiResult.matchedSkills || []).length === 0 && (
                                        <Text size="sm" c="dimmed">
                                            Chưa tìm thấy kỹ năng trùng khớp rõ ràng.
                                        </Text>
                                    )}
                                    {(aiResult.matchedSkills || []).slice(0, 12).map((s, i) => (
                                        <Badge key={i} color="teal" variant="light" radius="xl">
                                            {s}
                                        </Badge>
                                    ))}
                                </Group>

                                <Text size="sm" fw={700} mt="xs">
                                    Cần bổ sung
                                </Text>
                                <Group gap={8}>
                                    {(aiResult.missingSkills || []).length === 0 && (
                                        <Text size="sm" c="dimmed">
                                            Không có kỹ năng thiếu nổi bật theo JD.
                                        </Text>
                                    )}
                                    {(aiResult.missingSkills || []).slice(0, 12).map((s, i) => (
                                        <Badge key={i} color="red" variant="light" radius="xl">
                                            {s}
                                        </Badge>
                                    ))}
                                </Group>
                            </Stack>
                        </Paper>

                        {/* Summary */}
                        <Paper withBorder radius="md" p="md">
                            <Group gap={8} align="center" mb={6}>
                                <IconChartBar size={18} />
                                <Text fw={800} size="sm">
                                    Nhận xét từ AI
                                </Text>
                            </Group>
                            <Text size="sm" c="gray.8" style={{ lineHeight: 1.55 }}>
                                {aiResult.summary}
                            </Text>
                            <Text size="xs" c="dimmed" mt="sm">
                                Gợi ý: bạn có thể cải thiện điểm bằng cách bổ sung kỹ năng còn thiếu và làm rõ kinh nghiệm liên quan trong CV.
                            </Text>
                        </Paper>
                    </>
                )}
            </Stack>
        </Modal>
    );
};

