import axios from "axios";
export const verifyRecaptcha = async (token, remoteip) => {
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret)
        throw new Error("RECAPTCHA_SECRET not set");
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (remoteip)
        params.append("remoteip", remoteip);
    try {
        const res = await axios.post("https://www.google.com/recaptcha/api/siteverify", params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        console.log("✅ reCAPTCHA verification result:", res.data);
        return res.data;
    }
    catch (error) {
        console.error("❌ Error verifying reCAPTCHA:", error);
        throw error;
    }
};
