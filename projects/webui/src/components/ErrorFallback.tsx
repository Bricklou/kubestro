import { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error }: FallbackProps) {
  console.log(error);
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error}</pre>
    </div>
  );
}
