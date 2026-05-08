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
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    loading: false,
  },
};

export const WithPagination: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    pagination: {
      page: 1,
      totalPages: 5,
      onPageChange: (page: number) => console.log('Page:', page),
    },
  },
};

export const WithSearch: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    search: {
      value: '',
      onChange: (value: string) => console.log('Search:', value),
      placeholder: 'Search users...',
    },
  },
};

export const WithSelection: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    selectable: true,
    onSelectionChange: (selected: any[]) => console.log('Selected:', selected),
  },
};

export const FullFeatured: Story = {
  args: {
    data: sampleData,
    columns,
    loading: false,
    selectable: true,
    pagination: {
      page: 1,
      totalPages: 3,
      onPageChange: (page: number) => console.log('Page:', page),
    },
    search: {
      value: '',
      onChange: (value: string) => console.log('Search:', value),
      placeholder: 'Search users...',
    },
    onRowClick: (row: any) => console.log('Clicked:', row),
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
    pagination: {
      page: 1,
      totalPages: 4,
      onPageChange: (page: number) => console.log('Page:', page),
    },
  },
};
