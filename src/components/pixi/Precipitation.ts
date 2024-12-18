export enum PrecipitationType {
    RAIN = 'RAIN',
    SNOW = 'SNOW',
    SUN = 'SUN',
    DEATH = 'DEATH',
}

export class PrecipitationOptions {
    constructor(
        public density: number,
        public colorStart: string,
        public colorEnd: string,
        public type: PrecipitationType,
    ) {
        this.density = density;
        this.colorStart = colorStart;
        this.colorEnd = colorEnd;
        this.type = type;
    }
}

export type EmitterPrecipitationDensityOptions = {
    frequency: number;
    maxParticles: number;
    moveSpeedStatic?: {
        minSpeed?: number;
        maxSpeed?: number;
    };
    particlesPerWave?: number;
    spawnChance?: number;
};

export const PrecipitationDensityMapping: Record<PrecipitationType, Record<number, EmitterPrecipitationDensityOptions>> = {
    [PrecipitationType.RAIN]: {
        0: {
            frequency: 0,
            maxParticles: 0,
        },
        1: {
            frequency: 0.01,
            maxParticles: 500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
            spawnChance: 0.55,
        },
        2: {
            frequency: 0.01,
            maxParticles: 1000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
            particlesPerWave: 10,
            spawnChance: 0.65,
        },
        3: {
            frequency: 0.005,
            maxParticles: 2500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
            particlesPerWave: 15,
            spawnChance: 0.65,
        },
        4: {
            frequency: 0.005,
            maxParticles: 4000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
            particlesPerWave: 20,
            spawnChance: 0.75,
        },
        5: {
            frequency: 0.001,
            maxParticles: 8000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
            particlesPerWave: 6,
            spawnChance: 0.95,
        },
    },
    [PrecipitationType.SNOW]: {
        0: {
            frequency: 0,
            maxParticles: 0,
        },
        1: {
            frequency: 0.01,
            maxParticles: 500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        2: {
            frequency: 0.01,
            maxParticles: 1000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        3: {
            frequency: 0.01,
            maxParticles: 2500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        4: {
            frequency: 0.001,
            maxParticles: 4000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        5: {
            frequency: 0.001,
            maxParticles: 5000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
    },
    [PrecipitationType.SUN]: {
        0: {
            frequency: 0,
            maxParticles: 0,
        },
        1: {
            frequency: 0.01,
            maxParticles: 500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        2: {
            frequency: 0.01,
            maxParticles: 1000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        3: {
            frequency: 0.01,
            maxParticles: 2500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        4: {
            frequency: 0.001,
            maxParticles: 4000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        5: {
            frequency: 0.001,
            maxParticles: 5000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
    },
    [PrecipitationType.DEATH]: {
        0: {
            frequency: 0,
            maxParticles: 0,
        },
        1: {
            frequency: 0.01,
            maxParticles: 500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        2: {
            frequency: 0.01,
            maxParticles: 1000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        3: {
            frequency: 0.01,
            maxParticles: 2500,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        4: {
            frequency: 0.001,
            maxParticles: 4000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
        5: {
            frequency: 0.001,
            maxParticles: 5000,
            moveSpeedStatic: {
                minSpeed: 1000,
                maxSpeed: 1000,
            },
        },
    },
};

export const PrecipitationDefaults: Record<PrecipitationType, PrecipitationOptions> = {
    [PrecipitationType.RAIN]: new PrecipitationOptions(
        1,
        '#78b2f4',
        '#4091ec',
        PrecipitationType.RAIN,
    ),
    [PrecipitationType.SNOW]: new PrecipitationOptions(
        1,
        '#78b2f4',
        '#4091ec',
        PrecipitationType.SNOW,
    ),
    [PrecipitationType.SUN]: new PrecipitationOptions(
        1,
        '#78b2f4',
        '#4091ec',
        PrecipitationType.SUN,
    ),
    [PrecipitationType.DEATH]: new PrecipitationOptions(
        1,
        '#78b2f4',
        '#4091ec',
        PrecipitationType.DEATH,
    ),
};

export const DefaultPrecipitationType: PrecipitationType = PrecipitationType.RAIN;
