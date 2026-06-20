// Structural shell for the consumer domain.
// Acts as a passthrough — NavRail and page state live inside UserSearchPage itself.

import { Outlet } from "react-router";

export default function UserMainLayout() {
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <Outlet />
    </div>
  );
}
