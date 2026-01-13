"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import {
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/config/firebase-config";
import toast from "react-hot-toast";
import { changeEmail, resetPassword } from "@/firebase/auth";

const Account = () => {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleEmailChange = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await changeEmail(newEmail, password);
      toast.success("Verification email sent to new email");
      await auth.signOut();
      setNewEmail("");
      setPassword("");
    } catch (err: any) {
      // console.error(err);
      toast.error(err.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);

    try {
      if (user.email) {
        await resetPassword(user.email);
      }
      toast.success("Password reset email sent.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-8">
        <div className="flex justify-center lg:justify-start">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-52 w-52 rounded-xl object-cover border border-border"
            />
          ) : (
            <div className="h-52 w-52 rounded-xl flex items-center justify-center bg-muted text-8xl font-semibold">
              {user.displayName?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {user.displayName || "No Display Name"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Email Verified</p>
                    <p className="text-muted-foreground">
                      {user.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Account Created</p>
                    <p className="text-muted-foreground">
                      {new Date(
                        user.metadata.creationTime!
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Last Sign In</p>
                    <p className="text-muted-foreground">
                      {new Date(
                        user.metadata.lastSignInTime!
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>New Email</Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Required for security"
                />
              </div>

              <Button
                onClick={handleEmailChange}
                disabled={loading || !newEmail || !password}
              >
                Update Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We’ll send a password reset link to your email.
              </p>

              <Button variant="outline" onClick={handlePasswordReset}>
                Send Password Reset Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
