// This file is superseded by Module 5's AuthContext (frontend/src/M5/AuthContext.js)
// Module 3 now uses Module 5's real authentication instead of mock users.
// Kept as placeholder to avoid breaking old imports.

import { useAuth } from '../../M5/useAuth';
export { useAuth };

// Legacy mock users — no longer used
export const AuthProvider = ({ children }) => children;
