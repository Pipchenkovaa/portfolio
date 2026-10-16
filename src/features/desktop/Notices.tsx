'use client';

import { useUnit } from 'effector-react';
import { $notices, noticeDismissed } from '@/features/notifications/model';
import { MailAppIcon } from '@/shared/app-icons';

export function Notices() {
  const { notices, dismiss } = useUnit({ notices: $notices, dismiss: noticeDismissed });
  return (
    <div className="notices" aria-live="polite">
      {notices.map((n) => (
        <button key={n.id} type="button" className="notice glass" onClick={() => dismiss(n.id)}>
          <MailAppIcon size={36} />
          <span className="flex-1">
            <span className="n-head">
              <span>{n.app}</span>
              <span>now</span>
            </span>
            <b className="block font-semibold">{n.title}</b>
            <span className="block opacity-80">{n.body}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
