"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function SessionWatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" && (pathname.startsWith("/admin") || pathname.startsWith("/member"))) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }

    if (status === "authenticated" && session?.user) {
      if (pathname.startsWith("/admin") && session.user.role !== "admin") {
        router.push("/member/dashboard");
      }
      if (pathname.startsWith("/member") && session.user.role !== "member") {
        router.push("/admin/dashboard");
      }
    }
  }, [session, status, pathname, router]);

  return null;
}
