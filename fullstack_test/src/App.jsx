/* eslint-disable no-unused-vars */
import {
  Badge,
  Banner,
  Button,
  DataTable,
  Divider,
  Layout,
  LegacyCard,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      campaign: "",
      title: "",
      description: "",
      options: [
        {
          title: "Single",
          subTitle: "Standard price",
          label: "",
          quantity: 1,
          discountType: "None",
          amount: "",
        },
        {
          title: "Duo",
          subTitle: "Save 10%",
          quantity: 2,
          label: "Popular",
          discountType: "% discount",
          amount: "10",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const discountOptions = [
    { label: "None", value: "None" },
    { label: "% discount", value: "% discount" },
    { label: "Fixed amount", value: "Fixed amount" },
  ];

  const handleAddOption = () => {
    append({
      title: "",
      subTitle: "",
      label: "",
      quantity: "",
      discountType: "None",
      amount: "",
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&current_weather=true"
      );

      const weatherData = await response.json();

      setSubmitSuccess(
        `Volume discount saved successfully! Current temperature: ${weatherData.current_weather.temperature}°C`
      );
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(error.message || "An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (amount, discountType) => {
    if (!amount || discountType === "None") return "-";
    if (discountType === "% discount") return `${amount}%`;
    if (discountType === "Fixed amount") return `$${amount}`;
    return amount;
  };

  return (
    <Page title="Create volume discount">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {submitError && (
          <div style={{ marginBottom: "16px" }}>
            <Banner tone="critical" onDismiss={() => setSubmitError("")}>
              {submitError}
            </Banner>
          </div>
        )}
        {submitSuccess && (
          <div style={{ marginBottom: "16px" }}>
            <Banner tone="success" onDismiss={() => setSubmitSuccess("")}>
              {submitSuccess}
            </Banner>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Layout>
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
                    render={({ field: { ref, ...field } }) => (
                      <TextField label="Title" autoComplete="off" {...field} />
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <TextField
                        label="Description"
                        autoComplete="off"
                        {...field}
                      />
                    )}
                  />
                </div>
              </LegacyCard>

              <LegacyCard title="Volume discount rule" sectioned>
                {errors.options?.root && (
                  <div style={{ marginBottom: "16px" }}>
                    <Banner tone="critical">
                      {errors.options.root.message}
                    </Banner>
                  </div>
                )}
                {fields.map((field, index) => {
                  const title = watch(`options.${index}.title`);
                  const subTitle = watch(`options.${index}.subTitle`);
                  const label = watch(`options.${index}.label`);
                  const quantity = watch(`options.${index}.quantity`);
                  const amount = watch(`options.${index}.amount`);
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
                            <TextField
                              label="Subtitle"
                              autoComplete="off"
                              {...field}
                            />
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
                                if (
                                  discountType === "% discount" &&
                                  num > 100
                                ) {
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
                                suffix={
                                  discountType === "% discount" ? "%" : "$"
                                }
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

            <Layout.Section variant="oneThird">
              <LegacyCard title="Preview" sectioned>
                <Text
                  variant="headingMd"
                  as="h2"
                  fontWeight="bold"
                  alignment="center"
                >
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
          </Layout>
        </form>
      </div>
    </Page>
  );
}

export default App;
