import { BlockStack, Box, Card, InlineGrid, Text } from "@shopify/polaris";
import { memo, useMemo } from "react";

interface CardColumnProps {
  items: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
}

// Memoize individual card component
const CardItem = memo(function CardItem({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200" align="center" inlineAlign="center">
        <Text as="h3" variant="headingSm">
          {title}
        </Text>
        {description && (
          <Text as="p" variant="bodyMd">
            {description}
          </Text>
        )}
      </BlockStack>
    </Card>
  );
});

CardItem.displayName = "CardItem";

const CardColumn = memo(function CardColumn({ items }: CardColumnProps) {
  // Memoize the cards array to prevent unnecessary re-renders
  const cards = useMemo(
    () =>
      items.map((item) => (
        <CardItem
          key={item.id}
          title={item.title}
          description={item.description}
        />
      )),
    [items]
  );

  return (
    <Box
      paddingInlineStart="400"
      paddingInlineEnd="400"
      paddingBlock="200"
    >
      <BlockStack gap="400" align="center">
        <InlineGrid gap="400" columns={3}>
          {cards}
        </InlineGrid>
      </BlockStack>
    </Box>
  );
});

CardColumn.displayName = "CardColumn";

export default CardColumn;
