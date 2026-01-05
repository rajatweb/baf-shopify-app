import {
  SkeletonPage,
  Layout,
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  BlockStack,
} from "@shopify/polaris";

export default function AppSkeleton() {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <BlockStack gap="200">
            <Card>
              <SkeletonBodyText />
            </Card>
            <Card>
              <BlockStack gap="200">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
