// Strips children from the DOM when the user lacks the required role.
// Use this instead of inline ternaries to keep access logic centralised.

import { useAuth } from "../hooks/useAuth";

/**
 * @param {{ allowedRoles: string[], children: React.ReactNode, fallback?: React.ReactNode }} props
 */
export function RBACContainer({ allowedRoles, children, fallback = null }) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role_scope)) return <>{fallback}</>;
  return <>{children}</>;
}
