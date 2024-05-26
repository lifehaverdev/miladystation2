const { execSync } = require('child_process');
const fs = require('fs');

// Ensure the environment variable is available
if (!process.env.GIT_MODULES) {
  throw new Error('GITMODULES environment variable is not set');
}

// Write the .gitmodules content to the .gitmodules file
fs.writeFileSync('.gitmodules', process.env.GIT_MODULES);

// Initialize and update the submodules
execSync('git submodule update --init --recursive', { stdio: 'inherit' });

// Continue with the build process
execSync('next build', { stdio: 'inherit' });