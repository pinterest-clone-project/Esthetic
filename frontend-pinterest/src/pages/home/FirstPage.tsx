const FirstPage = () =>{
    return (
        <div>
        <section className={"flex-col flex items-center pt-12"}>
            <div className={"lg:text-[64px] text-4xl font-bold top-32 leading-[45px] tracking-normal text-center text-white "}>
                Explore new ideas & inspirations</div>
            <div className={"lg:text-[24px] text-xl top-32 leading-[45px] lg:pt-6 pt-3 tracking-normal text-center max-w-[1011px] text-[#A1A1A1A1] "}>
                Discover and save your favourites from around the web</div>

            {/* Categories */}
            <div className="flex gap-3 mt-8">
                {["Concept Art", "Photography", "Nature", "Wallpapers"].map(
                    (category) => (
                        <button
                            key={category}
                            className="bg-[#535353] px-8 py-2 rounded-[5px] w-[200px] h-[35px] text-white text-sm hover:bg-[#666] hover:cursor-pointer"
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