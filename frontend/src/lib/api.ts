import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export function withTenant(tenantId: string) {
  return {
    headers: {
      "x-tenant-id": tenantId,
    },
  };
}
