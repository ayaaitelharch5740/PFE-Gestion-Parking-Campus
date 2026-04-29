export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface:  '#ffffff',
        bg:       '#f4f6f9',
        border:   '#e8ecf2',
        ink: {
          900: '#1a2332',
          700: '#374151',
          500: '#6b7280',
          300: '#a0aab8',
        },
        blue: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        green: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        orange: {
          50:  '#fff7ed',
          500: '#f97316',
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        serif:   ['"Instrument Serif"', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
        md:   '0 4px 20px rgba(0,0,0,0.08)',
        blue: '0 4px 14px rgba(37,99,235,0.25)',
      },
      borderRadius: {
        xl2: '14px',
        xl3: '18px',
      }
    }
  },
  plugins: []
}