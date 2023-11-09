import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  name: 'lsrx',
  test: {
    globals: true,
  },
}));
