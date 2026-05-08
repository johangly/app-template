import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Data/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Pending' },
];

const columns = [
  { header: 'Name', render: (item: any) => item.name },
  { header: 'Email', render: (item: any) => item.email },
  { header: 'Role', render: (item: any) => item.role },
  { header: 'Status', render: (item: any) => (
    <span className={`px-2 py-1 rounded text-sm ${
      item.status === 'Active' 
        ? 'bg-green-100 text-green-800' 
        : item.status === 'Inactive'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {item.status}
    </span>
  )},
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    search: '',
    onSearch: (value: string) => console.log('Search:', value),
    page: 1,
    limit: 10,
    totalPages: 1,
    total: sampleData.length,
    onPageChange: (page: number) => console.log('Page:', page),
    onLimitChange: (limit: number) => console.log('Limit:', limit),
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
    search: '',
    onSearch: () => {},
    page: 1,
    limit: 10,
    totalPages: 0,
    total: 0,
    onPageChange: () => {},
    onLimitChange: () => {},
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    loading: false,
    search: '',
    onSearch: () => {},
    page: 1,
    limit: 10,
    totalPages: 0,
    total: 0,
    onPageChange: () => {},
    onLimitChange: () => {},
    emptyMessage: 'No se encontraron usuarios',
  },
};

export const WithPagination: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    search: '',
    onSearch: () => {},
    page: 2,
    limit: 10,
    totalPages: 5,
    total: 50,
    onPageChange: (page: number) => console.log('Page:', page),
    onLimitChange: () => {},
  },
};

export const WithSearch: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    search: 'John',
    onSearch: (value: string) => console.log('Search:', value),
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 1,
    onPageChange: () => {},
    onLimitChange: () => {},
    searchPlaceholder: 'Buscar usuarios...',
  },
};

export const ManyRows: Story = {
  args: {
    data: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : 'User',
      status: i % 2 === 0 ? 'Active' : 'Inactive',
    })),
    columns,
    loading: false,
    search: '',
    onSearch: () => {},
    page: 1,
    limit: 10,
    totalPages: 2,
    total: 20,
    onPageChange: (page: number) => console.log('Page:', page),
    onLimitChange: () => {},
  },
};
