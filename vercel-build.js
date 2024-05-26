const { execSync } = require('child_process');
const fs = require('fs');
  // Ensure the environment variables are available
  if (!process.env.GIT_MODULES) {
    throw new Error('GITMODULES environment variable is not set');
  }

  // Write the .gitmodules content to the .gitmodules file
  try {
    console.log('Writing .gitmodules content...');
    const gitmodulesContent = process.env.GIT_MODULES
    fs.writeFileSync('.gitmodules', gitmodulesContent);
  } catch (error) {
    throw new Error(`Failed to write .gitmodules file: ${error.message}`);
  }

  // Initialize and update the submodules
  try {
    console.log('Initializing and updating submodules...');
    execSync('git submodule update --init --recursive', { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to initialize and update submodules: ${error.message}`);
  }

  // Continue with the build process
  try {
    console.log('Building the Next.js application...');
    execSync('next build', { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to build the Next.js application: ${error.message}`);
  }

