"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";

export function SignOutButton() {
  const signOut = useSession((s) => s.signOut);
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={async () => {
        await signOut();
        toast("Signed out. Your bag is still saved on this device.");
        router.replace("/");
        router.refresh();
      }}
    >
      <LogOut /> Sign out
    </Button>
  );
}
