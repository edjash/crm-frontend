/// <reference types="vite/client" />
interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_SERVER_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_MODE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
