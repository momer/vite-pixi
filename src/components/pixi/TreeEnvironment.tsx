import { forwardRef, MutableRefObject, RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';

import hardRainImageUrl from '/static/images/pixi/sakura/environment/HardRain.png';
import { Container, ContainerChild, Graphics } from 'pixi.js';
import { extend, useApplication, useAssets } from '@momer/pixi-react';
import { Emitter } from '@momer/pixi-particle-emitter';
import { Tree } from '@/components/pixi/TreeContainer';
import { Dimension } from '@/components/pixi/Dimension';
import { Mutex } from 'async-mutex';
import { ApplicationState } from '@momer/pixi-react/types/typedefs/ApplicationState';
import { TreeContext } from '@/components/pixi/TreeProvider';

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
    const { treeWorldContainerRef } = props.treeRef.current as unknown as Tree;

    const { app }: ApplicationState = useApplication();

    const { treeOptions } = useContext(TreeContext);


    const generateRainConfig = useCallback(() => {
        return {
            'lifetime': {
                'min': 1,
                'max': 1.5
            },
            'frequency': 0.01,
            'emitterLifetime': 0,
            'maxParticles': 300,
            'addAtBack': false,
            'pos': {
                'x': 0,
                'y': 0
            },
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
                            list: [{ value: treeOptions?.precipitation?.colorStart, time: 0 }, { value: treeOptions?.precipitation?.colorEnd, time: 1 }]
                        },
                    }
                }
            ]
        };
    }, [props.drawableTreeDimensions]);

    const [precipConfig, setPrecipConfig] = useState(generateRainConfig());

    const handleParticleContainer = useCallback((container: Container) => {
        // update the mask for the environment container when resized
        if (treeWorldContainerRef?.current && container) {
            environmentContainerRef.current = container;

            setIsEnvironmentContainerLoading(() => false);
        }
    }, [props.drawableTreeDimensions, props.isBlossomableAreaGraphicsLoading, props.isCanopyGraphicsLoading, props.isTrunkGraphicsLoading]);

    const drawTreeMask = useCallback((graphics: Graphics) => {
        console.log('draw tree mask');
        if (!isEnvironmentContainerLoading && environmentContainerRef?.current && graphics !== null && treeWorldContainerRef.current) {
            console.log('INSIDE draw tree mask');
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
            data: { parseAsGraphicsContext: true }
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
                console.log(`caught error: ${ error }`);
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
                // Regenerate the config
                const newPrecipConfig = generateRainConfig();
                setPrecipConfig(() => newPrecipConfig);
                // Load the new config
                props.emitter.init(precipConfig);
            } else {
                emitterMutex.runExclusive(() => {
                    if (!props.emitter && environmentContainerRef?.current) {
                        const newPrecipConfig = generateRainConfig();
                        setPrecipConfig(() => newPrecipConfig);

                        // update the emitter
                        props.setEmitter((prevState) => {
                            if (prevState !== null) {
                                return prevState;
                            }

                            return new Emitter(
                                environmentContainerRef.current as Container<ContainerChild>,
                                newPrecipConfig,
                            );
                        });
                    }
                });
            }
        }
    }, [props.drawableTreeDimensions, isEnvironmentContainerLoading, assetLoadSuccess, isSuccess, generateRainConfig]);

    return (
        isSuccess && (
            <container
                zIndex={ 10 }
                isRenderGroup={ true }
                ref={ handleParticleContainer }
                mask={treeMaskRef.current}
            >
                <graphics draw={ drawTreeMask }/>
                { props.children }
            </container>
        )
    );
};
TreeEnvironment.displayName = 'TreeEnvironment';
