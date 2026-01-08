"use client";

import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto relative z-10">
      <Separator />
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

