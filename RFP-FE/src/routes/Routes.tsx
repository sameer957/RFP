import { lazy } from 'react';
import { PATHS } from '../utils/Paths';

const Navbar = lazy(() => import('../components/common/Navbar'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Vendors = lazy(() => import('../pages/Vendors'));
const CreateRFP = lazy(() => import('../pages/CreateRFP'));
const Proposals = lazy(() => import('../pages/Proposals'));
const ProposalDetail = lazy(() => import('../pages/ProposalDetail'));

export const routes = [
  {
    element: <Navbar />,
    children: [
      {
        path: PATHS.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: PATHS.VENDORS,
        element: <Vendors />,
      },
      {
        path: PATHS.CREATE_RFP,
        element: <CreateRFP />,
      },
      {
        path: PATHS.PROPOSALS,
        element: <Proposals />,
      },
      {
        path: PATHS.PROPOSAL_DETAIL,
        element: <ProposalDetail />,
      },
    ],
  },
];
