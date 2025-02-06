import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

export function AuthButton() {
  return (
    <Button
      variant="outline"
      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-500 borderblue-500/20 rounded-full shadow-none [&_svg]:size-5"
    >
      <UserCircleIcon />
      Sign in
    </Button>
  );
}
