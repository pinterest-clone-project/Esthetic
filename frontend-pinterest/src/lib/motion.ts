import type { Transition, Variants } from "framer-motion";

export const easeOutSoft: Transition = {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1],
};

export const easeOutQuick: Transition = {
    duration: 0.22,
    ease: [0.22, 1, 0.36, 1],
};

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: easeOutSoft },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: easeOutSoft },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: easeOutSoft },
    exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } },
};

export const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: easeOutSoft },
    exit: { opacity: 0, x: -16, transition: { duration: 0.18 } },
};

export const pageTransition: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: easeOutSoft },
    exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
};

export const pinCardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: easeOutSoft },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
};

export const staggerFast: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.04,
        },
    },
};

export const toastVariants: Variants = {
    hidden: { opacity: 0, y: 12, scale: 0.96, x: 8 },
    visible: { opacity: 1, y: 0, scale: 1, x: 0, transition: easeOutSoft },
    exit: { opacity: 0, x: 16, scale: 0.96, transition: { duration: 0.2 } },
};
