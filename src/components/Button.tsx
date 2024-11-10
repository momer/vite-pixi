import clsx from 'clsx';
import { Link } from 'react-router-dom';

type ButtonProps = {
        invert?: boolean
    }
        & (
            (
            {
                variant: 'link';
            } & React.ComponentPropsWithoutRef<typeof Link>
        ) | (
            {
                variant: 'button';
                to?: undefined;
            } & React.ComponentPropsWithoutRef<'button'>
        )
    )


export function Button({
                           invert = false,
                           className,
                           children,
                           ...props
                       }: ButtonProps) {
    className = clsx(
        className,
        'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
        invert
            ? 'bg-white text-neutral-950 hover:bg-neutral-200'
            : 'bg-neutral-950 text-white hover:bg-neutral-800',
    );

    const inner = <span className="relative top-px">{ children }</span>;

    if (props.variant !== 'link') {
        return (
            <button className={ className } { ...props }>
                { inner }
            </button>
        );
    } else {
        return (
            <Link className={ className } to={ props.to }>
                { inner }
            </Link>
        );
    }
}
