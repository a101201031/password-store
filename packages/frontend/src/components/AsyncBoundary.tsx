import { isUnauthorizedError } from 'helper';
import type { ReactNode, SuspenseProps } from 'react';
import { Suspense } from 'react';
import type { ErrorBoundaryPropsWithRender } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import { SignOut } from 'components/sign';

interface AsyncBoundaryProps
  extends Omit<
    ErrorBoundaryPropsWithRender,
    'fallbackRender' | 'fallback' | 'FallbackComponent'
  > {
  children?: ReactNode;
  errorFallback: ErrorBoundaryPropsWithRender['fallbackRender'];
  suspenseFallback: SuspenseProps['fallback'];
}

function AsyncBoundary({
  children,
  errorFallback,
  suspenseFallback,
  ...errorBoundaryProps
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallbackRender={errorFallback} {...errorBoundaryProps}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

interface AuthAsyncBoundaryProps
  extends Omit<AsyncBoundaryProps, 'errorFallback'> {
  errorFallback?: AsyncBoundaryProps['errorFallback'];
}

function AuthAsyncBoundary({
  children,
  errorFallback = (_) => null,
  suspenseFallback,
  ...errorBoundaryProps
}: AuthAsyncBoundaryProps) {
  return (
    <AsyncBoundary
      errorFallback={(fallbackProps) => {
        const { error } = fallbackProps;
        if (isUnauthorizedError(error)) {
          return <SignOut />;
        }
        return errorFallback(fallbackProps);
      }}
      suspenseFallback={suspenseFallback}
      {...errorBoundaryProps}
    >
      {children}
    </AsyncBoundary>
  );
}

export { AsyncBoundary, AuthAsyncBoundary };
