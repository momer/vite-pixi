import React, { FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { TreeContext, TreeOptions } from '@/components/pixi/TreeProvider';
import { FadeIn } from '@/components/FadeIn';
import clsx from 'clsx';
import { AnimationDefinition, motion, ResolvedValues, useMotionValue } from 'framer-motion';
import { PopoverPicker } from '@/components/PopoverPicker';
import { PrecipitationOptions, PrecipitationType } from '@/components/pixi/Precipitation';
import { useClickOutside } from '@/components/useClickOutside';

interface TreeConfiguratorProps {
    children?: ReactNode;
}

function GearIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true" { ...props }>
            <motion.path
                animate={ {
                    fill: ['#fff', '#F29DBB', '#fff'],
                } }
                transition={ {
                    default: {
                        repeat: Infinity,
                        delay: 2,
                        duration: 3,
                        ease: 'easeInOut',
                    },
                } }
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"/>
            <motion.path
                fill={ '#fff' }
                animate={ {} }
                transition={ {
                    default: {
                        repeat: Infinity,
                        delay: 5,
                        duration: 3,
                        ease: 'easeInOut',
                    },
                } }
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg>
    );
}

export const TreeConfigurator: FC<TreeConfiguratorProps> = ({ children }) => {
    const treeContext = useContext(TreeContext);

    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [isHoverOrTouchVisible, setIsHoverOrTouchVisible] = useState<boolean>(false);
    const gearOpacity = useMotionValue(0);
    const [configuratorOpacity, setConfiguratorOpacity] = useState<number>(0);
    const entranceFrameNum = useMotionValue(0);

    const onEntranceComplete = useCallback((animation: AnimationDefinition): void => {
        setIsHoverOrTouchVisible(false);
        gearOpacity.set(1);
        setPrecipitationOption('density', 0);
        setIsInitialLoad(false);
    }, [isHoverOrTouchVisible]);

    const close = () => {
        if (isHoverOrTouchVisible) {
            setIsHoverOrTouchVisible(false);
        }
    };

    const pickerRef = useClickOutside<HTMLDivElement>({ handler: close });


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
        <div className={ 'w-full' }>
            { treeContext ? (
                <motion.div
                    style={{
                        opacity: configuratorOpacity,
                    }}
                    animate={ {
                        opacity: [0, configuratorOpacity],
                        y: [-400, -274],
                        x: [700, 0],
                    } }
                    onUpdate={async (latest) => {
                        entranceFrameNum.set(entranceFrameNum.get() + 1);
                        // prevent flickering
                        if (entranceFrameNum.get() === 1) {
                            setConfiguratorOpacity(1);
                        }
                        if (entranceFrameNum.get() === 210) {
                            // go from 1 to 0, or 0 to 1
                            setPrecipitationOption('density', 0);
                        }

                        await new Promise((resolve) => {
                            setTimeout(() => {
                                requestAnimationFrame(resolve);
                            }, 0);
                        });
                    }}
                    onAnimationComplete={ onEntranceComplete }
                    transition={ {
                        delay: 0,
                        duration: 3.5,
                        ease: 'easeOut',

                    } }
                >
                    <div
                        className={ clsx('') }
                    >

                        <div className={ clsx('flex flex-col items-end') }>
                            <div
                                onClick={ () => {
                                    if (!isInitialLoad) {
                                        return setIsHoverOrTouchVisible(true);
                                    }
                                } }

                                className={ clsx(
                                    'flex flex-col mx-auto',
                                    'group bg-opacity-95',
                                    (isHoverOrTouchVisible) && 'absolute -left-64 -top-72 lg:left-2 lg:-top-[15.75rem] min-w-1/3 p-4 rounded-lg outline outline-2 outline-[#F29DBB] bg-white') }>

                                <div
                                    ref={pickerRef}
                                    className={ clsx(
                                        'flex items-start justify-between w-full ',
                                        (isHoverOrTouchVisible) && 'drop-shadow-sm items-end pb-2 border-gray-100 border-b') }>

                                    <div className={ clsx(
                                        (!isHoverOrTouchVisible) && 'hidden',
                                        (isHoverOrTouchVisible) && 'flex flex-col',
                                    ) }>
                                        <h3>Sakura Configurator</h3>
                                    </div>

                                    <div
                                        className={ clsx('') }>
                                        <motion.div
                                            initial={ { opacity: gearOpacity } }
                                        >
                                            <motion.div
                                                animate={ {
                                                    rotate: 360,
                                                } }
                                                transition={ {
                                                    repeat: Infinity,
                                                    delay: 1,
                                                    duration: 4,
                                                    repeatDelay: 0,
                                                    ease: 'linear'
                                                } }
                                            >
                                                <GearIcon
                                                    className={ clsx(
                                                        'fill-white stroke-[2px] stroke-neutral-950',
                                                        (!isHoverOrTouchVisible) && 'h-8 w-8 ',
                                                        (isHoverOrTouchVisible) && 'h-6 w-6',
                                                    ) }
                                                ></GearIcon>
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                </div>

                                <div
                                    className={ clsx(
                                        (!isHoverOrTouchVisible) && 'hidden',
                                        (isHoverOrTouchVisible) && 'flex pt-2 justify-between w-full border-gray-900/10',
                                    ) }>
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
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>

                                                    <div className={
                                                        clsx(
                                                            `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_snowflake.png'),linear-gradient(0deg,_#9C9C9C_0%,_#858585_70%)] ${ '' } bg-no-repeat h-full w-full`,
                                                            treeContext.treeOptions.precipitation.type == PrecipitationType.SNOW ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                        ) }>
                                                    </div>
                                                </div>
                                                <div
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>

                                                    <div className={
                                                        clsx(
                                                            `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_sun.png'),linear-gradient(0deg,_#9C9C9C_0%,_#858585_70%)] ${ '' } bg-no-repeat h-full w-full`,
                                                            treeContext.treeOptions.precipitation.type == PrecipitationType.SUN ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                        ) }>
                                                    </div>
                                                </div>
                                                <div
                                                    className={ clsx(
                                                        'flex flex-col relative items-center justify-center overflow-hidden h-8 w-8 ',
                                                    ) }>
                                                    <div className={
                                                        clsx(
                                                            `absolute bg-cover rounded-lg bg-[url('/static/images/pixi/sakura/configurator/btn_icon_skull.png'),linear-gradient(0deg,_#9C9C9C_0%,_#858585_70%)] ${ '' } bg-no-repeat h-full w-full`,
                                                            treeContext.treeOptions.precipitation.type == PrecipitationType.DEATH ? 'opacity-100 border-2 border-black rounded-md' : 'opacity-45',
                                                        ) }>
                                                    </div>
                                                </div>
                                                {/* TODO: Add other precipitation modes */ }
                                                {/*
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
                                                */ }
                                            </div>
                                        </div>

                                        <div className={ clsx('flex min-h-8 font-light text-gray-900') }>
                                            <div className={ clsx('min-w-16 text-sm') }>
                                                <label className={ clsx() }>Color</label>
                                            </div>
                                            <div className={ clsx('flex items-end gap-2 w-full justify-between') }>
                                                <div className={ clsx('flex text-sm items-end gap-2') }>
                                                    <PopoverPicker
                                                        wrapperClassName={ 'w-8 h-8 rounded-lg border-2 border-black shadow cursor-pointer' }
                                                        className={ 'absolute bottom-full left-full' }
                                                        color={ treeContext.treeOptions.precipitation.colorStart }

                                                        onChange={ value => setPrecipitationOption('colorStart', value) }></PopoverPicker>
                                                </div>
                                                <div>
                                                    <p>to</p>
                                                </div>
                                                <div className={ clsx('flex text-sm items-end gap-2') }>
                                                    <PopoverPicker
                                                        wrapperClassName={ 'w-8 h-8 rounded-lg border-2 border-black shadow cursor-pointer' }
                                                        className={ 'absolute bottom-full right-full' }
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
                </motion.div>
            ) : (<div></div>)
            }
        </div>
    );
};
