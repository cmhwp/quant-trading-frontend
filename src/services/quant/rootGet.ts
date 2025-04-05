// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Root GET / */
export async function rootGet(options?: { [key: string]: any }) {
  return request<any>("/", {
    method: "GET",
    ...(options || {}),
  });
}
