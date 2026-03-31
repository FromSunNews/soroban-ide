/**
 * Terminal command execution logic.
 * Returns output string for each command.
 *
 * Local commands are handled here.
 * Stellar commands are detected but executed by Terminal.jsx via the backend.
 */

/**
 * Check if a command should be routed to the backend (any `stellar` command).
 */
export const isStellarCommand = (cmd) => {
  const trimmed = cmd.trim().toLowerCase();
  return trimmed.startsWith('stellar ');
};

/**
 * List files/folders at the given cwd relative to the workspace tree.
 * Returns a formatted string like a real `ls` output.
 */
const listFiles = (treeData, cwd) => {
  if (!treeData?.length) return '';

  // The root of the tree is the project folder
  const root = treeData[0];
  if (!root) return '';

  // Parse cwd to find the target node
  // cwd is like "~/project" or "~/project/src"
  const cwdParts = cwd.replace(/^~\/project\/?/, '').split('/').filter(Boolean);

  let current = root;
  for (const part of cwdParts) {
    if (!current.children?.length) return `ls: cannot access '${part}': No such file or directory`;
    const found = current.children.find((c) => c.name === part);
    if (!found) return `ls: cannot access '${part}': No such file or directory`;
    if (found.type !== 'folder') return `ls: '${part}' is not a directory`;
    current = found;
  }

  if (!current.children?.length) return '';

  // Format output: folders with trailing /, files without
  const entries = current.children
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .map((node) => (node.type === 'folder' ? `${node.name}/` : node.name));

  return entries.join('\n');
};

/**
 * Execute a local terminal command.
 * @param {string} cmd - Full command string
 * @param {string} cwd - Current working directory
 * @param {function} setCwd - State setter for cwd
 * @param {Array} treeData - Workspace tree (optional, for ls)
 * @returns {string|null} Output string, or null to clear terminal
 */
export const executeTerminalCommand = (cmd, cwd, setCwd, treeData) => {
  const parts = cmd.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      return `Available commands:
  clear                    - Clear terminal
  pwd                      - Print working directory
  cd <dir>                 - Change directory
  ls                       - List files in current directory
  echo <text>              - Print text
  whoami                   - Current user
  date                     - Current date

  stellar contract build   - Build Soroban contract (via backend)
  stellar contract deploy  - Deploy contract (via backend)
  stellar <...>            - Any stellar CLI command (via backend)`;

    case 'clear':
      return null; // Signal to clear history

    case 'pwd':
      return cwd;

    case 'cd':
      if (args.length === 0 || args[0] === '~') {
        setCwd('~/project');
      } else if (args[0] === '..') {
        setCwd((prev) => {
          const segments = prev.split('/');
          if (segments.length > 1) segments.pop();
          return segments.join('/') || '/';
        });
      } else {
        setCwd((prev) => {
          return args[0].startsWith('/') ? args[0] : `${prev}/${args[0]}`;
        });
      }
      return '';

    case 'ls':
      if (treeData) {
        return listFiles(treeData, cwd);
      }
      return '';

    case 'echo':
      return args.join(' ');

    case 'whoami':
      return 'developer';

    case 'date':
      return new Date().toString();

    case 'cat':
      return `cat: reading from workspace not yet supported`;

    case 'npm':
      if (args[0] === 'install' || args[0] === 'i') {
        return '[npm] Installing dependencies...\n[npm] Added 42 packages in 2s';
      } else if (args[0] === 'run' || args[0] === 'start') {
        return `[npm] Running ${args[1] || 'start'}...\n[npm] Starting development server at http://localhost:3000`;
      } else if (args[0] === 'build') {
        return '[npm] Building project...\n[npm] Build completed in 5.2s';
      }
      return `[npm] Unknown command: ${args[0] || ''}`;

    default:
      return `Command not found: ${command}\nType 'help' for available commands.`;
  }
};
