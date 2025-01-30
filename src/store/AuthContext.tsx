import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { firebaseAuth, firebaseFirestore } from "../firebase/BaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface IAuthContextType {
  user: User | null;
  userDetails: any;
  loading: boolean;
  logout: () => Promise<void>;
}
const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  console.log("🚀 ~ user:", user)
  const [userDetails, setUserDetails] = useState<any>(null);
  console.log("🚀 ~ userDetails:", userDetails)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          // Fetch user details from Firestore
          const userDoc = await getDoc(
            doc(firebaseFirestore, "users", currentUser.uid)
          );
          if (userDoc.exists()) {
            setUserDetails(userDoc.data());
          }
        } else {
          setUserDetails(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  const logout = async () => {
    await signOut(firebaseAuth);
  };

  return (
    <AuthContext.Provider value={{ user, userDetails, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
