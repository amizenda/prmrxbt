"use client";

/**
 * WalletInput — validates Ethereum addresses (0x + 40 hex chars).
 * Shows green checkmark on valid, red border + error on invalid.
 *
 * Used in: /dashboard
 */

import { useState, useCallback } from "react";
import { isValidAddress, truncateAddress } from "@/utils/wallet";

interface WalletInputProps {
  onSubmit: (address: string) => void;
  initialValue?: string;
  isLoading?: boolean;
}

export function WalletInput({ onSubmit, initialValue = "", isLoading = false }: WalletInputProps) {
  const [value, setValue] = useState(initialValue.trim());
  const [touched, setTouched] = useState(false);

  const isValid = isValidAddress(value);
  const showError = touched && value.length > 0 && !isValid;

  const handleSubmit = useCallback(() => {
    setTouched(true);
    if (!isValid) return;
    onSubmit(value.toLowerCase());
  }, [isValid, onSubmit, value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label
        htmlFor="wallet-address-input"
        className="text-sm font-label font-medium text-on-surface-variant tracking-wide uppercase"
        style={{ letterSpacing: "0.08em" }}
      >
        Wallet Address
      </label>

      {/* Input row */}
      <div className="flex gap-2 items-stretch">
        <div className="relative flex-1">
          <input
            id="wallet-address-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="0x0000...0000"
            value={value}
            onChange={(e) => {
              // Allow paste of full address; don't restrict typing
              setValue(e.target.value);
              if (touched) setTouched(false);
            }}
            onBlur={() => setTouched(true)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={[
              "w-full h-11 px-3 pr-10 rounded-[var(--radius-sm)]",
              "bg-surface-container-low text-on-surface font-label text-sm",
              "border transition-colors duration-150",
              "placeholder:text-on-surface-variant/50",
              "focus:outline-none focus:ring-2",
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-text",
              // Validation states
              showError
                ? "border-error focus:ring-error/40"
                : value.length > 0 && isValid
                ? "border-primary focus:ring-primary/40"
                : "border-outline-variant focus:ring-primary/40",
            ]
              .filter(Boolean)
              .join(" ")}
          />

          {/* Validation icon */}
          {value.length > 0 && (
            <span
              className={[
                "absolute right-3 top-1/2 -translate-y-1/2",
                "material-symbols-outlined text-sm leading-none",
                showError ? "text-error" : isValid ? "text-primary" : "text-outline",
              ].join(" ")}
              aria-hidden="true"
            >
              {showError ? "error" : isValid ? "check_circle" : "circle"}
            </span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !isValid}
          className={[
            "h-11 px-5 rounded-[var(--radius-sm)] font-label font-semibold text-sm",
            "transition-all duration-150",
            "flex items-center gap-2",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "bg-primary text-on-primary",
            "!hover:bg-primary/90 active:scale-95",
          ].join(" ")}
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              Loading
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">search</span>
              Track
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {showError && (
        <p className="text-xs text-error font-label flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">warning</span>
          Must be a valid Ethereum address (0x + 40 hex characters)
        </p>
      )}

      {/* Truncated preview */}
      {isValid && value.length > 0 && (
        <p className="text-xs text-on-surface-variant font-label">
          Tracking: <span className="font-mono text-primary">{truncateAddress(value)}</span>
        </p>
      )}
    </div>
  );
}
