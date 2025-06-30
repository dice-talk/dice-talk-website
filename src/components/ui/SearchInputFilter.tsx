import Input from './Input'; 

interface SearchInputFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export function SearchInputFilter({ label, value, onChange, placeholder, id }: SearchInputFilterProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id || label.toLowerCase()} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <Input
        id={id || label.toLowerCase()}
        placeholder={placeholder || `${label} 입력`}
        value={value}
        onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}