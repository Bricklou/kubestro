import { Button } from "@/components/ui/button.tsx";
import { LogOutIcon } from "lucide-react";

function Navbar() {
  return (
    <header className="p-4 flex flex-row">
      <Button variant="secondary" size="sm" className="gap-x-2">
        <LogOutIcon className="size-5" />
        Logout
      </Button>
    </header>
  );
}

export default Navbar;
