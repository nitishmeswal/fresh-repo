import React from "react";
import EarningStatistics from "@/components/charts/horizantal-charts";

export default {
  title: "Components/EarningStatistics",
  component: EarningStatistics,
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1E1E1E" }],
    },
  },
};

const Template = (args:any) => <EarningStatistics {...args} />;

export const Default = Template.bind({});

// @ts-ignore
Default.args = {};
