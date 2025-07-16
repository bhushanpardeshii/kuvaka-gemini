"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveAuthData } from "@/lib/localStorage";

const phoneSchema = z.object({
  country: z.string().min(1, "Select a country"),
  phone: z
    .string()
    .min(6, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\d+$/, "Only digits allowed"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "Only digits allowed"),
});

export default function SignupPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<{ name: string; code: string; dial: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [sentOtp, setSentOtp] = useState(false);
  const [selectedDial, setSelectedDial] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Fetch country data
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=cca2,name,idd")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data
          .filter((c: any) => c.idd && c.idd.root)
          .map((c: any) => ({
            name: c.name.common,
            code: c.cca2,
            dial: c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : ""),
          }))
          .filter((c: any) => c.dial);
        countryList.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(countryList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch countries:', error);
        toast.error('Failed to load countries. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  // Phone form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: "", phone: "" },
  });

  // OTP form
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    setError: setOtpError,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Watch country select to update dial code
  useEffect(() => {
    const code = watch("country");
    const found = countries.find((c) => c.code === code);
    setSelectedDial(found ? found.dial : "");
  }, [watch("country"), countries]);

  // Simulate OTP send
  const onPhoneSubmit = (data: any) => {
    setSentOtp(false);
    setPhone(data.phone);
    setStep("otp");
    
    // Show sending OTP toast
    toast.info('Sending OTP...', {
      description: `OTP will be sent to +${selectedDial} ${data.phone}`,
    });
    
    setTimeout(() => {
      setSentOtp(true);
      // Show OTP sent success toast
      toast.success('OTP Sent Successfully!', {
        description: 'Please check your phone for the 6-digit code (use 123456)',
      });
    }, 1200);
  };

  // Simulate OTP validation
  const onOtpSubmit = (data: any) => {
    if (data.otp === "123456") {
      // Save auth data to localStorage
      saveAuthData(phone, selectedDial);
      
      setStep("success");
      toast.success('Authentication Successful!', {
        description: 'Welcome to Gemini Chat!',
      });
    } else {
      setOtpError("otp", { message: "Invalid OTP. Try 123456." });
      toast.error('Invalid OTP', {
        description: 'Please enter the correct 6-digit code (123456)',
      });
    }
  };

  // Redirect to chat page
  const handleContinueToChat = () => {
    toast.info('Redirecting to chat...', {
      description: 'Setting up your chat experience',
    });
    router.push('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up / Login</h2>
        {step === "phone" && (
          <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Country</label>
              <select
                {...register("country")}
                className="w-full p-2 border rounded bg-background text-foreground"
                disabled={loading}
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message as string}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedDial}
                  readOnly
                  className="w-20 p-2 border rounded bg-muted text-muted-foreground"
                  tabIndex={-1}
                />
                <input
                  {...register("phone")}
                  type="text"
                  placeholder="Enter phone number"
                  className="flex-1 p-2 border rounded bg-background text-foreground"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold hover:bg-primary/90 transition"
              disabled={loading}
            >
              Send OTP
            </button>
          </form>
        )}
        {step === "otp" && (
          <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Enter OTP</label>
              <input
                {...registerOtp("otp")}
                type="text"
                placeholder="123456"
                className="w-full p-2 border rounded bg-background text-foreground tracking-widest text-center text-lg"
                disabled={!sentOtp}
              />
              {errorsOtp.otp && <p className="text-red-500 text-sm mt-1">{errorsOtp.otp.message as string}</p>}
              {!sentOtp && <p className="text-muted-foreground text-sm mt-2">Sending OTP...</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold hover:bg-primary/90 transition"
              disabled={!sentOtp}
            >
              Verify OTP
            </button>
          </form>
        )}
        {step === "success" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-xl font-semibold mb-2">Signup/Login Successful!</div>
            <div className="text-muted-foreground mb-6">Welcome, +{selectedDial} {phone}</div>
            <button
              onClick={handleContinueToChat}
              className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-primary/90 transition"
            >
              Continue to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 