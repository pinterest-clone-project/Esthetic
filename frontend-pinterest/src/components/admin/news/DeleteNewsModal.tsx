import { useTranslation } from "react-i18next";
import { useDeleteNewsMutation } from "@/services/newsService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { INews } from "@/types/news/INews";

interface DeleteNewsModalProps {
    news: INews;
    onClose: () => void;
}

const getApiErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "";
};

const DeleteNewsModal = ({ news, onClose }: DeleteNewsModalProps) => {
    const { t, i18n } = useTranslation('admin');
    const [deleteNews, { isLoading }] = useDeleteNewsMutation();
    const { showToast } = useToast();
    const title = i18n.language === 'uk' ? news.titleUk : news.titleEn;

    const handleDelete = async () => {
        try {
            await deleteNews(news.id).unwrap();
            showToast(t('toast.newsDeleted'), "success");
            onClose();
        } catch (err) {
            showToast(getApiErrorMessage(err) || t('news.formModal.error'), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-2">{t('news.deleteModal.title')}</h2>
                <p className="text-sm text-white/50 mb-4">
                    {t('news.deleteModal.desc', { title })}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-2xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors"
                    >
                        {t('news.deleteModal.cancel')}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-2xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    >
                        {t('news.deleteModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteNewsModal;
