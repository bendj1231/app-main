const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname);
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const proc = spawn(`${npmCmd} run dev`, {
  cwd,
  stdio: 'inherit',
  shell: true
});

proc.on('exit', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  proc.kill('SIGINT');
});

process.on('SIGTERM', () => {
  proc.kill('SIGTERM');
});
