import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSearchPinsQuery } from "@/services/pinService.ts";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";
import { useGetAllTagsQuery } from "@/services/tagService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import { APP_ENV } from "@/constants/env";

const SORT_OPTIONS = [
    { label: "Newest", sortBy: "CreatedAt", sortDirection: "Desc" },
    { label: "Oldest", sortBy: "CreatedAt", sortDirection: "Asc" },
    { label: "Most liked", sortBy: "LikesCount", sortDirection: "Desc" },
    { label: "Least liked", sortBy: "LikesCount", sortDirection: "Asc" },
];

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") ?? "";

    const [categoryId, setCategoryId] = useState<string>("");
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [sortIdx, setSortIdx] = useState(0);
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
    }, { skip: !q && !categoryId && tagIds.length === 0 });

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
    const showResults = !q && !categoryId && tagIds.length === 0;

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-6 py-8">

            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-3 mb-8 max-w-5xl mx-auto">

                {/* Active search term */}
                {q && (
                    <div className="flex items-center gap-2">
                        <span className="text-black dark:text-white text-sm font-semibold">"{q}"</span>
                        <button
                            onClick={() => setSearchParams({})}
                            className="text-gray-400 hover:text-black dark:hover:text-white text-xs transition-colors"
                        >✕</button>
                    </div>
                )}

                {/* Category picker */}
                <div className="relative" ref={categoryBoxRef}>
                    <button
                        onClick={() => setCategoryOpen(p => !p)}
                        className={`flex items-center gap-2 px-3 h-8 rounded-full text-xs border transition-colors
                            ${categoryId
                                ? "bg-[#4ade80] text-black border-[#4ade80]"
                                : "bg-white dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30"
                            }`}
                    >
                        {selectedCategory?.image && (
                            <img src={`${APP_ENV.IMAGES_100_URL}${selectedCategory.image}`} alt="" className="w-4 h-4 rounded-full object-cover" />
                        )}
                        {selectedCategory ? selectedCategory.name : "Category"}
                        <svg className={`w-3 h-3 transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {categoryOpen && (
                        <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto w-52">
                            {categoryId && (
                                <button
                                    onClick={() => { setCategoryId(""); setCategoryOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5"
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
                                        <div className="w-5 h-5 rounded-full bg-white/10 shrink-0" />
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
                        className="h-8 px-3 rounded-full text-xs border bg-white dark:bg-white/5 text-black dark:text-white border-gray-200 dark:border-white/10 outline-none focus:border-[#4ade80] transition-colors w-32"
                    />
                    {tagFocused && tagSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto w-44">
                            {tagSuggestions.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => { setTagIds(p => [...p, tag.id]); setTagQuery(""); }}
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
                    <span key={tag.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4ade80] text-black text-xs font-medium">
                        #{tag.name}
                        <button onClick={() => setTagIds(p => p.filter(id => id !== tag.id))} className="hover:opacity-60 transition-opacity">✕</button>
                    </span>
                ))}

                {/* Sort */}
                <div className="ml-auto flex items-center gap-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full p-0.5">
                    {SORT_OPTIONS.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setSortIdx(i)}
                            className={`px-3 h-7 rounded-full text-xs transition-colors
                                ${sortIdx === i
                                    ? "bg-[#4ade80] text-black font-semibold"
                                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            {data && (
                <p className="text-gray-500 text-xs mb-5 max-w-5xl mx-auto">
                    {data.totalCount} result{data.totalCount !== 1 ? "s" : ""}
                </p>
            )}

            {/* Loading */}
            {(isLoading || isFetching) && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                </div>
            )}

            {/* Empty prompt */}
            {showResults && !isLoading && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <span className="text-4xl">🔍</span>
                    <p className="text-gray-400 text-sm">Search for auras, tags, or categories</p>
                </div>
            )}

            {/* No results */}
            {isEmpty && !showResults && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <span className="text-4xl">😶</span>
                    <p className="text-gray-400 text-sm">No auras found</p>
                </div>
            )}

            {/* Grid */}
            {!isLoading && !isFetching && pins.length > 0 && (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 max-w-7xl mx-auto">
                    {pins.map(p => (
                        <PinCard key={p.id} pin={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
