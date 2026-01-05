import { memo, useState, useCallback } from "react";
import { ActionList, Popover, Button, Text } from "@shopify/polaris";
import { IconSource } from "@shopify/polaris";

interface AppActionListProps {
  title: string;
  icon: IconSource;
  items: {
    content: string;
    helpText?: string;
  }[];
}

const AppActionList = memo(({ title, icon, items }: AppActionListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  const actionItems = items.map((item) => ({
    content: item.content,
    helpText: item.helpText,
  }));

  return (
    <Popover
      active={isOpen}
      activator={
        <Button icon={icon} onClick={toggleOpen} accessibilityLabel={title}>
          {title}
        </Button>
      }
      onClose={toggleOpen}
    >
      <Popover.Pane>
        <div style={{ padding: "1rem", minWidth: "200px" }}>
          <Text variant="headingMd" as="h2">
            {title}
          </Text>
          <ActionList items={actionItems} />
        </div>
      </Popover.Pane>
    </Popover>
  );
});

AppActionList.displayName = "AppActionList";

export default AppActionList; 