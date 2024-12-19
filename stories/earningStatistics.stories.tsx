import React from "react";
// import EarningStatistics from "@/components/charts/horizantal-charts";
import Chart from "@/components/charts/stats-chart";

export default {
  title: "Components/EarningStatistics",
  component: Chart,
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1E1E1E" }],
    },
  },
};

const Template = (args:any) => <Chart {...args} />;

export const Default = Template.bind({});

// @ts-ignore
Default.args = {};
