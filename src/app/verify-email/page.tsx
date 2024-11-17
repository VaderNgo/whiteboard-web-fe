"use client";

import React, { useEffect, useState } from "react";
import { useLoggedInUser } from "@/lib/services/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useResendConfirmationEmail, useVerifyEmail } from "@/lib/services/mutations";

export default function VerifyEmailPage() {
  const user = useLoggedInUser();
  const params = useSearchParams();
  const router = useRouter();
  const verifyEmail = useVerifyEmail();
  const resendConfirmationEmail = useResendConfirmationEmail();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResent, setIsResent] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      router.push("/dashboard");
    }
  }, [isSuccess, countdown, router]);

  useEffect(() => {
    if (params.has("token")) {
      verifyEmail
        .mutateAsync(params.get("token")!)
        .then(() => {
          setIsSuccess(true);
        })
        .catch(() => {
          if (user.data?.emailVerified) {
            setIsSuccess(true);
          } else {
            setIsError(true);
          }
        });
    }
  }, []);

  const handleResendConfirmation = async () => {
    try {
      await resendConfirmationEmail.mutateAsync();
      setIsResent(true);
    } catch (error) {
      console.error("Failed to resend confirmation email:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isError && (
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Token Expired</h1>
            <p className="text-gray-600 mb-6">
              Your verification link has expired or is invalid. Please request a new verification
              email.
            </p>

            <button
              onClick={handleResendConfirmation}
              disabled={resendConfirmationEmail.isPending || isResent}
              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendConfirmationEmail.isPending || isResent ? (
                <span className="flex items-center justify-center">
                  {isResent ? (
                    "Email resent"
                  ) : (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  )}
                </span>
              ) : (
                "Resend Confirmation Email"
              )}
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified</h1>
            <p className="text-gray-600">Redirecting to dashboard in {countdown} seconds...</p>
          </div>
        )}

        {!isSuccess && !isError && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email</h1>
              <p className="text-gray-600">
                Please wait while we confirm your email address. This should only take a moment.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse w-2/3"></div>
              </div>

              <p className="text-sm text-gray-500">
                You&#39;ll be automatically redirected once verification is complete
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
