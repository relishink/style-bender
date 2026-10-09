import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Destructive: Story = { args: { variant: 'destructive' } }
