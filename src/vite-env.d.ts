/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_API_URL: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }