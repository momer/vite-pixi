import { Application, extend, useApplication, useAssets, useTick } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
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
    const treeRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
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


    useTick(() => {

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

    const handleTreeGraphics = useCallback((tree: Graphics) => {
        if (tree) {
            tree.position = {
                x: app.screen.width / 2 + (tree.getBounds().width / 6) ,
                y: app.screen.height / 2 - ((2 * tree.getBounds().height) / 5)
            };
            setTreeTrunkScale(0.65);
            console.log(`tree position: ${tree.position}`);
            // set the ref for other components
            treeRef.current = tree;
        }
    }, []);

    return (
        <container sortableChildren={ true }>
            { isSuccess && treeTrunk && app?.renderer && app?.screen && (
                <graphics
                    ref={ handleTreeGraphics }
                    context={ treeTrunk }
                    pivot={ treeTrunkPivot }
                    scale={ treeTrunkScale }
                    x={ app.screen.width / 2 }
                    y={ app.screen.height / 2}
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
