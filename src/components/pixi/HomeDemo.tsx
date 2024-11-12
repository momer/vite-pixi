import { Application, extend, useApplication, useAssets } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

extend({
    Container,
    Graphics,
    Sprite,
});

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = () => {
    const [treeTrunkPivot, setTreeTrunkPivot] = useState({ x: 0, y: 0});
    const { app }: ApplicationState = useApplication();
    const {
        assets: [
            treeTrunk,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'treeTrunk',
            src: trunkSvgUrl,
            data: { parseAsGraphicsContext: true }
        }
    ]);

    useEffect(() => {
        if (isSuccess && treeTrunk && app?.renderer && app?.ticker && app?.screen) {
            const bounds = treeTrunk.bounds;
            setTreeTrunkPivot({
                x: (bounds.x + bounds.width) / 2,
                y: (bounds.y + bounds.height) / 2,
            });
            treeTrunk.position.set(app.screen.width / 2, app.screen.height / 2);
        }
    }, [treeTrunk, app]);

    return (
        <container sortableChildren={ true }>
            { isSuccess && treeTrunk && app?.renderer && app?.screen && (
                <graphics
                    context={ treeTrunk }
                    pivot={treeTrunkPivot}
                    x={ app.screen.width / 2 }
                    y={ app.screen.height / 2 }
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
