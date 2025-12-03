/* eslint-disable no-unused-vars */
import { Banner, Layout, Page } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

function VolumeDiscountForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [optionFields, setOptionFields] = useState([]);

  const handleFieldsUpdate = (fields) => {
    setOptionFields(fields);
  };

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&current_weather=true"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

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
            <LeftSection
              control={control}
              errors={errors}
              watch={watch}
              setSubmitError={setSubmitError}
              getFields={handleFieldsUpdate}
            />
            <RightSection
              fields={optionFields}
              watch={watch}
              isSubmitting={isSubmitting}
            />
          </Layout>
        </form>
      </div>
    </Page>
  );
}

export default VolumeDiscountForm;
