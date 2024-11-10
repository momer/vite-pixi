// @ts-check
import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin-js';
import stylisticTs from '@stylistic/eslint-plugin-ts';

// This is just an example default config for ESLint.
// You should change it to your needs following the documentation.
export default tseslint.config(
    {
        ignores: ['**/dist/**', '**/tmp/**', '**/coverage/**', '**/node_modules/**', '**/docs/**'],
    },

    {
        // ignores: ['**/test/**'],
        extends: [
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylisticTypeChecked,
        ],

        files: ['**/*.ts?(x)', '**/*.mts?(x)'],

        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@stylistic/ts': stylisticTs,
            '@stylistic/js': stylisticJs
        },

        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@stylistic/ts/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/ts/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'semi',
                        requireLast: true
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false
                    }
                }
            ],
            '@stylistic/ts/semi': ['error', 'always'],
            '@stylistic/ts/type-annotation-spacing': 'error',
            '@stylistic/js/eol-last': 'error',
            '@stylistic/js/no-trailing-spaces': 'error',
            '@stylistic/js/padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'return'
                }
            ],
            '@stylistic/js/space-in-parens': ['off', 'never'],
            '@stylistic/js/spaced-comment': [
                'error',
                'always',
                {
                    markers: ['/']
                }
            ],
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit',
                    overrides: {
                        constructors: 'no-public'
                    },
                    ignoredMethodNames: [
                        'ngOnInit',
                        'ngOnChanges',
                        'ngOnDestroy',
                        'ngAfterViewInit'
                    ]
                }
            ],
            '@typescript-eslint/member-ordering': ["error", {
                "default": [
                    "static-field",
                    "instance-field",
                    "static-method",
                    "instance-method"
                ]
            }],
            '@typescript-eslint/no-empty-interface': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/unified-signatures': 'error',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-require-imports': [
                'error',
                { allow: ['/package\\.json$', 'crypto'] }
            ],
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': [
                'error',
                {
                    ignorePrimitives: true
                }
            ],
            '@typescript-eslint/prefer-regexp-exec': 'off',
            '@typescript-eslint/adjacent-overload-signatures': 'off',
            'arrow-body-style': 'error',
            curly: 'error',
            eqeqeq: ['error', 'smart'],
            'guard-for-in': 'error',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-console': 'error',
            'no-eval': 'error',
            'no-new-wrappers': 'error',
            'no-throw-literal': 'error',
            'no-undef-init': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            radix: 'error'
        },

        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2020,
            sourceType: 'module',

            globals: {
                ...globals.browser,
            },

            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },

    {
        files: ['*config.js', '*.config.mjs', '*config.ts', '*config.mts'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        }

    },
    {
        files: ['test/**'],

        plugins: {
            vitest,
        },

        rules: {
            ...vitest.configs.recommended.rules,
        },

        settings: {
            vitest: {
                typecheck: true,
            },
        },

        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
            },
        },
    },
    eslintConfigPrettier,
);
