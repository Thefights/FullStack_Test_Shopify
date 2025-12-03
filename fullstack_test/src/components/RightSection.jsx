/* eslint-disable no-unused-vars */
import { Button, DataTable, Layout, LegacyCard, Text } from "@shopify/polaris";

function RightSection({ fields, watch, isSubmitting }) {
  const formatAmount = (amount, discountType) => {
    if (!amount || discountType === "None") return "-";
    if (discountType === "% discount") return `${amount}%`;
    if (discountType === "Discount / each") return `$${amount}`;
    return amount;
  };

  return (
    <Layout.Section variant="oneThird">
      <LegacyCard title="Preview" sectioned>
        <Text variant="headingMd" as="h2" fontWeight="bold" alignment="center">
          Buy more and save
        </Text>
        <div style={{ marginTop: "16px" }}>
          <Text variant="bodyMd" as="p">
            Apply for all products in store
          </Text>
        </div>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "numeric"]}
          headings={["Title", "Discount Type", "Quantity", "Amount"]}
          rows={fields.map((field, index) => {
            const title = watch(`options.${index}.title`);
            const discountType = watch(`options.${index}.discountType`);
            const quantity = watch(`options.${index}.quantity`);
            const amount = watch(`options.${index}.amount`);
            return [
              title || "-",
              discountType || "-",
              quantity || "-",
              formatAmount(amount, discountType),
            ];
          })}
        />
        <Button
          fullWidth
          variant="primary"
          submit
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: "16px" }}
        >
          Save volume discount
        </Button>
      </LegacyCard>
    </Layout.Section>
  );
}

export default RightSection;
