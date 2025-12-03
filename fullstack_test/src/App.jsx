import {
  Badge,
  Button,
  Divider,
  Layout,
  LegacyCard,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";

function App() {
  const { control } = useForm({
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
          amount: "10%",
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

  return (
    <Page title="Create volume discount">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
                  render={({ field: { ref, ...field } }) => (
                    <TextField label="Campaign" autoComplete="off" {...field} />
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
              {fields.map((field, index) => (
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
                      onClick={() => remove(index)}
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
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Title"
                          autoComplete="off"
                          {...field}
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
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Quantity"
                          type="number"
                          autoComplete="off"
                          {...field}
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
                    <Controller
                      name={`options.${index}.amount`}
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Amount"
                          autoComplete="off"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "16px" }}>
                <Button fullWidth icon={PlusIcon}>
                  Add option
                </Button>
              </div>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <LegacyCard title="Tags" sectioned>
              <p>Add tags to your order.</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
}

export default App;
