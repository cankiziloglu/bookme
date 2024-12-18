'use client';

import { useState } from 'react';
import { Button, ButtonProps } from './ui/button';
import { Copy, CopyCheck, CopyX } from 'lucide-react';

export default function CopyEventButton({
  eventId,
  clerkUserId,
  ...buttonProps
}: Omit<ButtonProps, 'children' | 'onClick'> & {
  eventId: string;
  clerkUserId: string;
}) {
  type CopyStateType = 'idle' | 'copied' | 'error';
  const [copyState, setCopyState] = useState<CopyStateType>('idle');

  const CopyIcon = getCopyIcon(copyState);

  function getCopyIcon(copyState: CopyStateType) {
    switch (copyState) {
      case 'idle':
        return Copy;
      case 'copied':
        return CopyCheck;
      case 'error':
        return CopyX;
    }
  }

  function getChildren(copyState: CopyStateType) {
    switch (copyState) {
      case 'idle':
        return 'Copy Link';
      case 'copied':
        return 'Copied!';
      case 'error':
        return 'Error';
    }
  }

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        navigator.clipboard
          .writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
          .then(() => {
            setCopyState('copied');
            setTimeout(() => setCopyState('idle'), 3000);
          })
          .catch(() => {
            setCopyState('error');
            setTimeout(() => setCopyState('idle'), 3000);
          });
      }}
    >
      <CopyIcon />
      {getChildren(copyState)}
    </Button>
  );
}
