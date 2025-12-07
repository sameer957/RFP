import { useEffect, useState } from 'react';
import Card from '../components/Dashboard/Card';
import { GetMethod } from '../api/APIMethods/Get';
import API_ENDPOINTS from '../api/Endpoints/AllEndpoints';
import HistoryDetail from '../components/modal/HistoryDetail';
import { TEXT } from '../utils/TextConstants';

function Dashboard() {
  const [vendorCount, setVendorCount] = useState<number>(0);
  const [rfpsCreated, setRfpsCreated] = useState<number>(0);
  const [proposalReceived, setProposalReceivedd] = useState<number>(0);
  const [activities, setActivities] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyDetail, setHistoryDetail] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  const showHistoryDetail = async (id: number) => {
    try {
      const res = await GetMethod(API_ENDPOINTS.DASHBOARD.HISTORY_DETAIL(id));

      if (res.success) {
        setHistoryDetail(res.data);
        setIsHistoryModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVendorCount = async () => {
    try {
      const res = await GetMethod(API_ENDPOINTS.DASHBOARD.BRIEF_DATA);
      if (res.success) {
        setVendorCount(res.data.vendorCount);
        setRfpsCreated(res.data.rfpsCreated);
        setProposalReceivedd(res.data.proposalReceived);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchActivities = async () => {
    const res = await GetMethod(API_ENDPOINTS.DASHBOARD.ACTIVITES);

    if (res.success) {
      setActivities(res.data);
    }
  };

  const fetchHistory = async () => {
    const res = await GetMethod(API_ENDPOINTS.DASHBOARD.HISTORY);

    if (res.success) {
      const formatted = res.data.map((item: any) => ({
        id: item.id,
        prompt: item.prompt,
        timeAgo: item.timeAgo,
      }));
      setHistory(formatted);
    }
  };

  useEffect(() => {
    fetchVendorCount();
    fetchActivities();
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col p-6 w-full h-screen bg-gray-950 text-white overflow-hidden space-y-6">
      <HistoryDetail
        isOpen={isHistoryModalOpen}
        historyDetail={historyDetail}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <div>
        <h1 className="text-3xl font-semibold">{TEXT.DASHBOARD.HEADING}</h1>
        <p className="text-gray-400 mt-1">{TEXT.DASHBOARD.SUB_HEADING}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-shrink-0">
        <Card heading={TEXT.DASHBOARD.CARD_ONE_HEADING} data={rfpsCreated} />
        <Card heading={TEXT.DASHBOARD.CARD_TWO_HEADING} data={proposalReceived} />
        <Card heading={TEXT.DASHBOARD.CARD_THIRD_HEADING} data={vendorCount} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto">
        <div className="xl:col-span-2 bg-gray-900 rounded-2xl overflow-y-auto shadow-xl p-6 space-y-4 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">{TEXT.DASHBOARD.ACTIVITY_TITLE}</h2>
          <div className="border-b border-gray-800 mb-2"></div>

          <div className="space-y-4 overflow-y-auto flex-1">
            {activities.map((item: any, index) => (
              <div
                key={index}
                className=" bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/60 transition-all"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.timeAgo}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold mb-3">{TEXT.DASHBOARD.HISTORY_TITLE}</h2>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {history.length ? (
                history.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-blue-600/20 border border-blue-500/20 rounded-xl p-5 hover:bg-blue-600/30 transition-all "
                  >
                    <h3 className="text-base font-semibold text-blue-300 line-clamp-2">
                      {item.prompt}
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">{item.timeAgo}</p>

                    <p
                      className="text-xs text-gray-400 mt-2 underline w-fit cursor-pointer"
                      onClick={() => showHistoryDetail(item.id)}
                    >
                      {TEXT.COMMON.VIEW}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">{TEXT.DASHBOARD.NO_HISTORY}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
