import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import  UserSetting  from "@/components/settings/user-setting";
import { userEvent, within } from "@storybook/test";

// Storybook metadata
export default {
  title: "Forms/UserProfileForm",
  component: UserSetting,
  parameters: {
    layout: "centered", // Centers the component in the viewport
  },
} as Meta<typeof UserSetting>;

// @ts-ignore
const Template: StoryFn<typeof UserSetting> = (args) => <UserSetting {...args} />;

export const Default = Template.bind({});
Default.args = {};

// Filled State Story
export const Filled = Template.bind({});
Filled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // Simulating user input
  await userEvent.type(canvas.getByLabelText(/First Name/i), "Peter");
  await userEvent.type(canvas.getByLabelText(/Last Name/i), "Griffin");
  await userEvent.type(canvas.getByLabelText(/Username/i), "thepetergriffin");
  await userEvent.type(canvas.getByLabelText(/Email/i), "hello@design.io");
  await userEvent.type(canvas.getByLabelText(/Birthday/i), "09/22/1975");
  await userEvent.type(canvas.getByLabelText(/Location/i), "Quahog");
  await userEvent.type(canvas.getByLabelText(/New Password/i), "Password123");
  await userEvent.type(canvas.getByLabelText(/Confirm Password/i), "Password123");
  
  // Submit the form
  await userEvent.click(canvas.getByRole("button", { name: /Save Changes/i }));
};

// Error State Story
export const ErrorState = Template.bind({});
ErrorState.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // Attempt to submit the form without any inputs
  await userEvent.click(canvas.getByRole("button", { name: /Save Changes/i }));
};
