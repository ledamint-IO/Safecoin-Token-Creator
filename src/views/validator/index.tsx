import { FC } from 'react';

import { MonitorValidator } from 'components/MonitorValidatorSetup';

export const ValidatorView: FC = ({ }) => {

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#90f5c5] to-[#90f5c5]">
          Validator Monitor
        </h1>      
        <div className="text-center">
          <MonitorValidator />
        </div>
      </div>
    </div>
  );
};
