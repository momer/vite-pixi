import React, { useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { useClickOutside } from '@/components/useClickOutside';
import clsx from 'clsx';
import { AnyColor, ColorPickerBaseProps } from 'react-colorful/dist/types';

// Reserve ability to extend this later
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PopoverPickerProps<T extends AnyColor> extends ColorPickerBaseProps<T> {
}

export const PopoverPicker = ({ wrapperClassName, className, color, onChange } : Partial<PopoverPickerProps<string>> & { wrapperClassName: string }) => {
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    const pickerRef = useClickOutside<HTMLDivElement>({ handler: close });

    return (
        <div className={ clsx('relative') }>
            <div
                className={ clsx(wrapperClassName) }
                style={ { backgroundColor: color } }
                onClick={ () => {
                    toggle(true);
                } }
            />

            { isOpen && (
                <div className={ clsx(className) } ref={ pickerRef }>
                    <HexColorPicker color={ color } onChange={ onChange }/>
                </div>
            ) }
        </div>
    );
};
