'use client';

import { motion, useAnimation, type Easing } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import React from 'react';

interface MotionSectionProps {
    children: React.ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    stagger?: boolean;
}

export default function MotionSection({
    children,
    direction = 'up',
    stagger = false,
}: MotionSectionProps) {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: false, // allow reverse
    });

    useEffect(() => {
        controls.start(inView ? 'visible' : 'hidden');
    }, [inView, controls]);

    const parentVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const childVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
            y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as Easing,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={stagger ? parentVariants : undefined}
            className="snap-start"
        >
            {stagger
                ? React.Children.map(children, (child, i) => (
                    <motion.div key={i} variants={childVariants}>
                        {child}
                    </motion.div>
                ))
                : <motion.div variants={childVariants}>{children}</motion.div>}
        </motion.div>
    );
}
