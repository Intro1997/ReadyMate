# ReadyMate

A command-line tool for checking and installing software dependencies with customizable installers and cross-platform support.

## Features

- Check if specific software is installed on your system
- Install missing dependencies using various package managers
- Support multiple operating systems (macOS, Windows, Linux)
- Customizable installation commands per operating system
- Root privilege support for Linux installations
- Interactive installation confirmation with auto-approve option
- JSON configuration file support for installation settings

## Installation

Install globally using npm:

```bash
npm install -g readymate
```

## Configuration File

ReadyMate uses a JSON configuration file (`ready_mate_config.json`) to define installation settings. You can specify different installation commands for different operating systems.

Example configuration:

```json
{
  "clang-tidy": {
    "macos": {
      "support": true,
      "installer": "brew",
      "cmd": "install llvm"
    },
    "windows": {
      "support": true,
      "installer": "choco",
      "cmd": "install llvm"
    },
    "linux": {
      "support": true,
      "installer": "apt-get",
      "cmd": "install clang-tidy"
      "root": true
    }
  }
}
```

Configuration file structure:

- Each software package is defined by a top-level key
- Each package can have OS-specific configurations (`macos`, `windows`, `linux`)
- OS-specific configuration options:
  - `support`: Boolean indicating if the software is supported on this OS (default: true)
  - `installer`: The package manager to use
  - `cmd`: The installation command (including the package name)
  - `root`: (Linux only) Boolean indicating if sudo is required

## Usage

### Command Line Interface

```bash
readymate [options]
```

Options:

- `-c, --config-file <path>`: Path to configuration file (defaults to ready_mate_config.json in current directory)
- `-y, --yes`: Skip confirmation steps
- `-v, --version`: Output version number
- `-h, --help`: Display help information

Examples:

```bash
# Use default config file in current directory
readymate
# Use custom config file
readymate -c /path/to/config.json
# Auto-approve all installations
readymate -y
```

### API Usage

```js
const { check } = require("readymate");
// Check and install software using config file
await check(
  "/path/to/config.json", // config file path (optional)
  true // auto-approve all (optional)
);
```

## Operating System Support

- macOS (darwin)
- Windows (win32)
- Linux
- Other platforms (will use default installation commands)

## Requirements

- Node.js >= 14
- npm >= 6

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
