import { forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import hardRainImageUrl from '/static/images/pixi/sakura/environment/HardRain.png';
import { Container, ContainerChild, Point } from 'pixi.js';
import { extend, useAssets } from '@pixi/react';
import { Emitter } from '@momer/pixi-particle-emitter';
import { Tree } from '@/components/pixi/TreeContainer';
import { Dimension } from '@/components/pixi/Dimension';
import { Mutex } from 'async-mutex';

extend({
    Container
});

export interface TreeEnvironmentProps {
    drawableTreeDimensions: Dimension;
    children?: React.ReactNode;
}

export const TreeEnvironment = forwardRef<Tree, TreeEnvironmentProps>((props, ref) => {
    const emitterMutex = new Mutex();
    const environmentContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const [isEnvironmentContainerLoading, setIsEnvironmentContainerLoading] = useState(true);
    const [precipitationParticleCount, setPrecipitationParticleCount] = useState(500);
    const { treeObjectContainerRef } = ref?.current as unknown as Tree;

    const generateRainConfig = useCallback(() => {
        return {
            'lifetime': {
                'min': 0.81,
                'max': 0.81
            },
            'frequency': 0.004,
            'emitterLifetime': 0,
            'maxParticles': 1000,
            'addAtBack': false,
            'pos': {
                'x': 0,
                'y': 0
            },
            'behaviors': [
                {
                    'type': 'alphaStatic',
                    'config': {
                        'alpha': 0.5
                    }
                },
                {
                    'type': 'moveSpeedStatic',
                    'config': {
                        'min': 3000,
                        'max': 3000
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
                        'min': 65,
                        'max': 65
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
                            'w': 100,
                            'h': 100
                        }
                    }
                }
            ]
        };
    }, [props.drawableTreeDimensions]);

    const [precipConfig, setPrecipConfig] = useState(generateRainConfig());
    const [emitter, setEmitter] = useState<Emitter | null>(null);

    const handleParticleContainer = useCallback((container: Container) => {
        environmentContainerRef.current = container;
        setIsEnvironmentContainerLoading(() => false);
    }, []);

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
        if (emitter && elapsedRef.current) {
            // update emitter (convert to seconds)
            try {
                emitter.update((now - elapsedRef.current) * 0.001);
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
        console.log('triggering update');
        emitterMutex.runExclusive(() => {
            console.log('obtained update lock');
            if (emitter) {
                console.log('setting emitter to update');
                updateEmitter();
            }
        });
    }, [emitter]);

    useEffect(() => {
        console.log('in the environment effect');
        if (treeObjectContainerRef.current && assetLoadSuccess && isSuccess && hardRain) {
            // environmentContainerRef.current.scale = 1;
            if (emitter) {
                console.log('destroying emitter');
                emitter.destroy();
                emitter.parent = treeObjectContainerRef.current;
                emitter.ownerPos = new Point();
                emitter.spawnPos = new Point();
                emitter.init(precipConfig);
            } else {
                console.log('setting emitter');
                emitterMutex.isLocked();
                emitterMutex.runExclusive(() => {
                    if (!emitter && treeObjectContainerRef?.current) {
                        const newPrecipConfig = generateRainConfig();
                        setPrecipConfig(() => precipConfig);
                        console.log('creating emitter');
                        setEmitter((prevState) => {
                            if (prevState !== null) {
                                console.log('returning prevstate');
                                return prevState;
                            }

                            return new Emitter(
                                treeObjectContainerRef.current as Container<ContainerChild>,
                                newPrecipConfig,
                            );
                        });
                    }
                });
            }
        }
    }, [props.drawableTreeDimensions, isEnvironmentContainerLoading, assetLoadSuccess, isSuccess]);

    useEffect(() => {
        // console.log(`outer update: updating ownerpos: (${ props?.drawableTreeDimensions })`);
        // console.log(`inner update: updating ownerpos: (${ props.drawableTreeDimensions.x }, ${ props.drawableTreeDimensions.y })`);
        emitterMutex.runExclusive(() => {
            if (emitter && emitter.ownerPos && props.drawableTreeDimensions) {
                console.log('updating owner pos');
                // emitter.updateOwnerPos(props.drawableTreeDimensions.x, props.drawableTreeDimensions.y);
                //     emitter.resetPositionTracking();
            }
        });
    }, [props.drawableTreeDimensions, emitter]);

    return (
        isSuccess && (
            <container
                ref={ handleParticleContainer }
            >
                { props.children }
            </container>
        )
    );
});
TreeEnvironment.displayName = 'TreeEnvironment';
