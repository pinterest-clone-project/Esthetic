const FirstPage = () =>{
    return (
        <div>
        <section className={"flex-col flex items-center pt-12"}>
            <div className={"lg:text-[64px] text-4xl font-bold top-32 leading-[45px] tracking-normal text-center text-white "}>
                Explore new ideas & inspirations</div>
            <div className={"lg:text-[24px] text-sm top-32 lg:leading-[45px] leading-[20px] lg:pt-6 pt-3 tracking-normal text-center max-w-[1011px] text-[#A1A1A1A1] "}>
                Discover and save your favourites from around the web</div>

            {/* Categories */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                {["Concept Art", "Photography", "Nature", "Wallpapers"].map(
                    (category) => (
                        <button
                            key={category}
                            className="bg-[#535353] lg:text-sm text-[11px] px-8 py-2 rounded-[5px] max-w-[200px] max-h-[35px] text-white hover:bg-[#666] hover:cursor-pointer"
                        >
                            {category}
                        </button>
                    )
                )}
            </div>
        </section>

        </div>
    )
}
export default FirstPage;