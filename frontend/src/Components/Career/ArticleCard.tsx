import { DevToArticle } from "../../Services/CareerService";
import { IconClockHour3, IconHeart } from "@tabler/icons-react";

interface ArticleCardProps {
    article: DevToArticle;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
    const publishedAt = article.readable_publish_date || "";

    return (
        <a
            href={article.url || article.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Cover image */}
            <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden bg-gray-100">
                {article.cover_image || article.social_image ? (
                    <img
                        src={article.cover_image || article.social_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-500">
                        HireWave
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-oceanTeal-600">
                    {article.title}
                </h3>
                {article.description && (
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                        {article.description}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 text-xs text-gray-500 pt-1">
                    <span className="inline-flex items-center gap-1">
                        <IconClockHour3 size={14} className="text-gray-400" />
                        {publishedAt}
                    </span>
                    {typeof article.positive_reactions_count === "number" && (
                        <span className="inline-flex items-center gap-1">
                            <IconHeart size={14} className="text-rose-400" />
                            {article.positive_reactions_count}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
};

export default ArticleCard;
