import React from "react";
import routes from "app/routes";
import { allRoles } from "user/user_role";
import { useCurrentUser } from "login/login_state";
import { Redirect } from "react-router-dom";

export default function ProtectedPage({children, allowedRoles=allRoles}) {
  let currentUser = useCurrentUser();
  
  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return children;
  } else {
    return <Redirect to={routes.rootPath()}/>;
  }
}