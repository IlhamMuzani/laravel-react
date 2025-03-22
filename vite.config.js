// import {
//     defineConfig
// } from 'vite';
// import laravel from 'laravel-vite-plugin';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['resources/js/app.jsx'], // Ubah dari app.js ke app.jsx
//             refresh: true,
//         }),
//         react(),
//     ],
// });
import {
    defineConfig
} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/App.jsx'],
            refresh: true,
        }),
        react(),
    ],
    base: process.env.VITE_BASENAME || '/',
});

