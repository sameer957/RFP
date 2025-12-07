import React, { useEffect, useState } from 'react';
import { PostMethod } from '../../api/APIMethods/Post';
import { GetMethod } from '../../api/APIMethods/Get';
import API_ENDPOINTS from '../../api/Endpoints/AllEndpoints';
import toast from 'react-hot-toast';
import { TEXT } from '../../utils/TextConstants';

const SelectTemplate = ({
  selectedTemplate,
  setSelectedTemplate,
  isModalOpen,
  setIsModalOpen,
}: any) => {
  const [templates, setTemplates] = useState([]);

  if (!isModalOpen) return null;

  const handleSelectTemplate = async (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(false);

    const payload = {
      templateId: template.id,
    };

    const res = await PostMethod(API_ENDPOINTS.TEMPLATES.SAVE_TEMPLATE, payload);

    if (res.success) {
      toast.success(res.message);
    }
  };

  const fetchAllTemplates = async () => {
    const res = await GetMethod(API_ENDPOINTS.TEMPLATES.GET_TEMPLATES);
    setTemplates(res.data);
  };

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-3xl p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
          <h3 className="text-2xl font-bold text-white">{TEXT.SELECT_TEMPLATE.SELECT_TEMPLATE}</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 cursor-pointer hover:text-white transition duration-200 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((template: any) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-4 rounded-xl cursor-pointer transition duration-300 ${
                selectedTemplate?.id === template.id
                  ? 'bg-blue-600 border-2 border-blue-400 shadow-blue-500/50 scale-[1.02]'
                  : 'bg-gray-700 hover:bg-gray-600 border border-gray-700'
              }`}
            >
              <h4
                className={`text-lg font-semibold ${
                  selectedTemplate?.id === template.id ? 'text-white' : 'text-gray-100'
                }`}
              >
                {template.title}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  selectedTemplate?.id === template.id ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {template.description}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(false)}
          className="cursor-pointer mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition"
        >
          {TEXT.COMMON.CLOSE}
        </button>
      </div>
    </div>
  );
};

export default SelectTemplate;
