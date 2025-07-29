import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue.bold('🎨 TDP Design System Setup'));
  console.log();

  let config = {
    framework: 'react',
    bundler: 'vite',
    typescript: true,
    tailwind: true,
    fontFamily: 'geist'
  };

  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework are you using?',
        choices: [
          { name: 'React', value: 'react' },
          { name: 'Next.js', value: 'nextjs' },
          { name: 'Vue', value: 'vue' }
        ],
        default: 'react'
      },
      {
        type: 'list',
        name: 'bundler',
        message: 'Which bundler are you using?',
        choices: [
          { name: 'Vite', value: 'vite' },
          { name: 'Webpack', value: 'webpack' },
          { name: 'Next.js (built-in)', value: 'nextjs' }
        ],
        default: 'vite'
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        default: true
      },
      {
        type: 'confirm',
        name: 'tailwind',
        message: 'Do you want to setup Tailwind CSS?',
        default: true
      }
    ]);

    config = { ...config, ...answers };
  }

  const spinner = ora('Setting up TDP Design System...').start();

  try {
    // Create necessary directories
    await fs.ensureDir('src/components/ui');
    await fs.ensureDir('src/lib');

    // Copy base configuration files
    if (config.tailwind) {
      await setupTailwindConfig(config);
      await setupGlobalCSS(config);
    }
    
    await setupUtilsFile(config);
    await setupPackageJson(config);
    await setupFonts(config);

    spinner.succeed('TDP Design System initialized successfully!');
    
    console.log();
    console.log(chalk.green('✅ Setup complete!'));
    console.log();
    console.log('Next steps:');
    console.log(`  ${chalk.cyan('npm install')} - Install dependencies`);
    console.log(`  ${chalk.cyan('tdp add button')} - Add a button component`);
    console.log(`  ${chalk.cyan('tdp add card')} - Add a card component`);

  } catch (error) {
    spinner.fail('Failed to initialize TDP Design System');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

function getTemplatesPath(): string {
  // Get the directory where this script is located
  const currentDir = path.dirname(__filename);
  // Go up to the package root and find templates
  return path.join(currentDir, '../../templates');
}

async function setupTailwindConfig(config: any) {
  const templatesPath = getTemplatesPath();
  const templatePath = path.join(templatesPath, 'tailwind.config.ts');
  const targetPath = 'tailwind.config.ts';
  
  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, targetPath);
  } else {
    // Fallback: write the config directly
    const tailwindConfig = `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        heading: ["Halyard Display", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;`;

    await fs.writeFile(targetPath, tailwindConfig);
  }
}

async function setupGlobalCSS(config: any) {
  const cssPath = config.framework === 'nextjs' ? 'app/globals.css' : 'src/index.css';
  const templatesPath = getTemplatesPath();
  const templatePath = path.join(templatesPath, 'globals.css');
  
  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, cssPath);
  }
}

async function setupUtilsFile(config: any) {
  const templatesPath = getTemplatesPath();
  const templatePath = path.join(templatesPath, 'lib/utils.ts');
  const targetPath = 'src/lib/utils.ts';
  
  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, targetPath);
  } else {
    // Fallback
    const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
    await fs.writeFile(targetPath, utilsContent);
  }
}

async function setupPackageJson(config: any) {
  const packageJsonPath = 'package.json';
  
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Add dependencies
    packageJson.dependencies = packageJson.dependencies || {};
    Object.assign(packageJson.dependencies, {
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "class-variance-authority": "^0.7.0",
      "@radix-ui/react-slot": "^1.0.2",
      "@phosphor-icons/react": "^2.0.0"
    });

    packageJson.devDependencies = packageJson.devDependencies || {};
    Object.assign(packageJson.devDependencies, {
      "tailwindcss-animate": "^1.0.7"
    });

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

async function setupFonts(config: any) {
  console.log();
  console.log(chalk.yellow('📝 Font Setup Instructions:'));
  console.log('Add these fonts to your HTML <head>:');
  console.log(chalk.cyan(`
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/khl0xcy.css">
  `));
} 