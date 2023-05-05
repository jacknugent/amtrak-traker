import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Trains from "./components/Trains";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Trains />
    </QueryClientProvider>
  );
}

export default App;
