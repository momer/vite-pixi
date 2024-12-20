import { ContactSection } from '@/components/ContactSection';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { List, ListItem } from '@/components/List';
import { SectionIntro } from '@/components/SectionIntro';
import { StylizedImage } from '@/components/StylizedImage';
import { Testimonial } from '@/components/Testimonial';
import logoBrightPath from '/static/images/clients/bright-path/logo-light.svg';
import logoFamilyFund from '/static/images/clients/family-fund/logo-light.svg';
import logoGreenLife from '/static/images/clients/green-life/logo-light.svg';
import logoHomeWork from '/static/images/clients/home-work/logo-light.svg';
import logoMailSmirk from '/static/images/clients/mail-smirk/logo-light.svg';
import logoNorthAdventures from '/static/images/clients/north-adventures/logo-light.svg';
import logoPhobiaDark from '/static/images/clients/phobia/logo-dark.svg';
import logoPhobiaLight from '/static/images/clients/phobia/logo-light.svg';
import logoUnseal from '/static/images/clients/unseal/logo-light.svg';
import imageLaptop from '/static/images/laptop.jpg';
import React, { useCallback, useRef, useState } from 'react';
// import { StringMap } from '@/lib/stringMap';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import clsx from 'clsx';
import { HomeDemo } from '@/components/pixi/HomeDemo';
import { TreeConfigurator } from '@/components/pixi/TreeConfigurator';
import { TreeProvider } from '@/components/pixi/TreeProvider';
import Dandelion from '@/components/plants/Dandelion';

interface StringMap {
    [key: string]: string;
}

const clients = [
    ['Phobia', logoPhobiaLight],
    ['Family Fund', logoFamilyFund],
    ['Unseal', logoUnseal],
    ['Mail Smirk', logoMailSmirk],
    ['Home Work', logoHomeWork],
    ['Green Life', logoGreenLife],
    ['Bright Path', logoBrightPath],
    ['North Adventures', logoNorthAdventures],
];

function Clients() {
    return (
        <div className="bg-neutral-950 mt-24 rounded-4xl py-20 sm:mt-32 sm:py-32 lg:mt-10">
            <Container>
                <FadeIn className="flex items-center gap-x-8">
                    <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
                        We’ve worked with hundreds of amazing people
                    </h2>
                    <div className="h-px flex-auto bg-neutral-800"/>
                </FadeIn>
                <FadeInStagger faster>
                    <ul
                        role="list"
                        className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
                    >
                        { clients.map(([client, logo]) => (
                            <li key={ client }>
                                <FadeIn>
                                    <img src={ logo } alt={ client }/>
                                </FadeIn>
                            </li>
                        )) }
                    </ul>
                </FadeInStagger>
            </Container>
        </div>
    );
}

function Services() {
    return (
        <>
            <SectionIntro
                eyebrow="Services"
                title="We help you identify, explore and respond to new opportunities."
                className="mt-24 sm:mt-32 lg:mt-40"
            >
                <p>
                    As long as those opportunities involve giving us money to re-purpose
                    old projects — we can come up with an endless number of those.
                </p>
            </SectionIntro>
            <Container className="mt-16">
                <div className="lg:flex lg:items-center lg:justify-end">
                    <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
                        <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
                            <StylizedImage
                                src={ imageLaptop }
                                sizes="(min-width: 1024px) 41rem, 31rem"
                                className="justify-center lg:justify-end"
                            />
                        </FadeIn>
                    </div>
                    <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
                        <ListItem title="Web development">
                            We specialise in crafting beautiful, high quality marketing pages.
                            The rest of the website will be a shell that uses lorem ipsum
                            everywhere.
                        </ListItem>
                        <ListItem title="Application development">
                            We have a team of skilled developers who are experts in the latest
                            app frameworks, like Angular 1 and Google Web Toolkit.
                        </ListItem>
                        <ListItem title="E-commerce">
                            We are at the forefront of modern e-commerce development. Which
                            mainly means adding your logo to the Shopify store template we’ve
                            used for the past six years.
                        </ListItem>
                        <ListItem title="Custom content management">
                            At Studio we understand the importance of having a robust and
                            customised CMS. That’s why we run all of our client projects out
                            of a single, enormous Joomla instance.
                        </ListItem>
                    </List>
                </div>
            </Container>
        </>
    );
}

export const metadata: StringMap = {
    title: 'Contact Us',
    description: 'Let’s work together. We can’t wait to hear from you.',
};

export function Home() {
    const fullsizeDivRef = useRef<HTMLDivElement | null>(null);
    const fullsizeDivRefCallback = useCallback((element: HTMLDivElement) => {
        fullsizeDivRef.current = element;
        return element;
    }, []);

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
                                            className={ 'z-10 absolute left-1/2 lg:left-[29rem] lg:bottom-[2.5rem] bottom-[8rem] md:bottom-[5.5rem]' }>
                                            <TreeConfigurator/>
                                        </div>
                                    </div>

                                    <span className="">
                                        <span className="hidden md:inline">
                                            We encourage challenges to blossom into solutions.
                                        </span>
                                        <span className="inline md:hidden">
                                            We encourage challenges to blossom into solutions.
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div id="pixi-app" className={ clsx('top-12 left-0 m-0 p-0 absolute touch-none z-10') }>
                        { <HomeDemo ref={ fullsizeDivRef }/> }
                    </div>
                    <div className="bg-neutral-950 mt-24 rounded-4xl py-20 sm:mt-32 sm:py-32 lg:mt-10">
                        <Container>
                            <Dandelion/>
                        </Container>
                    </div>
                    <Clients/>

                    <Testimonial
                        className="mt-24 sm:mt-32 lg:mt-40"
                        client={ { name: 'Phobia', logo: logoPhobiaDark } }
                    >
                        The team at Studio went above and beyond with our onboarding, even
                        finding a way to access the user’s microphone without triggering one of
                        those annoying permission dialogs.
                    </Testimonial>

                    <Services/>

                    <ContactSection/>

                </TreeProvider>
            </HelmetProvider>
        </>
    );
}
