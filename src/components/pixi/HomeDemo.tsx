import { Application, extend, useApplication, useAssets, useTick } from '@pixi/react';
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
    const [treeTrunkPivot, setTreeTrunkPivot] = useState({ x: 0, y: 0 });
    const [treeTrunkScale, setTreeTrunkScale] = useState<number>(1);
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

    const ref = useRef<Graphics>(null);

    useTick(() => {
        if (treeTrunk && isSuccess && ref && ref.current && ref.current?.constructor && ref.current.constructor.name === 'Graphics') {
            // ref.current.rotation += 0.01;
            setTreeTrunkScale(0.75);
            console.log(`Current scale: ${ treeTrunkScale } | Current rotation: ${ ref.current.rotation }`);
            // console.log(`Ref type: ${typeof ref.current} ref: ${ref.current.constructor.name}`);
        }
    });

    useEffect(() => {
        if (isSuccess && treeTrunk && app?.renderer && app?.ticker && app?.screen) {
            const bounds = treeTrunk.bounds;
            setTreeTrunkPivot({
                x: (bounds.x + bounds.width) / 2,
                y: (bounds.y + bounds.height) / 2,
            });

        }
    }, [treeTrunk, app]);

    useEffect(() => {
        if (ref && ref.current) {
            // ref.current.position = { x: 0, y: 0 };
        }
    }, [ref]);

    return (
        <container sortableChildren={ true }>
            { isSuccess && treeTrunk && app?.renderer && app?.screen && (
                <graphics
                    ref={ ref }
                    context={ treeTrunk }
                    pivot={ treeTrunkPivot }
                    scale={ treeTrunkScale }
                    x={ app.screen.width - ((9 * treeTrunk.bounds.width) / 10) + 40 }
                    y={ app.screen.height - ((8 * treeTrunk.bounds.height) / 10) }
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
