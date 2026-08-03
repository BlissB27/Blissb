"use client";

import { useRef, useState } from "react";
import { FieldGroup, GroupField } from "@/components/ui/field-group";

export type StructuredAddress = { street: string; city: string; state: string; zip: string };

type Suggestion = { placeId: string; label: string };

const AUTOCOMPLETE_DEBOUNCE_MS = 300;
const MIN_INPUT_LENGTH = 4;

export function AddressFields({
  value,
  onChange,
}: {
  value: StructuredAddress;
  onChange: (patch: Partial<StructuredAddress>) => void;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sessionTokenRef = useRef<string>(crypto.randomUUID());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = (input: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (input.trim().length < MIN_INPUT_LENGTH) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/address-autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, sessionToken: sessionTokenRef.current }),
        });
        const data = await response.json();
        setSuggestions(response.ok ? data.suggestions ?? [] : []);
      } catch {
        setSuggestions([]);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
  };

  const handleStreetChange = (newStreet: string) => {
    onChange({ street: newStreet });
    setShowSuggestions(true);
    fetchSuggestions(newStreet);
  };

  const handleSelectSuggestion = async (suggestion: Suggestion) => {
    setShowSuggestions(false);
    setSuggestions([]);

    try {
      const response = await fetch("/api/address-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: suggestion.placeId, sessionToken: sessionTokenRef.current }),
      });
      const data = await response.json();
      if (response.ok) {
        onChange(data);
      }
    } catch {
      // Fields stay editable either way — the customer can just type the rest manually.
    } finally {
      // A fresh session for the next search — bundles each complete address
      // lookup into its own Google Places billing session.
      sessionTokenRef.current = crypto.randomUUID();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <FieldGroup>
          <GroupField
            label="Street address"
            value={value.street}
            onChange={(e) => handleStreetChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay so a click on a suggestion registers before the list unmounts.
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            placeholder="123 Main St"
            autoComplete="off"
          />
        </FieldGroup>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-brand-border bg-white shadow-md">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="block w-full px-3 py-2 text-left text-sm text-brand-text hover:bg-brand-bg"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <FieldGroup>
        <GroupField
          label="City"
          value={value.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="City"
        />
        <div className="grid grid-cols-2 divide-x divide-brand-border">
          <GroupField
            label="State"
            value={value.state}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder="State"
          />
          <GroupField
            label="ZIP code"
            value={value.zip}
            onChange={(e) => onChange({ zip: e.target.value })}
            placeholder="ZIP code"
          />
        </div>
      </FieldGroup>
    </div>
  );
}
