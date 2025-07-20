// components/FormField.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

const FormField = ({ control, name, label, type, placeholder }: any) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input {...field} type={type} placeholder={placeholder} />
        )}
      />
    </div>
  );
};

export default FormField;
