import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSearchPinsQuery } from "@/services/pinService.ts";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";
import { useGetAllTagsQuery } from "@/services/tagService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import { APP_ENV } from "@/constants/env";
import { SearchX, ChevronDown, X } from "lucide-react";

const SORT_OPTIONS = [
    { label: "Newest",         sortBy: "CreatedAt",     sortDirection: "Desc", color: "#A1A1A1" },
    { label: "Oldest",         sortBy: "CreatedAt",     sortDirection: "Asc",  color: "#A1A1A1" },
    { label: "Most liked",     sortBy: "LikesCount",    sortDirection: "Desc", color: "#e11d48" },
    { label: "Least liked",    sortBy: "LikesCount",    sortDirection: "Asc",  color: "#e11d48" },
    { label: "Most commented", sortBy: "CommentsCount", sortDirection: "Desc", color: "#f59e0b" },
    { label: "A → Z",          sortBy: "Title",         sortDirection: "Asc",  color: "#8b5cf6" },
    { label: "Z → A",          sortBy: "Title",         sortDirection: "Desc", color: "#8b5cf6" },
];

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const categoryId = searchParams.get("categoryId") ?? "";
    const tagIds = searchParams.getAll("tagId");
    const sortIdx = Math.min(Number(searchParams.get("sort") ?? 0), SORT_OPTIONS.length - 1);

    const [tagQuery, setTagQuery] = useState("");
    const [tagFocused, setTagFocused] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
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
                        {q ? `"${q}"` : "All auras"}
                    </h1>
                    {data && !isLoading && (
                        <span className="text-sm text-gray-400">{data.totalCount} result{data.totalCount !== 1 ? "s" : ""}</span>
                    )}
                </div>
                {q && (
                    <button
                        onClick={() => updateParams({ q: null })}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors mt-1"
                    >
                        <X size={12} /> Clear search
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 mb-6">
                <div className="flex flex-wrap items-center gap-2">

                    {/* Category picker */}
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
                            {selectedCategory ? selectedCategory.name : "Category"}
                            <ChevronDown size={12} className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                        </button>
                        {categoryOpen && (
                            <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto w-52">
                                {categoryId && (
                                    <button
                                        onClick={() => { setCategoryId(""); setCategoryOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5"
                                    >
                                        Clear
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

                    {/* Tag picker */}
                    <div className="relative" ref={tagBoxRef}>
                        <input
                            type="text"
                            value={tagQuery}
                            onChange={e => setTagQuery(e.target.value)}
                            onFocus={() => setTagFocused(true)}
                            placeholder="Tags..."
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

                    {/* Selected tags */}
                    {selectedTags.map(tag => (
                        <span key={tag.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4ade80] text-black text-xs font-medium">
                            #{tag.name}
                            <button onClick={() => removeTag(tag.id)} className="hover:opacity-60 transition-opacity ml-0.5">
                                <X size={10} />
                            </button>
                        </span>
                    ))}

                    {/* Clear all */}
                    {hasFilters && (
                        <button
                            onClick={() => setSearchParams({})}
                            className="px-3 py-1.5 rounded-full text-xs text-gray-400 hover:text-black dark:hover:text-white border border-dashed border-gray-300 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/30 transition-all"
                        >
                            Clear all
                        </button>
                    )}

                    {/* Sort */}
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

            {/* Loading */}
            {(isLoading || isFetching) && (
                <div className="flex justify-center py-16">
                    <div className="w-7 h-7 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#4ade80] animate-spin" />
                </div>
            )}

            {/* No results */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                        <SearchX size={28} className="text-gray-300 dark:text-white/20" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-black dark:text-white">No auras found</p>
                        <p className="text-xs text-gray-400 mt-1">Try different keywords or filters</p>
                    </div>
                </div>
            )}

            {/* Grid */}
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
