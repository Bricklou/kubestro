import { Alert, AlertDescription, AlertTitle } from "@kubestro/design-system";
import { AlertTriangleIcon } from "lucide-react";

export function MissingRepoAlert() {
  return <Alert variant="warning">
    <AlertTriangleIcon className="size-4" />
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>
      Please configure at least one repository in order to be able to install a game manager.
    </AlertDescription>
  </Alert>
}
