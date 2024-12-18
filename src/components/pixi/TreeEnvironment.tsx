import { MutableRefObject, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Container, ContainerChild, Graphics } from 'pixi.js';
import { extend, useApplication, useAssets } from '@pixi/react';
import { Emitter } from '@momer/pixi-particle-emitter';
import { Tree } from '@/components/pixi/TreeContainer';
import { Dimension } from '@/components/pixi/Dimension';
import { Mutex } from 'async-mutex';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';
import { TreeContext } from '@/components/pixi/TreeProvider';
import { EmitterPrecipitationDensityOptions, PrecipitationDensityMapping } from '@/components/pixi/Precipitation';

import hardRainImageUrl from '/static/images/pixi/sakura/environment/HardRain.png';

extend({
    Container,
    Graphics
});

export interface TreeEnvironmentProps {
    treeRef: RefObject<Tree>;
    drawableTreeDimensions: Dimension;
    emitter: Emitter | undefined | null;
    setEmitter: React.Dispatch<React.SetStateAction<Emitter | null>>;
    isTrunkGraphicsLoading: boolean;
    isCanopyGraphicsLoading: boolean;
    isBlossomableAreaGraphicsLoading: boolean;
    children?: React.ReactNode;
}

export const TreeEnvironment = (props: TreeEnvironmentProps) => {
    const emitterMutex = new Mutex();
    const treeMaskRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const environmentContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const [isEnvironmentContainerLoading, setIsEnvironmentContainerLoading] = useState(true);
    const [isEnvironmentMaskLoading, setIsEnvironmentMaskLoading] = useState(true);
    const {treeWorldContainerRef} = props.treeRef.current as unknown as Tree;
    const {app}: ApplicationState = useApplication();
    const treeContext = useContext(TreeContext);

    const mappedPrecipDensity: EmitterPrecipitationDensityOptions = useMemo(() => {
        if (treeContext?.treeOptions?.precipitation) {
            return PrecipitationDensityMapping[treeContext.treeOptions.precipitation.type][treeContext.treeOptions.precipitation.density];
        }

        // some default density for now
        return {
            frequency: 0.01,
            maxParticles: 500
        };
    }, [treeContext?.treeOptions?.precipitation.density]);

    const generateRainConfig = useMemo(() => {
        return {
            'lifetime': {
                'min': 1,
                'max': 1.5
            },
            'frequency': mappedPrecipDensity.frequency,
            'emitterLifetime': 0,
            'particlesPerWave': mappedPrecipDensity.particlesPerWave || 4,
            'maxParticles': mappedPrecipDensity.maxParticles,
            'addAtBack': false,
            'pos': {
                'x': 0,
                'y': 0
            },
            'spawnChance': mappedPrecipDensity.spawnChance || 1,
            'behaviors': [
                {
                    'type': 'blendMode',
                    'config': 'normal'
                },
                {
                    'type': 'alphaStatic',
                    'config': {
                        'alpha': 0.5
                    }
                },
                {
                    'type': 'moveSpeedStatic',
                    'config': {
                        'min': 1000,
                        'max': 1000
                    }
                },
                {
                    'type': 'scaleStatic',
                    'config': {
                        'min': 1,
                        'max': 1
                    }
                },
                {
                    'type': 'rotationStatic',
                    'config': {
                        'min': 83,
                        'max': 97
                    }
                },
                {
                    'type': 'textureRandom',
                    'config': {
                        'textures': [
                            'hardRain',
                        ]
                    }
                },
                {
                    'type': 'spawnShape',
                    'config': {
                        'type': 'rect',
                        'data': {
                            'x': 0,
                            'y': 0,
                            'w': props.drawableTreeDimensions?.width || 100,
                            'h': 1
                        }
                    }
                },
                {
                    type: 'color',
                    config: {
                        color: {
                            list: [{
                                value: treeContext?.treeOptions?.precipitation.colorStart,
                                time: 0
                            }, {value: treeContext?.treeOptions?.precipitation.colorEnd, time: 1}]
                        },
                    }
                }
            ]
        };
    }, [mappedPrecipDensity, props.drawableTreeDimensions, treeContext?.treeOptions?.precipitation?.colorEnd, treeContext?.treeOptions?.precipitation?.colorStart]);

    const handleParticleContainer = useCallback((container: Container) => {
        // update the mask for the environment container when resized
        if (treeWorldContainerRef?.current && container) {
            environmentContainerRef.current = container;

            setIsEnvironmentContainerLoading(() => false);
        }
    }, [props.drawableTreeDimensions, props.isBlossomableAreaGraphicsLoading, props.isCanopyGraphicsLoading, props.isTrunkGraphicsLoading]);

    const drawTreeMask = useCallback((graphics: Graphics) => {
        if (!isEnvironmentContainerLoading && environmentContainerRef?.current && graphics !== null && treeWorldContainerRef.current) {
            treeMaskRef.current = graphics;
            treeMaskRef.current.rect(
                0,
                0,
                treeWorldContainerRef.current.getLocalBounds().maxX - treeWorldContainerRef.current.getLocalBounds().minX,
                treeWorldContainerRef.current.getLocalBounds().maxY - treeWorldContainerRef.current.getLocalBounds().minY,
            ).fill({
                color: 0xFFDAE6,
                alpha: 1,
            });
            // environmentContainerRef.current.mask = treeMaskRef.current;
            setIsEnvironmentMaskLoading(() => false);
        }
    }, [props.drawableTreeDimensions, props.isBlossomableAreaGraphicsLoading, props.isCanopyGraphicsLoading, props.isTrunkGraphicsLoading, isEnvironmentContainerLoading]);

    const [assetLoadSuccess, setAssetLoadSuccess] = useState<boolean>(true);

    const elapsedRef: MutableRefObject<number | null> = useRef<number | null>(Date.now());
    const updateIdRef: MutableRefObject<number | null> = useRef<number | null>(null);
    const updateHookRef: MutableRefObject<((val: number) => void) | null> = useRef<((val: number) => void) | null>(null);

    const {
        assets: [
            hardRain,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'hardRain',
            src: hardRainImageUrl,
            data: {parseAsGraphicsContext: true}
        },
    ], {
        onProgress: (progress: number) => {
            if (progress >= 1) {
                setAssetLoadSuccess(true);
            }
        },
    });

    // Update function every frame
    const updateEmitter = () => {
        // Update the next frame
        updateIdRef.current = requestAnimationFrame(updateEmitter);

        const now = Date.now();
        if (props.emitter && elapsedRef.current) {
            // update emitter (convert to seconds)
            try {
                props.emitter.update((now - elapsedRef.current) * 0.001);
            } catch (error) {
                console.log(`caught error: ${error}`);
            }
        }

        // call update hook for specialist examples
        if (updateHookRef.current && elapsedRef.current) {
            updateHookRef.current(now - elapsedRef.current);
        }

        elapsedRef.current = now;
    };

    useEffect(() => {
        emitterMutex.runExclusive(() => {
            if (props.emitter) {
                updateEmitter();
            }
        });
    }, [props.emitter]);

    useEffect(() => {
        if (environmentContainerRef.current && assetLoadSuccess && isSuccess && hardRain) {
            if (props.emitter) {
                props.emitter.parent = environmentContainerRef.current;

                if (mappedPrecipDensity.maxParticles === 0) {
                    props.emitter.emit = false;
                    return;
                } else if (!props.emitter.emit) {
                    props.emitter.emit = true;
                }

                // Load the new config
                props.emitter.init(generateRainConfig);
            } else {
                emitterMutex.runExclusive(() => {
                    if (!props.emitter && environmentContainerRef?.current) {

                        // update the emitter
                        props.setEmitter((prevState) => {
                            if (prevState !== null) {
                                return prevState;
                            }

                            const emitter = new Emitter(
                                environmentContainerRef.current as Container<ContainerChild>,
                                generateRainConfig,
                            );

                            // duplicated here for now
                            if (mappedPrecipDensity.maxParticles === 0) {
                                emitter.emit = false;
                            }

                            return emitter;
                        });
                    }
                });
            }
        }
    }, [props.drawableTreeDimensions, isEnvironmentContainerLoading, assetLoadSuccess, isSuccess, generateRainConfig]);

    return (
        treeContext && isSuccess && (
            <container
                zIndex={10}
                isRenderGroup={true}
                ref={handleParticleContainer}
                mask={treeMaskRef.current}
            >
                <graphics draw={drawTreeMask}/>
                {props.children}
            </container>
        )
    );
};
TreeEnvironment.displayName = 'TreeEnvironment';
