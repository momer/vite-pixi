import {
    Assets,
    Container,
    Point,
    PointData,
    Spritesheet,
    SpritesheetData,
    SpritesheetFrameData,
    Texture,
    TextureSource
} from 'pixi.js';

import { AnimatedSprite } from '@/lib/pixi/scene/AnimatedSprite';
import leafClusterFullOpenUrl from '/static/images/pixi/sakura/leaf-clusters/full-open.png';
import { Mutex } from 'async-mutex';

let spritesheet: Spritesheet;

// All frames to load from the spritesheet for all animations
export const leafClusterFrames: string[] = [
    // Neutral / fully open leaf cluster
    'full-open',
];

export enum AnimationTitle {
    FULL_OPEN = 'FULL_OPEN',
}

// Reference: https://pixijs.com/8.x/guides/components/sprite-sheets
export const leafClusterData: SpritesheetData = {
    // frames will be populated async at runtime, on first LeafClusterSprite.create call
    frames: {},
    meta: {
        image: leafClusterFullOpenUrl,
        format: 'RGBA8888',
        size: { w: 75, h: 75 },
        scale: 1
    },
    animations: {
        [AnimationTitle.FULL_OPEN]: [
            'full-open', 'full-open', 'full-open', 'full-open', 'full-open',
            'full-open', 'full-open', 'full-open', 'full-open', 'full-open'
        ],
    },
};

function* spritesheetGenerator(frames: string[], w: number, h: number, framesPerRow: number): IterableIterator<[string, SpritesheetFrameData]> {
    for (let i = 0; i < frames.length; i++) {
        const x = (i % framesPerRow) * w;
        const y = Math.floor(i / framesPerRow) * h;

        yield [frames[i], {
            frame: {
                x: x,
                y: y,
                w: w,
                h: h
            },
            spriteSourceSize: { x: 0, y: 0, w: w, h: h },
            sourceSize: { w: w, h: h },
        }];
    }
}

export class LeafCluster {
    private static frameW = 75; // sprite size * number of sprites per row
    private static frameH = 75;
    private static spritesheetFramesPerRow = 1;

    private static _isInitializing = false;
    private static _isInitialized = false;

    private static loadMutex = new Mutex();

    private _sprite!: AnimatedSprite;

    private _currentAnimationTitle?: AnimationTitle;
    private _previousAnimationTitle?: AnimationTitle;
    private _previousPosition: Point = new Point(0, 0);
    private _previousAnchor: PointData | number = 0.5;
    private _previousAnimationSpeed = 0.1;

    public static async init()  {
        let shouldInitialize = false;
        await this.loadMutex.runExclusive(async () => {
            if (this._isInitializing || spritesheet) {
                return;
            }
            this._isInitializing = true;
            shouldInitialize = true;
        });

        if (!shouldInitialize) {
            return;
        }

        if (Object.keys(leafClusterData.frames).length === 0) {
            for (const [key, frame] of spritesheetGenerator(leafClusterFrames, this.frameW, this.frameH, this.spritesheetFramesPerRow)) {
                leafClusterData.frames[key] = frame;
            }
        }

        Assets.add({ alias: 'leafCluster', src: leafClusterData.meta.image });
        const texture = await Assets.load('leafCluster');

        spritesheet = new Spritesheet(
            texture,
            leafClusterData
        );

        await spritesheet.parse();
        this._isInitialized = true;
    }

    public get sprite(): AnimatedSprite {
        return this._sprite;
    }

    public addToStage(stage: Container) {
        if (this.sprite !== null && this.sprite !== undefined) {
            stage.addChild(this.sprite);
        }
    }

    public play(
        animationSpeed = 0.5,
        immediate = false,
        resetPrevious = false,
        stage?: Container,
        animationTitle?: AnimationTitle,
    ) {
        // Stop the currently running sprite
        if (!immediate && this.sprite.playing) {
            // First, set the callback
            this.sprite.onComplete = () => {
                this.play(animationSpeed, immediate, resetPrevious, stage, animationTitle);
            };
            // Then set the loop to terminate, so that the callback must trigger
            this.sprite.loop = false;

            // Then, early exit this function!
            return;
        }

        if (resetPrevious) {
            this.sprite.gotoAndStop(0);
        } else {
            this.sprite.stop();
        }

        // Retain the previous sprite for reference/position setting
        this._previousAnimationTitle = this._currentAnimationTitle;

        // Only update the current sprite if a new one is passed in
        if (animationTitle !== undefined && animationTitle !== null) {
            this.sprite.textures = this.animationFor(animationTitle);
            this._currentAnimationTitle = animationTitle;
        }

        // Regardless if the sprite changed, make it visible
        this.sprite.visible = true;
        this.sprite.animationSpeed = animationSpeed;

        if (stage !== undefined && stage !== null && this.sprite.parent !== stage) {
            this.addToStage(stage);
        }

        // Don't inherit animation speed by default
        // this._currentSprite.animationSpeed = this._previousAnimationSpeed;
        this.sprite.play();
    }

    constructor(
        animationTitle: AnimationTitle,
        initialPosition?: Point,
        anchor?: PointData | number,
        animationSpeed?: number,
        stage?: Container,
        play = true,
    ) {

        // Initialize the current sprite
        this._sprite = new AnimatedSprite(this.animationFor(animationTitle));
        this._currentAnimationTitle = animationTitle;

        this.sprite.position = initialPosition ?? this._previousPosition;
        this.sprite.anchor = anchor ?? this._previousAnchor;
        this.sprite.animationSpeed = animationSpeed ?? this._previousAnimationSpeed;

        if (stage) {
            this.addToStage(stage);
        }
        if (play) {
            this.sprite.play();
        }
    }

    private animationFor(animationTitle: AnimationTitle): Texture<TextureSource<any>>[] {
        // If the animatedSprite hasn't been created yet, add it to the cached list
        if (!(animationTitle in spritesheet.animations)) {
            throw new Error(`Unable to find animation ${ animationTitle } in spritesheet!`);
        }

        return spritesheet.animations[animationTitle];
    }
}
