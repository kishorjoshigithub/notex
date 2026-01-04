import { auth } from "@/config/firebase-config";
import { NewUser, LoggedUser } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "@/config/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    if (userCredential.user) {
      // Need to create a user document in firestore
      const docRef = await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        role: roles[0],
        isEmailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef;
    }
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
};

const loginUser = async (user: LoggedUser) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    return userCredential.user;
  } catch (error) {
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

export { signupUser, loginUser, SignOut };
