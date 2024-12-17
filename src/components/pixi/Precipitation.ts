
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

export const PrecipitationDensityMapping: Record<PrecipitationType, Record<number, number>> = {
    [PrecipitationType.RAIN]: {
        0: 0,
        1: 500,
        2: 1000,
        3: 2500,
        4: 4000,
        5: 5000,
    },
    [PrecipitationType.SNOW]: {
        0: 0,
        1: 500,
        2: 1000,
        3: 2500,
        4: 4000,
        5: 5000,
    },
    [PrecipitationType.SUN]: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    },
    [PrecipitationType.DEATH]: {
        0: 0,
        1: 500,
        2: 1000,
        3: 2500,
        4: 4000,
        5: 5000,
    },

};

export const PrecipitationDefaults: Record<PrecipitationType, PrecipitationOptions> = {
    [PrecipitationType.RAIN]: new PrecipitationOptions(
        0.75,
        '#78b2f4',
        '#4091ec',
        PrecipitationType.RAIN,
    ),
};

export const DefaultPrecipitationType: PrecipitationType = PrecipitationType.RAIN;
