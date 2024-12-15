import React, { createContext, FC, ReactNode, useState } from 'react';

export class RainOptions {
    density: number;
    colorStart: string;
    colorEnd: string;

    constructor(
        density: number = 0,
        colorStart: string = '#78b2f4',
        colorEnd: string = '#4091ec'
    ) {
        this.density = density;
        this.colorStart = colorStart;
        this.colorEnd = colorEnd;
    }
}

export type TreeOptions = {
    rain: RainOptions
}

export type TreeContextT = {
    treeOptions: TreeOptions;
    setTreeOptions: React.Dispatch<React.SetStateAction<TreeOptions>>;
}

export const TreeContext = createContext<TreeContextT | null>(null);

interface TreeProviderProps {
    children: ReactNode
}

export const TreeProvider: FC<TreeProviderProps> = ({ children }) => {
    const [treeOptions, setTreeOptions] = useState<TreeOptions>({
        rain: new RainOptions(),
    });

   return (
       <TreeContext.Provider value={{ treeOptions, setTreeOptions }}>
           {children}
       </TreeContext.Provider>
   );
};
