import React from "react";
import ContentList from "./content-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function App() {

  return (
<QueryClientProvider client={queryClient}>
      <ContentList />
    </QueryClientProvider>
  );
}
