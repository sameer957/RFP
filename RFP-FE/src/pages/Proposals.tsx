import React, { useEffect, useState } from 'react';
import { GetMethod } from '../api/APIMethods/Get';
import API_ENDPOINTS from '../api/Endpoints/AllEndpoints';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../utils/Paths';
import { TEXT } from '../utils/TextConstants';

function Proposals() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const getAllRfps = async () => {
    try {
      const res = await GetMethod(API_ENDPOINTS.RFP.GET_RFPS);

      if (res?.success) {
        setRfps(res.data);
      } else {
        setError('Failed to load proposals');
      }
    } catch (err) {
      setError('Something went wrong while fetching proposals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRfps();
  }, []);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="spinner"></div>
      </div>
    );
  }
  {
    if (error) {
      return <div className="p-4 bg-gray-950 h-screen w-full text-red-500">{error}</div>;
    }
  }

  return (
    <div className="w-full h-screen p-6 bg-gray-950 overflow-y-auto">
      <h1 className="text-2xl text-white font-semibold mb-4">{TEXT.PROPOSAL.HEADING}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rfps.map((item: any) => (
          <div
            key={item.id}
            className="bg-blue-600/20 shadow-md rounded-xl p-5 border hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(PATHS.PROPOSAL_DETAIL_LINK(item.id))}
          >
            <h2 className="text-lg font-bold text-white/70 mb-2">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.timeAgo}</p>

            <button className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              {TEXT.PROPOSAL.BTN_TEXT}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Proposals;
