"use client";

import React, { useCallback, useState, forwardRef, useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { useCountry } from "@/components/country-context";
import { COUNTRY_NAMES } from "@/utilities/CountryConfig/Link";

// Country interface matching our application's needs
export interface CountryOption {
  alpha2: string;
  alpha3: string;
  name: string;
}

// Convert our country data to the format needed
const countryOptions: CountryOption[] = Object.entries(COUNTRY_NAMES).map(([alpha3, name]) => ({
  alpha2: alpha3.slice(0, 2), // Convert 3-letter to 2-letter code
  alpha3,
  name
}));

interface CountryDropdownProps {
  onChange?: (country: CountryOption) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
}

const CountryDropdownComponent = (
  {
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [selected, setSelected] = useState<CountryOption | undefined>(
    defaultValue ? countryOptions.find(c => c.alpha3 === defaultValue) : undefined
  );

  useEffect(() => {
    if (defaultValue) {
      const initialCountry = countryOptions.find(
        (country) => country.alpha3 === defaultValue
      );
      if (initialCountry) {
        setSelected(initialCountry);
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (selectedCountry) {
      const country = countryOptions.find(c => c.alpha3 === selectedCountry);
      if (country) {
        setSelected(country);
      }
    }
  }, [selectedCountry]);

  const handleSelect = useCallback(
    (value: string) => {
      const country = countryOptions.find((c) => c.alpha3 === value);
      if (country) {
        setSelected(country);
        setSelectedCountry(
          country.alpha3 as
            | "AU"
            | "BR"
            | "CO"
            | "DE"
            | "IN"
            | "IT"
            | "MX"
            | "NG"
            | "US"
            | "ZA"
        );
        onChange?.(country);
      }
    },
    [onChange, setSelectedCountry]
  );

  return (
    <Select
      value={selected?.alpha3}
      onValueChange={handleSelect}
      disabled={disabled}
    >
      <SelectTrigger
        ref={ref}
        className={cn(
          "flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          slim ? "w-20" : "w-full"
        )}
      >
        <SelectValue placeholder={placeholder}>
          {selected ? (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                <CircleFlag
                  countryCode={selected.alpha2.toLowerCase()}
                  height={20}
                />
              </div>
              {!slim && (
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {selected.name}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {slim ? <Globe size={20} /> : <span>{placeholder}</span>}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Countries</SelectLabel>
          {countryOptions.map((option) => (
            <SelectItem
              key={option.alpha3}
              value={option.alpha3}
              className="flex items-center gap-2 w-full cursor-pointer"
            >
              <div className="inline-block w-5 h-5">
                <CircleFlag
                  countryCode={option.alpha2.toLowerCase()}
                  height={20}
                />
              </div>
              <span className="inline-block">
                {option.name}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent); 