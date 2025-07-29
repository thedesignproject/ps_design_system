import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface AddOptions {
  overwrite?: boolean;
}

export async function addCommand(component: string, options: AddOptions) {
  console.log(chalk.blue(`Adding ${component} component...`));
  
  const spinner = ora(`Installing ${component}...`).start();
  
  try {
    await installComponent(component, options);
    
    spinner.succeed(`${component} component added successfully!`);
    console.log(chalk.green(`✅ ${component} is ready to use!`));
    console.log();
    console.log('Import it in your components:');
    console.log(chalk.cyan(`import { ${getComponentImport(component)} } from "@/components/ui/${component}"`));
    
  } catch (error) {
    spinner.fail(`Failed to add ${component} component`);
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

async function installComponent(component: string, options: AddOptions) {
  const componentMap: Record<string, { files: string[], description: string }> = {
    button: {
      files: ['button.tsx'],
      description: 'Button component with variants'
    },
    card: {
      files: ['card.tsx'],
      description: 'Card component with header and content'
    },
    input: {
      files: ['input.tsx'],
      description: 'Input component with validation'
    },
    badge: {
      files: ['badge.tsx'],
      description: 'Badge component with different styles'
    }
  };

  const componentInfo = componentMap[component.toLowerCase()];
  
  if (!componentInfo) {
    throw new Error(`Component "${component}" not found. Available: ${Object.keys(componentMap).join(', ')}`);
  }

  // Ensure directories exist
  await fs.ensureDir('src/components/ui');
  await fs.ensureDir('src/lib');

  // Check if utils.ts exists, if not create it
  const utilsPath = 'src/lib/utils.ts';
  if (!(await fs.pathExists(utilsPath))) {
    const templatesPath = getTemplatesPath();
    const templateUtilsPath = path.join(templatesPath, 'lib/utils.ts');
    if (await fs.pathExists(templateUtilsPath)) {
      await fs.copy(templateUtilsPath, utilsPath);
    } else {
      // Fallback
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
      await fs.writeFile(utilsPath, utilsContent);
    }
  }

  // Copy component files
  const templatesPath = getTemplatesPath();
  for (const file of componentInfo.files) {
    const templatePath = path.join(templatesPath, 'components/ui', file);
    const targetPath = path.join('src/components/ui', file);
    
    // Check if file already exists
    if (await fs.pathExists(targetPath) && !options.overwrite) {
      console.log(chalk.yellow(`⚠️  ${file} already exists. Use --overwrite to replace it.`));
      continue;
    }
    
    if (await fs.pathExists(templatePath)) {
      await fs.copy(templatePath, targetPath);
      console.log(chalk.gray(`📁 Created ${targetPath}`));
    } else {
      throw new Error(`Template for ${file} not found at ${templatePath}`);
    }
  }

  // Update package.json with required dependencies
  await addDependencies(component);
}

async function addDependencies(component: string) {
  const packageJsonPath = 'package.json';
  
  if (!(await fs.pathExists(packageJsonPath))) {
    console.log(chalk.yellow('⚠️  package.json not found. Skipping dependency installation.'));
    return;
  }

  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.dependencies = packageJson.dependencies || {};

  // Base dependencies for all components
  const baseDependencies = {
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  };

  // Component-specific dependencies
  const componentDependencies: Record<string, Record<string, string>> = {
    button: {
      "@radix-ui/react-slot": "^1.0.2",
      "class-variance-authority": "^0.7.0"
    },
    badge: {
      "class-variance-authority": "^0.7.0"
    }
  };

  // Add dependencies
  Object.assign(packageJson.dependencies, baseDependencies);
  if (componentDependencies[component]) {
    Object.assign(packageJson.dependencies, componentDependencies[component]);
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  
  console.log(chalk.blue('📦 Dependencies added to package.json'));
  console.log(chalk.yellow('💡 Run "npm install" to install new dependencies'));
}

function getComponentImport(component: string): string {
  const imports: Record<string, string> = {
    button: 'Button',
    card: 'Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter',
    input: 'Input',
    badge: 'Badge'
  };
  
  return imports[component.toLowerCase()] || component;
} 