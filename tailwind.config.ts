import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	safelist: [
		// Extended color scales - ensure all color utilities are generated
		      {
        pattern: /bg-(gray|blue|red|green|amber|orange|purple|indigo|sky|pink|teal)-(50|100|200|300|400|500|600|700|800|900|950)/,
      },
      {
        pattern: /text-(gray|blue|red|green|amber|orange|purple|indigo|sky|pink|teal)-(50|100|200|300|400|500|600|700|800|900|950)/,
      },
      {
        pattern: /border-(gray|blue|red|green|amber|orange|purple|indigo|sky|pink|teal)-(50|100|200|300|400|500|600|700|800|900|950)/,
      },
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Design System Fonts (Customizable per client)
				'ds-sans': 'var(--ds-font-sans)',
				'ds-heading': 'var(--ds-font-heading)', 
				'ds-mono': 'var(--ds-font-mono)',
				'ds-display': 'var(--ds-font-display)',
				
				// Documentation Fonts (Fixed - don't change)
				'docs-sans': ['Geist', 'system-ui', 'sans-serif'],
				'docs-heading': ['Halyard Display', 'sans-serif'],
				'docs-mono': ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			colors: {
				// Semantic colors for component theming
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},

				// Extended Color Scales
				gray: {
					50: 'var(--gray-50)',
					100: 'var(--gray-100)',
					200: 'var(--gray-200)',
					300: 'var(--gray-300)',
					400: 'var(--gray-400)',
					500: 'var(--gray-500)',
					600: 'var(--gray-600)',
					700: 'var(--gray-700)',
					800: 'var(--gray-800)',
					900: 'var(--gray-900)',
					950: 'var(--gray-950)',
				},
				blue: {
					50: 'var(--blue-50)',
					100: 'var(--blue-100)',
					200: 'var(--blue-200)',
					300: 'var(--blue-300)',
					400: 'var(--blue-400)',
					500: 'var(--blue-500)',
					600: 'var(--blue-600)',
					700: 'var(--blue-700)',
					800: 'var(--blue-800)',
					900: 'var(--blue-900)',
					950: 'var(--blue-950)',
				},
				red: {
					50: 'var(--red-50)',
					100: 'var(--red-100)',
					200: 'var(--red-200)',
					300: 'var(--red-300)',
					400: 'var(--red-400)',
					500: 'var(--red-500)',
					600: 'var(--red-600)',
					700: 'var(--red-700)',
					800: 'var(--red-800)',
					900: 'var(--red-900)',
					950: 'var(--red-950)',
				},
				green: {
					50: 'var(--green-50)',
					100: 'var(--green-100)',
					200: 'var(--green-200)',
					300: 'var(--green-300)',
					400: 'var(--green-400)',
					500: 'var(--green-500)',
					600: 'var(--green-600)',
					700: 'var(--green-700)',
					800: 'var(--green-800)',
					900: 'var(--green-900)',
					950: 'var(--green-950)',
				},
				
				amber: {
					50: 'var(--amber-50)',
					100: 'var(--amber-100)',
					200: 'var(--amber-200)',
					300: 'var(--amber-300)',
					400: 'var(--amber-400)',
					500: 'var(--amber-500)',
					600: 'var(--amber-600)',
					700: 'var(--amber-700)',
					800: 'var(--amber-800)',
					900: 'var(--amber-900)',
					950: 'var(--amber-950)',
				},
				orange: {
					50: 'var(--orange-50)',
					100: 'var(--orange-100)',
					200: 'var(--orange-200)',
					300: 'var(--orange-300)',
					400: 'var(--orange-400)',
					500: 'var(--orange-500)',
					600: 'var(--orange-600)',
					700: 'var(--orange-700)',
					800: 'var(--orange-800)',
					900: 'var(--orange-900)',
					950: 'var(--orange-950)',
				},
				purple: {
					50: 'var(--purple-50)',
					100: 'var(--purple-100)',
					200: 'var(--purple-200)',
					300: 'var(--purple-300)',
					400: 'var(--purple-400)',
					500: 'var(--purple-500)',
					600: 'var(--purple-600)',
					700: 'var(--purple-700)',
					800: 'var(--purple-800)',
					900: 'var(--purple-900)',
					950: 'var(--purple-950)',
				},
				indigo: {
					50: 'var(--indigo-50)',
					100: 'var(--indigo-100)',
					200: 'var(--indigo-200)',
					300: 'var(--indigo-300)',
					400: 'var(--indigo-400)',
					500: 'var(--indigo-500)',
					600: 'var(--indigo-600)',
					700: 'var(--indigo-700)',
					800: 'var(--indigo-800)',
					900: 'var(--indigo-900)',
					950: 'var(--indigo-950)',
				},
				sky: {
					50: 'var(--sky-50)',
					100: 'var(--sky-100)',
					200: 'var(--sky-200)',
					300: 'var(--sky-300)',
					400: 'var(--sky-400)',
					500: 'var(--sky-500)',
					600: 'var(--sky-600)',
					700: 'var(--sky-700)',
					800: 'var(--sky-800)',
					900: 'var(--sky-900)',
					950: 'var(--sky-950)',
				},
				pink: {
					50: 'var(--pink-50)',
					100: 'var(--pink-100)',
					200: 'var(--pink-200)',
					300: 'var(--pink-300)',
					400: 'var(--pink-400)',
					500: 'var(--pink-500)',
					600: 'var(--pink-600)',
					700: 'var(--pink-700)',
					800: 'var(--pink-800)',
					900: 'var(--pink-900)',
					950: 'var(--pink-950)',
				},
				teal: {
					50: 'var(--teal-50)',
					100: 'var(--teal-100)',
					200: 'var(--teal-200)',
					300: 'var(--teal-300)',
					400: 'var(--teal-400)',
					500: 'var(--teal-500)',
					600: 'var(--teal-600)',
					700: 'var(--teal-700)',
					800: 'var(--teal-800)',
					900: 'var(--teal-900)',
					950: 'var(--teal-950)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
