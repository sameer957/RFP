import React, { useEffect, useState } from 'react';
import { GetMethod } from '../api/APIMethods/Get';
import API_ENDPOINTS from '../api/Endpoints/AllEndpoints';
import { useParams } from 'react-router-dom';
import { TEXT } from '../utils/TextConstants';

export interface ProposalReply {
  id: number;
  promptId: number;
  vendorEmail: string;
  messageId: string;
  bodyText: string | null;
  createdAt: string;
  processed: boolean;
  score: number | null;
  summary: string | null;
  selected: boolean;
}

function ProposalDetail() {
  const { id } = useParams();
  const numericId = Number(id);
  const [proposals, setProposals] = useState([]);
  const [bestProposal, setBestProposal] = useState<ProposalReply>();
  const [loading, setLoading] = useState(true);
  const [totalReplies, setTotalReplies] = useState<number>();

  const getSingleRfpResponses = async () => {
    try {
      const res = await GetMethod(API_ENDPOINTS.RFP.SINGLE_RFP_DETAIL(numericId));

      if (res?.success) {
        setTotalReplies(res.totalReplies);
        const list = res.data;
        setProposals(list);

        const best = list.find((p: any) => p.selected === true);
        setBestProposal(best);
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleRfpResponses();
  }, []);

  if (loading) return <div className="p-10 text-gray-200 text-xl">Loading proposals...</div>;

  return (
    <div className="w-full p-6 bg-gray-950 text-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{TEXT.PROPOSAL_DETAILS.HEADING}</h1>
        <p className="text-gray-400 mt-1">{TEXT.PROPOSAL_DETAILS.SUB_HEADING}</p>
      </div>

      <div className="mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-medium">{TEXT.PROPOSAL_DETAILS.CARD_HEADING}</h2>
        <p className="text-gray-400 mt-1">{TEXT.PROPOSAL_DETAILS.CARD_SUB_HEADING}</p>

        <div className="mt-4 flex items-center gap-8">
          <div className="bg-blue-600/20 px-4 py-2 rounded-xl text-blue-400 font-medium">
            {TEXT.PROPOSAL_DETAILS.TOTAL_REPLIES} {totalReplies}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">{TEXT.PROPOSAL_DETAILS.ALL_PROPOSAL}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {proposals.map((p: any) => (
          <div
            key={p.id}
            className={`
              bg-gray-900 border rounded-2xl p-5 shadow-lg transition
              ${p.selected ? 'border-green-500/40 shadow-green-700/20' : 'border-gray-800'}
            `}
            style={{
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 className="text-lg font-medium mb-2">{p.vendorEmail}</h2>

            <div className="text-gray-300 space-y-2 overflow-y-auto pr-2" style={{ flexGrow: 1 }}>
              <p>
                <span className="text-gray-500">{TEXT.PROPOSAL_DETAILS.SCORE}</span>{' '}
                {p.score ?? 'Not processed'}
              </p>

              <p>
                <span className="text-gray-500">{TEXT.PROPOSAL_DETAILS.SUMMARY}</span>{' '}
                {p.summary || 'No summary available'}
              </p>

              <p>
                <span className="text-gray-500">{TEXT.PROPOSAL_DETAILS.REPLY}</span>{' '}
                {p.bodyText?.slice(0, 250)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      {bestProposal && (
        <div className="bg-gray-900 border border-green-500/40 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-green-400">
            {TEXT.PROPOSAL_DETAILS.BEST_PROPOSAL}
          </h2>

          <p className="text-gray-400 mt-1">{TEXT.PROPOSAL_DETAILS.HIGHEST_SCORE}</p>

          <div className="mt-6 bg-green-600/20 rounded-xl p-5">
            <h3 className="text-xl font-medium text-green-400">{bestProposal?.vendorEmail}</h3>

            <div className="space-y-2 text-gray-300 mt-3">
              <p>
                <span className="text-gray-500">{TEXT.PROPOSAL_DETAILS.SCORE}</span>{' '}
                {bestProposal?.score}
              </p>
              <p>
                <span className="text-gray-500">{TEXT.PROPOSAL_DETAILS.SUMMARY}</span>{' '}
                {bestProposal?.summary}
              </p>

              <p>
                <span className="text-gray-500">{TEXT.PROPOSAL_DETAILS.REPLY}</span>{' '}
                {bestProposal?.bodyText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProposalDetail;
