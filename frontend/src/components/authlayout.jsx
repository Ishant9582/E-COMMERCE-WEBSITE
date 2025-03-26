// iski jrurat pdi bcoz agr sidha pprotected vala code likhre the to us case m menupage render nhi ho rha tha

import React from "react";
import { Outlet } from "react-router-dom";
import Protected from "./Protected";
export default function AuthLayout() {
  return (
    <Protected>
      <Outlet /> {/* Renders nested routes only if user is authenticated */}
    </Protected>
  );
}
