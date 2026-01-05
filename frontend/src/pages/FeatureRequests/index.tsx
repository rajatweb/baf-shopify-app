import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Box,
  TextField,
  Select,
  Modal,
  Banner,
  Icon,
  Spinner,
  EmptyState,
  Pagination,
} from "@shopify/polaris";
import {
  PlusIcon,
  ThumbsUpIcon,
  ChatIcon,
  FilterIcon,
} from "@shopify/polaris-icons";
import {
  useGetFeatureRequestsQuery,
  useCreateFeatureRequestMutation,
  useUpvoteFeatureRequestMutation,
  useAddCommentMutation,
  type FeatureRequest,
} from "../../store/api/feature-requests";
import { useGetShopQuery } from "../../store/api/shop";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function FeatureRequests() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureRequest | null>(
    null
  );
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [comment, setComment] = useState("");

  const { showToast } = useToast();

  // Form state for creating feature request
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    category: "general",
  });

  // Queries
  const { data: shopData } = useGetShopQuery();
  const {
    data: featureRequestsData,
    isLoading,
    refetch,
  } = useGetFeatureRequestsQuery({
    ...filters,
    shopDomain: shopData?.data?.shop?.name || "",
  });

  // Mutations
  const [createFeatureRequest, { isLoading: isCreating }] =
    useCreateFeatureRequestMutation();
  const [upvoteFeatureRequest] = useUpvoteFeatureRequestMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const featureRequests = featureRequestsData?.data || [];

  // Sort and paginate feature requests
  const sortedFeatureRequests = [...featureRequests].sort((a, b) => {
    switch (sortBy) {
      case "upvotes":
        return b.upvotes - a.upvotes;
      case "createdAt":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "priority": {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        );
      }
      default:
        return 0;
    }
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedFeatureRequests.length / itemsPerPage);
  const paginatedRequests = sortedFeatureRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateFeatureRequest = async () => {
    if (!formData.title || !formData.description) {
      showToast("Title and description are required", { isError: true });
      return;
    }

    try {
      await createFeatureRequest({
        ...formData,
        userEmail: shopData?.data?.shop?.name || "",
        userName: shopData?.data?.shop?.name || "",
        shopDomain: shopData?.data?.shop?.name || "",
      }).unwrap();

      showToast("Feature request created successfully!");
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "general",
      });
      refetch();
    } catch {
      showToast("Failed to create feature request", { isError: true });
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      await upvoteFeatureRequest(id).unwrap();
      showToast("Upvoted successfully!");
    } catch {
      showToast("Failed to upvote", { isError: true });
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedFeature) return;

    try {
      await addComment({
        id: selectedFeature.id,
        comment: comment.trim(),
        userEmail: shopData?.data?.shop?.name || "",
        userName: shopData?.data?.shop?.name || "",
      }).unwrap();

      showToast("Comment added successfully!");
      setShowCommentModal(false);
      setComment("");
      setSelectedFeature(null);
      refetch();
    } catch {
      showToast("Failed to add comment", { isError: true });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { tone: "info" as const, text: "Pending" },
      in_progress: { tone: "warning" as const, text: "In Progress" },
      completed: { tone: "success" as const, text: "Completed" },
      rejected: { tone: "critical" as const, text: "Rejected" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge tone={config.tone}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { tone: "info" as const, text: "Low" },
      medium: { tone: "warning" as const, text: "Medium" },
      high: { tone: "critical" as const, text: "High" },
      urgent: { tone: "critical" as const, text: "Urgent" },
    };
    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.medium;
    return <Badge tone={config.tone}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <BlockStack gap="400" align="center">
                <Spinner size="large" />
                <Text as="p" tone="subdued">
                  Loading feature requests...
                </Text>
              </BlockStack>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <Page
        title="Feature Requests"
        subtitle="Request new features and vote on existing ones"
        backAction={{
          content: "Back",
          onAction: () => navigate(-1),
        }}
        primaryAction={{
          content: "Request Feature",
          icon: PlusIcon,
          onAction: () => setShowCreateModal(true),
        }}
        secondaryActions={[
          {
            content: "Refresh",
            onAction: () => refetch(),
          },
        ]}
      >
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              {/* Info Banner */}
              <Banner title="Help us improve Smart Ship Rates" tone="info">
                <Text as="p">
                  Share your ideas for new features or improvements. Your
                  feedback helps us make Smart Ship Rates better for everyone.
                  Vote on existing requests to help us prioritize what to build
                  next.
                </Text>
              </Banner>

              {/* Filters and Sort */}
              <Card padding="0">
                <Box padding="400">
                  <BlockStack gap="400">
                    <InlineStack align="space-between">
                      <Text variant="headingMd" as="h2">
                        Filters & Sort
                      </Text>
                      <Icon source={FilterIcon} tone="subdued" />
                    </InlineStack>

                    <InlineStack gap="400" wrap={false}>
                      <div style={{ minWidth: "150px" }}>
                        <Select
                          label="Status"
                          options={[
                            { label: "All Statuses", value: "" },
                            { label: "Pending", value: "pending" },
                            { label: "In Progress", value: "in_progress" },
                            { label: "Completed", value: "completed" },
                            { label: "Rejected", value: "rejected" },
                          ]}
                          value={filters.status}
                          onChange={(value) =>
                            setFilters((prev) => ({ ...prev, status: value }))
                          }
                        />
                      </div>

                      <div style={{ minWidth: "150px" }}>
                        <Select
                          label="Priority"
                          options={[
                            { label: "All Priorities", value: "" },
                            { label: "Low", value: "low" },
                            { label: "Medium", value: "medium" },
                            { label: "High", value: "high" },
                            { label: "Urgent", value: "urgent" },
                          ]}
                          value={filters.priority}
                          onChange={(value) =>
                            setFilters((prev) => ({ ...prev, priority: value }))
                          }
                        />
                      </div>

                      <div style={{ minWidth: "150px" }}>
                        <Select
                          label="Category"
                          options={[
                            { label: "All Categories", value: "" },
                            { label: "General", value: "general" },
                            { label: "UI/UX", value: "ui" },
                            { label: "Functionality", value: "functionality" },
                            { label: "Performance", value: "performance" },
                            { label: "Integration", value: "integration" },
                          ]}
                          value={filters.category}
                          onChange={(value) =>
                            setFilters((prev) => ({ ...prev, category: value }))
                          }
                        />
                      </div>

                      <div style={{ minWidth: "150px" }}>
                        <Select
                          label="Sort By"
                          options={[
                            { label: "Newest First", value: "createdAt" },
                            { label: "Most Upvoted", value: "upvotes" },
                            { label: "Priority", value: "priority" },
                          ]}
                          value={sortBy}
                          onChange={setSortBy}
                        />
                      </div>
                    </InlineStack>
                  </BlockStack>
                </Box>
              </Card>

              {/* Feature Requests List */}
              {paginatedRequests.length === 0 ? (
                <Card>
                  <EmptyState
                    heading="No feature requests found"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  >
                    <Text as="p">
                      {Object.values(filters).some((f) => f)
                        ? "No feature requests match your current filters. Try adjusting your filters."
                        : "Be the first to request a feature! Click 'Request Feature' to get started."}
                    </Text>
                  </EmptyState>
                </Card>
              ) : (
                <BlockStack gap="400">
                  {paginatedRequests.map((feature) => (
                    <Card key={feature.id} padding="0">
                      <Box padding="400">
                        <BlockStack gap="400">
                          <InlineStack align="space-between">
                            <BlockStack gap="200">
                              <Text
                                variant="headingMd"
                                as="h3"
                                fontWeight="semibold"
                              >
                                {feature.title}
                              </Text>
                              <InlineStack gap="200">
                                {getStatusBadge(feature.status)}
                                {getPriorityBadge(feature.priority)}
                                <Badge tone="info">{feature.category}</Badge>
                              </InlineStack>
                            </BlockStack>

                            <InlineStack gap="200">
                              <Button
                                variant="plain"
                                icon={ThumbsUpIcon}
                                onClick={() => handleUpvote(feature.id)}
                              >
                                {feature.upvotes.toString()}
                              </Button>
                              <Button
                                variant="plain"
                                icon={ChatIcon}
                                onClick={() => {
                                  setSelectedFeature(feature);
                                  setShowCommentModal(true);
                                }}
                              >
                                {feature.comments.length.toString()}
                              </Button>
                            </InlineStack>
                          </InlineStack>

                          <Text as="p" variant="bodyMd">
                            {feature.description}
                          </Text>

                          <InlineStack align="space-between">
                            <Text as="p" tone="subdued" variant="bodySm">
                              Requested by{" "}
                              {feature.userName || feature.userEmail} on{" "}
                              {formatDate(feature.createdAt)}
                            </Text>

                            {feature.comments.length > 0 && (
                              <Text as="p" tone="subdued" variant="bodySm">
                                {feature.comments.length} comment
                                {feature.comments.length !== 1 ? "s" : ""}
                              </Text>
                            )}
                          </InlineStack>
                        </BlockStack>
                      </Box>
                    </Card>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box padding="400">
                      <Pagination
                        hasPrevious={currentPage > 1}
                        onPrevious={() => setCurrentPage((prev) => prev - 1)}
                        hasNext={currentPage < totalPages}
                        onNext={() => setCurrentPage((prev) => prev + 1)}
                        label={`Page ${currentPage} of ${totalPages}`}
                      />
                    </Box>
                  )}
                </BlockStack>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>

        {/* Create Feature Request Modal */}
        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Request New Feature"
          primaryAction={{
            content: "Submit Request",
            onAction: handleCreateFeatureRequest,
            loading: isCreating,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setShowCreateModal(false),
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <TextField
                label="Feature Title"
                value={formData.title}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                placeholder="e.g., Add support for international shipping"
                autoComplete="off"
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="Describe the feature you'd like to see..."
                multiline={4}
                autoComplete="off"
              />

              <InlineStack gap="400">
                <div style={{ flex: 1 }}>
                  <Select
                    label="Priority"
                    options={[
                      { label: "Low", value: "low" },
                      { label: "Medium", value: "medium" },
                      { label: "High", value: "high" },
                      { label: "Urgent", value: "urgent" },
                    ]}
                    value={formData.priority}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: value as "low" | "medium" | "high" | "urgent",
                      }))
                    }
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <Select
                    label="Category"
                    options={[
                      { label: "General", value: "general" },
                      { label: "UI/UX", value: "ui" },
                      { label: "Functionality", value: "functionality" },
                      { label: "Performance", value: "performance" },
                      { label: "Integration", value: "integration" },
                    ]}
                    value={formData.category}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  />
                </div>
              </InlineStack>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Add Comment Modal */}
        <Modal
          open={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          title={`Comment on: ${selectedFeature?.title}`}
          primaryAction={{
            content: "Add Comment",
            onAction: handleAddComment,
            loading: isAddingComment,
            disabled: !comment.trim(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setShowCommentModal(false),
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <TextField
                label="Your Comment"
                value={comment}
                onChange={setComment}
                placeholder="Share your thoughts on this feature request..."
                multiline={4}
                autoComplete="off"
              />

              {selectedFeature && selectedFeature.comments.length > 0 && (
                <BlockStack gap="300">
                  <Text variant="headingSm" as="h4">
                    Previous Comments
                  </Text>
                  <BlockStack gap="200">
                    {selectedFeature.comments.map((commentItem) => (
                      <Box
                        key={commentItem.id}
                        padding="300"
                        background="bg-surface-secondary"
                      >
                        <BlockStack gap="200">
                          <InlineStack align="space-between">
                            <Text as="p" variant="bodySm" fontWeight="semibold">
                              {commentItem.userName || commentItem.userEmail}
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                              {formatDate(commentItem.createdAt)}
                            </Text>
                          </InlineStack>
                          <Text as="p" variant="bodySm">
                            {commentItem.comment}
                          </Text>
                        </BlockStack>
                      </Box>
                    ))}
                  </BlockStack>
                </BlockStack>
              )}
            </BlockStack>
          </Modal.Section>
        </Modal>
      </Page>
    </div>
  );
}
