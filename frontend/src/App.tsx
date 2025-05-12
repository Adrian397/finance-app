import { type ReactElement, useEffect } from "react";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import { initializeAuth, useAuthStore } from "@/stores/authStore.ts";

const TestPage = (): ReactElement => {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <h1>Welcome to your Test Page, {user?.name || user?.email}!</h1>
      <p>Your details:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
const App = (): ReactElement => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    initializeAuth();
  }, []);

  if (token && isLoadingUser && !useAuthStore.getState().user) {
    return <div>Loading session...</div>;
  }

  return isAuthenticated ? <TestPage /> : <AuthPage />;
};

export default App;
