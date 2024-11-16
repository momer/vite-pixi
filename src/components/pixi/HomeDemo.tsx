import { Application, extend, useApplication, useAssets, useTick } from '@pixi/react';
import { Bounds, Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
import leafClusterFullOpenUrl from '/static/images/pixi/sakura/leaf-clusters/full-open.png';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

extend({
    Container,
    Graphics,
    Sprite,
});

export type Tree = {
    trunk: MutableRefObject<Graphics | null>;
    canopy: MutableRefObject<Graphics | null>;
}

export interface LeafCollectionProps {
    tree: Tree;
}

export const LeafCollection = ({ tree }: LeafCollectionProps) => {

    const {
        assets: [
            leafClusterFullOpen,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'leafClusterFullOpen',
            src: leafClusterFullOpenUrl,
        }
    ]);

};

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = () => {
    // Both should be the same for trunk and canopy
    const [treePivot, setTreePivot] = useState({ x: 0, y: 0 });
    const [treeScale, setTreeScale] = useState<number>(1);

    const [assetLoadSuccess, setAssetLoadSuccess] = useState<boolean>(true);
    const [isCanopyGraphicsLoaded, setIsCanopyGraphicsLoaded] = useState(false);
    const [isTrunkGraphicsLoaded, setIsTrunkGraphicsLoaded] = useState(false);

    const { app }: ApplicationState = useApplication();

    const trunkRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const canopyRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);

    const {
        assets: [
            treeTrunk,
            treeCanopy,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'treeTrunk',
            src: trunkSvgUrl,
            data: { parseAsGraphicsContext: true }
        },
        {
            alias: 'treeCanopy',
            src: canopySvgUrl,
            data: { parseAsGraphicsContext: true }
        }
    ], {
        onProgress: (progress: number) => {
            if (progress >= 1) {
                console.log('progress completed:', progress);
                setAssetLoadSuccess(() => true);
            }
        },
    });

    useEffect(() => {
        if (assetLoadSuccess &&
            isTrunkGraphicsLoaded &&
            isCanopyGraphicsLoaded &&
            app?.renderer &&
            app?.ticker &&
            app?.screen &&
            trunkRef.current &&
            canopyRef.current
        ) {
            console.log(`tree canopy: ${ treeCanopy }`);
            const bounds = trunkRef.current.getBounds();

            setTreeScale(0.65);
            setTreePivot({
                x: (bounds.x + bounds.width) / 2,
                y: (bounds.y + bounds.height) / 2,
            });
            const position = {
                x: (app.screen.width / 2) + (3 * app.screen.width / 7),
                y: (5 * app.screen.height / 8)
            };
            canopyRef.current.position = position;
            trunkRef.current.position = position;
        }
    }, [assetLoadSuccess, isTrunkGraphicsLoaded, isCanopyGraphicsLoaded, app, treeTrunk, treeCanopy]);

    const handleTreeTrunkGraphics = useCallback((trunk: Graphics) => {
        if (trunk) {
            // https://www.pixiplayground.com/#/edit/RMMgRsw1qqxpfUbS6-BEw
            //
            //     console.log(graphics.getLocalBounds().containsPoint(new PIXI.Point(110, 110)));
            //     const transformedPoint = graphics.toLocal(new PIXI.Point(110, 110));
            //     console.log(graphics.containsPoint(transformedPoint));

            // set the ref for other components
            trunkRef.current = trunk;
            setIsTrunkGraphicsLoaded(() => true);
        }
    }, []);

    const handleTreeCanopyGraphics = useCallback((canopy: Graphics) => {
        if (canopy) {
            // https://www.pixiplayground.com/#/edit/RMMgRsw1qqxpfUbS6-BEw
            //
            //     console.log(graphics.getLocalBounds().containsPoint(new PIXI.Point(110, 110)));
            //     const transformedPoint = graphics.toLocal(new PIXI.Point(110, 110));
            //     console.log(graphics.containsPoint(transformedPoint));

            // set the ref for other components
            canopyRef.current = canopy;
            setIsCanopyGraphicsLoaded(() => true);
        }
    }, []);

    return (
        <container sortableChildren={ true }>
            { isSuccess && app?.renderer && app?.screen && (
                <>
                    <graphics
                        ref={ handleTreeTrunkGraphics }
                        context={ treeTrunk }
                        pivot={ treePivot }
                        scale={ treeScale }
                        x={ app.screen.width / 2 }
                        y={ app.screen.height / 2 }
                    />
                    <graphics
                        ref={ handleTreeCanopyGraphics }
                        context={ treeCanopy }
                        pivot={ treePivot }
                        scale={ treeScale }
                        x={ app.screen.width / 2 }
                        y={ app.screen.height / 2 }
                    />
                </>
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
