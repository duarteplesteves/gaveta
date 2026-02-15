import type { app } from "server";

import { treaty } from "@elysiajs/eden";
import { env } from "@gaveta/env/server";

export const api = treaty<app>(env.BASE_URL);
