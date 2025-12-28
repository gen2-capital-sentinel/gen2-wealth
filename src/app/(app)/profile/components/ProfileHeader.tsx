type ProfileHeaderProps = {
  name: string;
};

export function ProfileHeader({ name }: ProfileHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
      <p className="text-muted-foreground">
        Manage your profile and KYC information, {name}.
      </p>
    </div>
  );
}
