import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Lock } from "lucide-react";
import { useGetActiveSubscriptionsQuery } from "../../store/api/subscriptions";
import { useMemo } from "react";
import React from "react";
import { isBasicPlan, isPlusPlan, isProPlan, isStarterPlan } from "../../utils/planUtils";

const Container = styled.div<{ inline?: boolean }>`
  position: relative;
  width: ${(props) => (props.inline ? "auto" : "100%")};
  display: ${(props) => (props.inline ? "inline-flex" : "block")};
  flex-direction: ${(props) => (props.inline ? "row" : "column")};
  align-items: ${(props) => (props.inline ? "center" : "flex-start")};
  gap: ${(props) => (props.inline ? "8px" : "4px")};
`;

const DisabledWrapper = styled.div`
  position: relative;
  width: 100%;
  opacity: 1;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  cursor: not-allowed;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(1px);
  z-index: 10;
  border-radius: 8px;
`;

const DisableModeWrapper = styled.div<{ direction?: "row" | "column" }>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  gap: 5px;
  opacity: 1;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  cursor: not-allowed;
  & > * {
    width: 100%;
  }
`;

const UpgradeBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #fff4e5 0%, #ffe8cc 100%);
  border: 1.5px solid #ffc453;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #ffe8cc 0%, #ffd699 100%);
    border-color: #ffb020;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LockIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #00a47c;
  border-radius: 6px;
  color: white;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const UpgradeText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #8b6914;
  text-align: center;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlanNameHighlight = styled.span`
  color: #00a47c;
  font-weight: 700;
  text-transform: capitalize;
  background: linear-gradient(135deg, rgba(0, 164, 124, 0.15) 0%, rgba(0, 164, 124, 0.1) 100%);
  padding: 3px 8px;
  border-radius: 6px;
  margin: 0 3px;
  border: 1px solid rgba(0, 164, 124, 0.2);
  display: inline-block;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 164, 124, 0.1);
  transition: all 0.2s ease;
  vertical-align: baseline;
  line-height: 1.4;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 164, 124, 0.2) 0%, rgba(0, 164, 124, 0.15) 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 164, 124, 0.15);
  }
`;

const FeatureNameHighlight = styled.span`
  color: #8b6914;
  font-weight: 700;
  font-style: italic;
  text-decoration: underline;
  text-decoration-color: #ffc453;
  text-underline-offset: 3px;
  text-decoration-thickness: 2px;
  display: inline;
  vertical-align: baseline;
  line-height: inherit;
`;

const PlanTextContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  align-items: baseline;
  line-height: 1.5;
`;

interface RestrictedWrapperProps {
    children: React.ReactNode;
    sectionId: string;
    mode?: "disabled" | "overlay";
    direction?: "row" | "column";
}

// Plan-section relationship
// + Pro (highest) gets all features
// + Plus inherits Pro; for now treat as same as Pro. If needed, can separate extra Plus features in future.
// + Basic: all of Starter + more, but not all features Pro/Plus have
// + Starter: only basic subset

// List all available features here
const allFeatureSections = [
    "homepage-only",
    "custom-branding",
    "hide-sold-out-products",
    "product-filters",
];

// Features available in Basic
const basicPlanSections = [
    "homepage-only",
    "custom-branding",
    "hide-sold-out-products"
];

// Starter plan has fewer than Basic (2 less features than Basic)
// Product filters are available for all paid plans (starter and above)
const starterPlanSections = [
    "homepage-only",
    "product-filters",
];

const featureNameMap = {
    "homepage-only": "Homepage Only",
    "custom-branding": "Custom Branding",
    "hide-sold-out-products": "Hide Sold Out Products",
    "product-filters": "Product Filters",
};

type DisableableProps = {
    disabled?: boolean;
};

const DisableModeWrapperComponent = ({
    disabled,
    children,
}: {
    disabled: boolean;
    children: React.ReactNode;
}) => {
    return React.Children.map(children, (child) => {
        if (!React.isValidElement<DisableableProps>(child)) return child;

        return React.cloneElement(child, {
            disabled,
        });
    });
};

const getRequiredPlan = (sectionId: string): "pro" | "basic" | "starter" => {
    // Pro plan gets all features by default.
    // If in basicPlanSections but not in starterPlanSections, it's a basic-only feature.
    // If in starterPlanSections, it's a starter feature.
    if (allFeatureSections.includes(sectionId)) {
        if (starterPlanSections.includes(sectionId)) return "starter";
        if (basicPlanSections.includes(sectionId)) return "basic";
        return "pro";
    }
    // fallback
    return "pro";
};

