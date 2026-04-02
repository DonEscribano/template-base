interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
}

interface TeamProps {
  members: TeamMember[];
  title?: string;
}

export function Team({ members, title = "Nuestro equipo" }: TeamProps) {
  if (members.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          {title}
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.name} className="text-center">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="mx-auto h-40 w-40 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <span className="text-4xl font-bold text-[var(--color-primary)]">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="mt-6 text-lg font-semibold text-[var(--color-text)]">
                {member.name}
              </h3>
              <p className="text-sm text-[var(--color-primary)]">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm text-[var(--color-text)]/60">{member.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
