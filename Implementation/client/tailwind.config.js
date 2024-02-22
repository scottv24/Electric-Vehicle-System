/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            accent: '#047508',
            gray: '#64748b',
            red: '#E5261F',
            white: 'white',
            black: 'black',
            bg: '#F2F1F1',
        },
        extend: {
            textColor: {
                nav: {
                    primary: 'var(--nav-primary)',
                    selected: 'var(--nav-selected-text)',
                },
            },
            backgroundColor: {
                nav: {
                    selected: 'var(--nav-selected)',
                    standard: 'var(--nav-bg)',
                    hover: 'var(--nav-hover)',
                },
            },
        },
    },
    plugins: [],
}
