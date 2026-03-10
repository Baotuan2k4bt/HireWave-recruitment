import { Badge, Button, Card, Group, Progress, Stack, Text, Avatar, Tooltip, Divider } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { EmployerCandidateRankingDTO } from "../../../Services/MatchingService";
import { getScoreColor } from "./RankingTab";

interface ShortlistTabProps {
  topCandidates: EmployerCandidateRankingDTO[];
  onRunAutoShortlist: () => void;
  loading?: boolean;
}

const ShortlistTab = ({ topCandidates, onRunAutoShortlist, loading }: ShortlistTabProps) => {
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
            AI đề xuất Top ứng viên
          </Text>
          <Text size="sm" c="dimmed" fw={500} style={{ lineHeight: 1.5 }}>
            Hệ thống tự động chọn ra những ứng viên nổi bật nhất cho Job này,
            giúp rút ngắn bước lọc CV thủ công.
          </Text>
        </Stack>
        <Button
          leftSection={<IconSparkles size={18} />}
          size="md"
          radius="xl"
          onClick={onRunAutoShortlist}
          loading={loading}
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)",
            color: "white",
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
            border: "none",
          }}
        >
          Chạy Auto Shortlist
        </Button>
      </Group>

      <Divider my="md" color="#e2e8f0" />

      <Stack gap="md">
        {topCandidates.length > 0 ? (
          topCandidates.map((c, index) => (
            <Card
              key={c.applicationId}
              radius="xl"
              padding="md"
              style={{
                background: index === 0 ? "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)" : "white",
                border: index === 0 ? "2px solid #22d3ee" : "1px solid #e2e8f0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              className="hover:shadow-lg transition-shadow"
            >
              <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                  <Avatar
                    radius="xl"
                    size="lg"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {(c.applicantName || "?")
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(-2) || "?"}
                  </Avatar>
                  <Stack gap={2}>
                    <Group gap={8}>
                      <Text fw={700} size="md" style={{ color: "#0f172a" }}>{c.applicantName}</Text>
                      <Badge
                        size="sm"
                        radius="md"
                        style={{
                          background: index === 0
                            ? "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)"
                            : "#e0f2fe",
                          color: index === 0 ? "white" : "#0369a1",
                          fontWeight: 700,
                        }}
                      >
                        Top {index + 1}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {c.role || "Ứng viên"}
                    </Text>
                    <Group gap={6} wrap="wrap">
                      {(c.matchedSkills || []).map((t) => (
                        <Badge
                          key={t}
                          size="xs"
                          variant="light"
                          color="gray"
                          radius="xl"
                        >
                          {t}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Group>
                <Stack gap={6} align="flex-end">
                  <Text size="sm" fw={700} style={{ color: "#0e7490" }}>
                    Điểm AI: {Number(c.matchingScore ?? 0).toFixed(1)}/100
                  </Text>
                  <Progress
                    value={c.matchingScore ?? 0}
                    color={getScoreColor(c.matchingScore ?? 0)}
                    radius="xl"
                    size="md"
                    w={180}
                  />
                  <Tooltip label="Đưa vào danh sách phỏng vấn">
                    <Button
                      size="sm"
                      radius="lg"
                      variant="outline"
                      style={{
                        borderColor: "#06b6d4",
                        color: "#0891b2",
                        fontWeight: 600,
                      }}
                    >
                      Thêm vào shortlist
                    </Button>
                  </Tooltip>
                </Stack>
              </Group>
            </Card>
          ))
        ) : (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: "linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%)",
              borderRadius: 16,
              border: "2px dashed #67e8f9",
            }}
          >
            <Text fw={600} size="md" c="dimmed">
              Bấm nút để chạy AI đề xuất ứng viên
            </Text>
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default ShortlistTab;
