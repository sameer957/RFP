import { useEffect, useState } from 'react';
import { PostMethod } from '../api/APIMethods/Post';
import API_ENDPOINTS from '../api/Endpoints/AllEndpoints';
import toast from 'react-hot-toast';
import { GetMethod } from '../api/APIMethods/Get';
import SelectTemplate from '../components/modal/SelectTemplate';
import { TEXT } from '../utils/TextConstants';

interface RfpTemplate {
  id: number;
  key: string;
  title: string;
  description: string;
  systemPrompt: string;
}

function CreateRFP() {
  const [prompt, setPrompt] = useState<string>('');
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorEmails, setSelectedVendorEmails] = useState<string[]>([]);

  const [selectedTemplate, setSelectedTemplate] = useState<RfpTemplate | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const sendEmail = async () => {
    if (selectedVendorEmails.length === 0) {
      toast.error('Select at least 1 vendor');
      return;
    }

    if (!proposal.rfpJson) {
      toast.error('Generate RFP first');
      return;
    }

    const payload = {
      vendorEmails: selectedVendorEmails,
      promptId: proposal?.promptId ?? null,
      rfpJson: proposal?.rfpJson,
    };

    setLoading(true);
    const res = await PostMethod(API_ENDPOINTS.RFP.SEND_EMAIL, payload);

    if (res.success) {
      setLoading(false);
      setSelectedVendorEmails([]);
      setPrompt('');
      setProposal(null);
      toast.success('Email sent successfully!');
    } else {
      setLoading(false);
      toast.error('Failed to send email');
    }
  };

  const handleClick = async () => {
    if (!prompt) {
      toast.error('Please provide a prompt and select a template.');
      return;
    }

    const payload = {
      prompt: prompt,
      systemPrompt: selectedTemplate?.systemPrompt ?? null,
    };

    setLoading(true);
    const res = await PostMethod(API_ENDPOINTS.RFP.CREATE, payload);

    if (res.success) {
      setLoading(false);
      toast.success('RFP generated successfully');
      setProposal(res?.data);
    } else {
      toast.error('Failed to generate RFP, Try Again');
    }
    setLoading(false);
  };

  const getSelectedTemplate = async () => {
    const res = await GetMethod(API_ENDPOINTS.TEMPLATES.GET_SAVED_TEMPLATE);
    setSelectedTemplate(res.data);
  };

  const getAllVendors = async () => {
    const res = await GetMethod(API_ENDPOINTS.VENDOR.FETCH(''));
    setVendors(res.vendors);
  };

  useEffect(() => {
    getSelectedTemplate();
    getAllVendors();
  }, []);

  return (
    <div className="w-full h-screen p-6 bg-gray-950 text-gray-100 relative">
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {isModalOpen && (
        <SelectTemplate
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{TEXT.CREATE_RFP.HEADING}</h1>
        <p className="text-gray-400 mt-1">{TEXT.CREATE_RFP.SUB_HEADING}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80%]">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col">
          <h2 className="text-xl font-medium mb-3">{TEXT.CREATE_RFP.REQUIREMENT}</h2>

          <div className="flex justify-between items-center mb-3 gap-2">
            <p className="text-sm text-gray-400">
              {TEXT.CREATE_RFP.DOMAIN}{' '}
              <span className="text-blue-400 font-medium">
                {selectedTemplate?.title || 'None Selected'}
              </span>
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer text-sm bg-purple-600 hover:bg-purple-700 transition text-white px-3 py-1.5 rounded-lg"
            >
              {TEXT.CREATE_RFP.CHOOSE_DOMAIN}
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={TEXT.CREATE_RFP.WRITE_PROMPT_PLACEHOLDER}
            className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-200 text-lg outline-none focus:ring-2 focus:ring-blue-600 transition"
          />

          <button
            className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-xl disabled:bg-gray-600"
            onClick={handleClick}
            disabled={!prompt}
          >
            {TEXT.CREATE_RFP.GENERATE}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col min-h-0">
          <h2 className="text-xl font-medium mb-4">{TEXT.CREATE_RFP.PROPOSAL_HEADING}</h2>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            {!proposal?.rfpJson ? (
              <p className="opacity-60">{TEXT.CREATE_RFP.GET_PROPOSAL_TEXT}</p>
            ) : (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-5">
                <h3 className="text-2xl font-semibold text-white">{proposal?.rfpJson?.title}</h3>

                <p className="text-gray-300">{proposal?.rfpJson?.description}</p>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    {TEXT.CREATE_RFP.PROPOSAL_REQUIREMENTS}
                  </h4>

                  <ul className="space-y-3">
                    {proposal?.rfpJson?.items?.map((item: any, index: number) => (
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
                  <p className="text-gray-100">{proposal?.rfpJson?.budget}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400">
                    {TEXT.CREATE_RFP.PROPOSAL_DELIVERY}
                  </h4>
                  <p className="text-gray-300">{proposal?.rfpJson?.deliveryTimeline}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400">
                    {TEXT.CREATE_RFP.PROPOSAL_PAYMENT_TERMS}
                  </h4>
                  <p className="text-gray-300">{proposal?.rfpJson?.paymentTerms}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400">
                    {TEXT.CREATE_RFP.PROPOSAL_WARRANTY}
                  </h4>
                  <p className="text-gray-300">{proposal?.rfpJson?.warranty}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col min-h-0">
          <h2 className="text-xl font-medium mb-4">{TEXT.CREATE_RFP.VENDORS_AVAILABLE}</h2>

          <div className="space-y-3 overflow-y-auto pr-2 flex-1 min-h-0">
            {vendors?.map((v: any, index: number) => (
              <label
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/60 border border-gray-700 hover:bg-gray-700/60 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedVendorEmails.includes(v.email)}
                  className="mt-1 h-4 w-4 accent-blue-500 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedVendorEmails((prev) => [...prev, v.email]);
                    } else {
                      setSelectedVendorEmails((prev) => prev.filter((email) => email !== v.email));
                    }
                  }}
                />

                <div className="flex flex-col leading-5">
                  <p className="text-white text-sm font-semibold">{v.name}</p>

                  <p className="text-gray-300 text-sm break-all">{v.email}</p>

                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 w-fit">
                    {v.category || 'NONE'}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={sendEmail}
            className="mt-5 cursor-pointer w-full bg-green-600 hover:bg-green-700 transition text-white py-2.5 rounded-xl disabled:bg-gray-600"
            disabled={!proposal?.rfpJson}
          >
            {TEXT.CREATE_RFP.SEND_PROPOSAL}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRFP;
