import axios from "axios";

export const verifyRecaptcha = async (token: string, remoteip?: string) => {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) throw new Error("RECAPTCHA_SECRET not set");

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (remoteip) params.append("remoteip", remoteip);

  const res = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    params.toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return res.data as {
    success: boolean;
    score?: number;
    action?: string;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
  };
};
