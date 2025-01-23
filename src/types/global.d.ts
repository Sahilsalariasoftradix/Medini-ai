// Assets
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Environment Variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_API_URL: string;
    REACT_APP_VERSION: string;
  }
}

// Global Variables
declare const APP_VERSION: string;
declare const IS_PRODUCTION: boolean;

// Custom Utilities
type Nullable<T> = T | null;

type Dictionary<T = any> = {
  [key: string]: T;
};

// Global Event Map
interface CustomEventMap {
  userLoggedIn: { userId: string };
  userLoggedOut: {};
}

declare global {
  interface WindowEventMap extends CustomEventMap {}
}
