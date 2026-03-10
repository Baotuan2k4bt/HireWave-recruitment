import { Link, useParams } from "react-router-dom";
import { IconSparkles } from "@tabler/icons-react";
import { Card, Group, Text } from "@mantine/core";

const timeAgo = (timestamp: string | Date) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInMs = now.getTime() - postDate.getTime();
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  if (days < 1) return "Hôm nay";
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${Math.floor(months / 12)} năm trước`;
};

interface AIJobCardProps {
  id: number;
  jobTitle: string;
  location?: string;
  companyName?: string;
  postTime?: string | Date;
  applicantsCount?: number;
  jobStatus?: string;
}

const AIJobCard = ({ id, jobTitle, location, companyName, postTime, applicantsCount = 0 }: AIJobCardProps) => {
  const { jobId } = useParams<{ jobId: string }>();
  const isActive = String(id) === String(jobId);

  return (
    <Link to={`/ai-features/${id}`} style={{ textDecoration: "none" }}>
      <Card
        withBorder
        radius="xl"
        padding="sm"
        className={`transition-all duration-200 cursor-pointer ${
          isActive
            ? "border-2 border-cyan-500 shadow-lg"
            : "border-slate-200 hover:border-cyan-300 hover:shadow-md"
        }`}
        style={{
          background: isActive
            ? "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)"
            : "white",
          boxShadow: isActive ? "0 8px 24px rgba(6, 182, 212, 0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)"
                : "linear-gradient(135deg, #67e8f9 0%, #5eead4 100%)",
              boxShadow: "0 2px 8px rgba(6, 182, 212, 0.3)",
            }}
          >
            <IconSparkles size={20} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <Text
              fw={700}
              size="sm"
              lineClamp={2}
              style={{ color: "#0f172a", letterSpacing: "-0.01em" }}
            >
              {jobTitle || `Job #${id}`}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1} mt={2} fw={500}>
              {companyName || "Công ty"} {location ? `• ${location}` : ""}
            </Text>
            <Group gap="xs" mt={4}>
              {postTime && (
                <Text size="xs" c="dimmed" fw={500}>
                  {timeAgo(postTime)}
                </Text>
              )}
              <Text
                size="xs"
                fw={600}
                style={{
                  color: applicantsCount > 0 ? "#0891b2" : "#64748b",
                }}
              >
                {applicantsCount > 0 ? `${applicantsCount} ứng viên` : "Chưa có ứng viên"}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
    </Link>
  );
};

export default AIJobCard;
