import { Button, InlineStack, Text } from "@shopify/polaris";

import { BlockStack } from "@shopify/polaris";

import { Box } from "@shopify/polaris";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BasicHeaderProps {
  title: string;
  subtitle: string;
}

// Memoize the header component to prevent re-renders
const BasicHeader = memo(function BasicHeader({
  title,
  subtitle,
}: BasicHeaderProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = () => {
    setIsLoading(true);
    navigate("/create-group");
  };

  return (
    <Box paddingInlineStart="400" paddingInlineEnd="400" paddingBlock="200">
      <BlockStack gap="100">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingLg" as="h6" fontWeight="bold">
            {title}
          </Text>
          <Button variant="primary" onClick={handleCreateGroup} loading={isLoading}>
            Create Shipping Rates
          </Button>
        </InlineStack>
        <InlineStack>
          <Text as="p" variant="bodyMd">
            {subtitle}
          </Text>
        </InlineStack>
      </BlockStack>
    </Box>
  );
});

BasicHeader.displayName = "BasicHeader";

export default BasicHeader;
