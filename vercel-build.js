const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Ensure the GITHUB_ACCESS_TOKEN environment variable is available
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error('GITHUB_ACCESS_TOKEN environment variable is not set');
  }

  // Submodule information
  const SUBMODULE_GITHUB = 'github.com/lifehaverdev/stationthisdeluxebot';
  const SUBMODULE_PATH = 'src/deluxebot';

  // Get submodule commit
  let output = execSync('git submodule status --recursive').toString();
  let noPrefix = output.split('-')[1]; // get rid of the prefix
  let COMMIT = noPrefix.split(' ')[0]; // get rid of the suffix

  // Set up an empty temporary work directory
  const tmpDir = path.join(__dirname, 'tmp');
  execSync(`rm -rf ${tmpDir} || true`); // remove the tmp folder if exists
  fs.mkdirSync(tmpDir); // create the tmp folder

  // Checkout the current submodule commit
  process.chdir(tmpDir);
  execSync('git init'); // initialise empty repo
  execSync(`git remote add origin https://${process.env.GITHUB_ACCESS_TOKEN}@${SUBMODULE_GITHUB}`); // add origin of the submodule
  execSync(`git fetch --depth=1 origin ${COMMIT}`); // fetch only the required version
  execSync(`git checkout ${COMMIT}`); // checkout on the right commit

  // Move the submodule from tmp to the submodule path
  process.chdir('..'); // go one directory up
  execSync(`rm -rf ${path.join(tmpDir, '.git')}`); // remove .git
  execSync(`mv ${tmpDir}/* ${SUBMODULE_PATH}/`); // move the submodule to the submodule path

  // Clean up
  execSync(`rm -rf ${tmpDir}`); // remove the tmp folder

    // Navigate to the submodule and install dependencies
    process.chdir(SUBMODULE_PATH);
    execSync('npm install', { stdio: 'inherit' });
  
    // Navigate back to the root directory and build the project
    process.chdir('../..');
    console.log('Building the Next.js application...');
    execSync('next build', { stdio: 'inherit' });
    console.log('Next.js application built successfully');

} catch (error) {
  console.error('Error during Vercel build:', error);
  process.exit(1);
}
