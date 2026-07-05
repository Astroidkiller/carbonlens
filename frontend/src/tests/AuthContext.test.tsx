import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
  }
}));

const TestComponent = () => {
  const { user, login } = useAuth();
  return (
    <div>
      <div data-testid="user-id">{user ? user.id : 'No User'}</div>
      <button onClick={() => login('fake-token')}>
        Login Button
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  it('provides null user initially when no token', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-id')).toHaveTextContent('No User');
  });

  it('fetches user if token is in localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue('fake-token');
    vi.mocked(authService.getProfile).mockResolvedValueOnce({
      id: 'user-123',
      email: 'test@example.com',
      full_name: 'Test User',
      current_carbon_score: 0,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('user-123');
    });
    expect(authService.getProfile).toHaveBeenCalledTimes(1);
  });
});
