import { type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "@/pages/AuthPage/AuthPage.tsx";
import OverviewPage from "@/pages/OverviewPage/OverviewPage.tsx";
import TransactionsPage from "@/pages/TransactionsPage/TransactionsPage.tsx";
import BudgetsPage from "@/pages/BudgetsPage/BudgetsPage.tsx";
import PotsPage from "@/pages/PotsPage/PotsPage.tsx";
import RecurringBillsPage from "@/pages/RecurringBillsPage/RecurringBillsPage.tsx";
import ProtectedRoute from "@/pages/ProtectedRoute/ProtectedRoute.tsx";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";

const App = (): ReactElement => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTE_PATHS.OVERVIEW} element={<OverviewPage />} />
        <Route path={ROUTE_PATHS.TRANSACTIONS} element={<TransactionsPage />} />
        <Route path={ROUTE_PATHS.BUDGETS} element={<BudgetsPage />} />
        <Route path={ROUTE_PATHS.POTS} element={<PotsPage />} />
        <Route
          path={ROUTE_PATHS.RECURRING_BILLS}
          element={<RecurringBillsPage />}
        />
      </Route>
      <Route path="*" element={<Navigate to={ROUTE_PATHS.HOME} replace />} />
    </Routes>
  );
};

export default App;
