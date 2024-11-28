const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { checkCommand } = require('./checker');
const { installSoftware } = require('./installer');

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
 * Load and validate config file
 * @param {string} configPath Path to config file
 * @returns {Object} Parsed config
 */
function loadConfig(configPath) {
  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configFile);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Config file not found: ${configPath}`);
    }
    throw new Error(`Invalid config file: ${error.message}`);
  }
}

/**
 * Check and install software dependencies
 * @param {string} [configFile] Path to config file
 * @param {boolean} [yes=false] Skip confirmation
 * @returns {Promise<boolean>} Success status
 */
async function check(configFile, yes = false) {
  const configPath = configFile || path.join(process.cwd(), 'ready_mate_config.json');
  const config = loadConfig(configPath);
  const currentOS = getOS();
  const failed = [];

  for (const [software, conf] of Object.entries(config)) {
    if (checkCommand(software)) {
      console.log(chalk.green(`Find ${software}.`));
      continue;
    }

    const osConfig = conf[currentOS];
    if (osConfig) {
      if (!osConfig.support) {
        console.log(chalk.red(`${software} is not supported on ${currentOS}.`));
        return false;
      }

      if (!checkCommand(osConfig.installer)) {
        console.log(chalk.red(`Installer ${osConfig.installer} not found.`));
        return false;
      }

      const success = await installSoftware(
        software,
        osConfig.installer,
        osConfig.cmd,
        yes,
        currentOS === 'linux' && osConfig.root === true
      );
      if (!success) failed.push(software);
    } else {
      // Check if software has a valid default installer
      if (!conf.installer || conf.installer.trim() === '') {
        console.log(chalk.red(`Auto installation of ${software} is not supported on ${currentOS}.`));
        return false;
      }

      if (!checkCommand(conf.installer)) {
        console.log(chalk.red(`Installer ${conf.installer} not found.`));
        return false;
      }

      const success = await installSoftware(
        software,
        conf.installer,
        conf.cmd,
        yes,
        false // Don't use root for default installer
      );
      if (!success) failed.push(software);
    }
  }

  // Final check
  for (const software of Object.keys(config)) {
    if (!checkCommand(software)) {
      console.log(chalk.red(`❌ Find and install ${software} failed.`));
    }
  }

  if (failed.length === 0) {
    console.log(chalk.green('✅ All software/commands are ready.'));
    return true;
  }
  return false;
}

module.exports = {
  check
}; 