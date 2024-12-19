import React from 'react';
import { Meta } from '@storybook/react';
import MapData from '@/components/map-data';

export default {
    title: 'Components/MapData',
    component: MapData,
} as Meta;

// @ts-ignore
const Template: Story<MapDataProps> = (args) => <MapData {...args} />;

export const Default = Template.bind({});
Default.args = {
    // Add default props here
};

export const WithCustomData = Template.bind({});
WithCustomData.args = {
    // Add custom props here
};