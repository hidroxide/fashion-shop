import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import React from "react";

import Auth from "@/components/auth";
import Layout from "@/components/layout";
import "@/styles/globals.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
});

const App = ({ Component, pageProps }) => {
  const AuthComponent = Component.isAuth ? Auth : React.Fragment;

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>iCOND Website</title>
        <link rel="icon" href="/img/logo.png" />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </Head>
      <AuthComponent>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthComponent>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
