"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import React from "react";

// GraphQL query
const ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

export function useAuth(redirectToLogin: boolean = true) {
  const router = useRouter();

  // Use Apollo Client's useQuery
  const { data, loading, error } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only", // always fetch fresh data
  });

  const user = data?.me || null;
  const isAuthenticated = !!user;

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && redirectToLogin && !isAuthenticated) {
      router.replace("/"); // redirect to landing
    }
  }, [loading, isAuthenticated, redirectToLogin, router]);

  // Optional: log errors
  React.useEffect(() => {
    if (error) console.error("GraphQL fetch user error:", error);
  }, [error]);

  return {
    user,
    isAuthenticated,
    isLoading: loading,
    error,
  };
}
