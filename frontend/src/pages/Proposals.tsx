import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ProposalCard from '../components/ProposalCard';
import { useElithStore } from '../stores/elithStore';
import { useEffect } from 'react';

export default function Proposals() {
  const navigate = useNavigate();
  const { proposals, setSessionStatus } = useElithStore();

  // Proposals are now loaded from the API results
  // No need to load mock data

  const handleImplement = (proposalId: string) => {
    console.log('Implementing proposal:', proposalId);
    setSessionStatus('running');
    navigate('/execution');
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Architecture Proposals</h1>
            <p className="text-text-secondary mb-8">
              Novel architecture options tailored to your codebase
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onImplement={() => handleImplement(proposal.id)}
                />
              ))}
            </div>

            {proposals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted">No proposals available yet.</p>
                <p className="text-text-muted text-sm mt-2">
                  Run the /architect operation to generate proposals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
