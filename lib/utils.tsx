export function withStore<T, P extends T>(
  Component: React.ComponentType<P>,
  storeProps: T,
) {
  return (props: P) => <Component {...props} {...storeProps} />;
}
