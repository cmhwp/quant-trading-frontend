// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Health Check Health check endpoint for the API GET /api/health */
export async function healthCheckApiHealthGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/health", {
    method: "GET",
    ...(options || {}),
  });
}
