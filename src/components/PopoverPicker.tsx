import React, { useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { useClickOutside } from '@/components/useClickOutside';
import clsx from 'clsx';

export const PopoverPicker = ({ color, onChange }) => {
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    const colorStartRef = useClickOutside({ handler: close });

    return (
        <div className={ clsx('relative') }>
            <div
                className={ clsx('w-8 h-8 rounded-lg border-2 border-white shadow cursor-pointer') }
                style={ { backgroundColor: color } }
                onClick={ () => {
                    toggle(true);
                } }
            />

            { isOpen && (
                <div className={ clsx('absolute top-full') } ref={ colorStartRef }>
                    <HexColorPicker color={ color } onChange={ onChange }/>
                </div>
            ) }
        </div>
    );
};
