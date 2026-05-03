"use client";

import { useRBAC } from "@/hooks/useRBAC";
import { ModuleId } from "@/types/admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldX } from "lucide-react";

interface RouteGuardProps {
  moduleId: ModuleId;
  children: React.ReactNode;
}

export function RouteGuard({ moduleId, children }: RouteGuardProps) {
  const { modules } = useRBAC();
  const router = useRouter();

  useEffect(() => {
    if (!modules.includes(moduleId)) {
      router.replace("/admin/403");
    }
  }, [moduleId, modules, router]);

  if (!modules.includes(moduleId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldX size={48} className="text-slate-300" />
        <p className="text-slate-500 text-sm">Checking permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
