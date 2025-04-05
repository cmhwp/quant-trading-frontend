// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Get Indices GET /api/indices */
export async function getIndicesApiIndicesGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/indices", {
    method: "GET",
    ...(options || {}),
  });
}
