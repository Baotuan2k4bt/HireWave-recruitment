import { useEffect, useMemo, useState } from "react";
import { Badge, Input, Loader, Skeleton } from "@mantine/core";
import { IconSearch, IconExternalLink, IconCalendar } from "@tabler/icons-react";
import { getVnJobNews, PagedResponse, VnJobNews } from "../Services/CareerService";
import { Link, useLocation } from "react-router-dom";

const CareerNewsPage = () => {
  const [news, setNews] = useState<VnJobNews[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const location = useLocation();

  const fetchData = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const res: PagedResponse<VnJobNews> = await getVnJobNews(currentPage, size);
      setNews(res.items || []);
      setHasMore(res.hasMore);
    } catch {
      setError("Không tải được tin tức việc làm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const stripHtml = (html: string) => (html ? html.replace(/<[^>]+>/g, "").trim() : "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return news;
    return news.filter((n) => {
      const t = (n.title || "").toLowerCase();
      const d = stripHtml(n.description || "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  }, [news, query]);

  const handlePrev = () => page > 1 && !loading && setPage((p) => p - 1);
  const handleNext = () => hasMore && !loading && setPage((p) => p + 1);

  const Tab = ({
    to,
    label,
    active,
  }: {
    to: string;
    label: string;
    active: boolean;
  }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
        active
          ? "bg-teal-500 text-white border-teal-500"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-[90vh] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-3">
          <span className="hover:text-gray-700">Cẩm nang nghề nghiệp</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Tin tức việc làm</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tin tức việc làm</h1>
            <p className="text-gray-600 mt-2">
              Tổng hợp tiêu đề & mô tả ngắn từ nguồn RSS chính thức •{" "}
              <span className="font-medium">VnExpress</span>
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-[360px]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              placeholder="Tìm theo tiêu đề hoặc mô tả..."
              leftSection={<IconSearch size={16} />}
              radius="md"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Tab to="/career-guide/news" label="Tin tức việc làm" active={location.pathname.includes("/news")} />
          <Tab to="/career-guide/tips" label="Bí kíp việc làm" active={location.pathname.includes("/tips")} />
          <Tab to="/career-guide/interview" label="Phỏng vấn" active={location.pathname.includes("/interview")} />
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <Skeleton height={14} radius="xl" />
                <Skeleton height={10} mt={10} width="80%" radius="xl" />
                <Skeleton height={10} mt={8} width="70%" radius="xl" />
                <div className="mt-3 flex items-center gap-2">
                  <Skeleton height={22} width={90} radius="xl" />
                  <Skeleton height={10} width={120} radius="xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            Không có tin phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {stripHtml(item.description)}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <Badge variant="light" color="teal" radius="xl">
                        {item.source || "VnExpress"}
                      </Badge>

                      <span className="inline-flex items-center gap-1">
                        <IconCalendar size={14} />
                        {item.pubDate || "—"}
                      </span>

                      <span className="inline-flex items-center gap-1 ml-auto text-teal-600 font-medium">
                        Đọc bài gốc <IconExternalLink size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              page === 1 || loading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Trang trước
          </button>

          <span className="text-sm text-gray-600">
            Trang <b>{page}</b>
          </span>

          <button
            onClick={handleNext}
            disabled={!hasMore || loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              !hasMore || loading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-teal-500 text-white border-teal-500 hover:bg-teal-600"
            }`}
          >
            Trang sau
          </button>
        </div>

        {/* Hint */}
        {!loading && !error && (
          <div className="mt-6 text-center text-xs text-gray-500">
            * Trang này chỉ hiển thị tiêu đề & mô tả ngắn và dẫn về bài gốc để tôn trọng bản quyền.
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerNewsPage;