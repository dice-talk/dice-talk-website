import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./Select";

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownFilterProps<T extends string> {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  id?: string;
}

export function DropdownFilter<T extends string>({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  id,
}: DropdownFilterProps<T>) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id || label.toLowerCase()}
        className="mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id || label.toLowerCase()}>
          <SelectValue placeholder={placeholder || `${label} 선택`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
