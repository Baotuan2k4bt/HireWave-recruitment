import { useEffect, useState } from 'react';
import { 
    Container, 
    Paper, 
    Title, 
    Text, 
    Button, 
    Progress, 
    Badge, 
    Alert, 
    List, 
    Stack, 
    Group,
    FileButton,
    Divider,
    Card,
    ThemeIcon,
    Grid,
    Stepper,
    Box,
    Center
} from '@mantine/core';
import { 
    IconUpload, 
    IconFileText, 
    IconCheck, 
    IconX, 
    IconAlertCircle,
    IconBrain,
    IconSparkles,
    IconInfoCircle,
    IconMail,
    IconPhone,
    IconChartBar,
    IconTarget,
    IconTrendingUp,
    IconTrendingDown,
    IconFileCheck,
    IconFileDescription
} from '@tabler/icons-react';
import { evaluateCVFromFile, CVAnalysisResponse } from '../Services/CVAnalysisService';
import { successNotification, errorNotification } from '../Services/NotificationService';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchMyCvs } from '../Services/CvService';
import axiosInstance from '../Interceptor/AxiosInterceptor';

const CVAnalysisPage = () => {
    const user = useSelector((state: any) => state.user);
    const [searchParams] = useSearchParams();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<CVAnalysisResponse | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [autoTriggered, setAutoTriggered] = useState(false);

    // Auto analyze default CV using UserResumeAPI (/cv/*) when requested from other pages
    useEffect(() => {
        const shouldAuto = searchParams.get('autoDefault') === '1';
        if (!shouldAuto || autoTriggered) return;
        setAutoTriggered(true);

        const run = async () => {
            setLoading(true);
            setActiveStep(1);
            try {
                const cvs = await fetchMyCvs();
                const cv = cvs.find((c) => c.isDefault) || cvs[0];
                if (!cv) {
                    errorNotification('Thiếu CV', 'Bạn chưa có CV. Vui lòng tải lên CV ở trang "My CV" trước.');
                    setActiveStep(0);
                    return;
                }

                const res = await axiosInstance.get(`/cv/file/${cv.id}`, { responseType: 'blob' });
                const blob = res.data as Blob;
                const inferredType = (cv.mimeType || blob.type || 'application/pdf') as string;
                const inferredName = cv.originalFilename || cv.title || 'cv.pdf';
                const fileObj = new File([blob], inferredName, { type: inferredType });

                setFile(fileObj);
                const result = await evaluateCVFromFile(fileObj);
                setAnalysisResult(result);
                setActiveStep(2);

                if (result.error) {
                    errorNotification('Lỗi', result.error);
                    setActiveStep(1);
                } else {
                    successNotification('Thành công', 'Phân tích CV hoàn tất!');
                }
            } catch (e: any) {
                errorNotification('Lỗi', e.message || 'Không thể tự động phân tích CV. Vui lòng thử lại.');
                setActiveStep(0);
            } finally {
                setLoading(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, autoTriggered]);

    const handleFileSelect = (selectedFile: File | null) => {
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                errorNotification('Lỗi', 'Vui lòng chọn file PDF');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                errorNotification('Lỗi', 'File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
                return;
            }
            setFile(selectedFile);
            setAnalysisResult(null);
            setActiveStep(0);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            errorNotification('Lỗi', 'Vui lòng chọn file CV');
            return;
        }

        setLoading(true);
        setActiveStep(1);
        try {
            const result = await evaluateCVFromFile(file);
            setAnalysisResult(result);
            setActiveStep(2);
            
            if (result.error) {
                errorNotification('Lỗi', result.error);
                setActiveStep(1);
            } else {
                successNotification('Thành công', 'Phân tích CV hoàn tất!');
            }
        } catch (error: any) {
            errorNotification('Lỗi', error.message || 'Không thể phân tích CV. Vui lòng thử lại.');
            setActiveStep(1);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 90) return 'green';
        if (score >= 75) return 'blue';
        if (score >= 60) return 'yellow';
        return 'red';
    };

    const getScoreColorClass = (score: number): string => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getPriorityColor = (suggestion: string): string => {
        const upper = suggestion.toUpperCase();
        if (upper.startsWith('HIGH:')) return 'red';
        if (upper.startsWith('MEDIUM:')) return 'yellow';
        if (upper.startsWith('LOW:')) return 'blue';
        return 'gray';
    };

    const getPriorityLabel = (suggestion: string): string => {
        const upper = suggestion.toUpperCase();
        if (upper.startsWith('HIGH:')) return 'HIGH';
        if (upper.startsWith('MEDIUM:')) return 'MEDIUM';
        if (upper.startsWith('LOW:')) return 'LOW';
        return '';
    };

    const removePriorityPrefix = (suggestion: string): string => {
        return suggestion.replace(/^(HIGH|MEDIUM|LOW):\s*/i, '');
    };

    const getBreakdownLabel = (key: string): string => {
        const labels: { [key: string]: string } = {
            contact: 'Thông tin liên hệ',
            structure: 'Cấu trúc CV',
            length: 'Độ dài nội dung',
            header: 'Vị trí header',
            impact: 'Tác động nội dung'
        };
        return labels[key] || key;
    };

    const getBreakdownMax = (key: string): number => {
        const maxs: { [key: string]: number } = {
            contact: 25,
            structure: 20,
            length: 15,
            header: 10,
            impact: 30
        };
        return maxs[key] || 100;
    };

    return (
        <div className="min-h-[90vh] bg-white">
            {/* Progress Stepper */}
            <div className="bg-deepSlate-50 border-b border-gray-200 py-6">
                <Container size="lg">
                    <Stepper 
                        active={activeStep} 
                        onStepClick={setActiveStep}
                        className="max-w-3xl mx-auto"
                    >
                        <Stepper.Step 
                            label="Tải lên CV" 
                            description="Upload file PDF của bạn"
                            icon={<IconUpload size={18} />}
                        />
                        <Stepper.Step 
                            label="Phân tích đánh giá" 
                            description="AI đang phân tích CV"
                            icon={<IconBrain size={18} />}
                            loading={loading}
                        />
                        <Stepper.Step 
                            label="Kết quả & Gợi ý" 
                            description="Xem đánh giá chi tiết"
                            icon={<IconFileCheck size={18} />}
                        />
                    </Stepper>
                </Container>
            </div>

            <Container size="lg" className="py-12">
                <Stack gap="xl">
                    {/* Header */}
                    {!analysisResult && (
                        <div className="text-center mb-8">
                            <Group justify="center" gap="sm" mb="md">
                                <IconBrain size={48} className="text-oceanTeal-500" />
                                <Title order={1} size="3rem" className="text-deepSlate-900">
                                    Phân tích CV bằng AI
                                </Title>
                            </Group>
                            
                        </div>
                    )}

                    {/* Upload Section - Split Layout */}
                    {!analysisResult && (
                        <Grid gutter="xl">
                            {/* Left: Info Section */}
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Paper 
                                    shadow="sm" 
                                    p="xl" 
                                    radius="md" 
                                    className="bg-gradient-to-br from-oceanTeal-50 to-blue-50 h-full"
                                >
                                    <Stack gap="lg">
                                        <div>
                                            <Title order={2} className="text-deepSlate-900 mb-3 flex items-center gap-2">
                                                <IconFileDescription size={28} className="text-oceanTeal-500" />
                                                Kiểm tra nội dung CV
                                            </Title>
                                            <Text size="sm" className="text-deepSlate-700 leading-relaxed">
                                                Công cụ sẽ xem xét các phần như tiêu đề, mục tiêu nghề nghiệp, 
                                                kinh nghiệm làm việc, học vấn và kỹ năng. Hệ thống ATS Simulator 
                                                mô phỏng cách các hệ thống tuyển dụng tự động đọc và đánh giá CV.
                                            </Text>
                                        </div>

                                        <Divider />

                                        <div>
                                            <Title order={4} className="text-deepSlate-900 mb-3">
                                                5 Tiêu chí đánh giá
                                            </Title>
                                            <Stack gap="sm">
                                                <Group gap="sm">
                                                    <ThemeIcon size="sm" color="oceanTeal" variant="light" radius="xl">
                                                        <IconMail size={14} />
                                                    </ThemeIcon>
                                                    <Text size="sm">Thông tin liên hệ (Email, Phone)</Text>
                                                </Group>
                                                <Group gap="sm">
                                                    <ThemeIcon size="sm" color="oceanTeal" variant="light" radius="xl">
                                                        <IconFileText size={14} />
                                                    </ThemeIcon>
                                                    <Text size="sm">Cấu trúc CV (Sections đầy đủ)</Text>
                                                </Group>
                                                <Group gap="sm">
                                                    <ThemeIcon size="sm" color="oceanTeal" variant="light" radius="xl">
                                                        <IconFileDescription size={14} />
                                                    </ThemeIcon>
                                                    <Text size="sm">Độ dài nội dung (150-800 từ)</Text>
                                                </Group>
                                                <Group gap="sm">
                                                    <ThemeIcon size="sm" color="oceanTeal" variant="light" radius="xl">
                                                        <IconTarget size={14} />
                                                    </ThemeIcon>
                                                    <Text size="sm">Vị trí header (Contact ở đầu CV)</Text>
                                                </Group>
                                                <Group gap="sm">
                                                    <ThemeIcon size="sm" color="oceanTeal" variant="light" radius="xl">
                                                        <IconChartBar size={14} />
                                                    </ThemeIcon>
                                                    <Text size="sm">Tác động nội dung (Metrics, Action verbs)</Text>
                                                </Group>
                                            </Stack>
                                        </div>
                                    </Stack>
                                </Paper>
                            </Grid.Col>

                            {/* Right: Upload Form */}
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Paper 
                                    shadow="xl" 
                                    p="xl" 
                                    radius="md" 
                                    className="bg-white border border-gray-200"
                                >
                                    <Stack gap="lg">
                                        <div>
                                            <Title order={2} className="text-deepSlate-900 mb-2">
                                                Đánh giá CV bởi HireWave AI
                                            </Title>
                                            <Text size="sm" c="dimmed">
                                                Tải lên CV của bạn để nhận đánh giá chi tiết và gợi ý cải thiện
                                            </Text>
                                        </div>

                                        <div>
                                            <Text size="sm" fw={500} mb="xs">
                                                Tải lên CV của bạn (dưới 10MB)
                                            </Text>
                                            <Group>
                                                <FileButton
                                                    onChange={handleFileSelect}
                                                    accept="application/pdf"
                                                >
                                                    {(props) => (
                                                        <Button
                                                            {...props}
                                                            leftSection={<IconUpload size={18} />}
                                                            size="md"
                                                            color="oceanTeal.4"
                                                            variant="outline"
                                                            className="flex-1"
                                                        >
                                                            {file ? 'Chọn file khác' : 'CHỌN TỆP'}
                                                        </Button>
                                                    )}
                                                </FileButton>
                                            </Group>
                                            {file && (
                                                <Card withBorder className="bg-deepSlate-50 mt-3">
                                                    <Group justify="space-between">
                                                        <Group gap="sm">
                                                            <IconFileText size={20} className="text-oceanTeal-500" />
                                                            <div>
                                                                <Text fw={500} size="sm">{file.name}</Text>
                                                                <Text size="xs" c="dimmed">
                                                                    {(file.size / 1024).toFixed(2)} KB
                                                                </Text>
                                                            </div>
                                                        </Group>
                                                        <Button
                                                            size="xs"
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() => {
                                                                setFile(null);
                                                                setAnalysisResult(null);
                                                                setActiveStep(0);
                                                            }}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Group>
                                                </Card>
                                            )}
                                            <Text size="xs" c="dimmed" mt="xs">
                                                Định dạng: PDF (text-based, không hỗ trợ file scan/ảnh)
                                            </Text>
                                        </div>

                                        <Button
                                            onClick={handleAnalyze}
                                            loading={loading}
                                            disabled={!file}
                                            size="lg"
                                            fullWidth
                                            leftSection={<IconSparkles size={20} />}
                                            className="bg-gradient-to-r from-oceanTeal-400 to-oceanTeal-600 hover:from-oceanTeal-500 hover:to-oceanTeal-700 text-white font-bold shadow-lg shadow-oceanTeal-400/30 hover:shadow-xl hover:shadow-oceanTeal-400/40 hover:scale-[1.02] transition-all duration-200"
                                        >
                                            {loading ? 'Đang phân tích...' : 'ĐÁNH GIÁ CV NGAY'}
                                        </Button>

                                        <Text size="xs" c="dimmed" className="text-center">
                                            <a href="#" className="text-oceanTeal-600 hover:text-oceanTeal-700 hover:underline">
                                                Tìm hiểu 3 bước đơn giản để tối ưu CV
                                            </a>
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    )}

                    {/* Analysis Results */}
                    {analysisResult && !analysisResult.error && (
                        <Stack gap="xl">
                            {/* Main Score Card */}
                            <Paper 
                                shadow="xl" 
                                p="xl" 
                                radius="md" 
                                className={`bg-gradient-to-br ${
                                    analysisResult.score >= 90 ? 'from-green-50 to-emerald-50 border-green-200' :
                                    analysisResult.score >= 75 ? 'from-blue-50 to-cyan-50 border-blue-200' :
                                    analysisResult.score >= 60 ? 'from-yellow-50 to-amber-50 border-yellow-200' :
                                    'from-red-50 to-rose-50 border-red-200'
                                } border-2`}
                            >
                                <Stack gap="lg">
                                    <div className="text-center">
                                        <Title order={2} className="text-deepSlate-900 mb-2">
                                            Kết quả đánh giá ATS
                                        </Title>
                                        <Text size="sm" c="dimmed">
                                            Điểm số được tính dựa trên 5 tiêu chí và được chuẩn hóa theo thang ATS (60+ là ổn, 75+ là tốt, 90+ là xuất sắc; rất khó đạt điểm tuyệt đối).
                                        </Text>
                                    </div>

                                    <Grid>
                                        <Grid.Col span={{ base: 12, md: 6 }}>
                                            <Center>
                                                <div className="text-center">
                                                    <Text 
                                                        fw={900} 
                                                        size="5rem"
                                                        className={getScoreColorClass(analysisResult.score)}
                                                        style={{ lineHeight: 1 }}
                                                    >
                                                        {analysisResult.score}
                                                    </Text>
                                                    <Text size="lg" c="dimmed" mt={-8}>/100</Text>
                                                    <Group justify="center" gap="sm" mt="md">
                                                        {analysisResult.levelLabel && (
                                                            <Badge
                                                                size="lg"
                                                                color={getScoreColor(analysisResult.score)}
                                                                variant="light"
                                                                className="text-base font-bold px-4 py-2"
                                                            >
                                                                {analysisResult.levelLabel}
                                                            </Badge>
                                                        )}
                                                        {analysisResult.verdict && (
                                                            <Badge
                                                                size="lg"
                                                                color={getScoreColor(analysisResult.score)}
                                                            >
                                                                {analysisResult.verdict}
                                                            </Badge>
                                                        )}
                                                    </Group>
                                                    <Progress
                                                        value={analysisResult.score}
                                                        color={getScoreColor(analysisResult.score)}
                                                        size="xl"
                                                        radius="xl"
                                                        className="mt-4"
                                                    />
                                                </div>
                                            </Center>
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 6 }}>
                                            <Stack gap="md">
                                                {analysisResult.uiHints && (
                                                    <>
                                                        <div>
                                                            <Group justify="space-between" mb="xs">
                                                                <Text size="sm" fw={600}>ATS Readability</Text>
                                                                <Badge color="blue" variant="light">
                                                                    {analysisResult.uiHints.atsReadability}%
                                                                </Badge>
                                                            </Group>
                                                            <Progress
                                                                value={analysisResult.uiHints.atsReadability}
                                                                color="blue"
                                                                size="md"
                                                                radius="xl"
                                                            />
                                                            <Text size="xs" c="dimmed" mt={4}>
                                                                Khả năng ATS đọc và hiểu CV của bạn
                                                            </Text>
                                                        </div>
                                                        <div>
                                                            <Group justify="space-between" mb="xs">
                                                                <Text size="sm" fw={600}>Content Impact</Text>
                                                                <Badge color="purple" variant="light">
                                                                    {analysisResult.uiHints.contentImpact}%
                                                                </Badge>
                                                            </Group>
                                                            <Progress
                                                                value={analysisResult.uiHints.contentImpact}
                                                                color="purple"
                                                                size="md"
                                                                radius="xl"
                                                            />
                                                            <Text size="xs" c="dimmed" mt={4}>
                                                                Mức độ thể hiện kết quả và tác động
                                                            </Text>
                                                        </div>
                                                        {analysisResult.uiHints.wordCount && (
                                                            <Group gap="md" mt="sm">
                                                                <div>
                                                                    <Text size="xs" c="dimmed">Số từ</Text>
                                                                    <Text fw={600}>{analysisResult.uiHints.wordCount}</Text>
                                                                </div>
                                                                <Divider orientation="vertical" />
                                                                <div>
                                                                    <Text size="xs" c="dimmed">Sections</Text>
                                                                    <Text fw={600}>{analysisResult.uiHints.sectionCount}/4</Text>
                                                                </div>
                                                                <Divider orientation="vertical" />
                                                                <div>
                                                                    <Text size="xs" c="dimmed">Metrics</Text>
                                                                    <Text fw={600}>
                                                                        {analysisResult.uiHints.hasMetrics ? 'Có' : 'Không'}
                                                                    </Text>
                                                                </div>
                                                            </Group>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Stack>
                            </Paper>

                            {/* Breakdown Scores */}
                            {analysisResult.breakdown && (
                                <Paper shadow="sm" p="xl" radius="md" className="bg-white border border-gray-200">
                                    <Title order={3} className="text-deepSlate-900 mb-6 flex items-center gap-2">
                                        <IconChartBar size={24} className="text-oceanTeal-500" />
                                        Điểm chi tiết theo tiêu chí
                                    </Title>
                                    <Grid gutter="md">
                                        {Object.entries(analysisResult.breakdown).map(([key, score]) => {
                                            const max = getBreakdownMax(key);
                                            const percentage = (score / max) * 100;
                                            const color = percentage >= 80 ? 'green' : percentage >= 60 ? 'blue' : percentage >= 40 ? 'yellow' : 'red';
                                            return (
                                                <Grid.Col key={key} span={{ base: 12, sm: 6, lg: 4 }}>
                                                    <Card 
                                                        withBorder 
                                                        className="bg-deepSlate-50 h-full hover:shadow-md transition-shadow"
                                                    >
                                                        <Stack gap="xs">
                                                            <Group justify="space-between">
                                                                <Text size="sm" fw={600} className="text-deepSlate-900">
                                                                    {getBreakdownLabel(key)}
                                                                </Text>
                                                                <Badge
                                                                    size="sm"
                                                                    color={color}
                                                                    variant="light"
                                                                >
                                                                    {score}/{max}
                                                                </Badge>
                                                            </Group>
                                                            <Progress
                                                                value={percentage}
                                                                color={color}
                                                                size="lg"
                                                                radius="xl"
                                                            />
                                                            <Text size="xs" c="dimmed">
                                                                {percentage.toFixed(0)}% hoàn thành
                                                            </Text>
                                                        </Stack>
                                                    </Card>
                                                </Grid.Col>
                                            );
                                        })}
                                    </Grid>
                                </Paper>
                            )}

                            {/* Strengths and Weaknesses */}
                            <Grid gutter="md">
                                {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <Paper 
                                            shadow="sm" 
                                            p="xl" 
                                            radius="md" 
                                            className="bg-white border border-green-200 h-full"
                                        >
                                            <Title order={3} className="text-deepSlate-900 mb-4 flex items-center gap-2">
                                                <IconTrendingUp size={24} className="text-green-500" />
                                                Điểm mạnh
                                            </Title>
                                            <List
                                                spacing="sm"
                                                size="sm"
                                                icon={
                                                    <ThemeIcon color="green" size={22} radius="xl">
                                                        <IconCheck size={14} />
                                                    </ThemeIcon>
                                                }
                                            >
                                                {analysisResult.strengths.map((strength, index) => (
                                                    <List.Item key={index} className="text-deepSlate-700">
                                                        {strength}
                                                    </List.Item>
                                                ))}
                                            </List>
                                        </Paper>
                                    </Grid.Col>
                                )}

                                {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <Paper 
                                            shadow="sm" 
                                            p="xl" 
                                            radius="md" 
                                            className="bg-white border border-red-200 h-full"
                                        >
                                            <Title order={3} className="text-deepSlate-900 mb-4 flex items-center gap-2">
                                                <IconTrendingDown size={24} className="text-red-500" />
                                                Điểm yếu
                                            </Title>
                                            <List
                                                spacing="sm"
                                                size="sm"
                                                icon={
                                                    <ThemeIcon color="red" size={22} radius="xl">
                                                        <IconX size={14} />
                                                    </ThemeIcon>
                                                }
                                            >
                                                {analysisResult.weaknesses.map((weakness, index) => (
                                                    <List.Item key={index} className="text-deepSlate-700">
                                                        {weakness}
                                                    </List.Item>
                                                ))}
                                            </List>
                                        </Paper>
                                    </Grid.Col>
                                )}
                            </Grid>

                            {/* Issues Section */}
                            {analysisResult.issues && analysisResult.issues.length > 0 && (
                                <Paper shadow="sm" p="xl" radius="md" className="bg-white border border-red-200">
                                    <Title order={3} className="text-deepSlate-900 mb-4 flex items-center gap-2">
                                        <IconX size={24} className="text-red-500" />
                                        Vấn đề cần khắc phục
                                    </Title>
                                    <List
                                        spacing="sm"
                                        size="sm"
                                        icon={
                                            <ThemeIcon color="red" size={22} radius="xl">
                                                <IconX size={14} />
                                            </ThemeIcon>
                                        }
                                    >
                                        {analysisResult.issues.map((issue, index) => (
                                            <List.Item key={index} className="text-deepSlate-700">
                                                {issue}
                                            </List.Item>
                                        ))}
                                    </List>
                                </Paper>
                            )}

                            {/* Suggestions Section with Priority */}
                            {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                                <Paper shadow="sm" p="xl" radius="md" className="bg-white border border-gray-200">
                                    <Title order={3} className="text-deepSlate-900 mb-4 flex items-center gap-2">
                                        <IconInfoCircle size={24} className="text-blue-500" />
                                        Gợi ý cải thiện
                                    </Title>
                                    <Stack gap="md">
                                        {analysisResult.suggestions.map((suggestion, index) => {
                                            const priority = getPriorityLabel(suggestion);
                                            const priorityColor = getPriorityColor(suggestion);
                                            const cleanSuggestion = removePriorityPrefix(suggestion);
                                            
                                            return (
                                                <Card 
                                                    key={index} 
                                                    withBorder 
                                                    className={`bg-deepSlate-50 hover:bg-deepSlate-100 transition-colors ${
                                                        priority === 'HIGH' ? 'border-l-4 border-l-red-500' :
                                                        priority === 'MEDIUM' ? 'border-l-4 border-l-yellow-500' :
                                                        'border-l-4 border-l-blue-500'
                                                    }`}
                                                >
                                                    <Group gap="sm" align="flex-start" wrap="nowrap">
                                                        {priority && (
                                                            <Badge
                                                                size="md"
                                                                color={priorityColor}
                                                                variant="filled"
                                                                className="shrink-0"
                                                            >
                                                                {priority}
                                                            </Badge>
                                                        )}
                                                        <Text className="flex-1 text-deepSlate-700 leading-relaxed">
                                                            {cleanSuggestion}
                                                        </Text>
                                                    </Group>
                                                </Card>
                                            );
                                        })}
                                    </Stack>
                                </Paper>
                            )}

                            {/* Parsed Info Section */}
                            {analysisResult.parsedInfo && (
                                <Paper shadow="sm" p="xl" radius="md" className="bg-white border border-gray-200">
                                    <Title order={3} className="text-deepSlate-900 mb-4">
                                        Thông tin đã trích xuất
                                    </Title>
                                    <Card withBorder className="bg-deepSlate-50">
                                        <Stack gap="md">
                                            {analysisResult.parsedInfo.name && (
                                                <Group>
                                                    <Text fw={500} className="w-32">Tên:</Text>
                                                    <Text>{analysisResult.parsedInfo.name}</Text>
                                                </Group>
                                            )}
                                            {analysisResult.parsedInfo.email && (
                                                <Group>
                                                    <IconMail size={18} className="text-deepSlate-400" />
                                                    <Text fw={500} className="w-32">Email:</Text>
                                                    <Text>{analysisResult.parsedInfo.email}</Text>
                                                </Group>
                                            )}
                                            {analysisResult.parsedInfo.phone && (
                                                <Group>
                                                    <IconPhone size={18} className="text-deepSlate-400" />
                                                    <Text fw={500} className="w-32">Điện thoại:</Text>
                                                    <Text>{analysisResult.parsedInfo.phone}</Text>
                                                </Group>
                                            )}
                                            {analysisResult.parsedInfo.skills && (
                                                <div>
                                                    <Group mb="xs">
                                                        <IconTarget size={18} className="text-deepSlate-400" />
                                                        <Text fw={500}>Kỹ năng:</Text>
                                                    </Group>
                                                    <div className="ml-8 space-y-3">
                                                        {Object.entries(analysisResult.parsedInfo.skills).map(([category, skills]: [string, any]) => (
                                                            <div key={category}>
                                                                <Text size="xs" fw={500} c="dimmed" mb="xs">
                                                                    {category}:
                                                                </Text>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {skills.map((skill: string, idx: number) => (
                                                                        <Badge 
                                                                            key={idx} 
                                                                            size="sm" 
                                                                            color="oceanTeal" 
                                                                            variant="light"
                                                                        >
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Stack>
                                    </Card>
                                </Paper>
                            )}

                            {/* Action Buttons */}
                            <Group justify="center">
                                <Button
                                    onClick={() => {
                                        setFile(null);
                                        setAnalysisResult(null);
                                        setActiveStep(0);
                                    }}
                                    variant="outline"
                                    color="oceanTeal.4"
                                    leftSection={<IconUpload size={18} />}
                                >
                                    Phân tích CV khác
                                </Button>
                            </Group>
                        </Stack>
                    )}

                    {/* Error Alert */}
                    {analysisResult?.error && (
                        <Alert
                            icon={<IconAlertCircle size={18} />}
                            title="Lỗi"
                            color="red"
                        >
                            {analysisResult.error}
                        </Alert>
                    )}

                    {/* Info Section */}
                    {!analysisResult && (
                        <Paper shadow="sm" p="xl" radius="md" className="bg-deepSlate-50 border border-gray-200">
                            <Title order={3} className="text-deepSlate-900 mb-4">
                                Lưu ý
                            </Title>
                            <List spacing="sm" size="sm">
                                <List.Item>Chỉ hỗ trợ file PDF dạng text-based (không hỗ trợ file scan/ảnh)</List.Item>
                                <List.Item>Kích thước file tối đa: 10MB</List.Item>
                                <List.Item>CV được đánh giá dựa trên 5 tiêu chí: Thông tin liên hệ, Cấu trúc, Độ dài, Vị trí header, Tác động nội dung</List.Item>
                                <List.Item>Kết quả phân tích chỉ mang tính tham khảo, mô phỏng cách ATS đọc CV</List.Item>
                            </List>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </div>
    );
};

export default CVAnalysisPage;
