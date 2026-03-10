import { useState } from 'react';
import { Container, Title, Text, Paper, Button, Textarea, Select, MultiSelect, Slider, Group, Badge, Stack, Grid, LoadingOverlay, Card } from '@mantine/core';
import { IconBrain, IconSparkles, IconTargetArrow } from '@tabler/icons-react';
import { AiCareerAnalysisService } from '../Services/AiCareerAnalysisService';
import { CareerFitRequest, CareerFitResponse, JobSuggestion } from '../types/ai-career.types';

const INDUSTRY_OPTIONS = [
  'Công nghệ thông tin',
  'Marketing – Truyền thông',
  'Kinh doanh – Bán hàng',
  'Tài chính – Ngân hàng',
  'Nhân sự',
  'Thiết kế – Sáng tạo',
  'Logistics – Chuỗi cung ứng',
  'Giáo dục – Đào tạo',
  'Y tế – Chăm sóc sức khỏe',
  'Du lịch – Nhà hàng – Khách sạn',
  'Xây dựng – Kỹ thuật',
  'Sản xuất – Công nghiệp',
  'Luật – Pháp lý',
  'Hành chính – Văn phòng',
  'Dữ liệu – Phân tích – AI',
].map((v) => ({ value: v, label: v }));

const LEVEL_OPTIONS = [
  'Sinh viên / Thực tập',
  'Mới tốt nghiệp',
  'Junior (0-2 năm kinh nghiệm)',
  'Middle (2-5 năm kinh nghiệm)',
  'Senior (5+ năm kinh nghiệm)',
  'Quản lý / Leader',
];

