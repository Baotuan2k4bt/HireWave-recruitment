import { Badge, Table, Group, Avatar, Text, Stack, Progress, Card, Loader, Modal, ActionIcon, Tooltip } from "@mantine/core";
import { IconUsers, IconMessageCircle } from "@tabler/icons-react";
import { useState } from "react";
import { EmployerCandidateRankingDTO } from "../../../Services/MatchingService";

interface RankingTabProps {
  candidates: EmployerCandidateRankingDTO[];
  jobTitle?: string;
  loading?: boolean;
}

export const getScoreColor = (score: number) => {
  if (score >= 90) return "teal";
  if (score >= 75) return "blue";
  if (score >= 60) return "yellow";
  return "red";
};

const getScoreBgColor = (score: number) => {
  if (score >= 90) return { bg: "#ecfdf5", text: "#059669", border: "#10b981" };
  if (score >= 75) return { bg: "#eff6ff", text: "#2563eb", border: "#3b82f6" };
  if (score >= 60) return { bg: "#fefce8", text: "#ca8a04", border: "#eab308" };
  return { bg: "#fef2f2", text: "#dc2626", border: "#ef4444" };
};

const RankingTab = ({ candidates, jobTitle, loading }: RankingTabProps) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidateRankingDTO | null>(null);

  const handleOpenComment = (c: EmployerCandidateRankingDTO) => {
    setSelectedCandidate(c);
    setModalOpened(true);
  };

  return (
    <Card
      radius="xl"
      padding="lg"
      style={{
        background: "white",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      <Group justify="space-between" mb="lg" wrap="wrap" gap="md">
        <Stack gap={4}>
          <Text fw={800} size="lg" style={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
            Job: {jobTitle || "N/A"}
          </Text>
          <Text size="sm" c="dimmed" fw={500} style={{ lineHeight: 1.5 }}>
            AI đánh giá và xếp hạng ứng viên dựa trên mức độ phù hợp với JD
            (kỹ năng, kinh nghiệm, từ khóa…) và dữ liệu hồ sơ đã khai báo (profile, số năm kinh nghiệm thực tế).
          </Text>
        </Stack>
        {loading ? (
          <Loader size="sm" color="cyan" />
        ) : (
          <Badge
            leftSection={<IconUsers size={16} />}
            size="lg"
            radius="xl"
            style={{
              background: "linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%)",
              color: "#0e7490",
              fontWeight: 700,
              border: "1px solid #67e8f9",
              padding: "8px 16px",
            }}
          >
            {candidates.length} ứng viên đang được đánh giá
          </Badge>
        )}
      </Group>

      <Table
        verticalSpacing="md"
        highlightOnHover
        withColumnBorders={false}
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <Table.Thead>
          <Table.Tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <Table.Th style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", width: "22%" }}>
              Ứng viên
            </Table.Th>
            <Table.Th style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", width: "18%" }}>
              Điểm phù hợp (AI)
            </Table.Th>
            <Table.Th style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", width: "28%" }}>
              Kỹ năng khớp
            </Table.Th>
            <Table.Th style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", width: "12%" }}>
              Nhận xét AI
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!loading && (!candidates || candidates.length === 0) ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" py="xl" c="dimmed">
                  Chưa có dữ liệu xếp hạng cho job này. Đảm bảo đã có ứng viên ứng tuyển và hệ thống đã tính điểm AI.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : null}
          {(candidates || []).map((c, index) => {
            const score = c.matchingScore ?? 0;
            const scoreStyle = getScoreBgColor(score);
            return (
              <Table.Tr
                key={c.applicationId}
                style={{
                  background: index % 2 === 1 ? "rgba(240, 249, 255, 0.5)" : "transparent",
                  borderRadius: 8,
                }}
              >
                <Table.Td style={{ verticalAlign: "top", paddingTop: 16, paddingBottom: 16 }}>
                  <Group gap="sm" align="flex-start" wrap="nowrap">
                    <Avatar
                      radius="xl"
                      size="md"
                      style={{
                        background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}
                    >
                      {(c.applicantName || "?")
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(-2) || "?"}
                    </Avatar>
                    <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                      <Group gap={6} wrap="wrap">
                        <Text fw={700} size="sm" style={{ color: "#0f172a" }} lineClamp={1}>
                          {c.applicantName}
                        </Text>
                        {index === 0 && (
                          <Badge
                            size="xs"
                            radius="md"
                            style={{
                              background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)",
                              color: "white",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            #1 Đề xuất
                          </Badge>
                        )}
                      </Group>
                      <Text size="xs" c="dimmed" fw={500}>
                        ID: {c.applicantId}
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td style={{ verticalAlign: "top", paddingTop: 16, paddingBottom: 16 }}>
                  <Stack gap={6} style={{ maxWidth: 140 }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: 10,
                        background: scoreStyle.bg,
                        border: `1px solid ${scoreStyle.border}`,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: scoreStyle.text,
                      }}
                    >
                      {Number(score).toFixed(1)}/100
                    </div>
                    <Progress
                      value={score}
                      color={getScoreColor(score)}
                      radius="xl"
                      size="lg"
                      styles={{ section: { transition: "width 0.4s ease" } }}
                    />
                  </Stack>
                </Table.Td>
                <Table.Td style={{ verticalAlign: "top", paddingTop: 16, paddingBottom: 16 }}>
                  <Group gap={6} wrap="wrap" align="flex-start">
                    {(c.matchedSkills || []).slice(0, 5).map((t) => (
                      <Badge
                        key={String(t)}
                        size="sm"
                        variant="light"
                        radius="lg"
                        style={{
                          background: "#f1f5f9",
                          color: "#334155",
                          fontWeight: 600,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {t}
                      </Badge>
                    ))}
                    {(c.matchedSkills || []).length > 5 && (
                      <Text size="xs" fw={600} c="dimmed">
                        +{(c.matchedSkills || []).length - 5}
                      </Text>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td style={{ verticalAlign: "top", paddingTop: 16, paddingBottom: 16 }}>
                  <Tooltip label="Xem nhận xét chi tiết AI">
                    <ActionIcon
                      variant="light"
                      size="lg"
                      radius="xl"
                      onClick={() => handleOpenComment(c)}
                      style={{
                        background: "linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%)",
                        color: "#0891b2",
                        border: "1px solid #67e8f9",
                      }}
                    >
                      <IconMessageCircle size={20} strokeWidth={2} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="sm">
            <IconMessageCircle size={22} color="#0891b2" />
            <Text fw={700} size="lg">Nhận xét chi tiết AI</Text>
          </Group>
        }
        size="lg"
        radius="xl"
        styles={{
          header: { borderBottom: "2px solid #e2e8f0", paddingBottom: 12 },
          body: { paddingTop: 20 },
        }}
      >
        {selectedCandidate && (
          <Stack gap="md">
            <Group gap="sm">
              <Avatar
                radius="xl"
                size="md"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {(selectedCandidate.applicantName || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(-2) || "?"}
              </Avatar>
              <div>
                <Text fw={700} size="md">{selectedCandidate.applicantName}</Text>
                <Text size="xs" c="dimmed">ID: {selectedCandidate.applicantId} • Điểm: {Number(selectedCandidate.matchingScore ?? 0).toFixed(1)}/100</Text>
              </div>
            </Group>
            <div
              style={{
                padding: 16,
                background: "linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%)",
                borderRadius: 12,
                border: "1px solid #a5f3fc",
              }}
            >
              <Text
                size="sm"
                fw={500}
                style={{ color: "#334155", lineHeight: 1.7, whiteSpace: "pre-line" }}
              >
                {selectedCandidate.summary || "Chưa có nhận xét."}
              </Text>
            </div>
            {(selectedCandidate.matchedSkills?.length ?? 0) > 0 && (
              <Stack gap={6}>
                <Text size="xs" fw={700} c="dimmed">Kỹ năng khớp</Text>
                <Group gap={6} wrap="wrap">
                  {selectedCandidate.matchedSkills!.map((t) => (
                    <Badge key={t} size="sm" variant="light" radius="lg" color="cyan">
                      {t}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            )}
          </Stack>
        )}
      </Modal>
    </Card>
  );
};

export default RankingTab;
