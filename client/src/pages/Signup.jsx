import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      setLoading(false);
      return;
    }

    try {
      const result = await signup(username, email, password);
      if (result.success) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #eff6ff 35%, #dbeafe 70%, #e0f2fe 100%)" }}
    >
      {/* Background blobs */}
      <div className="blob blob-teal"   style={{ width: 460, height: 460, top: "-100px", right: "-120px", opacity: 0.45 }} />
      <div className="blob blob-blue"   style={{ width: 360, height: 360, bottom: "-80px", left: "-80px", opacity: 0.4 }} />
      <div className="blob blob-indigo" style={{ width: 220, height: 220, top: "55%", left: "25%", opacity: 0.2 }} />

      <div className="min-h-screen flex items-center justify-center px-5 py-12 relative">
        <div className="w-full max-w-md fade-up">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2.5 mb-10 group">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #14B8A6 0%, #2563EB 100%)",
                boxShadow: "0 6px 20px rgba(20,184,166,0.3)",
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
            >
              Trippy
            </span>
          </Link>

          {/* Card */}
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1.5px solid rgba(255,255,255,0.95)",
              boxShadow: "0 8px 48px rgba(20,184,166,0.1), 0 2px 16px rgba(15,23,42,0.06)",
            }}
          >
            <div className="text-center mb-8">
              <h1
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}
              >
                Create your account 🚀
              </h1>
              <p className="text-sm" style={{ color: "#64748B" }}>
                Join Trippy and start planning smarter
              </p>
            </div>

            {error && (
              <div
                className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2"
                style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3" }}
              >
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div
                className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2"
                style={{ background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}
              >
                <span className="flex-shrink-0 mt-0.5">✓</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" id="signup-form">
              <AuthField
                id="signup-username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                hint="Minimum 3 characters"
              />
              <AuthField
                id="signup-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <AuthField
                id="signup-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                hint="Minimum 8 characters"
              />

              <button
                type="submit"
                disabled={loading}
                id="signup-submit-btn"
                className="w-full font-bold rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
                style={{
                  background: loading
                    ? "#6EE7B7"
                    : "linear-gradient(135deg, #14B8A6 0%, #2563EB 100%)",
                  color: "#fff",
                  padding: "15px 28px",
                  fontSize: "1rem",
                  border: "none",
                  boxShadow: loading ? "none" : "0 6px 24px rgba(20,184,166,0.3)",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="inline-block rounded-full border-2 border-white/40 border-t-white animate-spin"
                      style={{ width: 18, height: 18 }}
                    />
                    Creating account...
                  </>
                ) : "Create Account →"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm" style={{ color: "#64748B" }}>
              Already have an account?{" "}
              <Link to="/signin" className="font-bold hover:underline" style={{ color: "#2563EB" }}>
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: "#94A3B8" }}>
            🔒 Your data is secure and private
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthField = ({ id, label, type, value, onChange, placeholder, minLength, hint }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-bold uppercase tracking-widest mb-2"
      style={{ color: "#64748B" }}
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      minLength={minLength}
      required
      style={{
        width: "100%",
        padding: "13px 16px",
        border: "1.5px solid #E2E8F0",
        borderRadius: "14px",
        fontSize: "0.9375rem",
        fontFamily: "'Inter', sans-serif",
        color: "#0F172A",
        background: "#FAFBFC",
        outline: "none",
        transition: "all 0.2s",
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = "#14B8A6";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.12)";
        e.currentTarget.style.background = "#fff";
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = "#E2E8F0";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "#FAFBFC";
      }}
    />
    {hint && <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>{hint}</p>}
  </div>
);

export default Signup;
