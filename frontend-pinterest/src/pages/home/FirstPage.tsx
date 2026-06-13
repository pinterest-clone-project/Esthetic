import im1 from "../../../src/assets/defaults/def-1.jpg"
import im2 from "../../../src/assets/defaults/def-2.jpg"
import im3 from "../../../src/assets/defaults/def-3.jpg"
import im4 from "../../../src/assets/defaults/def-4.jpg"
import im5 from "../../../src/assets/defaults/def-5.jpg"
import im6 from "../../../src/assets/defaults/def-6.jpg"
import im7 from "../../../src/assets/defaults/def-7.jpg"
import im8 from "../../../src/assets/defaults/def-8.jpg"
import {useAppSelector} from "@/store";

const FirstPage = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="scroll-smooth">

            <section className={"flex-col flex items-center pt-8"}>
                <div className={"lg:text-[64px] text-4xl font-bold top-32 leading-[45px] tracking-normal text-center text-white "}>
                    Explore new ideas & inspirations</div>
                <div className={"lg:text-[24px] text-sm top-32 lg:leading-[45px] leading-[20px] lg:pt-6 pt-3 tracking-normal text-center max-w-[1011px] text-[#A1A1A1A1] "}>
                    Discover and save your favourites from around the web</div>

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

            <section className="mt-[60px] flex justify-center h-[470px] lg:h-[475px] md:h-[475px]">
                <div className="hidden relative lg:block md:block w-full max-w-[1400px]">

                    <img
                        src={im1}
                        className="absolute left-[10%] w-[140px] lg:w-[200px] h-[290px] lg:h-[350px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im2}
                        className="absolute left-[28%] w-[140px] lg:w-[200px] h-[340px] lg:h-[400px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im3}
                        className="absolute top-[40px] left-[44%] w-[140px] lg:w-[200px] h-[340px] lg:h-[400px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im5}
                        className="absolute left-[76%] w-[140px] lg:w-[200px] h-[340px] lg:h-[400px] object-cover rounded-[15px]"
                    />

                    <img
                        src={im4}
                        className="absolute top-[80px] left-[63%] w-[140px] lg:w-[200px] h-[310px] lg:h-[370px] object-cover rounded-[15px]"
                    />

                </div>
            </section>

            {!user && (
            <section className="relative w-screen ml-[calc(50%-50vw)]">
                <a href={"#see-how-it-works"} className="w-full h-[70px] bg-btn-primary text-black font-medium text-2xl flex items-center justify-center gap-2 ">
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
            )}


            <section id={"see-how-it-works"} className={"min-h-screen flex items-center"}>

                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 text-white w-full"}>

                    <section className=" hidden md:hidden lg:flex justify-center">
                        <div className="relative w-full max-w-[700px] h-[600px]">

                            <img src={im6} className="absolute top-[4%] left-[23%] w-[150px] h-[150px] object-cover rounded-[15px]" />
                            <img src={im7} className="absolute left-[55%] w-[300px] h-[300px] object-cover rounded-[15px]" />
                            <img src={im8} className="absolute top-[55%] left-[65%] w-[200px] h-[200px] object-cover rounded-[15px]" />
                            <img src={im5} className="absolute top-18 left-[40%] w-[300px] h-[400px] object-cover rounded-[15px]" />
                        </div>
                    </section>

                    <section className={"flex flex-col items-center text-white"}>
                        <div className={"font-bold leading-[45px] mt-16 tracking-[-0.5px] lg:text-[64px] text-4xl"}>
                            Find your Ideas
                        </div>

                        <p className={"leading-[45px] max-w-[493px] mt-16 text-center tracking-[-0.5px] lg:text-[32px] text-xl"}>
                            What else would you like to try?
                            Type in a search term for a topic you're interested in, like "Nature,"
                            and browse the results
                        </p>

                        <a
                            href={"review"}
                            className={"w-[200px] h-[50px] rounded-[10px] mt-16 text-center pt-2 text-[20px] bg-btn-primary hover:bg-btn-dark text-black"}
                        >
                            Review
                        </a>
                    </section>

                </div>

            </section>

        </div>
    )
}

export default FirstPage;