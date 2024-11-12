import { Application, extend, useApplication, useAssets } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, useCallback, useEffect, useRef } from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

extend({
    Container,
    Graphics,
    Sprite,
});

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = () => {
    const { app }: ApplicationState = useApplication();
    const {
        assets: [
            treeTrunk,
        ],
        isSuccess,
    } = useAssets([
        trunkSvgUrl,
        {
            alias: 'treeTrunk',
            src: trunkSvgUrl,
            data: { parseAsGraphicsContext: true }
        }
    ]);

    const drawCallback = useCallback((graphics: Graphics) => {
        if (graphics && app?.renderer && app?.ticker && app?.screen) {
            const bounds = graphics.getLocalBounds();
            graphics.pivot.set(
                (bounds.x + bounds.width) / 2,
                (bounds.y + bounds.height) / 2
            );

            app.ticker.add(() => {
                graphics.rotation += 0.01;
                graphics.scale.set(2 + Math.sin(graphics.rotation));
            });
        }
    }, [app]);

    return (
        <container sortableChildren={ true }>
            { isSuccess && app?.renderer && app?.screen && (
                <graphics
                    context={ treeTrunk }
                    x={ app.screen.width / 2 }
                    y={ app.screen.height / 2 }
                    draw={ drawCallback }
                />
            ) }
        </container>
    );
};
TreeContainer.displayName = 'HomeDemo';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref }
            background={ 'white' }
            backgroundAlpha={ 0 }
        >
            <TreeContainer/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
