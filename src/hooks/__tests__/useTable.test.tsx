import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTable } from '../useTable';

// Test component to use the hook
function TestTableComponent({ service, fetchFn }: any) {
  const {
    data,
    loading,
    error,
    page,
    totalPages,
    search,
    setSearch,
    refetch
  } = useTable({ service, fetchFn });

  return (
    <div>
      <input
        data-testid="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button data-testid="refetch-btn" onClick={refetch}>Refetch</button>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <div data-testid="page">{page}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <div data-testid="data-count">{data?.length || 0}</div>
    </div>
  );
}

describe('useTable', () => {
  const mockService = {
    getAll: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fetch data on mount', async () => {
    const mockData = {
      data: [{ id: 1, name: 'Test' }],
      pagination: {
        page: 1,
        totalPages: 1,
        total: 1
      }
    };
    mockService.getAll.mockResolvedValue(mockData);

    render(<TestTableComponent service={mockService} fetchFn="getAll" />);

    expect(mockService.getAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: '' });
  });

  it('should handle search with debounce', async () => {
    const mockData = {
      data: [],
      pagination: { page: 1, totalPages: 0, total: 0 }
    };
    mockService.getAll.mockResolvedValue(mockData);

    render(<TestTableComponent service={mockService} fetchFn="getAll" />);

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'test search');

    // Should not call immediately (debounce)
    expect(mockService.getAll).toHaveBeenCalledTimes(1);

    // Fast-forward debounce timer
    jest.advanceTimersByTime(500);

    // Should call with search term
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mockService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'test search' })
    );
  });

  it('should show loading state while fetching', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockService.getAll.mockReturnValue(promise);

    render(<TestTableComponent service={mockService} fetchFn="getAll" />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    resolvePromise({
      data: [],
      pagination: { page: 1, totalPages: 0, total: 0 }
    });

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  it('should handle errors', async () => {
    mockService.getAll.mockRejectedValue(new Error('Network error'));

    render(<TestTableComponent service={mockService} fetchFn="getAll" />);

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByTestId('error')).toHaveTextContent('Network error');
  });

  it('should refetch when refetch is called', async () => {
    const mockData = {
      data: [],
      pagination: { page: 1, totalPages: 0, total: 0 }
    };
    mockService.getAll.mockResolvedValue(mockData);

    render(<TestTableComponent service={mockService} fetchFn="getAll" />);

    // Wait for initial fetch
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mockService.getAll).toHaveBeenCalledTimes(1);

    // Click refetch
    const refetchBtn = screen.getByTestId('refetch-btn');
    await userEvent.click(refetchBtn);

    expect(mockService.getAll).toHaveBeenCalledTimes(2);
  });

  it('should update pagination info', async () => {
    const mockData = {
      data: [{ id: 1 }],
      pagination: {
        page: 2,
        totalPages: 5,
        total: 50
      }
    };
    mockService.getAll.mockResolvedValue(mockData);

    render(<TestTableComponent service={mockService} fetchFn="getAll" />);

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByTestId('page')).toHaveTextContent('2');
    expect(screen.getByTestId('total-pages')).toHaveTextContent('5');
    expect(screen.getByTestId('data-count')).toHaveTextContent('1');
  });
});
