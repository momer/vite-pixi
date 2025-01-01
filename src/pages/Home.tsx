import sakuraBranch from '/static/images/plants/sakura-branch-1600.png';
import bonsaiLogo from '/static/images/clients/bonsai/bonsai.png';
import astellasLogo from '/static/images/clients/astellas/astellas.png';
import mHUBLogo from '/static/images/clients/mHUB/mHUB-white-text.png';
import twinmoLogo from '/static/images/clients/twinmo/twinmo-logo.png';

import React, { useCallback, useId, useRef, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import clsx from 'clsx';
import { HomeDemo } from '@/components/pixi/HomeDemo';
import { TreeConfigurator } from '@/components/pixi/TreeConfigurator';
import { TreeProvider } from '@/components/pixi/TreeProvider';
import { PlainImage } from '@/components/PlainImage';
import { InteractiveMarquee } from '@/components/Marquee';
import { AnimatePresence, AnimationDefinition, motion, useInView } from 'framer-motion';

export function CriticalSectionAnimation({
                                             children,
                                             className,
                                             stopIndex,
                                         }: {
    children: React.ReactNode;
    className?: string;
    stopIndex?: number;
}) {
    const initialIndex = 0;
    const animationDurationMS = 3500;
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const onAnimationStart = (): void => {
        if (!stopIndex || stopIndex !== activeIndex) {
            setTimeout(
                () => {
                    setActiveIndex((current) => (current + 1) % React.Children.count(children));
                },
                animationDurationMS);
        }
    };

    const onAnimationComplete = (): void => {

    };

    return (
        <div className='inline' ref={ ref }>
            { isInView ? React.Children.map(children, (child, idx) => (
                (activeIndex === idx && <div
                    className='inline relative'
                    key={ idx }
                >
                    <motion.div
                        className={ clsx(
                            className,
                            'inline relative'
                        ) }
                        initial={ { opacity: idx === initialIndex ? 1 : 0.3 } }

                        animate={ { opacity: 1 } }
                        transition={ { duration: (animationDurationMS * 0.5) / 1000 } }
                        exit={ { opacity: 0 } }
                        onAnimationStart={ onAnimationStart }
                        onAnimationComplete={ onAnimationComplete }
                    >
                        { child }
                    </motion.div>
                    <motion.div className={ clsx(
                        'inline w-full h-full absolute top-0 left-0',
                        idx !== stopIndex && 'bg-black-500 bg-opacity-85',
                    ) }
                                initial={ { opacity: 0 } }
                                animate={ {
                                    opacity: 1
                                } }
                                transition={ {
                                    delay: (animationDurationMS * 0.5) / 1000,
                                } }
                    >

                    </motion.div>
                </div>)
            )) : React.Children.toArray(children)[0] }
        </div>
    );
}

export function Home() {
    const fullsizeDivRef = useRef<HTMLDivElement | null>(null);
    const fullsizeDivRefCallback = useCallback((element: HTMLDivElement) => {
        fullsizeDivRef.current = element;
        return element;
    }, []);

    const initialCaseStudyId = useId();
    const [activeCaseStudyId, setActiveCaseStudyId] = useState<number | string | null>(initialCaseStudyId);

    const handleCaseStudySelect = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (event.currentTarget) {
            setActiveCaseStudyId((event.currentTarget as HTMLDivElement).id);
        }
    };

    return (
        <>
            <HelmetProvider>
                <TreeProvider>
                    <Helmet>
                        <title>DCEK: Systems Thinking in Bloom</title>
                        <meta name="description"
                              content="We're an engineering and systems design agency, bringing technology products to our clients customers."/>
                        <link rel="stylesheet" href="https://use.typekit.net/wiw0xgp.css"/>
                    </Helmet>


                    <div className={ clsx('h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] w-full relative bg-white') }>

                        <div
                            className={ clsx('h-[95%] inset-0 w-full absolute') }
                            ref={ fullsizeDivRefCallback }
                        >
                        </div>
                        <div className={ 'flex flex-col items-end justify-end w-full h-full z-20' }>

                            <div
                                className={ clsx('flex flex-col justify-end items-end w-full top-2/3 xl:top-1/2') }
                            >
                                <div
                                    className="flex flex-col justify-end w-full mt-auto flex-wrap mx-0 px-4 text-left bg-white/90 md:bg-transparent text-neutral-950 ">

                                    <div className={
                                        'flex flex-col justify-end xl:mx-0 text-left z-20 relative gap-8'
                                    }>
                                        <div className='flex gap-3'>

                                            <h1 className='text-3xl lg:text-4xl font-light tracking-tight font-headings'>
                                                We&apos;re a
                                                <CriticalSectionAnimation stopIndex={ 2 } className={ 'inline' }>
                                                    <p className={ 'inline font-headings' }> creative </p>
                                                    <p className={ 'inline font-headings' }> technical </p>
                                                    <p className={ 'inline font-headings' }> technical creative </p>
                                                </CriticalSectionAnimation>
                                                agency.
                                            </h1>
                                            <div className='hidden lg:block self-end'>
                                                <TreeConfigurator/>
                                            </div>
                                        </div>

                                        <div
                                            className={ 'flex flex-col lg:w-1/2 font-light text-3xl lg:text-4xl font-headings gap-8' }>
                                            <p>
                                                We help with branding and design,
                                                community engagement, and systems development.&nbsp;

                                            </p>
                                            <div
                                                className={ `flex w-full justify-start ${ '' } ` }>
                                                <a href='mailto:mo@dcek.com'
                                                   className={ 'font-headings hover:border-[#F29DBB] underline underline-offset-4 decoration-[#F29DBB] hover:decoration-neutral-950 hover:text-[#F29DBB]' }>
                                                    Get in touch.
                                                </a>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div
                                className="w-full relative overflow-hidden ">
                                <div className={ clsx('flex flex-col px-4 mt-4 mb-8 gap-24') }>

                                    {/* intro */ }

                                </div>
                            </div>
                        </div>

                    </div>

                    <motion.div
                        id="pixi-app"
                        className={ clsx('hidden lg:block top-16 left-0 p-0 absolute touch-none z-10 bg-white') }
                        animate={ { opacity: [0, 1] } }
                        transition={ {
                            duration: 5
                        } }
                    >
                        { <HomeDemo ref={ fullsizeDivRef }/> }
                    </motion.div>


                </TreeProvider>
            </HelmetProvider>
        </>
    );
}
