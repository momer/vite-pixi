import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import clsx from 'clsx';
import { Border } from '@/components/Border';

export function TreeEnvironment({
                         children,
                         className,
                     }: {
    children: React.ReactNode
    className?: string
}) {
    return (
        {children}
    );
}

export function Ground({
                             children,
                         }: {
    children: React.ReactNode
}) {
    return (
        <li className="group mt-10 first:mt-0">
            <FadeIn>
                <Border className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden">
                    {children}
                </Border>
            </FadeIn>
        </li>
    );
}
