import { Application, extend, useApplication, useAssets } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, useCallback, useRef } from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';

extend({
    Container,
    Graphics,
    Sprite,
    useAssets
});

export const SakuraContainer = () => {
    const drawCallback = useCallback((graphics: Graphics) => {
        graphics.clear();
        graphics.setFillStyle({ color: 'red' });
        graphics.rect(0, 0, 100, 100);
        graphics.fill();
    }, []);

    const {
        assets: [
            sakuraTrunk,
        ],
        isSuccess,
    } = useAssets([
        trunkSvgUrl,
        {
            alias: 'sakuraTrunk',
            src: trunkSvgUrl,
        }
    ]);

    return (
        <container x={ 100 } y={ 100 }>
            {  }
            {/*<graphics draw={ drawCallback }/>*/ }
            { isSuccess && (
                <sprite texture={ sakuraTrunk }/>
            ) }
        </container>
    );
};

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref }
            background={'white'}
            backgroundAlpha={0}
        >
            <SakuraContainer/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
