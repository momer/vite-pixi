import React, { FC, ReactNode, useContext, useEffect, useMemo } from 'react';
import { TreeContext, TreeOptions } from '@/components/pixi/TreeProvider';
import { FadeIn } from '@/components/FadeIn';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { PopoverPicker } from '@/components/PopoverPicker';
import {
    EmitterPrecipitationDensityOptions,
    PrecipitationDensityMapping,
    PrecipitationOptions,
    PrecipitationType
} from '@/components/pixi/Precipitation';

interface TreeConfiguratorProps {
    children?: ReactNode;
}

function GearIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true" { ...props }>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg>
    );
}

export const TreeConfigurator: FC<TreeConfiguratorProps> = ({ children }) => {
    const treeContext = useContext(TreeContext);

    useEffect(() => {

    }, []);

    const setPrecipitationOption = <K extends keyof PrecipitationOptions, T extends PrecipitationOptions[K]>(key: K, value: T): void => {
        if (treeContext?.setTreeOptions) {
            treeContext?.setTreeOptions((current: TreeOptions) => {
                const updatedOpt = { ...current };
                updatedOpt.precipitation[key] = value;
                return updatedOpt;
            });
        }
    };

    return (
        <div>
            { treeContext ? (
                <FadeIn className="mx-auto lg:mx-0 -mt-16 lg:mt-0 w-full"
                        viewport={ { once: true, margin: '0px 0px 0px' } }
                        transition={ {
                            duration: 0.33,
                            delay: 0.66,
                            delayChildren: 0.5,
                            staggerChildren: 0.5
                        } }>
                    <div
                        className={ clsx('p-4') }
                    >

                        <div className={ clsx('flex flex-col items-end') }>
                            <div className={ clsx(
                                'flex flex-col',
                                'group hover:min-w-1/3 hover:p-4 hover:rounded-lg hover:outline hover:outline-2 hover:outline-[#F29DBB]') }>

                                <div
                                    className={ clsx('flex group-hover:drop-shadow-sm items-start group-hover:items-end justify-between w-full group-hover:pb-2 group-hover:border-gray-100 group-hover:border-b') }>

                                    <div className={ clsx('hidden group-hover:flex flex-col') }>
                                        <h3>Sakura Configurator</h3>
                                    </div>

                                    <div
                                        className={ clsx('') }>
                                        <motion.div
                                            animate={ { rotate: 360 } }
                                            className={ clsx('') }
                                            transition={ {
                                                repeat: Infinity,
                                                duration: 7,
                                                repeatDelay: 0,
                                                ease: 'linear'
                                            } }

                                        >
                                            <GearIcon
                                                className={ clsx(
                                                    'h-8 w-8 group-hover:h-6 group-hover:w-6 fill-none stroke-[2px]',
                                                    'stroke-neutral-950',
                                                ) }
                                            ></GearIcon>
                                        </motion.div>

                                    </div>

                                </div>
                                <div
                                    className={ clsx('hidden group-hover:flex group-hover:pt-2 group-hover:justify-between group-hover:w-full group-hover:border-gray-900/10') }>
                                    <div className={ clsx('flex flex-col w-full gap-4') }>
                                        <label className={ clsx('font-medium text-gray-900') }>Precipitation</label>

                                        <div className={ clsx('flex min-h-8 font-light text-gray-900') }>
                                            <div className={ clsx('min-w-16 text-sm') }>
                                                <label className={ clsx() }>Density</label>
                                            </div>
                                            <div className={ clsx('w-full text-sm') }>
                                                <input
                                                    type="range"
                                                    min={ 0 }
                                                    max={ 5 }
                                                    value={ treeContext?.treeOptions?.precipitation?.density }
                                                    onChange={ e => setPrecipitationOption('density', Number(e.target.value)) }
                                                    className={ clsx('w-full range') }
                                                    step={ 1 }/>
                                                <div className="flex w-full justify-between px-2 text-xs">
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={ clsx('flex min-h-8 font-light text-gray-900') }>
                                            <div className={ clsx('min-w-16 text-sm') }>
                                                <label className={ clsx() }>Type</label>
                                            </div>

                                            <div className={ clsx('flex gap-2 justify-between text-sm w-full') }>
                                                <div
                                                    onClick={ () => setPrecipitationOption('type', PrecipitationType.RAIN) }
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>

                                                    <div
                                                        className={
                                                            clsx(
                                                                `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_water.png'),linear-gradient(0deg,theme('colors.cyan.500/3')_30%,theme('colors.blue.500')_65%)] ${ '' } bg-no-repeat h-full w-full`,
                                                                treeContext.treeOptions.precipitation.type == PrecipitationType.RAIN ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                            ) }>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={ () => setPrecipitationOption('type', PrecipitationType.SNOW) }
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>

                                                    <div className={
                                                        clsx(
                                                            `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_snowflake.png'),linear-gradient(0deg,_#658DBD_15%,_#CEE7FB_90%)] ${ '' } bg-no-repeat h-full w-full`,
                                                            treeContext.treeOptions.precipitation.type == PrecipitationType.SNOW ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                        ) }>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={ () => setPrecipitationOption('type', PrecipitationType.SUN) }
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>

                                                    <div className={
                                                        clsx(
                                                            `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_sun.png'),linear-gradient(0deg,_#FDCD13_45%,_#ED4C3C_60%)] ${ '' } bg-no-repeat h-full w-full`,
                                                            treeContext.treeOptions.precipitation.type == PrecipitationType.SUN ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                        ) }>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={ () => setPrecipitationOption('type', PrecipitationType.DEATH) }
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>
                                                    <div className={
                                                        clsx(
                                                            `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_skull.png'),linear-gradient(0deg,_#000000_35%,_#CB0707_70%)] ${ '' } bg-no-repeat h-full w-full`,
                                                            treeContext.treeOptions.precipitation.type == PrecipitationType.DEATH ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                        ) }>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={ clsx('flex min-h-8 font-light text-gray-900') }>
                                            <div className={ clsx('min-w-16 text-sm') }>
                                                <label className={ clsx() }>Color</label>
                                            </div>
                                            <div className={ clsx('flex items-end gap-2 w-full justify-between') }>
                                                <div className={ clsx('flex text-sm items-end gap-2') }>
                                                    <PopoverPicker
                                                        className={ 'w-8 h-8 rounded-lg border-2 border-black shadow cursor-pointer' }
                                                        color={ treeContext.treeOptions.precipitation.colorStart }

                                                        onChange={ value => setPrecipitationOption('colorStart', value) }></PopoverPicker>
                                                </div>
                                                <div>
                                                    <p>to</p>
                                                </div>
                                                <div className={ clsx('flex text-sm items-end gap-2') }>
                                                    <PopoverPicker
                                                        className={ 'w-8 h-8 rounded-lg border-2 border-black shadow cursor-pointer' }
                                                        color={ treeContext.treeOptions.precipitation.colorEnd }
                                                        onChange={ value => setPrecipitationOption('colorEnd', value) }></PopoverPicker>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            ) : (<div></div>)
            }
        </div>
    );
};
