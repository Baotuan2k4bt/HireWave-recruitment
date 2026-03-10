import { Badge, Button, Card, Group, Progress, Stack, Text, Avatar, Divider, Loader } from "@mantine/core";
import { EmployerCandidateRankingDTO, CandidateCompareDTO } from "../../../Services/MatchingService";
import { getScoreColor } from "./RankingTab";

interface CompareTabProps {
  candidates: EmployerCandidateRankingDTO[];
  comparison?: CandidateCompareDTO;
  selectedIds: [number | null, number | null];
  onSelect: (id: number, slot: 0 | 1) => void;
  loading?: boolean;
}

const CompareTab = ({ candidates, comparison, selectedIds, onSelect, loading }: CompareTabProps) => {
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
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={800} size="lg" style={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
            AI so sánh 2 ứng viên
          </Text>
          <Text size="sm" c="dimmed" fw={500} style={{ lineHeight: 1.5 }}>
            Đặt 2 hồ sơ cạnh nhau để so sánh điểm AI, kỹ năng và mức độ phù hợp.
          </Text>
        </Stack>

        <Group align="stretch" gap="md">
          {[0, 1].map((slotIndex) => {
            const selectedId = selectedIds[slotIndex as 0 | 1];
            const c = candidates.find(cand => cand.applicationId === selectedId);

            return (
              <Card
                key={slotIndex}
                radius="xl"
                padding="md"
                className="flex-1"
                style={{
                  background: "linear-gradient(180deg, #f8fafc 0%, #f0f9ff 100%)",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <Stack gap="sm">
                  {c ? (
                    <>
                      <Group justify="space-between">
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
                            {(c.applicantName || "?").split(" ").map(w => w[0]).join("").slice(-2) || "?"}
                          </Avatar>
                          <div>
                            <Text fw={700} size="sm" style={{ color: "#0f172a" }}>{c.applicantName}</Text>
                            <Text size="xs" c="dimmed" fw={500}>{c.role || "Ứng viên"}</Text>
                          </div>
                        </Group>
                        <Badge
                          size="sm"
                          radius="xl"
                          style={{
                            background: "linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%)",
                            color: "#0e7490",
                            fontWeight: 700,
                            border: "1px solid #67e8f9",
                          }}
                        >
                          {Number(c.matchingScore ?? 0).toFixed(1)}/100
                        </Badge>
                      </Group>
                      <Divider color="#e2e8f0" />
                      <Stack gap={6}>
                        <Text size="xs" fw={700} c="dimmed">Kỹ năng khớp</Text>
                        <Group gap={6} wrap="wrap">
                          {(c.matchedSkills || []).map(t => (
                            <Badge
                              key={t}
                              size="xs"
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
                        </Group>
                        <Text size="xs" fw={700} c="dimmed" mt="xs">Điểm phù hợp tổng thể</Text>
                        <Progress
                          value={c.matchingScore ?? 0}
                          color={getScoreColor(c.matchingScore ?? 0)}
                          radius="xl"
                          size="md"
                        />
                      </Stack>
                    </>
                  ) : (
                    <div
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        background: "rgba(224, 242, 254, 0.5)",
                        borderRadius: 12,
                        border: "2px dashed #bae6fd",
                      }}
                    >
                      <Text fw={600} c="dimmed">Chọn ứng viên</Text>
                    </div>
                  )}

                  <Divider color="#e2e8f0" />
                  <Stack gap={6}>
                    <Text size="xs" fw={700} c="dimmed">Chọn ứng viên</Text>
                    <Group gap={6} wrap="wrap">
                      {(candidates || []).map((other) => (
                        <Button
                          key={other.applicationId}
                          size="xs"
                          radius="lg"
                          variant={other.applicationId === selectedId ? "filled" : "outline"}
                          onClick={() => onSelect(other.applicationId, slotIndex as 0 | 1)}
                          style={
                            other.applicationId === selectedId
                              ? {
                                  background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)",
                                  border: "none",
                                  fontWeight: 700,
                                }
                              : {
                                  borderColor: "#06b6d4",
                                  color: "#0891b2",
                                  fontWeight: 600,
                                }
                          }
                        >
                          {(other.applicantName || "?").split(" ").slice(-1)[0] || "?"}
                        </Button>
                      ))}
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Group>

        {loading ? (
          <Group justify="center" py="xl"><Loader size="sm" color="cyan" /></Group>
        ) : comparison && (
          <Card
            radius="xl"
            padding="md"
            style={{
              background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
              border: "2px solid #67e8f9",
              boxShadow: "0 4px 16px rgba(6, 182, 212, 0.15)",
            }}
          >
            <Stack gap="sm">
              <Text fw={800} size="sm" style={{ color: "#0e7490" }}>
                AI Phân tích đối đầu:
              </Text>
              <Text size="sm" fw={500} style={{ whiteSpace: "pre-line", color: "#334155", lineHeight: 1.6 }}>
                {comparison.summary}
              </Text>
              {comparison.scoreGap > 0 && (
                <Text size="xs" fw={700} c="dimmed">
                  Khoảng cách điểm: {comparison.scoreGap.toFixed(1)}
                </Text>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
};

export default CompareTab;