const AiCareerAnalysisPage = () => {
  const [form, setForm] = useState<CareerFitRequest>({
    level: '',
    description: '',
    skills: [],
    preferredIndustries: [],
    socialLevel: 50,
    analyticalLevel: 50,
    creativityLevel: 50,
    stabilityPreference: 50,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CareerFitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (patch: Partial<CareerFitRequest>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload: CareerFitRequest = {
        ...form,
        skills:
          typeof form.skills === 'string'
            ? (form.skills as unknown as string).split(',').map((s) => s.trim()).filter(Boolean)
            : form.skills,
      };
      const res = await AiCareerAnalysisService.analyzeCareer(payload);
      setResult(res);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const renderJobCard = (job: JobSuggestion, index: number) => (
    <Card
      key={index}
      shadow="sm"
      radius="lg"
      withBorder
      className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur"
    >
      <Group justify="space-between" align="flex-start" mb="xs">
        <div>
          <Text fw={600} size="lg" className="text-deepSlate-900">
            {job.title}
          </Text>
          <Text size="sm" c="dimmed">
            {job.industry}
          </Text>
        </div>
        <Badge
          radius="xl"
          size="lg"
          variant="gradient"
          gradient={{ from: 'oceanTeal.5', to: 'oceanTeal.7', deg: 135 }}
        >
          {job.matchScore}% phù hợp
        </Badge>
      </Group>
      <Text size="sm" c="dimmed">
        {job.reason}
      </Text>
    </Card>
  );

  return (
    <div className="bg-gradient-to-br from-[#ecf9ff] via-white to-[#eef2ff] min-h-[calc(100vh-64px)] py-10">
      <LoadingOverlay
        visible={loading}
        zIndex={2000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'oceanTeal.4', type: 'bars' }}
      />
      <Container size="lg">
        <Group align="flex-start" mb="xl" className="gap-6 flex-col md:flex-row">
          <div className="flex-1">
            <Group gap="xs" mb={8}>
              <Badge
                variant="light"
                color="oceanTeal"
                leftSection={<IconBrain size={16} />}
                radius="lg"
              >
                AI Career Insight
              </Badge>
            </Group>
            <Title
              order={1}
              className="text-3xl md:text-4xl font-extrabold text-deepSlate-900 mb-3 tracking-tight"
            >
              Phân tích Nghề nghiệp AI
            </Title>
           
          </div>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              shadow="md"
              radius="lg"
              p="lg"
              withBorder
              className="bg-white/90 backdrop-blur-sm border border-oceanTeal-50/60"
            >
              <Stack gap="md">
                <Group gap="xs">
                  <IconTargetArrow className="text-oceanTeal-500" />
                  <Text fw={600} className="text-deepSlate-900">
                    Thông tin về bạn
                  </Text>
                </Group>

                <Select
                  label="Cấp độ hiện tại"
                  placeholder="Chọn cấp độ"
                  data={LEVEL_OPTIONS}
                  value={form.level || ''}
                  onChange={(value) => handleChange({ level: value || '' })}
                  withAsterisk
                />

                <Textarea
                  label="Mục tiêu & mô tả bản thân"
                  placeholder="Ví dụ: Em là sinh viên năm 4 ngành CNTT, yêu thích backend, muốn tìm công việc có lộ trình phát triển rõ ràng..."
                  minRows={4}
                  value={form.description || ''}
                  onChange={(e) => handleChange({ description: e.currentTarget.value })}
                  autosize
                />

                <Textarea
                  label="Kỹ năng chính"
                  description="Ngăn cách bằng dấu phẩy. Ví dụ: Java, Spring Boot, SQL, Giao tiếp, Làm việc nhóm"
                  minRows={2}
                  value={Array.isArray(form.skills) ? form.skills.join(', ') : (form.skills as any) || ''}
                  onChange={(e) => handleChange({ skills: e.currentTarget.value.split(',').map((s) => s.trim()) })}
                />

                <MultiSelect
                  label="Ngành ưu tiên (tuỳ chọn)"
                  placeholder="Chọn 1-3 ngành mà bạn quan tâm"
                  data={INDUSTRY_OPTIONS}
                  value={form.preferredIndustries || []}
                  onChange={(value) => handleChange({ preferredIndustries: value })}
                  searchable
                  clearable
                />

                <Stack gap="sm" mt="sm">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={500} className="text-deepSlate-900">
                        Phong cách & sở thích công việc
                      </Text>
                      <Text size="xs" c="dimmed">
                        Kéo thanh trượt để mô tả phong cách làm việc mà bạn cảm thấy đúng với mình nhất.
                      </Text>
                    </div>
                    <Badge
                      radius="xl"
                      size="sm"
                      variant="light"
                      color="oceanTeal"
                    >
                      Thang 0 - 100
                    </Badge>
                  </Group>

                  <div>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" c="dimmed">
                        Giao tiếp
                      </Text>
                      <Badge size="xs" variant="light" color="oceanTeal" radius="xl">
                        {form.socialLevel}
                      </Badge>
                    </Group>
                    <Slider
                      min={0}
                      max={100}
                      value={form.socialLevel || 0}
                      onChange={(value) => handleChange({ socialLevel: value })}
                      className="mb-4"
                      marks={[
                        { value: 0, label: 'Thấp' },
                        { value: 50, label: 'Vừa' },
                        { value: 100, label: 'Cao' },
                      ]}
                    />
                  </div>

                  <div>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" c="dimmed">
                        Phân tích / Logic
                      </Text>
                      <Badge size="xs" variant="light" color="oceanTeal" radius="xl">
                        {form.analyticalLevel}
                      </Badge>
                    </Group>
                    <Slider
                      min={0}
                      max={100}
                      value={form.analyticalLevel || 0}
                      onChange={(value) => handleChange({ analyticalLevel: value })}
                      className="mb-4"
                      marks={[
                        { value: 0, label: 'Thấp' },
                        { value: 50, label: 'Vừa' },
                        { value: 100, label: 'Cao' },
                      ]}
                    />
                  </div>

                  <div>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" c="dimmed">
                        Sáng tạo
                      </Text>
                      <Badge size="xs" variant="light" color="oceanTeal" radius="xl">
                        {form.creativityLevel}
                      </Badge>
                    </Group>
                    <Slider
                      min={0}
                      max={100}
                      value={form.creativityLevel || 0}
                      onChange={(value) => handleChange({ creativityLevel: value })}
                      className="mb-4"
                      marks={[
                        { value: 0, label: 'Thấp' },
                        { value: 50, label: 'Vừa' },
                        { value: 100, label: 'Cao' },
                      ]}
                    />
                  </div>

                  <div>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" c="dimmed">
                        Ưu tiên ổn định (so với thử thách)
                      </Text>
                      <Badge size="xs" variant="light" color="oceanTeal" radius="xl">
                        {form.stabilityPreference}
                      </Badge>
                    </Group>
                    <Slider
                      min={0}
                      max={100}
                      value={form.stabilityPreference || 0}
                      onChange={(value) => handleChange({ stabilityPreference: value })}
                      className="mb-4"
                      marks={[
                        { value: 0, label: 'Thấp' },
                        { value: 50, label: 'Vừa' },
                        { value: 100, label: 'Cao' },
                      ]}
                    />
                  </div>
                </Stack>

                {error && (
                  <Text size="sm" c="red" mt="sm">
                    {error}
                  </Text>
                )}

                <Button
                  fullWidth
                  size="md"
                  radius="xl"
                  leftSection={<IconSparkles size={18} />}
                  className="bg-oceanTeal-500 hover:bg-oceanTeal-600 transition-colors"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Phân tích nghề nghiệp bằng AI
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            {result ? (
              <Stack gap="md">
                <Paper
                  radius="lg"
                  withBorder
                  p="lg"
                  className="bg-white/90 backdrop-blur-sm border border-oceanTeal-50/60 shadow-md"
                >
                  <Group justify="space-between" mb="sm">
                    <div>
                      <Text fw={600} className="text-deepSlate-900 mb-1">
                        Chân dung nghề nghiệp
                      </Text>
                      <Text size="sm" c="dimmed">
                        {result.persona}
                      </Text>
                    </div>
                    <div className="flex flex-col items-end">
                      <Text size="xs" c="dimmed" mb={4}>
                        Mức độ phù hợp tổng quan
                      </Text>
                      <Badge
                        radius="xl"
                        size="lg"
                        variant="gradient"
                        gradient={{ from: 'oceanTeal.5', to: 'oceanTeal.7', deg: 120 }}
                      >
                        {result.overallScore} / 100
                      </Badge>
                    </div>
                  </Group>
                  <Text size="sm" mt="sm" className="text-deepSlate-800">
                    {result.summary}
                  </Text>
                  {result.recommendedIndustries?.length > 0 && (
                    <Group gap="xs" mt="md" wrap="wrap">
                      {result.recommendedIndustries.map((ind, idx) => (
                        <Badge key={idx} variant="light" color="oceanTeal" radius="xl">
                          {ind}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Paper>

                <Stack gap="md">
                  <Group justify="space-between">
                    <Text fw={600} className="text-deepSlate-900">
                      Gợi ý công việc phù hợp
                    </Text>
                    <Text size="xs" c="dimmed">
                      Dựa trên kỹ năng, sở thích và phong cách làm việc của bạn
                    </Text>
                  </Group>
                  <Grid gutter="md">
                    {result.topJobs?.map((job, idx) => (
                      <Grid.Col key={idx} span={{ base: 12, sm: 6 }}>
                        {renderJobCard(job, idx)}
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>

                {(result.strengths?.length || 0) > 0 && (
                  <Paper radius="lg" withBorder p="lg" className="bg-white/80 backdrop-blur-sm shadow-sm">
                    <Text fw={600} className="text-deepSlate-900 mb-2">
                      Điểm mạnh nổi bật
                    </Text>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-deepSlate-800">
                      {result.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </Paper>
                )}

                {(result.improvements?.length || 0) > 0 && (
                  <Paper radius="lg" withBorder p="lg" className="bg-white/80 backdrop-blur-sm shadow-sm">
                    <Text fw={600} className="text-deepSlate-900 mb-2">
                      Gợi ý cải thiện
                    </Text>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-deepSlate-800">
                      {result.improvements.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </Paper>
                )}

                {(result.roadmap30Days?.length || 0) > 0 && (
                  <Paper radius="lg" withBorder p="lg" className="bg-white/80 backdrop-blur-sm shadow-sm">
                 
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-deepSlate-800">
                      {result.roadmap30Days.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ol>
                  </Paper>
                )}

                {(result.jobKeywords?.length || 0) > 0 && (
                  <Paper radius="lg" withBorder p="lg" className="bg-white/80 backdrop-blur-sm shadow-sm">
                    <Text fw={600} className="text-deepSlate-900 mb-2">
                      Từ khóa gợi ý để tìm việc
                    </Text>
                    <Group gap="xs" wrap="wrap">
                      {result.jobKeywords.map((k, idx) => (
                        <Badge key={idx} variant="light" color="oceanTeal" radius="xl">
                          {k}
                        </Badge>
                      ))}
                    </Group>
                  </Paper>
                )}
              </Stack>
            ) : (
              <Paper
                radius="lg"
                withBorder
                p="xl"
                className="bg-gradient-to-br from-oceanTeal-50 via-white to-indigo-50 border-oceanTeal-100 h-full flex items-center"
              >
                <Stack gap="md">
                  <Group>
                    <IconBrain className="text-oceanTeal-500" size={32} />
                    <div>
                      <Text fw={600} className="text-deepSlate-900 text-lg">
                        Bắt đầu với phân tích nghề nghiệp cá nhân hóa
                      </Text>
                  
                    </div>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Gợi ý: Hãy mô tả càng cụ thể càng tốt về ngành đang học/đang làm, những kỹ năng
                    bạn tự tin, môi trường làm việc bạn mong muốn và mức độ ưu tiên ổn định hay thử
                    thách.
                  </Text>
                </Stack>
              </Paper>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default AiCareerAnalysisPage;

