import { Application, extend, useApplication, useAssets } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, useCallback, useRef } from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

extend({
    Container,
    Graphics,
    Sprite,
});

export const SakuraContainer = () => {
    const { app }: ApplicationState = useApplication();

    const drawCallback = useCallback((graphics: Graphics) => {
        if (app?.renderer && app?.screen) {
            graphics.clear();
            graphics.setFillStyle({ color: 'red' });
            graphics.rect(app.screen.width / 2, app.screen.height / 2, 100, 100);
            graphics.fill();
        }
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
        <container sortableChildren={ true }>

            <graphics draw={ drawCallback }/>

            {/*<graphics draw={ drawCallback }/>*/ }
            { isSuccess && app?.renderer && app?.screen && (
                <sprite
                    texture={ sakuraTrunk }
                    anchor={ { x: 0.5, y: 0.5 } }
                    x={ app.screen.width / 2 }
                    y={ app.screen.height / 2 }
                    zIndex={ 500 }
                />
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
            background={ 'white' }
            backgroundAlpha={ 0 }
        >
            <SakuraContainer/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
