import { Application, extend, useApplication, useAssets } from '@pixi/react';
import { Bounds, Container, ContainerChild, Graphics, Point, Rectangle, Sprite } from 'pixi.js';
import { ForwardedRef, forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
import leafClusterFullOpenUrl from '/static/images/pixi/sakura/leaf-clusters/full-open.png';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';
import type { PointData } from 'pixi.js/lib/maths/point/PointData';

extend({
    Container,
    Graphics,
    Sprite,
});

// todo, this can be exported and isolated
// ref if needed:
// https://tailwindcss.com/docs/screens
// https://stackoverflow.com/questions/59982018/how-do-i-get-tailwinds-active-breakpoint-in-javascript
const cssScreens = {
    'sm': 640,
    // => @media (min-width: 640px) { ... }

    'md': 768,
    // => @media (min-width: 768px) { ... }

    'lg': 1024,
    // => @media (min-width: 1024px) { ... }

    'xl': 1280,
    // => @media (min-width: 1280px) { ... }

    '2xl': 1536,
    // => @media (min-width: 1536px) { ... }

    '3xl': 1792,
};

const TREE_DEFAULT_SCALE = 0.75;

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

export interface TreeContainerOptions {
    ref: ForwardedRef<HTMLDivElement>;
}

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = forwardRef<HTMLDivElement>((props, ref) => {
    const [measureRef, bounds] = useMeasure();
    const { app }: ApplicationState = useApplication();
    const [divResized, setDivResized] = useState(false);

    // Both should be the same for trunk and canopy

    const [assetLoadSuccess, setAssetLoadSuccess] = useState<boolean>(true);
    const [isCanopyGraphicsLoaded, setIsCanopyGraphicsLoaded] = useState(false);
    const [isTrunkGraphicsLoaded, setIsTrunkGraphicsLoaded] = useState(false);

    const containerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const trunkRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const canopyRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);

    const calculateTreeScale = (screen: Rectangle): PointData | number => {
        let scale: number = 1;

        const sw = screen.width;

        if (sw >= cssScreens['2xl']) {
            scale = TREE_DEFAULT_SCALE;
        } else if (sw >= cssScreens['xl']) {
            scale = 0.6;
        } else if (sw >= cssScreens['lg']) {
            scale = 0.6;
        } else if (sw >= cssScreens['md']) {
            scale = 0.55;
        } else if (sw >= cssScreens['sm']) {
            scale = 0.5;
        } else {
            scale = 0.45;
        }

        return scale;
    };

    const calculateTreePos = (screen: Rectangle, container: Container<ContainerChild> | null): PointData => {
        const screenW = screen.width;
        const screenH = screen.height;

        // default position is center of the screen
        const pos = new Point((screenW / 2), (screenH / 2));

        if (!container) {
            return pos;
        }

        const containerBounds = container.getLocalBounds();

        // Handle container offset - in order to get the container to be a perfect fit around
        // the tree. This effectively centers the tree, given its offset within the container
        // Should use container.getLocalBounds.x (or minX) for this instead.
        pos.x -= containerBounds.minX * container.scale.x;
        pos.y -= containerBounds.minY * container.scale.y;

        // offset x for 2xl screens
        if (screenW >= cssScreens['2xl']) {
            pos.x += (4 * containerBounds.width) / 7;
            // pos.y -= containerBounds.height / 32;
        } else if (screenW >= cssScreens['xl']) {
            // pos.x -= containerBounds.minX;
            pos.y -= containerBounds.minY;
        } else if (screenW >= cssScreens['lg']) {
            // pos.x -= containerBounds.minX;
            pos.y -= containerBounds.minY;
        } else if (screenW >= cssScreens['md']) {
            // pos.x -= containerBounds.minX;
            pos.y -= containerBounds.minY;
        } else {
            // pos.x -= containerBounds.minX;
            pos.y -= (4 * containerBounds.minY)/3;
        }

        return pos;
    };

    const calculateCenterPivot = (container: Container<ContainerChild> | null): PointData => {
        if (!container) {
            return new Point(0, 0);
        }

        return {
            x: (container.getLocalBounds().maxX - container.getLocalBounds().minX) / 2,
            y: (container.getLocalBounds().maxY - container.getLocalBounds().minY) / 2,
        };
    };

    const resizeTreeContainer = useCallback(() => {
        if (assetLoadSuccess &&
            trunkRef &&
            canopyRef &&
            app?.renderer &&
            app?.ticker &&
            app?.screen &&
            trunkRef.current &&
            canopyRef.current &&
            containerRef.current
        ) {
            containerRef.current.scale = calculateTreeScale(app.screen);
            containerRef.current.position = calculateTreePos(app.screen, containerRef.current);
            containerRef.current.pivot = calculateCenterPivot(containerRef.current);

            canopyRef.current.visible = true;
            trunkRef.current.visible = true;
        }
    }, [assetLoadSuccess, isTrunkGraphicsLoaded, isCanopyGraphicsLoaded, app]);

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
                setAssetLoadSuccess(true);
            }
        },
    });

    // initial load, start observingt he div parent for sizing
    useEffect(() => {
        if (ref) {
            ref = ref as MutableRefObject<HTMLDivElement>;
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (app && app.renderer) {
                        app.renderer.resize(width, height);
                        resizeTreeContainer();
                    }
                }
            });
            observer.observe(ref.current as Element, {});

        }
    }, [ref, app]);

    const handleTreeTrunkGraphics = useCallback((trunk: Graphics) => {
        if (trunk) {
            // https://www.pixiplayground.com/#/edit/RMMgRsw1qqxpfUbS6-BEw
            //
            //     console.log(graphics.getLocalBounds().containsPoint(new PIXI.Point(110, 110)));
            //     const transformedPoint = graphics.toLocal(new PIXI.Point(110, 110));
            //     console.log(graphics.containsPoint(transformedPoint));

            // set the ref for other components
            trunkRef.current = trunk;
            setIsTrunkGraphicsLoaded(true);
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
            setIsCanopyGraphicsLoaded(true);
        }
    }, []);

    useEffect(() => {
        resizeTreeContainer();
    }, [assetLoadSuccess, isTrunkGraphicsLoaded, isCanopyGraphicsLoaded, app, treeTrunk, treeCanopy]);

    return (
        isSuccess && app?.renderer && app?.screen && (
            <container isRenderGroup={ true } ref={ containerRef } sortableChildren={ true }>
                <>
                    <graphics
                        ref={ handleTreeTrunkGraphics }
                        context={ treeTrunk }
                    />
                    <graphics
                        ref={ handleTreeCanopyGraphics }
                        context={ treeCanopy }
                    />
                </>
            </container>
        )
    );
});

TreeContainer.displayName = 'HomeDemo';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref }
            background={ 'white' }
            backgroundAlpha={ 0 }
            antialias={ true }
        >
            <TreeContainer ref={ ref }/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
