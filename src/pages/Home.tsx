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
    const animationDurationMS = 2000;
    const [activeIndex, setActiveIndex] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const onAnimationStart = (): void => {
        if (stopIndex && stopIndex !== activeIndex) {
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
                        )}
                        initial={ { opacity: 0.3 } }

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

                        'bg-red-500'
                        // `bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='24'%3E%3Cdefs%3E%3Cpattern id='bg' patternUnits='userSpaceOnUse' width='130' height='24'%3E%3Cpath fill='%23A5EF8B' d='M0,12c32.5,0,32.5,12,65,12s32.5-12,65-12V0C97.5,0,92.9,12,65,12C32.5,12,20.7,0,0,0'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%' height='100%' fill='url(%23bg)'/%3E%3C/svg%3E")] ${ '' } `
                        // `bg-[url('/static/images/pixi/sakura/configurator/btn_icon_sun.png'),linear-gradient(0deg,_#9C9C9C_0%,_#858585_70%)] ${ '' } bg-cover `
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
                            className={ clsx('h-full inset-0 w-full absolute') }
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

                    <div id="pixi-app" className={ clsx('top-16 left-0 m-0 p-0 absolute touch-none z-10') }>
                        { <HomeDemo ref={ fullsizeDivRef }/> }
                    </div>

                    <div
                        className="h-[calc(100vh-128px)] lg:h-[calc(100vh-98px)] w-full relative bg-neutral-950 rounded-4xl py-20 sm:py-32 px-0">
                        <div className={ clsx('flex h-full sm:px-0 md:px-4') }>
                            <img
                                alt=""
                                src={ sakuraBranch }
                                className="w-1/2 object-contain top-8 self-start"
                            />
                            <div className={ clsx('flex flex-col gap-3 w-full') }>
                                <div className={
                                    'text-white text-right'
                                }>
                                    <h1 className='text-3xl lg:text-4xl font-medium tracking-tight font-display'>
                                        We&apos;re a&nbsp;
                                        <CriticalSectionAnimation stopIndex={ 2 } className={ 'inline-block' }>
                                            <p className={ 'inline' }>creative agency,</p>
                                            <p className={ 'inline' }>technical agency,</p>
                                            <p className={ 'inline' }>technical creative agency,</p>
                                        </CriticalSectionAnimation>
                                    </h1>
                                    <h2 className='font-light'>
                                        helping our clients change the world, for the better.
                                    </h2>

                                </div>
                                <div
                                    className={ clsx('bg-transparent  h-full rounded-md w-full py-4 ') }>
                                    <div className={ 'flex flex-col gap-8 relative p-0 justify-between h-full' }>
                                        <InteractiveMarquee
                                            speed={ -0.25 }
                                        >
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ bonsaiLogo }
                                            />
                                        </InteractiveMarquee>
                                        <InteractiveMarquee
                                            speed={ 0.5 }
                                        >
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-32 object-contain' }
                                                        src={ mHUBLogo }
                                            />
                                        </InteractiveMarquee>
                                        <InteractiveMarquee
                                            speed={ -0.25 }
                                        >
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ twinmoLogo }
                                            />
                                        </InteractiveMarquee>
                                        <InteractiveMarquee
                                            speed={ 0.5 }
                                        >
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />
                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />

                                            <PlainImage id={ initialCaseStudyId }
                                                        className={ 'inline-block w-64 object-contain' }
                                                        src={ astellasLogo }
                                            />
                                        </InteractiveMarquee>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TreeProvider>
            </HelmetProvider>
        </>
    );
}
