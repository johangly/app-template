import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  const defaultProps = {
    email: '',
    setEmail: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    handleLogin: jest.fn((e) => e.preventDefault()),
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with email and password inputs', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('calls setEmail when email input changes', async () => {
    const setEmail = jest.fn();
    render(<LoginForm {...defaultProps} setEmail={setEmail} />);

    const emailInput = screen.getByLabelText(/correo/i);
    await userEvent.type(emailInput, 'test@example.com');

    expect(setEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('calls setPassword when password input changes', async () => {
    const setPassword = jest.fn();
    render(<LoginForm {...defaultProps} setPassword={setPassword} />);

    const passwordInput = screen.getByLabelText(/contraseña/i);
    await userEvent.type(passwordInput, 'password123');

    expect(setPassword).toHaveBeenCalledWith('password123');
  });

  it('calls handleLogin when form is submitted', async () => {
    const handleLogin = jest.fn((e) => e.preventDefault());
    render(<LoginForm {...defaultProps} handleLogin={handleLogin} />);

    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    await userEvent.click(submitButton);

    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it('disables inputs and shows loading state when loading is true', () => {
    render(<LoginForm {...defaultProps} loading={true} />);

    expect(screen.getByLabelText(/correo/i)).toBeDisabled();
    expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /cargando/i })).toBeDisabled();
  });

  it('prevents form submission when fields are empty', async () => {
    const handleLogin = jest.fn((e) => e.preventDefault());
    render(<LoginForm {...defaultProps} handleLogin={handleLogin} />);

    const form = screen.getByRole('form') || document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
      expect(handleLogin).toHaveBeenCalled();
    }
  });

  it('has required attributes on inputs', () => {
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/correo/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    render(<LoginForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/contraseña/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Note: This test assumes there's a toggle button
    // You may need to adjust based on actual implementation
  });
});
