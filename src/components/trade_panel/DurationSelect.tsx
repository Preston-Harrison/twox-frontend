import classnames from 'classnames';
import * as React from 'react';

import { DURATIONS } from '../../config';

type Props = {
  duration: number;
  onChange: (duration: number) => void;
};

const DurationSelect: React.FC<Props> = (props) => {
  const { onChange, duration } = props;

  return (
    <div className='relative w-full'>
      <div>
        <div>Select Duration</div>
        <div className='my-2 flex gap-[0.5px] rounded-sm border border-coral-dark-grey bg-coral-dark-grey'>
          {DURATIONS.map((d) => (
            <div
              className={classnames(
                '+ flex flex-1 cursor-pointer flex-col items-center justify-center border-b-4 border-coral-blue                 bg-coral-blue p-1 pt-[4px] transition-all hover:bg-coral-dark-blue max-laptop:text-sm',
                {
                  'cursor-default !border-coral-light-grey !bg-coral-dark-blue':
                    duration === d.duration,
                }
              )}
              onClick={() => onChange(d.duration)}
              key={d.duration}
            >
              <span>{d.display}</span>
              <span>{d.units}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DurationSelect;
