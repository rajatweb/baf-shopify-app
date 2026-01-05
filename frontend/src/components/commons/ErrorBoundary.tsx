import { Component, ErrorInfo, ReactNode } from "react";
import { Banner, Page, Layout } from "@shopify/polaris";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Page>
          <Layout>
            <Layout.Section>
              <Banner
                title="Something went wrong"
                tone="critical"
                action={{ content: "Reload page", onAction: this.handleReload }}
              >
                <p>
                  We're sorry! The application has encountered an unexpected
                  error.
                </p>
                {process.env.NODE_ENV === "development" && (
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {this.state.error?.toString()}
                  </pre>
                )}
              </Banner>
            </Layout.Section>
          </Layout>
        </Page>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
