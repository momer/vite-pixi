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
                                        We&apos;re a technical creative agency,
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
