import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer } from "../components/layout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-7xl font-display font-bold gold-text">404</h1>
        <p className="mt-4 text-muted-foreground">This page could not be found.</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110">
          Go Home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JusticeLink — Know Your Rights. Understand the Law." },
      { name: "description", content: "AI-powered legal guidance for Indian citizens. Get applicable sections, evidence checklists, and FIR drafts in plain language." },
      { name: "author", content: "JusticeLink" },
      { property: "og:title", content: "JusticeLink — Know Your Rights. Understand the Law." },
      { property: "og:description", content: "AI-powered legal guidance for Indian citizens. Get applicable sections, evidence checklists, and FIR drafts in plain language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JusticeLink — Know Your Rights. Understand the Law." },
      { name: "twitter:description", content: "AI-powered legal guidance for Indian citizens. Get applicable sections, evidence checklists, and FIR drafts in plain language." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2dce9169-cccd-4962-a23e-a11ad18f14c9/id-preview-0cfedadd--635c52b7-be46-4df8-a8f3-364922329db2.lovable.app-1782983983329.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2dce9169-cccd-4962-a23e-a11ad18f14c9/id-preview-0cfedadd--635c52b7-be46-4df8-a8f3-364922329db2.lovable.app-1782983983329.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Chrome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  return (
    <>
      {!isAdmin && <Header />}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Chrome />
      <Toaster theme="dark" position="top-right" />
    </QueryClientProvider>
  );
}
