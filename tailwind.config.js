/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Fluid spacing scale using clamp()
            spacing: {
                'fluid-xs': 'clamp(0.25rem, 0.5vw, 0.5rem)',
                'fluid-sm': 'clamp(0.5rem, 1vw, 0.75rem)',
                'fluid-md': 'clamp(1rem, 2vw, 1.5rem)',
                'fluid-lg': 'clamp(1.5rem, 3vw, 2.5rem)',
                'fluid-xl': 'clamp(2rem, 4vw, 4rem)',
                'fluid-2xl': 'clamp(3rem, 6vw, 6rem)',
                // Fluid sidebar width
                'sidebar': 'clamp(260px, 18vw, 300px)',
            },
            // Fluid font sizes using clamp()
            fontSize: {
                'fluid-xs': 'clamp(0.625rem, 0.8vw, 0.75rem)',     // 10-12px
                'fluid-sm': 'clamp(0.75rem, 0.9vw, 0.875rem)',    // 12-14px
                'fluid-base': 'clamp(0.875rem, 1vw, 1rem)',        // 14-16px
                'fluid-lg': 'clamp(1rem, 1.2vw, 1.125rem)',        // 16-18px
                'fluid-xl': 'clamp(1.125rem, 1.5vw, 1.25rem)',     // 18-20px
                'fluid-2xl': 'clamp(1.25rem, 2vw, 1.5rem)',       // 20-24px
                'fluid-3xl': 'clamp(1.5rem, 3vw, 2rem)',           // 24-32px
                'fluid-4xl': 'clamp(2rem, 4vw, 2.5rem)',           // 32-40px
                'fluid-5xl': 'clamp(2.5rem, 5vw, 3.5rem)',         // 40-56px
                'fluid-6xl': 'clamp(3rem, 6vw, 4.5rem)',           // 48-72px
            },
            // Fluid container sizing
            width: {
                'fluid-sm': 'clamp(300px, 90vw, 400px)',
                'fluid-md': 'clamp(400px, 85vw, 600px)',
                'fluid-lg': 'clamp(600px, 80vw, 900px)',
                'fluid-xl': 'clamp(800px, 75vw, 1200px)',
                'fluid-2xl': 'clamp(1000px, 70vw, 1400px)',
            },
            maxWidth: {
                'fluid-sm': 'clamp(300px, 90vw, 400px)',
                'fluid-md': 'clamp(400px, 85vw, 600px)',
                'fluid-lg': 'clamp(600px, 80vw, 900px)',
                'fluid-xl': 'clamp(800px, 75vw, 1200px)',
                'fluid-2xl': 'clamp(1000px, 70vw, 1400px)',
            },
            // Fluid border radius
            borderRadius: {
                'fluid-sm': 'clamp(0.5rem, 1vw, 0.75rem)',
                'fluid-md': 'clamp(0.75rem, 1.5vw, 1rem)',
                'fluid-lg': 'clamp(1rem, 2vw, 1.5rem)',
                'fluid-xl': 'clamp(1.5rem, 3vw, 2rem)',
            },
        },
    },
    plugins: [],
}

