import { auth } from "@/config/firebase-config";
import { NewUser, LoggedUser } from "@/types";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { db } from "@/config/firebase-config";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
const roles = ["user", "admin"];

const signupUser = async (user: NewUser) => {
  const { name, email, password } = user;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, { displayName: name });

    await sendEmailVerification(userCredential.user);
    const docRef = await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      role: roles[0],
      email: userCredential.user.email,
      name: userCredential.user.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: userCredential.user.emailVerified,
    });

    return { docRef, message: "Verify Email to complete the signup" };
  } catch (error: any) {
    console.log(error.code, error.message);
  }
};

const loginUser = async (user: LoggedUser) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    await userCredential.user.reload();

    if (!userCredential.user.emailVerified) {
      throw new Error("Verify your email before logging in.");
    }

    const userDocQuery = query(
      collection(db, "users"),
      where("uid", "==", userCredential.user.uid),
      limit(1)
    );
    const querySnapshot = await getDocs(userDocQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        isEmailVerified: true,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        updatedAt: serverTimestamp(),
      });
    }

    return userCredential.user;
  } catch (error: any) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      }
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email");
      }
      if (error.code === "auth/invalid-credential") {
        throw new Error("Invalid email or password");
      }
      throw new Error("Login failed. Please try again");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Something went wrong");
  }
};

const SignOut = async () => {
  try {
    const user = await auth.signOut();
    console.log("User signed out");
  } catch (error: any) {
    console.log("Sign out error", error);
  }
};

const getUserById = async (userId: string) => {
  try {
    const user = await getDoc(doc(db, "users", userId));
    return user;
  } catch (error: any) {
    console.error(error.code, error.message);
  }
};

const changeEmail = async (
  newEmail: string,
  password: string
): Promise<void> => {
  try {
    const user: User | null = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No authenticated user found");
    }

    if (newEmail === user.email) {
      throw new Error("New email must be different from the current email");
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", newEmail), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("Email already in use");
    }

    await verifyBeforeUpdateEmail(user, newEmail);

    console.log("Verifify new email to complete the change.");
  } catch (error: any) {
    console.error(error);

    switch (error.code) {
      case "auth/wrong-password":
        throw new Error("Incorrect password");
      case "auth/invalid-email":
      case "auth/invalid-new-email":
        throw new Error("Please enter a valid email address.");
      case "auth/requires-recent-login":
        throw new Error("Please log in again and retry");
      case "auth/too-many-requests":
        throw new Error("Too many attempts. Try again later.");
      case "auth/invalid-credential":
        throw new Error("Invalid credentials provided");
      default:
        if (error instanceof Error) throw error;
        throw new Error("Failed to update email");
    }
  }
};

const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Please enter your email address.");
    }
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("No account found with this email.");
    }
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error(error);
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-email":
          throw new Error("Please enter a valid email address.");
        case "auth/user-not-found":
          throw new Error("No account found with this email.");
        case "auth/too-many-requests":
          throw new Error("Too many requests. Please try again later.");
        default:
          throw new Error(
            "Failed to send password reset email. Please try again."
          );
      }
    }
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to send password reset email. Please try again.");
  }
};

export {
  signupUser,
  loginUser,
  SignOut,
  getUserById,
  changeEmail,
  resetPassword,
};
