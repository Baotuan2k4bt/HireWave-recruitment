import { useEffect, useState } from "react";
import { DevToArticle, getInterviewArticles } from "../Services/CareerService";
import ArticleCard from "../Components/Career/ArticleCard";
import { Loader } from "@mantine/core";

const CareerInterviewPage = () => {
    const [articles, setArticles] = useState<DevToArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getInterviewArticles(1, 12)
            .then((data) => setArticles(data))
            .catch(() => setError("Không tải được bài viết phỏng vấn. Vui lòng thử lại sau."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-[90vh] bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Phỏng vấn
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Kinh nghiệm trả lời phỏng vấn, xử lý câu hỏi khó và tạo ấn tượng với nhà tuyển dụng.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader color="teal" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10 text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerInterviewPage;

