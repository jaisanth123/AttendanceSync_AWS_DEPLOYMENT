import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode

const RoleFromToken = () => {
  // Log all session storage items to inspect them
  console.log('SessionStorage:', sessionStorage);

  const token = sessionStorage.getItem('authToken'); // Retrieve the token from sessionStorage

  console.log('Token from sessionStorage:', token); // Log token to verify if it's retrieved

  if (token) {
    try {
      const decoded = jwtDecode(token); // Decode the JWT token
      console.log('Decoded token:', decoded); // Log the decoded token to the console
      console.log('Role:', decoded.role); // Log the role
      return decoded.role; // Extract and return the role from decoded token
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else {
    console.log('Token not found in sessionStorage');
  }

  // If no valid token found, return null
  return null;
};

export default RoleFromToken;
