import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
// import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      // viteMockServe({
      //   mockPath: 'mock',
      //   localEnabled: true,
      // }),
      svgLoader(),
    ],

    server: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        // [VITE_API_URL_PREFIX]: { target: 'http://192.168.1.250:3000/', changeOrigin: true },
        '/api': { target: 'http://192.168.1.250:3000/' },
        '/chat': {
          target: 'http://192.168.1.250:5000/',
          ws: true,
          rewrite: (path) => path.replace(/^\/chat/, ''),
        },
        '/socket.io': {
          target: 'http://192.168.1.250:5000/',
          ws: true,
        },
      },
    },
  };
};
