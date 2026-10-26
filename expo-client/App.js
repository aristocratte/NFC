import { createContext, useContext, useState } from 'react';

// La sesión vive en memoria: la contraseña nunca se guarda.
const SessionContext = createContext(null);

export default function App({ children }) {
  const [user, setUser] = useState(null);
  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
