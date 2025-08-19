import { NhostClient } from '@nhost/nhost-js';

const backendUrl = import.meta.env.VITE_NHOST_BACKEND_URL;

export const nhost = new NhostClient(
  backendUrl
    ? { backendUrl }
    : {
        subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
        region: import.meta.env.VITE_NHOST_REGION
      }
);
