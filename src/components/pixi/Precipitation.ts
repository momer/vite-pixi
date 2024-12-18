
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

export const PrecipitationDensityMapping: Record<PrecipitationType, Array<number>> = {
    [PrecipitationType.RAIN]: [
        0,
        500,
        1000,
        2500,
        4000,
        5000,
    ],
    [PrecipitationType.SNOW]: [
        0,
        500,
        1000,
        2500,
        4000,
        5000,
    ],
    [PrecipitationType.SUN]: [
        0,
        0,
        0,
        0,
        0,
        0,
    ],
    [PrecipitationType.DEATH]: [
        0,
        500,
        1000,
        2500,
        4000,
        5000,
    ],
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
