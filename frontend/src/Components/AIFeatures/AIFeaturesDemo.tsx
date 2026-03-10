import {
  Group,
  Pill,
  Stack,
  Tabs,
  Text,
  ScrollArea,
  Divider,
  Loader,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconArrowsRightLeft, IconSparkles, IconStars, IconTrophy, IconUserCheck } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import {
  compareCandidates,
  CandidateCompareDTO,
  EmployerCandidateRankingDTO,
  getRankingByJob,
  getTopCandidates,
} from "../../Services/MatchingService";
import { getJobsPostedBy } from "../../Services/JobService";
import CompareTab from "./SubComponents/CompareTab";
import RankingTab from "./SubComponents/RankingTab";
import ShortlistTab from "./SubComponents/ShortlistTab";
import AIJobCard from "./AIJobCard";

const AIFeaturesDemo = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const user = useSelector((state: any) => state.user);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const parsedId = jobId ? parseInt(jobId, 10) : null;
  const id = parsedId != null && !Number.isNaN(parsedId) ? parsedId : null;

  const [jobList, setJobList] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [ranking, setRanking] = useState<EmployerCandidateRankingDTO[]>([]);
  const [topCandidates, setTopCandidates] = useState<EmployerCandidateRankingDTO[]>([]);
  const [comparison, setComparison] = useState<CandidateCompareDTO>();
  const [selectedForCompare, setSelectedForCompare] = useState<[number | null, number | null]>([null, null]);

  const [loadingRanking, setLoadingRanking] = useState(false);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const isEmployer = user?.accountType === "EMPLOYER" || user?.accountType === "ADMIN";

  // Load danh sách job đã đăng
  useEffect(() => {
    if (isEmployer && user?.id) {
      setLoadingJobs(true);
      getJobsPostedBy(user.id)
        .then((jobs: any[]) => {
          const list = Array.isArray(jobs) ? jobs : [];
          setJobList(list);
        })
        .catch((err) => {
          console.error("Error loading jobs:", err);
          notifications.show({
            title: "Lỗi",
            message: "Không thể tải danh sách job.",
            color: "red",
          });
        })
        .finally(() => setLoadingJobs(false));
    }
  }, [user?.id, isEmployer]);

  const fetchRanking = useCallback(async () => {
    if (id == null) return;
    setLoadingRanking(true);
    setComparison(undefined);
    try {
      const data = await getRankingByJob(id);
      const list = Array.isArray(data) ? data : [];
      setRanking(list);
      if (list.length >= 2) {
        setSelectedForCompare([Number(list[0].applicationId), Number(list[1].applicationId)]);
      } else {
        setSelectedForCompare([null, null]);
      }
    } catch (error: any) {
      setRanking([]);
      setSelectedForCompare([null, null]);
      notifications.show({
        title: "Lỗi",
        message: error?.response?.data?.errorMessage || "Không thể tải xếp hạng ứng viên.",
        color: "red",
      });
    } finally {
      setLoadingRanking(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const handleRunAutoShortlist = async () => {
    if (id == null) return;
    setLoadingTop(true);
    try {
      const data = await getTopCandidates(id, 3);
      setTopCandidates(Array.isArray(data) ? data : []);
    } catch (error: any) {
      notifications.show({
        title: "Lỗi",
        message: error?.response?.data?.errorMessage || "Không thể tải Top ứng viên.",
        color: "red",
      });
    } finally {
      setLoadingTop(false);
    }
  };

  const handleSelectCompare = (candidateId: number, slot: 0 | 1) => {
    const newSelected: [number | null, number | null] = [...selectedForCompare];
    newSelected[slot] = candidateId;
    setSelectedForCompare(newSelected);
  };

  useEffect(() => {
    if (selectedForCompare[0] && selectedForCompare[1]) {
      fetchComparison(selectedForCompare[0], selectedForCompare[1]);
    }
  }, [selectedForCompare]);

  const fetchComparison = async (leftId: number, rightId: number) => {
    setLoadingCompare(true);
    setComparison(undefined);
    try {
      const data = await compareCandidates(leftId, rightId);
      setComparison(data);
    } catch (error: any) {
      setComparison(undefined);
      notifications.show({
        title: "Lỗi",
        message: error?.response?.data?.errorMessage || "Không thể so sánh ứng viên.",
        color: "red",
      });
    } finally {
      setLoadingCompare(false);
    }
  };

  const selectedJob = jobList.find((j) => j.id === id);

  return (
    <div
      className="min-h-[calc(100vh-80px)]"
      style={{
        background: colorScheme === "dark"
          ? theme.colors.dark[7]
          : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0fdfa 50%, #ecfeff 100%)",
      }}
    >
      <div className="flex gap-6 py-6 px-5 max-w-7xl mx-auto">
        {/* Sidebar: Danh sách job đã đăng */}
        {isEmployer && (
          <div className="w-72 shrink-0 hidden md:block">
            <div className="sticky top-24">
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 50%, #14b8a6 100%)",
                  boxShadow: "0 4px 20px rgba(6, 182, 212, 0.35)",
                }}
              >
                <Group gap={8} mb={4}>
                  <div className="p-1.5 rounded-lg bg-white/25">
                    <IconSparkles size={20} color="white" />
                  </div>
                  <Text fw={800} size="lg" c="white" style={{ letterSpacing: "-0.02em" }}>
                    Job của tôi
                  </Text>
                </Group>
                <Text size="sm" c="white" opacity={0.95} style={{ lineHeight: 1.4 }}>
                  Chọn job để xem AI xếp hạng ứng viên
                </Text>
              </div>
              <ScrollArea h="calc(100vh - 220px)" type="auto" offsetScrollbars>
                {loadingJobs ? (
                  <Stack gap="sm" align="center" py="xl">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">
                      Đang tải job...
                    </Text>
                  </Stack>
                ) : jobList.length === 0 ? (
                  <Text size="sm" c="dimmed" py="xl">
                    Chưa có job. Đăng job để sử dụng AI tuyển dụng.
                  </Text>
                ) : (
                  <Stack gap="sm">
                    {jobList
                      .filter((j: any) => ["ACTIVE", "PENDING", "CLOSED"].includes(j.jobStatus))
                      .sort((a: any, b: any) => new Date(b.postTime || 0).getTime() - new Date(a.postTime || 0).getTime())
                      .map((job: any) => (
                        <AIJobCard
                          key={job.id}
                          id={job.id}
                          jobTitle={job.jobTitle}
                          location={job.location}
                          companyName={job.companyName || job.company}
                          postTime={job.postTime}
                          applicantsCount={job.applicants?.length ?? 0}
                          jobStatus={job.jobStatus}
                        />
                      ))}
                  </Stack>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Panel chính: AI Features */}
        <div className="flex-1 min-w-0">
          <Stack gap="lg">
            <div
              className="rounded-2xl p-6 -mx-1"
              style={{
                background: "linear-gradient(135deg, #0891b2 0%, #0d9488 50%, #0f766e 100%)",
                boxShadow: "0 8px 32px rgba(8, 145, 178, 0.3)",
              }}
            >
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <Stack gap={6}>
                  <Group gap={10}>
                    <div className="p-2 rounded-xl bg-white/20">
                      <IconSparkles size={26} color="white" />
                    </div>
                    <Text
                      fw={800}
                      size="xl"
                      c="white"
                      style={{ letterSpacing: "-0.03em", fontSize: "1.5rem" }}
                    >
                      Trung tâm AI tuyển dụng
                    </Text>
                  </Group>
                  <Text size="sm" c="white" opacity={0.95} className="max-w-2xl" style={{ lineHeight: 1.5 }}>
                    Xếp hạng, đề xuất và so sánh ứng viên theo mức độ phù hợp với JD
                  </Text>
                </Stack>
                <Pill
                  size="lg"
                  radius="xl"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    fontWeight: 700,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Group gap={6}>
                    <IconStars size={18} />
                    AI tuyển dụng thông minh
                  </Group>
                </Pill>
              </Group>
            </div>

            {id == null ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{
                  background: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  border: "2px dashed #06b6d4",
                }}
              >
                <Text size="md" fw={600} c="dark.7" ta="center" mb={4}>
                  {isEmployer
                    ? "Chọn một job từ danh sách bên trái để xem xếp hạng AI"
                    : "Truy cập /ai-features/[jobId] với jobId hợp lệ."}
                </Text>
                {isEmployer && jobList.length > 0 && (
                  <Text size="sm" c="dimmed">
                    Hiển thị job ACTIVE, PENDING, CLOSED. Job nháp không hiển thị.
                  </Text>
                )}
              </div>
            ) : (
              <>
                {selectedJob && (
                  <div
                    className="rounded-xl px-4 py-2 inline-flex"
                    style={{
                      background: "linear-gradient(90deg, #e0f2fe 0%, #ccfbf1 100%)",
                      border: "1px solid #67e8f9",
                    }}
                  >
                    <Text size="sm" fw={700} c="#0e7490">
                      Đang xem: {selectedJob.jobTitle}
                    </Text>
                  </div>
                )}

                <Tabs
                  defaultValue="ranking"
                  radius="xl"
                  variant="pills"
                  classNames={{
                    list: "bg-slate-100/80 p-1 rounded-xl",
                    tab: "font-semibold data-[active]:bg-white data-[active]:shadow-md data-[active]:text-cyan-700",
                  }}
                >
                  <Tabs.List grow>
                    <Tabs.Tab value="ranking" leftSection={<IconTrophy size={18} />}>
                      Xếp hạng ứng viên
                    </Tabs.Tab>
                    <Tabs.Tab value="shortlist" leftSection={<IconUserCheck size={18} />}>
                      AI đề xuất Top
                    </Tabs.Tab>
                    <Tabs.Tab value="compare" leftSection={<IconArrowsRightLeft size={18} />}>
                      So sánh 2 ứng viên
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="ranking" pt="md">
                    <RankingTab
                      candidates={ranking}
                      loading={loadingRanking}
                      jobTitle={selectedJob?.jobTitle}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="shortlist" pt="md">
                    <ShortlistTab
                      topCandidates={topCandidates}
                      onRunAutoShortlist={handleRunAutoShortlist}
                      loading={loadingTop}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="compare" pt="md">
                    <CompareTab
                      candidates={ranking}
                      comparison={comparison}
                      selectedIds={selectedForCompare}
                      onSelect={handleSelectCompare}
                      loading={loadingCompare}
                    />
                  </Tabs.Panel>
                </Tabs>
              </>
            )}
          </Stack>
        </div>
      </div>

      {/* Mobile: Drawer hoặc dropdown job - đơn giản là hiển thị danh sách phía trên */}
      {isEmployer && (
        <div className="md:hidden px-4 pb-4">
          <Divider my="sm" />
          <Text fw={600} size="sm" mb="sm">
            Chọn job
          </Text>
          <ScrollArea w="100%" scrollbarSize={6}>
            <Group gap="sm" wrap="nowrap" align="stretch">
              {jobList
                .filter((j: any) => ["ACTIVE", "PENDING", "CLOSED"].includes(j.jobStatus))
                .slice(0, 10)
                .map((job: any) => (
                  <div key={job.id} className="min-w-[200px]">
                    <AIJobCard
                      id={job.id}
                      jobTitle={job.jobTitle}
                      location={job.location}
                      companyName={job.companyName || job.company}
                      postTime={job.postTime}
                      applicantsCount={job.applicants?.length ?? 0}
                    />
                  </div>
                ))}
            </Group>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default AIFeaturesDemo;
