/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URI: string;
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
