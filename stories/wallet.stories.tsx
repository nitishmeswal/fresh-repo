import WalletPage from "@/components/wallet/page";
import { Meta } from "@storybook/react";
import { StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
export default  {
    title: "Wallet",
    Component: WalletPage,
    parameters: {
        layouts: "centered"
    }
} as Meta<typeof WalletPage>

// @ts-ignore
const template : StoryFn<typeof WalletPage> = (args) => <WalletPage {...args} />

export const Default = template.bind({})
Default.args = {}

export const ErrorState = template.bind({});
ErrorState.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // Attempt to submit the form without any inputs
  await userEvent.click(canvas.getByRole("button", { name: /Save Changes/i }));
};