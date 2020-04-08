import React from "react";
import { MDXProvider } from "@mdx-js/react";
import MDX from "@mdx-js/runtime";
import ErrorBoundary from "components/error-boundary";

const Component = ({
  content,
  components,
  scope,
  fallback
}: {
  content: string;
  components?: { [key: string]: React.ReactNode };
  scope?: { [key: string]: any };
  fallback?: React.ReactNode;
}) => (
  <ErrorBoundary fallback={fallback}>
    <MDXProvider components={components} scope={scope}>
      <MDX scope={scope}>{content}</MDX>
    </MDXProvider>
  </ErrorBoundary>
);

export default Component;
