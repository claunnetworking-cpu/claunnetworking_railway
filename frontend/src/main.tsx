import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  // Nao redirecionar para login se ja estamos em uma rota publica
  const publicRoutes = ['/company-registration', '/sell-job-plans', '/sell-course-plans', '/sell-mentorship-plans'];
  const currentPath = window.location.pathname;
  if (publicRoutes.some(route => currentPath.startsWith(route))) {
    return;
  }

  window.location.href = getLoginUrl();
};

// Remover assinatura global de erro de autenticacao para permitir navegacao em rotas publicas
// queryClient.getQueryCache().subscribe(event => {
//   if (event.type === "updated" && event.action.type === "error") {
//     const error = event.query.state.error;
//     redirectToLoginIfUnauthorized(error);
//     console.error("[API Query Error]", error);
//   }
// });
//
// queryClient.getMutationCache().subscribe(event => {
//   if (event.type === "updated" && event.action.type === "error") {
//     const error = event.mutation.state.error;
//     redirectToLoginIfUnauthorized(error);
//     console.error("[API Mutation Error]", error);
//   }
// });

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
