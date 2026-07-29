import im1 from "../../../src/assets/defaults/def-1.jpg"
import im2 from "../../../src/assets/defaults/def-2.jpg"
import im3 from "../../../src/assets/defaults/def-3.jpg"
import im4 from "../../../src/assets/defaults/def-4.jpg"
import im5 from "../../../src/assets/defaults/def-5.jpg"
import im6 from "../../../src/assets/defaults/def-6.jpg"
import im7 from "../../../src/assets/defaults/def-7.jpg"
import im8 from "../../../src/assets/defaults/def-8.jpg"
import { useAppSelector } from "@/store";
import Modal from "@/components/ui/Modal.tsx";
import RegisterForm from "@/components/auth/RegisterForm.tsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerFast } from "@/lib/motion";

const heroImageVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

const FirstPage = () => {
    const { t } = useTranslation('common');
    const user = useAppSelector((state) => state.auth.user);
    const [activeModal, setActiveModal] = useState<"signup" | null>(null);

    useEffect(() => {
        if (user) setActiveModal(null);
    }, [user]);

    return (
        <div className="scroll-smooth">

            <div className="md:contents flex flex-col min-h-[calc(100vh-72px)]">

                <motion.section
                    className="flex-col flex items-center pt-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={fadeUp}
                        className="lg:text-[64px] text-4xl font-bold top-32 leading-[45px] tracking-normal text-center text-black dark:text-white"
                    >
                        {t('firstPage.hero')}
                    </motion.div>
                    <motion.div
                        variants={fadeUp}
                        className="lg:text-[24px] text-sm top-32 lg:leading-[45px] leading-[20px] lg:pt-6 pt-3 tracking-normal text-center max-w-[1011px] text-[#A1A1A1A1]"
                    >
                        {t('firstPage.heroSub')}
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-8"
                        variants={staggerFast}
                    >
                        {([
                            ['conceptArt', t('firstPage.categories.conceptArt')],
                            ['photography', t('firstPage.categories.photography')],
                            ['nature', t('firstPage.categories.nature')],
                            ['wallpapers', t('firstPage.categories.wallpapers')],
                        ] as [string, string][]).map(([key, label]) => (
                            <motion.a
                                key={key}
                                href={`/aura/search?q=${encodeURIComponent(label)}`}
                                variants={fadeUp}
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 rounded-full bg-[#A2A2A2]/30 dark:bg-[#535353]/40 text-black dark:text-white text-sm font-medium hover:bg-[#1DB954] hover:text-black transition-colors whitespace-nowrap text-center"
                            >
                                {label}
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.section>

                <section className="mt-[40px] flex justify-center md:h-[475px] lg:h-[475px]">

                    <motion.div
                        className="flex md:hidden gap-2 w-full px-4"
                        variants={staggerFast}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.img variants={heroImageVariants} src={im1} className="w-0 flex-1 object-cover rounded-[12px]" style={{ height: "48vw" }} alt="" />
                        <motion.img variants={heroImageVariants} src={im2} className="w-0 flex-1 object-cover rounded-[12px] self-start" style={{ height: "54vw" }} alt="" />
                        <motion.img variants={heroImageVariants} src={im3} className="w-0 flex-1 object-cover rounded-[12px]" style={{ height: "48vw" }} alt="" />
                    </motion.div>

                    <motion.div
                        className="hidden relative lg:block md:block w-full max-w-[1400px]"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.img
                            variants={heroImageVariants}
                            src={im1}
                            className="absolute left-[10%] w-[140px] lg:w-[200px] h-[290px] lg:h-[350px] object-cover rounded-[15px]"
                            alt=""
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                        />
                        <motion.img
                            variants={heroImageVariants}
                            src={im2}
                            className="absolute left-[28%] w-[140px] lg:w-[200px] h-[340px] lg:h-[400px] object-cover rounded-[15px]"
                            alt=""
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                        />
                        <motion.img
                            variants={heroImageVariants}
                            src={im3}
                            className="absolute top-[40px] left-[44%] w-[140px] lg:w-[200px] h-[340px] lg:h-[400px] object-cover rounded-[15px]"
                            alt=""
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                        />
                        <motion.img
                            variants={heroImageVariants}
                            src={im5}
                            className="absolute left-[76%] w-[140px] lg:w-[200px] h-[340px] lg:h-[400px] object-cover rounded-[15px]"
                            alt=""
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                        />
                        <motion.img
                            variants={heroImageVariants}
                            src={im4}
                            className="absolute top-[80px] left-[63%] w-[140px] lg:w-[200px] h-[310px] lg:h-[370px] object-cover rounded-[15px]"
                            alt=""
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                        />
                    </motion.div>
                </section>

                {!user && (
                    <motion.section
                        className="relative w-screen ml-[calc(50%-50vw)] mt-auto md:mt-0"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.35 }}
                    >
                        <a href={"#see-how-it-works"}
                           className="w-full h-[50px] md:h-[70px] bg-btn-primary text-white dark:text-black font-medium text-base md:text-2xl flex items-center justify-center gap-2 whitespace-nowrap">
                            {t('firstPage.seeHowItWorks')}
                            <motion.svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                animate={{ y: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                            >
                                <path d="M6 9l6 6 6-6"/>
                            </motion.svg>
                        </a>
                    </motion.section>
                )}

            </div>


            <section id={"see-how-it-works"} className={"min-h-screen flex items-center"}>

                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 text-white w-full"}>

                    <motion.div
                        className="flex lg:hidden gap-2 w-full px-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerFast}
                    >
                        <motion.img variants={heroImageVariants} src={im6} className="w-0 flex-1 object-cover rounded-[12px]" style={{ height: "48vw" }} alt="" />
                        <motion.img variants={heroImageVariants} src={im7} className="w-0 flex-1 object-cover rounded-[12px] self-start" style={{ height: "54vw" }} alt="" />
                        <motion.img variants={heroImageVariants} src={im8} className="w-0 flex-1 object-cover rounded-[12px]" style={{ height: "48vw" }} alt="" />
                    </motion.div>

                    <motion.section
                        className="hidden lg:flex justify-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                    >
                        <div className="relative w-full max-w-[700px] h-[500px]">
                            <motion.img variants={heroImageVariants} src={im6} className="absolute top-[4%] left-[23%] w-[150px] h-[150px] object-cover rounded-[15px]" alt="" />
                            <motion.img variants={heroImageVariants} src={im7} className="absolute left-[55%] w-[300px] h-[300px] object-cover rounded-[15px]" alt="" />
                            <motion.img variants={heroImageVariants} src={im8} className="absolute top-[55%] left-[65%] w-[200px] h-[200px] object-cover rounded-[15px]" alt="" />
                            <motion.img variants={heroImageVariants} src={im5} className="absolute top-18 left-[40%] w-[300px] h-[400px] object-cover rounded-[15px]" alt="" />
                        </div>
                    </motion.section>

                    <motion.section
                        className="flex flex-col items-center text-black dark:text-white"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="font-bold leading-[45px] mt-16 tracking-[-0.5px] lg:text-[64px] text-4xl">
                            {t('firstPage.findYourIdeas')}
                        </motion.div>

                        <motion.p variants={fadeUp} className="leading-[45px] max-w-[493px] mt-16 text-center tracking-[-0.5px] lg:text-[32px] text-xl text-black dark:text-white">
                            {t('firstPage.findDescription')}
                        </motion.p>

                        <motion.button
                            variants={fadeUp}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveModal("signup")}
                            className="w-[200px] h-[50px] rounded-[10px] mt-16 text-center text-[20px] bg-btn-primary hover:bg-btn-dark text-white dark:text-black"
                        >
                            {t('firstPage.review')}
                        </motion.button>
                    </motion.section>

                </div>
            </section>

            {!user && (
                <Modal
                    isOpen={activeModal === "signup"}
                    onClose={() => setActiveModal(null)}
                    width={450}
                    height="auto"
                    borderRadius={20}
                >
                    <RegisterForm onSuccess={() => setActiveModal(null)}/>
                </Modal>
            )}

        </div>
    )
}

export default FirstPage;
