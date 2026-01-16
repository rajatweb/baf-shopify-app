import { useState } from "react";
// import AppHeader from "../../components/commons/Header";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I enable the widget?",
    answer:
      'Go to Shopify Admin → Online Store → Themes → Customize → App embeds. Toggle on "Build A Fit" and save.',
  },
  {
    question: "How does revenue tracking work?",
    answer:
      'When customers add items from "Shop This Fit" and complete checkout within 24 hours, the revenue is attributed to Build A Fit.',
  },
  {
    question: "What image format works best?",
    answer:
      "Square images (1:1) with white or transparent backgrounds work best. This lets customers layer products naturally on the canvas.",
  },
  {
    question: "Can I use my own logo?",
    answer:
      "Yes! On Basic plan and above, upload a custom logo in Settings → Branding. It'll appear on all shared/exported fit images.",
  },
];

function FAQItemComponent({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid #e1e3e5",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          padding: "16px 0",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <span>{item.question}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            padding: "0 0 16px",
            color: "#6d7175",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function Documentation() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <div style={{ marginTop: "var(--p-space-800)", paddingBottom: "var(--p-space-1600)" }}>
      <s-page heading="Documentation">
        <s-link slot="breadcrumb-actions" href="/">
          Home
        </s-link>
        <s-button slot="secondary-actions" variant="secondary" icon="arrow-left">
          Back to Home
        </s-button>
        {/* <AppHeader
          title="Documentation"
          subtitle="Learn how to use Build A Fit"
          showBackButton={true}
          backButtonPath="/"
          backButtonLabel="Back"
        /> */}

        <s-stack direction="block" gap="base">
          {/* Getting Started Video Card */}
          <div style={{ marginBottom: "24px" }}>
            <s-box background="base" border="base" borderRadius="base" padding="base">
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
              <div
                style={{
                  background: "#000",
                  borderRadius: "8px",
                  width: "240px",
                  height: "135px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "36px",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  // TODO: Implement video playback
                  console.log("Play video");
                }}
              >
                ▶
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 600 }}>Getting Started</span>
                </div>
                <div style={{ color: "#6d7175", fontSize: "14px", lineHeight: 1.5, marginBottom: "16px" }}>
                  Set up your outfit builder and start driving engagement in under 2 minutes.
                </div>
                <s-button
                  variant="primary"
                  onClick={() => {
                    // TODO: Implement video playback
                    console.log("Watch video");
                  }}
                >
                  Watch Video
                </s-button>
              </div>
            </div>
            </s-box>
          </div>

          {/* FAQ Section */}
          <s-box background="base" border="base" borderRadius="base" padding="base">
            <s-stack direction="block" gap="base">
              <span style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>
                FAQ
              </span>
              {faqItems.map((item, index) => (
                <FAQItemComponent
                  key={index}
                  item={item}
                  isOpen={openFAQIndex === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </s-stack>
          </s-box>
        </s-stack>
      </s-page>
    </div>
  );
}