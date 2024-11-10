import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './index.html',
        './src/**/*',
        './dist/*.{html, js}',
    ],
    theme: {
        screens: {
            'xs': '475px',
            ...defaultTheme.screens,
        },
        extend: {
            boxShadow: {
                'solid-l-sm': '-3px 3px 0 0 rgb(59, 130, 246)',
                'solid-l-md': '-6px 6px 0 0 rgb(59, 130, 246)',
                'solid-l-lg': '-9px 9px 0 0 rgb(59, 130, 246)',
                'solid-r-sm': '3px 3px 0 0 rgb(59, 130, 246)',
                'solid-r-md': '6px 6px 0 0 rgb(59, 130, 246)',
                'solid-r-lg': '9px 9px 0 0 rgb(59, 130, 246)',

                'full-sm': '0 0 3px 3px rgb(59, 130, 246)',
                'full-md': '0 0 5px 5px rgb(59, 130, 246)',
                'full-lg': '0 0 7px 7px rgb(59, 130, 246)',
            },

            colors: {
                /* TWUI Palette 5 */
                secondary: {
                    'lightBlue': {
                        50: 'hsl(195, 100%, 95%)',
                        100: 'hsl(195, 100%, 85%)',
                        200: 'hsl(195, 97%, 75%)',
                        300: 'hsl(196, 94%, 67%)',
                        400: 'hsl(197, 92%, 61%)',
                        500: 'hsl(199, 84%, 55%)',
                        600: 'hsl(201, 79%, 46%)',
                        700: 'hsl(202, 83%, 41%)',
                        800: 'hsl(203, 87%, 34%)',
                        900: 'hsl(204, 96%, 27%)',
                    },
                    cyan: {
                        50: 'hsl(186, 100%, 94%)',
                        100: 'hsl(185, 94%, 87%)',
                        200: 'hsl(184, 80%, 74%)',
                        300: 'hsl(184, 65%, 59%)',
                        400: 'hsl(185, 57%, 50%)',
                        500: 'hsl(185, 62%, 45%)',
                        600: 'hsl(184, 77%, 34%)',
                        700: 'hsl(185, 81%, 29%)',
                        800: 'hsl(185, 84%, 25%)',
                        900: 'hsl(184, 91%, 17%)',
                    },
                    pink: {
                        50: 'hsl(341, 100%, 95%)',
                        100: 'hsl(338, 100%, 86%)',
                        200: 'hsl(336, 100%, 77%)',
                        300: 'hsl(334, 86%, 67%)',
                        400: 'hsl(330, 79%, 56%)',
                        500: 'hsl(328, 85%, 46%)',
                        600: 'hsl(326, 90%, 39%)',
                        700: 'hsl(324, 93%, 33%)',
                        800: 'hsl(322, 93%, 27%)',
                        900: 'hsl(320, 100%, 19%)',
                    },
                    yellow: {
                        50: 'hsl(49, 100%, 96%)',
                        100: 'hsl(48, 100%, 88%)',
                        200: 'hsl(48, 95%, 76%)',
                        300: 'hsl(48, 94%, 68%)',
                        400: 'hsl(44, 92%, 63%)',
                        500: 'hsl(42, 87%, 55%)',
                        600: 'hsl(36, 77%, 49%)',
                        700: 'hsl(29, 80%, 44%)',
                        800: 'hsl(22, 82%, 39%)',
                        900: 'hsl(15, 86%, 30%)',
                    },
                    red: {
                        50: 'hsl(360, 100%, 95%)',
                        100: 'hsl(360, 100%, 87%)',
                        200: 'hsl(360, 100%, 80%)',
                        300: 'hsl(360, 91%, 69%)',
                        400: 'hsl(360, 83%, 62%)',
                        500: 'hsl(356, 75%, 53%)',
                        600: 'hsl(354, 85%, 44%)',
                        700: 'hsl(352, 90%, 35%)',
                        800: 'hsl(350, 94%, 28%)',
                        900: 'hsl(348, 94%, 20%)',
                    },
                    teal: {
                        50: 'hsl(152, 68%, 96%)',
                        100: 'hsl(154, 75%, 87%)',
                        200: 'hsl(156, 73%, 74%)',
                        300: 'hsl(158, 58%, 62%)',
                        400: 'hsl(160, 51%, 49%)',
                        500: 'hsl(162, 63%, 41%)',
                        600: 'hsl(164, 71%, 34%)',
                        700: 'hsl(166, 72%, 28%)',
                        800: 'hsl(168, 80%, 23%)',
                        900: 'hsl(170, 97%, 15%)',
                    },
                },
                primary: {
                    'blueGrey': {
                        50: 'hsl(210, 36%, 96%)',
                        100: 'hsl(212, 33%, 89%)',
                        200: 'hsl(210, 31%, 80%)',
                        300: 'hsl(211, 27%, 70%)',
                        400: 'hsl(209, 23%, 60%)',
                        500: 'hsl(210, 22%, 49%)',
                        600: 'hsl(209, 28%, 39%)',
                        700: 'hsl(209, 34%, 30%)',
                        800: 'hsl(211, 39%, 23%)',
                        900: 'hsl(209, 61%, 16%)',
                    },
                }
            },
            listStyleType: {
                square: 'square',
                roman: 'upper-roman'
            },
        },
        fontFamily: {
            sans: ['Inconsolata, sans-serif'],
            headings: ['"League Gothic"', 'sans-serif'],
            body: ['"Source Sans Pro"', 'sans-serif'],
        },
    },
    plugins: [
        typography,
        forms,
        aspectRatio,
        lineClamp,
        // https://github.com/tailwindlabs/tailwindcss/discussions/3378
        plugin(({matchUtilities, theme}) => {
            matchUtilities(
                {
                    'animation-delay': (value) => {
                        return {
                            'animation-delay': value,
                        };
                    },
                },
                {
                    values: theme('transitionDelay'),
                }
            );
        }),
    ]
};
