import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router";
import { pageTransition } from "@/lib/motion";

const PageTransition = () => {
    const location = useLocation();
    const outlet = useOutlet();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageTransition}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-full"
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
