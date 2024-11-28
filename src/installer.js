const { spawn } = require('child_process');
const chalk = require('chalk');
const os = require('os');

/**
 * Get current operating system
 * @returns {string} Operating system name
 */
function getOS() {
  const platform = os.platform();
  switch (platform) {
    case 'darwin':
      return 'macos';
    case 'win32':
      return 'windows';
    case 'linux':
      return 'linux';
    default:
      return platform;
  }
}

/**
 * Install software using specified installer and command
 * @param {string} software Software to install
 * @param {string} installer Installer to use
 * @param {string} cmd Installation command
 * @param {boolean} skipConfirm Skip confirmation
 * @param {boolean} [useRoot=false] Use sudo for Linux
 * @returns {Promise<boolean>} Installation success
 */
async function installSoftware(software, installer, cmd, skipConfirm = false, useRoot = false) {
  if (!skipConfirm) {
    const answer = await askForConfirmation(
      `Do you want to install ${software} using ${installer}? (y/N) `
    );
    if (!answer) {
      console.log(chalk.yellow('Installation cancelled.'));
      return false;
    }
  }

  return new Promise((resolve) => {
    const cmdParts = cmd.split(' ').filter(Boolean);
    
    // Add sudo if root is required on Linux
    const isLinux = getOS() === 'linux';
    const spawnOptions = {
      stdio: 'inherit',
      shell: isLinux && useRoot // Use shell when sudo is needed on Linux
    };

    let finalInstaller = installer;
    if (isLinux && useRoot) {
      finalInstaller = `sudo ${installer}`;
    }

    const installation = spawn(finalInstaller, cmdParts, spawnOptions);

    installation.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

function askForConfirmation(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim().toLowerCase() === 'y');
    });
  });
}

module.exports = {
  installSoftware
}; 