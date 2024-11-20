import { Application, extend, useApplication, useAssets } from '@pixi/react';
import {
    Container,
    ContainerChild,
    ConvertedStrokeStyle,
    FillInstruction,
    Graphics,
    Point,
    Rectangle,
    Sprite
} from 'pixi.js';
import { ForwardedRef, forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
import blossomableSvgUrl from '/static/images/pixi/sakura/blossomable.svg';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';
import type { PointData } from 'pixi.js/lib/maths/point/PointData';
import { AnimationTitle as LeafClusterAnimationTitle, LeafCluster } from '@/components/pixi/LeafCluster';
import { randomFloatFromInterval, randomIntFromInterval } from '@/utils/math/rand';
import { quickRound } from '@/utils/math/floats';

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
const TREE_BLOSSOMABLE_AREA_DENSITY = 0.6;

export type Tree = {
    trunk: MutableRefObject<Graphics | null>;
    canopy: MutableRefObject<Graphics | null>;
    blossomableArea: MutableRefObject<Graphics | null>;
}

export interface LeafCollectionProps {
    tree: Tree;
    isCanopyGraphicsLoading: boolean;
    isTrunkGraphicsLoading: boolean;
    isBlossomableAreaGraphicsLoading: boolean;
}

export const LeafCollection = forwardRef<HTMLDivElement, LeafCollectionProps>((props, primaryTreeContainerRef) => {
    const collectionContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [numLeafClusters, setNumLeafClusters] = useState<number>(3500);
    const leafClusters = useRef<Array<LeafCluster>>([]);

    // initialize the LeafCluster assets
    useEffect(() => {
        const initAssets = async () => {
            setIsInitializing(true);
            try {
                await LeafCluster.init();
            } catch (err: unknown) {
                console.log(`caught an error: ${ err }`);
                setError(err);
            } finally {
                setIsInitializing(false);
            }
        };

        initAssets();
    }, []);

    useEffect(() => {
        (async () => {
            if (isInitializing || !collectionContainerRef?.current) {
                return;
            }
            if (!props.tree.canopy?.current || !props.tree.trunk?.current || !props.tree.blossomableArea?.current) {
                return;
            }
            // The goal:
            // 1. iterate through each instruction, and
            // 2. iterate each instruction's shape paths,
            // 3. For each shape path, calculate its area, and calculate that area's percentage of availableBlossomArea
            // 4. Multiply that percentage against numLeafClusters to discover how many points this section should have
            // 5. generate that many random points within its bounds, and move on to the next path

            // assume bounds will hold during this loop
            const blossomableArea = props.tree.blossomableArea.current;
            const containerBounds = blossomableArea.getLocalBounds();
            const availableBlossomArea: number = containerBounds.width * containerBounds.height;
            let leafClusterPoint: PointData | null = null;

            const instructions = blossomableArea.context.instructions;
            const tmpPoint = new Point();

            // ref: GraphicsContext#.containsPoint
            for (let i = 0; i < instructions.length; i++) {
                const instruction = instructions[i];

                const data = instruction.data as FillInstruction['data'];
                const path = data.path;

                if (!instruction.action || !path) continue;
                if (instruction.action !== 'fill') continue;

                const style = data.style;
                const shapes = path.shapePath.shapePrimitives;

                // TODO: Starting point is to create 1 point per shape. Next: calculate area
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j].shape;

                    if (!style || !shape) continue;

                    const transform = shapes[j].transform;

                    let pointIsContained = false;
                    // will need to use a while loop to make sure the shape contains the point,
                    // holes mean that it could be missed.

                    leafClusterPoint = null;
                    const shapeRect: Rectangle = shape.getBounds();
                    const shapeArea: number = shapeRect.width * shapeRect.height;
                    const pctTotalArea: number = quickRound(shapeArea / availableBlossomArea, 2);
                    // scale num clusters according to density estimate
                    let targetNumLeafClusters: number = quickRound(pctTotalArea * numLeafClusters, 0);

                    if (targetNumLeafClusters < 5) {
                        targetNumLeafClusters = randomIntFromInterval(7, 20);
                    }

                    for (let k = 0; k < targetNumLeafClusters; k++) {
                        pointIsContained = false;
                        while (!pointIsContained) {
                            const localLeafClusterPoint = new Point(
                                quickRound(randomFloatFromInterval(shapeRect.x, shapeRect.x + shapeRect.width), 2),
                                quickRound(randomFloatFromInterval(shapeRect.y, shapeRect.y + shapeRect.height), 2)
                            );

                            if (instruction.action === 'fill') {
                                pointIsContained = shape.contains(localLeafClusterPoint.x, localLeafClusterPoint.y);
                            } else {
                                pointIsContained = shape.strokeContains(localLeafClusterPoint.x, localLeafClusterPoint.y, (style as ConvertedStrokeStyle).width);
                            }

                            const holes = data.hole;

                            if (holes) {
                                const holeShapes = holes.shapePath?.shapePrimitives;

                                if (holeShapes) {
                                    for (let l = 0; l < holeShapes.length; l++) {
                                        if (holeShapes[l].shape.contains(localLeafClusterPoint.x, localLeafClusterPoint.y)) {
                                            pointIsContained = false;
                                        }
                                    }
                                }
                            }

                            leafClusterPoint = transform ? transform.apply(localLeafClusterPoint, tmpPoint) : localLeafClusterPoint;
                        }

                        if (!leafClusterPoint) {
                            throw new Error('failed to find a cluster point!');
                        }

                        const leafCluster = new LeafCluster(
                            LeafClusterAnimationTitle.FULL_OPEN,
                            leafClusterPoint,
                            0.5,
                            1,
                            collectionContainerRef.current,
                            true,
                        );

                        // I'm not a huge fan of digging into it like this, but there we are
                        // I also don't want to extend sprite.
                        leafCluster.sprite.scale.set(1 - (randomFloatFromInterval(75, 80)/100));
                        leafClusters.current.push(leafCluster);

                        if (leafClusters.current.length % 100 === 0) {
                            await new Promise((resolve) => requestAnimationFrame(resolve));
                        }
                    }
                }
            }
        })();

    }, [isInitializing]);

    if (isInitializing) {
        return <></>;
    }

    return (
        <container isRenderGroup={ true } ref={ collectionContainerRef } sortableChildren={ true }>
        </container>
    );
});
LeafCollection.displayName = 'LeafCollection';

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
    const [isCanopyGraphicsLoading, setIsCanopyGraphicsLoading] = useState(true);
    const [isTrunkGraphicsLoading, setIsTrunkGraphicsLoading] = useState(true);
    const [isBlossomableAreaGraphicsLoading, setIsBlossomableAreaGraphicsLoading] = useState(true);

    const primaryTreeContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const trunkRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const canopyRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const blossomableAreaRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);

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
            pos.y -= (4 * containerBounds.minY) / 3;
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
            blossomableAreaRef.current &&
            primaryTreeContainerRef.current
        ) {
            primaryTreeContainerRef.current.scale = calculateTreeScale(app.screen);
            primaryTreeContainerRef.current.position = calculateTreePos(app.screen, primaryTreeContainerRef.current);
            primaryTreeContainerRef.current.pivot = calculateCenterPivot(primaryTreeContainerRef.current);

            canopyRef.current.visible = true;
            trunkRef.current.visible = true;
            blossomableAreaRef.current.visible = true;
        }
    }, [assetLoadSuccess, isTrunkGraphicsLoading, isCanopyGraphicsLoading, app]);

    const {
        assets: [
            treeTrunk,
            treeCanopy,
            blossomableArea,
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
        },
        {
            alias: 'blossomableArea',
            src: blossomableSvgUrl,
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
            trunkRef.current = trunk;
            setIsTrunkGraphicsLoading(false);
        }
    }, []);

    const handleTreeCanopyGraphics = useCallback((canopy: Graphics) => {
        if (canopy) {
            canopyRef.current = canopy;
            setIsCanopyGraphicsLoading(false);
        }
    }, []);

    const handleBlossomableAreaGraphics = useCallback((blossomableArea: Graphics) => {
        if (blossomableArea) {
            blossomableAreaRef.current = blossomableArea;
            blossomableAreaRef.current.stroke({
                color: 0xEEADC1,
                width: 4,
                alpha: 0,
            });
            blossomableAreaRef.current.fill({
                color: 0xEEADC1,
                alpha: 0,
            });
            setIsBlossomableAreaGraphicsLoading(false);
        }
    }, []);

    useEffect(() => {
        resizeTreeContainer();
    }, [assetLoadSuccess, isTrunkGraphicsLoading, isCanopyGraphicsLoading, app, treeTrunk, treeCanopy]);

    return (
        isSuccess && app?.renderer && app?.screen && (
            <container isRenderGroup={ true } ref={ primaryTreeContainerRef } sortableChildren={ true }>
                <>
                    <graphics
                        ref={ handleTreeTrunkGraphics }
                        context={ treeTrunk }
                    />
                    <graphics
                        ref={ handleTreeCanopyGraphics }
                        context={ treeCanopy }
                    />
                    <graphics
                        ref={ handleBlossomableAreaGraphics }
                        context={ blossomableArea }
                    />
                    <LeafCollection
                        tree={
                            {
                                trunk: trunkRef,
                                canopy: canopyRef,
                                blossomableArea: blossomableAreaRef,
                            }
                        }
                        isCanopyGraphicsLoading={ isCanopyGraphicsLoading }
                        isTrunkGraphicsLoading={ isTrunkGraphicsLoading }
                        isBlossomableAreaGraphicsLoading={ isBlossomableAreaGraphicsLoading }
                        isRenderGroup={ true }
                        ref={ primaryTreeContainerRef }
                        sortableChildren={ true }
                    />
                </>
            </container>
        )
    );
});
TreeContainer.displayName = 'TreeContainer';

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
