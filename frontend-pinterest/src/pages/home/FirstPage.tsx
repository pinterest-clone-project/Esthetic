import im1 from "../../../src/assets/defaults/def-1.jpg"
import im2 from "../../../src/assets/defaults/def-2.jpg"
import im3 from "../../../src/assets/defaults/def-3.jpg"
import im4 from "../../../src/assets/defaults/def-4.jpg"
import im5 from "../../../src/assets/defaults/def-5.jpg"
import im6 from "../../../src/assets/defaults/def-6.jpg"
import im7 from "../../../src/assets/defaults/def-7.jpg"
import im8 from "../../../src/assets/defaults/def-8.jpg"

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
                            className="bg-[#535353] lg:text-sm text-[11px] px-8 py-2 rounded-[5px] lg:min-w-[200px] md:min-w-[190px] min-w-[130px] lg:min-h-[35px] min-h-[27px] text-white hover:bg-[#666] hover:cursor-pointer"
                        >
                            {category}
                        </button>
                    )
                )}
            </div>
        </section>

            {/* Gallery */}
            <section className="mt-[70px] flex justify-center">
                <div className="relative w-[1400px] h-[500px] overflow-hidden">

                    <img
                        src={im1}
                        className="absolute left-[145px]  w-[200px] h-[350px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im2}
                        className="absolute left-[390px] w-[200px] h-[400px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im3}
                        className="absolute top-[40px] left-[623px] w-[200px] h-[400px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im5}
                        className="absolute left-[1061px]  w-[200px] h-[400px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im4}
                        className="absolute top-[80px] left-[876px] w-[200px] h-[370px] object-cover rounded-[15px]"
                    />

                </div>
            </section>

            <section className="-mx-[calc((100vw-1505px)/2)]">
                <a href={"#see-how-it-works"} className="w-screen h-[70px] bg-btn-primary text-black font-medium text-2xl flex items-center justify-center gap-2 ">
                    See how it works
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </a>
            </section>

            <section id={"see-how-it-works"} className={"h-full"}>
                <div>hello</div>
            </section>

        </div>
    )
}
export default FirstPage;