// Consumer domain React Router sub-routes — Owner: Kong Leak Smey.

import { Route } from "react-router";
import UserMainLayout from "../layouts/UserMainLayout";
import UserSearchPage from "../pages/UserSearchPage";

export function UserRoutes() {
  return (
    <Route path="/user" element={<UserMainLayout />}>
      <Route index element={<UserSearchPage />} />
      {/* Future: /user/vendor/:id, /user/profile, /user/routes/saved */}
    </Route>
  );
}
