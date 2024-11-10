'use client';

import { ImgHTMLAttributes, useRef } from 'react';
import {
    motion,
    useMotionTemplate,
    useScroll,
    useTransform,
} from 'framer-motion';

type ImagePropsWithOptionalAlt = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> & { alt?: string }

export function GrayscaleTransitionImage(
    props: Pick<
        ImagePropsWithOptionalAlt,
        'src' | 'className'
    > & { alt?: string },
) {
    const ref = useRef<React.ElementRef<'div'>>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 65%', 'end 35%'],
    });
    const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 1]);
    const filter = useMotionTemplate`grayscale(${ grayscale })`;

    return (
        <div ref={ ref } className="group relative">
            <motion.img alt="" style={ { filter } as never } { ...props } />
            <div
                className="pointer-events-none absolute left-0 top-0 w-full opacity-0 transition duration-300 group-hover:opacity-100"
                aria-hidden="true"
            >
                <img alt="" { ...props } />
            </div>
        </div>
    );
}
