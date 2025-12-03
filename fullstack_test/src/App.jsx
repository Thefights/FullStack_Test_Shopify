import { Layout, LegacyCard, Page } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useFieldArray, useForm } from "react-hook-form";

function App() {
  const { control, register, watch, handleSubmit } = useForm({
    defaultValues: {
      campaign: "",
      title: "",
      description: "",
      optioms: [
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

  return (
    <Page fullWidth title="Create volume discount">
      <Layout>
        <Layout.Section>
          <LegacyCard title="Order details" sectioned>
            <p>
              Use to follow a normal section with a secondary section to create
              a 2/3 + 1/3 layout on detail pages (such as individual product or
              order pages). Can also be used on any page that needs to structure
              a lot of content. This layout stacks the columns on small screens.
            </p>
          </LegacyCard>
          <LegacyCard title="Order details" sectioned>
            <p>
              Use to follow a normal section with a secondary section to create
              a 2/3 + 1/3 layout on detail pages (such as individual product or
              order pages). Can also be used on any page that needs to structure
              a lot of content. This layout stacks the columns on small screens.
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <LegacyCard title="Tags" sectioned>
            <p>Add tags to your order.</p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default App;
