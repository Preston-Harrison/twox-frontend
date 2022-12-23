import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';

import useCheckOutsideClick from '../hooks/useCheckOutsideClick';

type Props = {
  duration: number;
  onChange: (duration: number) => void;
};

const DURATIONS = [5 * 60, 10 * 60, 30 * 60];

function formatDuration(d: number) {
  return `${d / 60}m`;
}

const DurationDropdown: React.FC<Props> = (props) => {
  const { onChange, duration } = props;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  useCheckOutsideClick(ref, close);

  return (
    <div className='relative w-full' ref={ref}>
      <Button onClick={() => setOpen(!open)} className='w-full'>
        {formatDuration(duration)}
      </Button>
      <div
        className={classnames('absolute z-10 w-full', {
          hidden: !open,
        })}
      >
        {DURATIONS.filter((d) => d !== duration).map((d) => {
          return (
            <button
              onClick={() => {
                onChange(d);
                close();
              }}
              key={d}
              className='w-full bg-white p-2 hover:!bg-gray-200'
            >
              {formatDuration(d)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DurationDropdown;
