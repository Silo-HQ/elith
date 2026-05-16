import { ArchProposal } from '../stores/elithStore';

interface ProposalCardProps {
  proposal: ArchProposal;
  onImplement: () => void;
}

export default function ProposalCard({ proposal, onImplement }: ProposalCardProps) {
  return (
    <div
      className={`bg-bg-secondary border rounded-lg p-6 transition-all ${
        proposal.recommended
          ? 'border-accent shadow-lg shadow-accent/20'
          : 'border-border hover:border-border-light'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-text-primary">{proposal.name}</h3>
        {proposal.recommended && (
          <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
            RECOMMENDED
          </span>
        )}
      </div>

      {/* Why Not Standard */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Why not standard:</h4>
        <p className="text-sm text-text-primary font-mono bg-bg-tertiary p-3 rounded">
          {proposal.why_not_standard}
        </p>
      </div>

      {/* Proposal */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Proposal:</h4>
        <p className="text-sm text-text-primary">{proposal.proposal}</p>
      </div>

      {/* Tradeoffs */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Tradeoffs:</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Pros */}
          <div className="space-y-1">
            {proposal.tradeoffs.pros.map((pro, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-success mt-0.5">✓</span>
                <span className="text-text-primary">{pro}</span>
              </div>
            ))}
          </div>
          {/* Cons */}
          <div className="space-y-1">
            {proposal.tradeoffs.cons.map((con, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-error mt-0.5">✗</span>
                <span className="text-text-primary">{con}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Migration Steps */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Migration:</h4>
        <div className="space-y-1">
          {proposal.migration_steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-text-primary">
              <span className="text-accent font-mono">{index + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        {!proposal.migration_downtime && (
          <div className="mt-2 text-xs text-success">✓ Zero downtime migration</div>
        )}
      </div>

      {/* Implement Button */}
      <button
        onClick={onImplement}
        className="w-full bg-accent hover:bg-accent-dim text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Implement This
      </button>
    </div>
  );
}

// Made with Bob
