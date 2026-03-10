import { Card, Group, Pill, Stack, Tabs, Text } from "@mantine/core";
import { IconArrowsRightLeft, IconLayoutDashboard, IconSparkles, IconStars, IconTrophy, IconUserCheck } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployerCandidateRankingDTO, getRankingByJob } from "../../Services/MatchingService";

const AIDashboard = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const parsedId = jobId ? parseInt(jobId, 10) : 1;
  const id = Number.isNaN(parsedId) ? 1 : parsedId;

  const [ranking, setRanking] = useState<EmployerCandidateRankingDTO[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRankingByJob(id);
        setRanking(data);
      } catch (error) {
        console.error("Error fetching ranking for dashboard:", error);
      }
    };

    fetchRanking();
  }, [id]);

  const dashboard = useMemo(() => {
    const totalApplicants = ranking.length;

    const averageScore =
      totalApplicants > 0
        ? Math.round(ranking.reduce((sum, c) => sum + c.matchingScore, 0) / totalApplicants)
        : 0;

    const strongCandidates = ranking.filter((c) => c.matchingScore > 80).length;
    const mediumCandidates = ranking.filter(
      (c) => c.matchingScore >= 60 && c.matchingScore <= 80
    ).length;
    const weakCandidates = ranking.filter((c) => c.matchingScore < 60).length;

    const topCandidate =
      totalApplicants > 0
        ? ranking.reduce((best, c) =>
            c.matchingScore > best.matchingScore ? c : best,
          ranking[0])
        : null;

    const missingSkillCount = ranking.reduce((acc, c) => {
      (c.missingSkills || []).forEach((skill) => {
        const key = skill.trim();
        if (!key) return;
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const mostMissingSkill =
      Object.entries(missingSkillCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      totalApplicants,
      averageScore,
      strongCandidates,
      mediumCandidates,
      weakCandidates,
      topCandidate,
      mostMissingSkill,
    };
  }, [ranking]);

  return (
    <div className="px-6 py-6 bg-slate-50 min-h-[calc(100vh-80px)]">
      <Stack gap="md" className="max-w-6xl mx-auto">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Group gap={8}>
              <IconSparkles size={22} className="text-oceanTeal-500" />
              <Text fw={700} size="xl">
                Trung tâm AI tuyển dụng
              </Text>
            </Group>
            <Text size="sm" c="dimmed" className="max-w-2xl">
            Dashboard: tổng quan chất lượng ứng viên theo Job để hỗ trợ ra quyết định nhanh.
            </Text>
          </Stack>
          <Group gap={6}>
            <IconStars size={18} className="text-oceanTeal-500" />
            <Pill
              size="lg"
              radius="xl"
              className="bg-oceanTeal-50 text-oceanTeal-700 border border-oceanTeal-100"
            >
              AI Dashboard
            </Pill>
          </Group>
        </Group>

        
        <Card withBorder radius="lg" shadow="sm" className="bg-white">
          <Stack gap={6}>
            <Text fw={700} size="lg">AI Dashboard</Text>
            <Text>Total Applicants: {dashboard.totalApplicants}</Text>
            <Text>Average Matching Score: {dashboard.averageScore}%</Text>
            <Text />
            <Text>Strong Candidates (&gt;80%): {dashboard.strongCandidates}</Text>
            <Text>Medium Candidates (60-80%): {dashboard.mediumCandidates}</Text>
            <Text>Weak Candidates (&lt;60%): {dashboard.weakCandidates}</Text>
            <Text />
            <Text>
              Top Candidate: {dashboard.topCandidate ? `${dashboard.topCandidate.applicantName} (${Number(dashboard.topCandidate.matchingScore).toFixed(1)}%)` : "N/A"}
            </Text>
            <Text>Most Missing Skill: {dashboard.mostMissingSkill}</Text>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
};

export default AIDashboard;
