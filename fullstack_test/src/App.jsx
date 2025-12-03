import { Text } from "@shopify/polaris";
import { useFieldArray, useForm } from "react-hook-form";
import "./App.css";

function App() {
  const { control, register, watch, handleSubmit } = useForm({
    defaultValues: {
      campaignName: "",
      optioms: [
        { title: "", quantity: 1, discountType: "None", amount: "" },
        { title: "", quantity: 2, discountType: "None", amount: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  return <Text> This is my test</Text>;
}

export default App;
