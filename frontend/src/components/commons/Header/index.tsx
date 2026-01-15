import { useNavigate } from "react-router-dom";

interface AppHeaderActionButton {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "plain";
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: AppHeaderActionButton;
  showBackButton?: boolean;
  backButtonPath?: string;
  backButtonLabel?: string;
}

function AppHeader({
  title,
  subtitle,
  actionButton,
  showBackButton = false,
  backButtonPath = "/",
  backButtonLabel = "Back",
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(backButtonPath);
  };

  return (
    <s-stack direction="block" gap="base" paddingBlock="large">
      <s-stack
        direction="inline"
        justifyContent="space-between"
        alignItems="center"
      >
        <s-stack direction="block" gap="small">
          <s-heading>{title}</s-heading>
          {subtitle && <s-text color="subdued">{subtitle}</s-text>}
        </s-stack>
        {actionButton && (
          <s-button
            variant={
              actionButton.variant as
                | "primary"
                | "secondary"
                | "tertiary"
                | "auto"
            }
            // icon={actionButton?.icon}
            onClick={actionButton.onClick}
          >
            {/* {actionButton.icon && <s-icon icon={actionButton.icon as IconType} />} */}
            {actionButton.label}
          </s-button>
        )}

        {showBackButton && (
          <s-button
            variant="tertiary"
            icon="arrow-left"
            onClick={handleBackClick}
          >
            {backButtonLabel}
          </s-button>
        )}
      </s-stack>
    </s-stack>
  );
}

export default AppHeader;
