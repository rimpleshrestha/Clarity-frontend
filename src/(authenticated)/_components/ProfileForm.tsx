// components/profile/ProfileForm.tsx
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  isEditing: boolean;
  onSubmit: () => void;
}

export const ProfileForm = ({
  name,
  setName,
  email,
  isEditing,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <form
      id="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">Name</label>
        <Input
          value={name}
          disabled={!isEditing}
          onChange={(e) => setName(e.target.value)}
          className="border-none bg-transparent p-0 h-auto text-lg focus-visible:ring-0 disabled:opacity-100 font-medium"
        />
        <hr className="border-slate-200" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">Email</label>
        <Input
          value={email}
          disabled
          className="border-none bg-transparent p-0 h-auto text-lg focus-visible:ring-0 disabled:opacity-100 font-medium"
        />
      </div>
    </form>
  );
};
