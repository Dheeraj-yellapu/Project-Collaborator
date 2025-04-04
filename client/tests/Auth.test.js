import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {Auth} from '../src/components/Auth'; // Adjust the import path based on your file structure
import axios from 'axios';
import Cookies from 'universal-cookie';

// Mock dependencies
jest.mock('axios');
jest.mock('universal-cookie', () => {
  return jest.fn(() => ({
    set: jest.fn(),
  }));
});

describe('Auth Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock window.location.reload
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  // Test 1: Renders Sign Up form by default
  test('renders Sign Up form by default', () => {
    render(<Auth />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Avatar URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  // Test 2: Switches to Sign In mode
  test('switches to Sign In mode when clicking the switch link', () => {
    render(<Auth />);
    fireEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Phone Number')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Avatar URL')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  // Test 3: Handles form input changes in Sign Up mode
  test('updates form fields on input change in Sign Up mode', () => {
    render(<Auth />);
    const fullNameInput = screen.getByLabelText('Full Name');
    const usernameInput = screen.getByLabelText('Username');
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    expect(fullNameInput.value).toBe('John Doe');
    expect(usernameInput.value).toBe('johndoe');
  });

  // Test 4: Submits Sign Up form and sets cookies
  test('submits Sign Up form and sets cookies on success', async () => {
    const mockResponse = {
      data: {
        token: 'abc123',
        userId: 'user1',
        hashedPassword: 'hashedpass',
        fullName: 'John Doe',
      },
    };
    axios.post.mockResolvedValue(mockResponse);
    const mockCookies = new Cookies();

    render(<Auth />);
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Avatar URL'), { target: { value: 'http://avatar.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/auth/signup', {
        username: 'johndoe',
        password: 'password123',
        fullName: 'John Doe',
        phoneNumber: '1234567890',
        avatarURL: 'http://avatar.com',
      });
      expect(mockCookies.set).toHaveBeenCalledWith('token', 'abc123');
      expect(mockCookies.set).toHaveBeenCalledWith('username', 'johndoe');
      expect(mockCookies.set).toHaveBeenCalledWith('fullName', 'John Doe');
      expect(mockCookies.set).toHaveBeenCalledWith('userId', 'user1');
      expect(mockCookies.set).toHaveBeenCalledWith('phoneNumber', '1234567890');
      expect(mockCookies.set).toHaveBeenCalledWith('avatarURL', 'http://avatar.com');
      expect(mockCookies.set).toHaveBeenCalledWith('hashedPassword', 'hashedpass');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  // Test 5: Submits Sign In form and sets minimal cookies
  test('submits Sign In form and sets minimal cookies on success', async () => {
    const mockResponse = {
      data: {
        token: 'xyz789',
        userId: 'user2',
        hashedPassword: 'hashedpass2',
        fullName: 'Jane Doe',
      },
    };
    axios.post.mockResolvedValue(mockResponse);
    const mockCookies = new Cookies();

    render(<Auth />);
    fireEvent.click(screen.getByText('Sign In')); // Switch to Sign In mode
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'janedoe' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password456' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/auth/login', {
        username: 'janedoe',
        password: 'password456',
        fullName: undefined, // Not provided in Sign In
        phoneNumber: undefined,
        avatarURL: undefined,
      });
      expect(mockCookies.set).toHaveBeenCalledWith('token', 'xyz789');
      expect(mockCookies.set).toHaveBeenCalledWith('username', 'janedoe');
      expect(mockCookies.set).toHaveBeenCalledWith('fullName', 'Jane Doe');
      expect(mockCookies.set).toHaveBeenCalledWith('userId', 'user2');
      expect(mockCookies.set).not.toHaveBeenCalledWith('phoneNumber', expect.anything());
      expect(mockCookies.set).not.toHaveBeenCalledWith('avatarURL', expect.anything());
      expect(mockCookies.set).not.toHaveBeenCalledWith('hashedPassword', expect.anything());
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  // Test 6: Handles API failure
  test('handles API failure gracefully', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    render(<Auth />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled(); // No reload on failure
    });
  });
});