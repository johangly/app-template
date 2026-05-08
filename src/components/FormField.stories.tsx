import type { Meta, StoryObj } from '@storybook/react';
import FormField from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Forms/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    name: 'name',
    type: 'text',
    required: true,
    placeholder: 'Enter your name',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    name: 'password',
    type: 'password',
    error: 'Password must be at least 8 characters',
    placeholder: 'Enter password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    name: 'username',
    type: 'text',
    disabled: true,
    value: 'john_doe',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <FormField
        label="Text Input"
        name="text"
        type="text"
        placeholder="Text input"
      />
      <FormField
        label="Email Input"
        name="email"
        type="email"
        placeholder="email@example.com"
      />
      <FormField
        label="Password Input"
        name="password"
        type="password"
        placeholder="Password"
      />
      <FormField
        label="Number Input"
        name="number"
        type="number"
        placeholder="123"
      />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-md space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Registration Form</h3>
      <FormField
        label="Full Name"
        name="name"
        type="text"
        required
        placeholder="John Doe"
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        placeholder="john@example.com"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        required
        placeholder="Min 8 characters"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  ),
};