const RestrictedWrapper: React.FC<RestrictedWrapperProps> = ({
    children,
    sectionId,
    mode = "overlay",
    direction = "column",
}) => {
    const navigate = useNavigate();
    const { data: { data: subscriptions } = {}, isFetching } =
        useGetActiveSubscriptionsQuery();

    const isPro = useMemo(() => {
        if (!subscriptions) return false;
        return isProPlan(subscriptions) || isPlusPlan(subscriptions);
        // Treat Plus as Pro for now, otherwise split here.
    }, [subscriptions]);

    const isBasic = useMemo(() => {
        if (!subscriptions) return false;
        return isBasicPlan(subscriptions);
    }, [subscriptions]);
    const isStarter = useMemo(() => {
        if (!subscriptions) return false;
        return isStarterPlan(subscriptions);
    }, [subscriptions]);

    const requiredPlan = useMemo(() => getRequiredPlan(sectionId), [sectionId]);
    const hasActiveSubscription = useMemo(() => {
        // If requires pro: only pro (and plus)
        // If requires basic: basic or higher
        // If requires starter: starter or higher
        if (requiredPlan === "pro") {
            return isPro;
        } else if (requiredPlan === "basic") {
            return isPro || isBasic;
        } else if (requiredPlan === "starter") {
            return isPro || isBasic || isStarter;
        }
        return false;
    }, [requiredPlan, isPro, isBasic, isStarter]);

    const planText = useMemo(() => {
        const featureName =
            featureNameMap[sectionId as keyof typeof featureNameMap] || "";

        if (requiredPlan === "pro") {
            // Always use Showroom/Runway (since Runway = Showroom for now)
            return (
                <PlanTextContainer>
                    Upgrade to{" "}
                    <PlanNameHighlight>Runway</PlanNameHighlight>
                    or
                    <PlanNameHighlight>Showroom</PlanNameHighlight>
                    {" "}plan to unlock{" "}
                    <FeatureNameHighlight>{featureName}</FeatureNameHighlight>
                </PlanTextContainer>
            );
        } else if (requiredPlan === "basic") {
            return (
                <PlanTextContainer>
                    Upgrade to{" "}
                    <PlanNameHighlight>Flagship</PlanNameHighlight>
                    {" "}plan to unlock{" "}
                    <FeatureNameHighlight>{featureName}</FeatureNameHighlight>
                </PlanTextContainer>
            );
        } else if (requiredPlan === "starter") {
            return (
                <PlanTextContainer>
                    Upgrade to{" "}
                    <PlanNameHighlight>Boutique</PlanNameHighlight>
                    {" "}plan to unlock{" "}
                    <FeatureNameHighlight>{featureName}</FeatureNameHighlight>
                </PlanTextContainer>
            );
        }
        // fallback
        return (
            <PlanTextContainer>
                Upgrade your plan to unlock{" "}
                <FeatureNameHighlight>{featureName}</FeatureNameHighlight>
            </PlanTextContainer>
        );
    }, [sectionId, requiredPlan]);

    if (isFetching) {
        return <s-text>Loading...</s-text>;
    }

    if (hasActiveSubscription) {
        return <>{children}</>;
    }

    if (!hasActiveSubscription && mode === "disabled") {
        return (
            <>
                <DisableModeWrapper direction={direction}>
                    <DisableModeWrapperComponent disabled={true}>
                        {children}
                    </DisableModeWrapperComponent>
                </DisableModeWrapper>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#8b6914",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        cursor: "pointer",
                        paddingLeft: "4px",
                        paddingTop: "2px",
                        width: "100%",
                    }}
                    onClick={() => navigate("/plans")}
                >
                    <Lock size={14} style={{ marginTop: "2px", flexShrink: 0, alignSelf: "flex-start" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>{planText}</div>
                </div>
            </>
        );
    }
    // Default overlay mode
    return (
        <Container>
            <DisabledWrapper>{children}</DisabledWrapper>
            <Overlay>
                <UpgradeBanner onClick={() => navigate("/plans")}>
                    <LockIconWrapper>
                        <Lock />
                    </LockIconWrapper>
                    <UpgradeText>{planText}</UpgradeText>
                </UpgradeBanner>
            </Overlay>
        </Container>
    );
};

export default RestrictedWrapper;
