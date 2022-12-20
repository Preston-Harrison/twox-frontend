import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

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
  return (
    <div className='w-full'>
      <Dropdown>
        <Dropdown.Toggle
          variant='success'
          className='w-full'
          id='duration-dropdown'
        >
          {formatDuration(duration)}
        </Dropdown.Toggle>

        <Dropdown.Menu className='w-full'>
          {DURATIONS.filter((d) => d !== duration).map((d) => (
            <Dropdown.Item onClick={() => onChange(d)} key={d}>
              {formatDuration(d)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DurationDropdown;
