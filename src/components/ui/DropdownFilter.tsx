import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './Select'; // Select 컴포넌트 경로 확인

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  id?: string;
}

export function DropdownFilter({ label, value, onValueChange, options, placeholder, id }: DropdownFilterProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id || label.toLowerCase()} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id || label.toLowerCase()}>
          <SelectValue placeholder={placeholder || `${label} 선택`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}