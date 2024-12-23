import { PasswordStrength } from "@/types/wallet-auth";

interface PasswordStrengthIndicatorProps {
    strength: PasswordStrength;
  }

  export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strength }) => {
    const strengthItems = [
      { key: 'length', label: 'At least 8 characters' },
      { key: 'uppercase', label: 'At least 1 uppercase letter' },
      { key: 'lowercase', label: 'At least 1 lowercase letter' },
      { key: 'number', label: 'At least 1 number' },
      { key: 'specialChar', label: 'At least 1 special character' },
    ];
  
    return (
      <div className="mt-2 space-y-1 text-sm">
        {strengthItems.map(({ key, label }) => (
          <p 
            key={key} 
            className={strength[key as keyof PasswordStrength] 
              ? "text-green-500" 
              : "text-red-500"}
          >
            {label}
          </p>
        ))}
      </div>
    );
  };