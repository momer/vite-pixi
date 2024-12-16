
export enum PrecipitationType {
    RAIN = 'RAIN',
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

export const PrecipitationDefaults: Record<PrecipitationType, PrecipitationOptions> = {
    [PrecipitationType.RAIN]: new PrecipitationOptions(
        0.75,
        '#78b2f4',
        '#4091ec',
        PrecipitationType.RAIN,
    ),
};

export const DefaultPrecipitationType: PrecipitationType = PrecipitationType.RAIN;
