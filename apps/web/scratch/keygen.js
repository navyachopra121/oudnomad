const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const sshDir = path.join(os.homedir(), '.ssh');
const keyPath = path.join(sshDir, 'id_ed25519');

if (fs.existsSync(keyPath)) fs.unlinkSync(keyPath);
if (fs.existsSync(keyPath + '.pub')) fs.unlinkSync(keyPath + '.pub');

const res = spawnSync('ssh-keygen', ['-t', 'ed25519', '-f', keyPath, '-N', '', '-q']);
if (res.error) {
  console.error(res.error);
} else {
  const pubKey = fs.readFileSync(keyPath + '.pub', 'utf-8');
  console.log('PUBLIC_KEY_READY:\n' + pubKey.trim());
}
