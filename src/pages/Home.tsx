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
    const animationDurationMS = 2000;
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
        <div className='inline-block' ref={ ref }>
            { isInView && React.Children.map(children, (child, idx) => (
                (activeIndex === idx && <div
                    className='inline-block relative'
                    key={ idx }
                >
                    <motion.div
                        className={ clsx(
                            className,
                            'inline-block relative'
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
                        'inline-block w-full h-full absolute top-0 left-0',
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
            )) }
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


                    <div className={ clsx('h-[calc(100vh-128px)] lg:h-[calc(100vh-98px)] w-full relative bg-white') }>

                        <div
                            className={ clsx('h-[96.5%] inset-0 w-full absolute') }
                            ref={ fullsizeDivRefCallback }
                        >
                        </div>
                        <div className={ 'w-full h-full inset-0 absolute z-20' }>
                            <div
                                className={ clsx('flex flex-col bottom-28 sm:bottom-28 md:bottom-20 lg:top-1/2 w-full lg:items-end absolute z-10 ') }>

                            </div>

                            <div
                                className={ clsx('flex flex-col items-end lg:items-start mx-auto h-1/2 w-full lg:max-w-xl xl:max-w-screen-2xl top-1/2 absolute') }
                            >
                                {/*bg-white/60*/ }
                                {/*[text-shadow:_0_1px_0_rgba(0,0,0,.4)]*/ }
                                <div
                                    className="flex flex-col mt-auto flex-wrap mx-auto lg:mx-0 sm:px-2 md:px-4 lg:mb-4 text-center lg:text-left bg-[linear-gradient(90deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.6)_60%,rgba(255,255,255,0.5)_95%,rgba(255,255,255,0)_100%)] text-neutral-950 ">

                                    {/*5todo, possibly: https://stackoverflow.com/questions/24757244/html-css-background-color-behind-text-word-wrap*/ }
                                    <div className={ 'flex gap-3 items-end' }>

                                        <h1 className="font-display mx-auto lg:mx-0 text-3xl lg:text-4xl font-medium tracking-tight  [text-wrap:balance]">
                                            Systems thinking, in bloom.

                                        </h1>
                                        <div
                                            className={ 'z-10 absolute left-1/2 lg:left-[28rem] lg:bottom-[1rem] bottom-[8rem] md:bottom-[5.5rem]' }>
                                            <TreeConfigurator/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <motion.div
                        id="pixi-app"
                        className={ clsx('top-16 left-0 p-0 absolute touch-none z-10 bg-white') }
                        animate={ { opacity: [0, 1] } }
                        transition={ {
                            duration: 5
                        } }
                    >
                        { <HomeDemo ref={ fullsizeDivRef }/> }
                    </motion.div>

                    <div
                        className="h-[calc(100vh-128px)] lg:h-[calc(100vh-98px)] w-full relative bg-neutral-950 pt-4 px-0 overflow-hidden">
                        <div className={ clsx('flex flex-col h-full sm:px-0 md:px-4') }>
                            <img
                                alt=""
                                src={ sakuraBranch }
                                className="max-h-full object-none top-0 left-0 self-start absolute opacity-35 overflow-visible"
                            />

                            <div className={
                                'flex flex-col w-3/4 xl:w-1/2 p-8 mx-auto xl:mx-0 xl:self-end text-neutral-950 text-left bg-white z-20 relative'
                            }>
                                <h1 className='text-3xl lg:text-4xl font-medium tracking-tight font-display'>
                                    We&apos;re a&nbsp;
                                    <CriticalSectionAnimation stopIndex={ 2 } className={ 'inline-block' }>
                                        <p className={ 'inline' }>creative</p>
                                        <p className={ 'inline' }>technical</p>
                                        <p className={ 'inline' }>technical, creative,</p>
                                    </CriticalSectionAnimation>
                                    &nbsp;agency,
                                    engineering a better future.
                                </h1>

                                <div className={ 'flex flex-col gap-4 pt-4 font-light text-4xl' }>
                                    <p>
                                        We partner with organizations on projects we believe will make a lasting,
                                        positive, impact on the world.
                                    </p>
                                    <p>
                                        Is your project making a difference? We help with branding and design,
                                        technical community engagement, and systems development.&nbsp;

                                    </p>
                                    <div
                                        className={ 'flex justify-start absolute bg-neutral-950 -bottom-14 left-0 ml-4' }>
                                        <a href='mailto:mo@dcek.com'
                                           className={ ' border-4 border-white p-4 text-white' }>
                                            Get in touch.
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className='flex gap-4 grow h-full mt-16 xl:mt-0'>
                        <div className='flex w-full h-full z-10'>
                            <div
                                className='flex flex-col h-96 w-[32rem] p-4 bg-neutral-950 border-4 border-white'>
                                <img
                                    alt={ '' }
                                    src={ bonsaiLogo }
                                    className='object-contain w-24 overflow-hidden'/>
                                <div className={ 'h-px w-full my-2 border-b border-1 border-white/45' }></div>
                                <div className='h-full bg-white/85'>

                                </div>

                            </div>
                        </div>
                    </div>

                </TreeProvider>
            </HelmetProvider>
        </>
    );
}
