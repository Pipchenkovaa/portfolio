'use client';

import { useState } from 'react';

/** mailto + копирование адреса: если почтовый клиент не настроен, адрес всё равно у человека в буфере. */
export function MailCopyLink({
  email,
  label,
  className,
}: {
  email: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <a
      className={className}
      href={`mailto:${email}`}
      onClick={() => {
        navigator.clipboard?.writeText(email).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          },
          () => {},
        );
      }}
    >
      {copied ? `✓ ${email}` : label}
    </a>
  );
}
