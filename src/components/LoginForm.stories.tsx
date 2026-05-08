import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import LoginForm from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LoginFormWrapper = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Iniciar Sesión
      </h2>
      <LoginForm
        {...props}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={(e) => {
          e.preventDefault();
          alert(`Email: ${email}, Password: ${password}`);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <LoginFormWrapper loading={false} />,
};

export const Loading: Story = {
  render: () => <LoginFormWrapper loading={true} />,
};

export const WithPrefilledData: Story = {
  render: () => {
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password123');

    return (
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Iniciar Sesión
        </h2>
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={(e) => {
            e.preventDefault();
            alert(`Email: ${email}, Password: ${password}`);
          }}
          loading={false}
        />
      </div>
    );
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="dark">
      <LoginFormWrapper loading={false} />
    </div>
  ),
};
