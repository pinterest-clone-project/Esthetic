import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSearchPinsQuery } from "@/services/pinService.ts";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";
import { useGetAllTagsQuery } from "@/services/tagService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import { APP_ENV } from "@/constants/env";
import { SearchX, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

const SearchPage = () => {
    const { t } = useTranslation('pins');

    const SORT_OPTIONS = [
        { label: t('search.sort.newest'),        sortBy: "CreatedAt",     sortDirection: "Desc", color: "#A1A1A1" },
        { label: t('search.sort.oldest'),        sortBy: "CreatedAt",     sortDirection: "Asc",  color: "#A1A1A1" },
        { label: t('search.sort.mostLiked'),     sortBy: "LikesCount",    sortDirection: "Desc", color: "#e11d48" },
        { label: t('search.sort.leastLiked'),    sortBy: "LikesCount",    sortDirection: "Asc",  color: "#e11d48" },
        { label: t('search.sort.mostCommented'), sortBy: "CommentsCount", sortDirection: "Desc", color: "#f59e0b" },
        { label: t('search.sort.aToZ'),          sortBy: "Title",         sortDirection: "Asc",  color: "#8b5cf6" },
        { label: t('search.sort.zToA'),          sortBy: "Title",         sortDirection: "Desc", color: "#8b5cf6" },
    ];

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const categoryId = searchParams.get("categoryId") ?? "";
    const tagIds = searchParams.getAll("tagId");
    const sortIdx = Math.min(Number(searchParams.get("sort") ?? 0), SORT_OPTIONS.length - 1);

    const [tagQuery, setTagQuery] = useState("");
    const [tagFocused, setTagFocused] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const tagBoxRef = useRef<HTMLDivElement>(null);
    const categoryBoxRef = useRef<HTMLDivElement>(null);

    const { data: categories } = useGetAllCategoriesQuery();
    const { data: tags } = useGetAllTagsQuery();

    const sort = SORT_OPTIONS[sortIdx];

    const { data, isLoading, isFetching } = useSearchPinsQuery({
        search: q || undefined,
        categoryId: categoryId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sortBy: sort.sortBy as any,
        sortDirection: sort.sortDirection as any,
        pageSize: 40,
    });

    const updateParams = (updates: Record<string, string | string[] | null>) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            for (const [key, value] of Object.entries(updates)) {
                next.delete(key);
                if (value === null) continue;
                if (Array.isArray(value)) {
                    value.forEach(v => next.append(key, v));
                } else if (value) {
                    next.set(key, value);
                }
            }
            return next;
        });
    };

    const setCategoryId = (id: string) => updateParams({ categoryId: id || null });
    const setSortIdx = (idx: number) => updateParams({ sort: idx === 0 ? null : String(idx) });
    const addTag = (id: string) => updateParams({ tagId: [...tagIds, id] });
    const removeTag = (id: string) => updateParams({ tagId: tagIds.filter(t => t !== id) });

    const selectedTags = useMemo(
        () => tags?.filter(t => tagIds.includes(t.id)) ?? [],
        [tags, tagIds]
    );

    const tagSuggestions = useMemo(() => {
        if (!tags) return [];
        const s = tagQuery.trim().toLowerCase();
        return tags
            .filter(t => !tagIds.includes(t.id))
            .filter(t => !s || t.name.toLowerCase().includes(s))
            .slice(0, 8);
    }, [tags, tagIds, tagQuery]);

    const selectedCategory = categories?.find(c => c.id === categoryId);
    const hasFilters = !!(q || categoryId || tagIds.length > 0);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (tagBoxRef.current && !tagBoxRef.current.contains(e.target as Node))
                setTagFocused(false);
            if (categoryBoxRef.current && !categoryBoxRef.current.contains(e.target as Node))
                setCategoryOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const pins = data?.items ?? [];
    const isEmpty = !isLoading && !isFetching && pins.length === 0;

    return (
        <div className="w-full min-h-full bg-white dark:bg-black">

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
                <div className="flex items-baseline gap-3 mb-1">
                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        {q ? `"${q}"` : t('search.allAuras')}
                    </h1>
                    {data && !isLoading && (
                        <span className="text-sm text-gray-400">
                            {data.totalCount !== 1 ? t('search.results_plural', { count: data.totalCount }) : t('search.results', { count: data.totalCount })}
                        </span>
                    )}
                </div>
                {q && (
                    <button
                        onClick={() => updateParams({ q: null })}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors mt-1"
                    >
                        <X size={12} /> {t('search.clearSearch')}
                    </button>
                )}
            </div>


            <div className="md:hidden max-w-7xl mx-auto px-6 mb-4">
                <button
                    onClick={() => setFiltersOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-white/70 border-gray-200 dark:border-white/10"
                >
                    <SlidersHorizontal size={13} />
                    {t('search.filters')}
                    {(categoryId || tagIds.length > 0 || sortIdx !== 0) && (
                        <span className="w-4 h-4 rounded-full bg-[#4ade80] text-black text-[10px] font-bold flex items-center justify-center">
                            {[categoryId ? 1 : 0, tagIds.length, sortIdx !== 0 ? 1 : 0].reduce((a, b) => a + b, 0)}
                        </span>
                    )}
                </button>
            </div>


            <div className="hidden md:block max-w-7xl mx-auto px-6 mb-6">
                <div className="flex flex-wrap items-center gap-2">


                    <div className="relative" ref={categoryBoxRef}>
                        <button
                            onClick={() => setCategoryOpen(p => !p)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                                ${categoryId
                                    ? "bg-[#4ade80] text-black border-[#4ade80]"
                                    : "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-white/70 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/15"
                                }`}
                        >
                            {selectedCategory?.image && (
                                <img src={`${APP_ENV.IMAGES_100_URL}${selectedCategory.image}`} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                            )}
                            {selectedCategory ? selectedCategory.name : t('search.category')}
                            <ChevronDown size={12} className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                        </button>
                        {categoryOpen && (
                            <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto w-52">
                                {categoryId && (
                                    <button
                                        onClick={() => { setCategoryId(""); setCategoryOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5"
                                    >
                                        {t('search.clearAll')}
                                    </button>
                                )}
                                {categories?.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setCategoryId(cat.id); setCategoryOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors
                                            ${cat.id === categoryId
                                                ? "bg-[#4ade80]/10 text-[#4ade80]"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        {cat.image ? (
                                            <img src={`${APP_ENV.IMAGES_100_URL}${cat.image}`} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 shrink-0" />
                                        )}
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="relative" ref={tagBoxRef}>
                        <input
                            type="text"
                            value={tagQuery}
                            onChange={e => setTagQuery(e.target.value)}
                            onFocus={() => setTagFocused(true)}
                            placeholder={t('search.tagsPlaceholder')}
                            className="h-[30px] px-3 rounded-full text-xs border bg-gray-100 dark:bg-white/8 text-black dark:text-white placeholder-gray-500 dark:placeholder-white/40 border-gray-200 dark:border-white/10 outline-none focus:border-[#4ade80] focus:bg-white dark:focus:bg-white/12 transition-all w-28"
                        />
                        {tagFocused && tagSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto w-44">
                                {tagSuggestions.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() => { addTag(tag.id); setTagQuery(""); }}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    {selectedTags.map(tag => (
                        <span key={tag.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4ade80] text-black text-xs font-medium">
                            #{tag.name}
                            <button onClick={() => removeTag(tag.id)} className="hover:opacity-60 transition-opacity ml-0.5">
                                <X size={10} />
                            </button>
                        </span>
                    ))}


                    {hasFilters && (
                        <button
                            onClick={() => setSearchParams({})}
                            className="px-3 py-1.5 rounded-full text-xs text-gray-400 hover:text-black dark:hover:text-white border border-dashed border-gray-300 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/30 transition-all"
                        >
                            {t('search.clearAll')}
                        </button>
                    )}


                    <div className="relative ml-auto">
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {SORT_OPTIONS.map((opt, i) => {
                                const isActive = sortIdx === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSortIdx(i)}
                                        className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border"
                                        style={{
                                            background: isActive ? opt.color : "transparent",
                                            color: isActive ? (opt.color === "#A1A1A1" ? "#fff" : "#000") : "#A1A1A1",
                                            borderColor: isActive ? opt.color : "#e8e8e8",
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>


            {filtersOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
                    <div className="relative bg-white dark:bg-[#111] rounded-t-2xl flex flex-col max-h-[85dvh]">
                    <div className="px-5 pt-2 pb-4 flex flex-col gap-4 overflow-y-auto flex-1">
                        {/* Handle */}
                        <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20 mx-auto" />

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-black dark:text-white">{t('search.filters')}</span>
                            {(categoryId || tagIds.length > 0 || sortIdx !== 0) && (
                                <button
                                    onClick={() => { setSearchParams({}); }}
                                    className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {t('search.clearAll')}
                                </button>
                            )}
                        </div>


                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('search.category')}</span>
                            <div className="flex flex-wrap gap-2">
                                {categories?.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategoryId(cat.id === categoryId ? "" : cat.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                            ${cat.id === categoryId
                                                ? "bg-[#4ade80] text-black border-[#4ade80]"
                                                : "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10"
                                            }`}
                                    >
                                        {cat.image && <img src={`${APP_ENV.IMAGES_100_URL}${cat.image}`} alt="" className="w-4 h-4 rounded-full object-cover" />}
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('search.tags')}</span>
                            <input
                                type="text"
                                value={tagQuery}
                                onChange={e => setTagQuery(e.target.value)}
                                placeholder={t('search.searchTagsPlaceholder')}
                                className="w-full h-9 px-3 rounded-xl text-xs border bg-gray-100 dark:bg-white/8 text-black dark:text-white placeholder-gray-400 border-gray-200 dark:border-white/10 outline-none focus:border-[#4ade80] transition-all"
                            />
                            {tagSuggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tagSuggestions.map(tag => (
                                        <button
                                            key={tag.id}
                                            onClick={() => { addTag(tag.id); setTagQuery(""); }}
                                            className="px-3 py-1.5 rounded-full text-xs border bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10"
                                        >
                                            #{tag.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map(tag => (
                                        <span key={tag.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4ade80] text-black text-xs font-medium">
                                            #{tag.name}
                                            <button onClick={() => removeTag(tag.id)} className="hover:opacity-60 transition-opacity">
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('search.sortBy')}</span>
                            <div className="flex flex-wrap gap-2">
                                {SORT_OPTIONS.map((opt, i) => {
                                    const isActive = sortIdx === i;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSortIdx(i)}
                                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                                            style={{
                                                background: isActive ? opt.color : "transparent",
                                                color: isActive ? (opt.color === "#A1A1A1" ? "#fff" : "#000") : "#6b7280",
                                                borderColor: isActive ? opt.color : "#e5e7eb",
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                        <div className="px-5 pb-20 pt-3 border-t border-gray-100 dark:border-white/10 shrink-0">
                            <button
                                onClick={() => setFiltersOpen(false)}
                                className="w-full py-3 rounded-xl bg-[#4ade80] text-black text-sm font-semibold"
                            >
                                {t('search.apply')}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {(isLoading || isFetching) && (
                <div className="flex justify-center py-16">
                    <div className="w-7 h-7 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#4ade80] animate-spin" />
                </div>
            )}


            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                        <SearchX size={28} className="text-gray-300 dark:text-white/20" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-black dark:text-white">{t('search.noAurasFound')}</p>
                        <p className="text-xs text-gray-400 mt-1">{t('search.tryDifferent')}</p>
                    </div>
                </div>
            )}


            {!isLoading && !isFetching && pins.length > 0 && (
                <div className="px-6 pb-8">
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 max-w-7xl mx-auto">
                        {pins.map(p => (
                            <PinCard key={p.id} pin={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
