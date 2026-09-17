import { spawn } from 'node:child_process';

function run(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, ...extraEnv }
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`));
    });
  });
}

const shouldSyncDatabase =
  process.env.STORAGE_PROVIDER === 'postgres' &&
  process.env.DEMO_MODE === 'false' &&
  Boolean(process.env.DATABASE_URL);

if (shouldSyncDatabase) {
  console.log('→ PostgreSQL mode detected: syncing Prisma schema before Next.js build');
  await run('npx', ['prisma', 'db', 'push', '--skip-generate']);
} else {
  console.log('→ Demo storage mode detected: skipping Prisma schema sync');
}

await run('next', ['build']);
