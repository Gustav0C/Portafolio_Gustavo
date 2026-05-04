import { ReactNode } from "react";

interface SchemaScriptProps {
  data: Record<string, unknown>;
}

export function SchemaScript({ data }: SchemaScriptProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
