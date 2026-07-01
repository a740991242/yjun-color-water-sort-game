/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_PORT: string
  readonly VITE_OUT_DIR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
