/* eslint-disable no-unused-vars */
import {
  Badge,
  Banner,
  Button,
  Divider,
  Layout,
  LegacyCard,
  Select,
  TextField,
} from "@shopify/polaris";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import { useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";

function LeftSection({ control, errors, watch, setSubmitError, getFields }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (getFields) {
      getFields(fields);
    }
  }, [fields, getFields]);

  const discountOptions = [
    { label: "None", value: "None" },
    { label: "% discount", value: "% discount" },
    { label: "Discount / each", value: "Discount / each" },
  ];

  const handleAddOption = () => {
    const lastOption = fields[fields.length - 1];
    const lastQuantity = watch(`options.${fields.length - 1}.quantity`);
    const nextQuantity = lastQuantity ? Number(lastQuantity) + 1 : 1;

    append({
      title: "",
      subTitle: "",
      label: "",
      quantity: nextQuantity,
      discountType: "None",
      amount: "",
    });
  };

  return (
    <Layout.Section>
      <LegacyCard title="General" sectioned>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Controller
            name="campaign"
            control={control}
            rules={{
              required: "Campaign is required",
            }}
            render={({ field: { ref, ...field } }) => (
              <TextField
                label="Campaign"
                autoComplete="off"
                {...field}
                requiredIndicator
                error={errors.campaign?.message}
              />
            )}
          />
          <Controller
            name="title"
            control={control}
            rules={{
              required: "Title is required",
            }}
            render={({ field: { ref, ...field } }) => (
              <TextField
                label="Title"
                autoComplete="off"
                {...field}
                requiredIndicator
                error={errors.title?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField label="Description" autoComplete="off" {...field} />
            )}
          />
        </div>
      </LegacyCard>

      <LegacyCard title="Volume discount rule" sectioned>
        {errors.options?.root && (
          <div style={{ marginBottom: "16px" }}>
            <Banner tone="critical">{errors.options.root.message}</Banner>
          </div>
        )}
        {fields.map((field, index) => {
          const discountType = watch(`options.${index}.discountType`);
          return (
            <div key={field.id}>
              {index > 0 && <Divider style={{ margin: "16px 0" }} />}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Badge tone="warning-strong" size="large">
                  OPTION {index + 1}
                </Badge>
                <Button
                  plain
                  destructive
                  icon={DeleteIcon}
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    } else {
                      setSubmitError("At least one option is required");
                    }
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "16px",
                }}
              >
                <Controller
                  name={`options.${index}.title`}
                  control={control}
                  rules={{
                    required: "Title is required",
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <TextField
                      label="Title"
                      autoComplete="off"
                      requiredIndicator
                      {...field}
                      error={errors.options?.[index]?.title?.message}
                    />
                  )}
                />
                <Controller
                  name={`options.${index}.subTitle`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <TextField label="Subtitle" autoComplete="off" {...field} />
                  )}
                />
                <Controller
                  name={`options.${index}.label`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <TextField
                      label="Label (optional)"
                      autoComplete="off"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name={`options.${index}.quantity`}
                  control={control}
                  rules={{
                    required: "Quantity is required",
                    min: {
                      value: 1,
                      message: "Quantity must be at least 1",
                    },
                    validate: (value) => {
                      const num = Number(value);
                      return (
                        (!isNaN(num) && Number.isInteger(num)) ||
                        "Quantity must be a valid number"
                      );
                    },
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <TextField
                      label="Quantity"
                      type="number"
                      autoComplete="off"
                      {...field}
                      requiredIndicator
                      error={errors.options?.[index]?.quantity?.message}
                    />
                  )}
                />
                <Controller
                  name={`options.${index}.discountType`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      label="Discount Type"
                      options={discountOptions}
                      {...field}
                    />
                  )}
                />
                {discountType !== "None" && (
                  <Controller
                    name={`options.${index}.amount`}
                    control={control}
                    rules={{
                      required: "Amount is required",
                      min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                      },
                      validate: (value) => {
                        const num = Number(value);
                        if (isNaN(num)) {
                          return "Amount must be a valid number";
                        }
                        if (discountType === "% discount" && num > 100) {
                          return "Percentage cannot exceed 100%";
                        }
                        return true;
                      },
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <TextField
                        label="Amount"
                        type="number"
                        autoComplete="off"
                        {...field}
                        suffix={discountType === "% discount" ? "%" : "$"}
                        requiredIndicator
                        error={errors.options?.[index]?.amount?.message}
                      />
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: "16px" }}>
          <Button
            fullWidth
            icon={PlusIcon}
            variant="primary"
            onClick={handleAddOption}
          >
            Add option
          </Button>
        </div>
      </LegacyCard>
    </Layout.Section>
  );
}

export default LeftSection;
