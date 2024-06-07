import { ReactElement } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FingerprintIcon } from "lucide-react";

export function Login(): ReactElement {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="font-bold text-3xl">Kubestro</h1>
      <Button className="gap-x-2">
        <FingerprintIcon className="size-5" />
        Login by OIDC
      </Button>
    </div>
  );
}
