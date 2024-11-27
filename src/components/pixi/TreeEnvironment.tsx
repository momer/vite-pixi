import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import hardRainImageUrl from '/static/images/pixi/sakura/environment/HardRain.png';
import { Container } from 'pixi.js';
import { extend, useAssets } from '@pixi/react';
import { Emitter } from '@momer/pixi-particle-emitter';

extend({
    Container
});

const hardRainConfig = {
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
                    'x': -600,
                    'y': -460,
                    'w': 900,
                    'h': 20
                }
            }
        }
    ]
};

export function TreeEnvironment({
                           children,
                       }: {
    children: React.ReactNode
}) {
    const environmentContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const emitterRef: MutableRefObject<Emitter | null> = useRef<Emitter>(null);
    const [isEnvironmentContainerLoading, setIsEnvironmentContainerLoading] = useState(true);
    const [precipitationParticleCount, setPrecipitationParticleCount] = useState(500);

    const handleParticleContainer = useCallback((container: Container) => {
        environmentContainerRef.current = container;
        setIsEnvironmentContainerLoading(false);
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
        if (emitterRef?.current && elapsedRef.current) {
            // update emitter (convert to seconds)
            emitterRef.current.update((now - elapsedRef.current) * 0.001);
        }

        // call update hook for specialist examples
        if (updateHookRef.current && elapsedRef.current) {
            updateHookRef.current(now - elapsedRef.current);
        }

        elapsedRef.current = now;
    };

    useEffect(() => {
        // TODO: change based on envirnment settings, like rain==true, etc.
        if (isEnvironmentContainerLoading && environmentContainerRef?.current !== null && assetLoadSuccess && hardRain && isSuccess) {
            emitterRef.current = new Emitter(
                environmentContainerRef.current,
                hardRainConfig,
            );
            // emitterRef.current.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

            updateEmitter();
        }
    }, [isEnvironmentContainerLoading, assetLoadSuccess, isSuccess]);

    return (
        <container
            dynamicProperties={{
                position: true,
                rotation: true,
                uvs: true,
                alpha: true,
            }}
            ref={handleParticleContainer}
        >
            {children}
        </container>
    );
}
