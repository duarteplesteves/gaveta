// Disable all Oxlint rules for the rest of the file
/* oxlint-disable */

import type { Path } from "better-auth/plugins";

import { auth } from "@gaveta/auth";

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  components: getSchema().then(({ components }) => components) as Promise<any>,
  getPaths: (prefix = "/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path] as Path;

        for (const method of Object.keys(paths[path] as Path)) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
} as const;
