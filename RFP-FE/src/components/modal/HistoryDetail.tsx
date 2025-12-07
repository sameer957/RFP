import React from 'react';
import { TEXT } from '../../utils/TextConstants';

function HistoryDetail({ isOpen, historyDetail, onClose }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] p-6 overflow-hidden animate-fadeIn">
        <button
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">{TEXT.HISTORY_DETAIL.RFP_DETAILS}</h2>

        <div className="overflow-y-auto max-h-[70vh] pr-2">
          {!historyDetail?.rfpJson ? (
            <p className="text-gray-500">{TEXT.HISTORY_DETAIL.NO_DETAILS}</p>
          ) : (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-5">
              <h3 className="text-2xl font-semibold text-white">{historyDetail.rfpJson.title}</h3>

              <p className="text-gray-300">{historyDetail.rfpJson.description}</p>

              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">
                  {TEXT.CREATE_RFP.PROPOSAL_REQUIREMENTS}
                </h4>
                <ul className="space-y-3">
                  {historyDetail.rfpJson.items?.map((item: any, index: any) => (
                    <li key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-gray-400 text-sm">{item.specs}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-400">
                  {TEXT.CREATE_RFP.PROPOSAL_BUDGET}
                </h4>
                <p className="text-gray-100">{historyDetail.rfpJson.budget}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-400">
                  {TEXT.CREATE_RFP.PROPOSAL_DELIVERY}
                </h4>
                <p className="text-gray-300">{historyDetail.rfpJson.deliveryTimeline}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-400">
                  {TEXT.CREATE_RFP.PROPOSAL_PAYMENT_TERMS}
                </h4>
                <p className="text-gray-300">{historyDetail.rfpJson.paymentTerms}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-400">
                  {TEXT.CREATE_RFP.PROPOSAL_WARRANTY}
                </h4>
                <p className="text-gray-300">{historyDetail.rfpJson.warranty}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryDetail;
