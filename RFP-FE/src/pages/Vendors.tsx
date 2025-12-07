import { useEffect, useState, useCallback } from 'react';
import { VendorSchema } from '../utils/validations/VendorSchema';
import toast from 'react-hot-toast';
import { GetMethod } from '../api/APIMethods/Get';
import { PostMethod } from '../api/APIMethods/Post';
import API_ENDPOINTS from '../api/Endpoints/AllEndpoints';
import debounce from 'lodash.debounce';
import { DeleteMethod } from '../api/APIMethods/Delete';
import { TEXT } from '../utils/TextConstants';

interface Vendor {
  id: number;
  name: string;
  email: string;
  category: string;
}

function Vendors() {
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteVendor = async (id: number) => {
    try {
      const res = await DeleteMethod(API_ENDPOINTS.VENDOR.DELETE(id));

      if (res.success) {
        toast.success(res.message);

        fetchVendors();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete vendor');
    }
  };

  const fetchVendors = async (search: string = '') => {
    try {
      const res = await GetMethod(API_ENDPOINTS.VENDOR.FETCH(search));
      setVendors(res.vendors);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch vendors');
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchVendors(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSaveVendor = async () => {
    try {
      VendorSchema.parse({ name, email, category });

      const payload = {
        name,
        email: email.toLowerCase(),
        category,
      };

      const res = await PostMethod(API_ENDPOINTS.VENDOR.CREATE, payload);

      if (res.success) {
        toast.success(res.message);
        setVendors([...vendors, res.vendor]);
        setShowModal(false);
        setName('');
        setEmail('');
        setCategory('');
      } else {
        toast.error(res?.data?.message || 'Failed to create vendor');
      }
    } catch (err: any) {
      if (err?.issues) {
        toast.error(err.issues[0].message);
      } else {
        toast.error(err?.response?.data?.message || 'Failed to create vendor');
      }
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="w-full h-screen p-6 bg-gray-950 text-gray-100 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">{TEXT.VENDORS.HEADING}</h1>
          <p className="text-gray-400 mt-1">{TEXT.VENDORS.SUB_HEADING}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
        >
          {TEXT.VENDORS.ADD_VENDOR}
        </button>
      </div>

      <input
        type="text"
        placeholder={TEXT.VENDORS.SEARCH}
        className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <h2 className="text-xl font-medium text-gray-100">{v.name}</h2>
            <p className="text-gray-400 mt-1">{v.email}</p>
            <span className="mt-3 inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
              {v.category || 'None'}
            </span>
            <div className="mt-5 flex items-end justify-end">
              <button
                className="cursor-pointer w-fit p-2 bg-red-900 hover:bg-red-700 transition rounded-xl text-sm"
                onClick={() => handleDeleteVendor(v.id)}
              >
                {TEXT.COMMON.REMOVE}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">{TEXT.VENDORS.ADD_NEW_VENDOR}</h2>

            <input
              type="text"
              placeholder={TEXT.VENDORS.NAME_PLACEHOLDER}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 mb-4 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder={TEXT.VENDORS.EMAIL_PLACEHOLDER}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 mb-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder={TEXT.VENDORS.CATEGORY_PLACEHOLDER}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 mb-4 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-4 py-2 bg-gray-700 rounded-xl"
              >
                {TEXT.COMMON.CANCEL}
              </button>

              <button
                onClick={handleSaveVendor}
                className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                {TEXT.VENDORS.SAVE}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;
