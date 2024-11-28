import {jwtDecode} from 'jwt-decode'; // Correct the import for jwt-decode
import Cookies from 'js-cookie';  // Corrected the import for js-cookie

const RoleFromToken = () => {
  // Log all cookies to inspect them
  console.log('All cookies:', document.cookie);

  const token = Cookies.get('authToken');  // Use js-cookie to get the token

  console.log('Token from cookie:', token);  // Log token to verify if it's retrieved

  if (token) {
    try {
      const decoded = jwtDecode(token);  // Decode the JWT token
      console.log('Decoded token:', decoded);  // Log the decoded token to the console
      console.log('Role:', decoded.role);  // Log the role
      return decoded.role;  // Extract and return the role from decoded token
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else {
    console.log('Token not found');
  }

  // If no valid token found, return null
  return null;
};

export default RoleFromToken;
