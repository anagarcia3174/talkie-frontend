import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  reauthenticateWithApple,
  reauthenticateWithGoogle,
  revokeGoogleAccess,
  signOutOfGoogle,
} from "@/lib/auth";
import { deleteAccount as deleteAccountRequest } from "@/lib/profile";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  logout: async () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    await signOutOfGoogle();
  };

  const deleteAccount = async () => {
    const providers = session?.user.app_metadata.providers as
      | string[]
      | undefined;
    let appleAuthorizationCode: string | undefined;
    if (Platform.OS === "ios" && providers?.includes("apple")) {
      appleAuthorizationCode = await reauthenticateWithApple();
    } else {
      await reauthenticateWithGoogle();
    }

    await deleteAccountRequest(appleAuthorizationCode);
    await revokeGoogleAccess();
    await supabase.auth.signOut({ scope: "local" });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
