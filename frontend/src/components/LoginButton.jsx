import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const { login, getUserRole } = useAuth();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <p className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
        Google sign-in is unavailable. Set VITE_GOOGLE_CLIENT_ID in frontend/.env.
      </p>
    );
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode JWT token to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userData = JSON.parse(jsonPayload);

      const userRole = getUserRole(userData.email);
      login({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        idToken: credentialResponse.credential,
      });

      if (userRole === 'student') {
        navigate('/upload');
      } else {
        navigate('/gallery');
        alert('Signed in successfully. Submission access is limited to IIITN DW students with valid BT IDs.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Login failed');
    alert('Login failed. Please try again.');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      theme="filled_black"
      size="large"
      text="signin_with"
      shape="rectangular"
    />
  );
};

export default LoginButton;

