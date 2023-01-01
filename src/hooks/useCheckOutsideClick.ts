import * as React from 'react';

export default function useCheckOutsideClick(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  React.useEffect(() => {
    // Alert if clicked on outside of element
    function handleClickOutside(event: MouseEvent) {
      if (
        ref &&
        ref.current &&
        !ref.current.contains(event.target as Node | null)
      ) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}
