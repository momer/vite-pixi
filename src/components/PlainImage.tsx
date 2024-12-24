import { ImgHTMLAttributes, useId } from 'react';

type ImagePropsWithOptionalAlt = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> & { alt?: string }

export function PlainImage({
                          className,
                          ...props
                      }: ImagePropsWithOptionalAlt) {
    const id = useId();
    return (
        <img
            alt=""
            id={ id }
            className={ className }
            {...props}
        />
    );
}
