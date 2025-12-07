import React, { memo } from 'react';

type CardProps = {
  heading: string;
  data?: string | number;
};

const Card = ({ heading, data }: CardProps) => {
  return (
    <div className="bg-gray-900 p-7 text-white shadow-xl rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold mb-2 text-center">{heading}</h2>
      {data !== undefined && <p className="text-lg font-medium text-center">{data}</p>}
    </div>
  );
};

export default memo(Card);
