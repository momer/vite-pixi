module.exports = {
    content: [
        "./index.html",
        './src/**/*',
        './dist/*.{html, js}',
    ],
    theme: {
        extend: {
            spacing: {
                128: '32rem'
            }
        },
    },
    plugins: [],
}
