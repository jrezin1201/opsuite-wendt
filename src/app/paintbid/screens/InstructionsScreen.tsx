"use client";

/**
 * PaintBid Instructions & Help Documentation
 */
export function InstructionsScreen() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-navy2 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">PaintBid User Guide</h1>
        <p className="text-white/80 text-lg">
          Complete instructions for creating accurate painting bids with the streamlined workflow
        </p>
      </div>

      {/* Quick Start */}
      <Section
        icon="🚀"
        title="Quick Start"
        description="Get up and running in 3 easy steps"
      >
        <StepCard
          number={1}
          title="Import Counts"
          description="Upload your File 2 Excel with project counts (Units, SF, LF, etc.)"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Navigate to the <strong>Import</strong> tab</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Upload Excel file&rdquo; and select your File 2 (.xlsx or .xls)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Review the parsed counts (Units, Corridors SF, Stucco SF, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Generate Bid Form&rdquo; to create your bid</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={2}
          title="Adjust Pricing"
          description="Set difficulty levels and toggles for each line item"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>Bid Form</strong> tab</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Set <strong>Difficulty 1-5</strong> on every line (1=Easy, 5=Very Hard)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Toggle conditions: 🔒 Tight Access, 🔧 Heavy Prep, 🏠 Occupied</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Adjust quantities and unit prices as needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Set global Contingency, Overhead, and Profit percentages</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={3}
          title="Generate Proposal"
          description="Create a professional proposal and print/export"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Navigate to the <strong>Proposal</strong> tab</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Edit project information (Name, Location, Client, Contact)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Review scope sections, pricing breakdown, and alternates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Edit exclusions as needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Print / Save PDF&rdquo; to export</span>
            </li>
          </ul>
        </StepCard>
      </Section>

      {/* Difficulty System */}
      <Section
        icon="⚙️"
        title="Difficulty & Pricing System"
        description="How difficulty levels and toggles affect your bid"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <h4 className="font-bold text-brand-navy text-lg mb-4">Difficulty Multipliers (1-5)</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <DifficultyCard level={1} label="Very Easy" multiplier="0.90x" color="bg-green-100 border-green-300 text-green-800" />
            <DifficultyCard level={2} label="Easy" multiplier="1.00x" color="bg-blue-100 border-blue-300 text-blue-800" />
            <DifficultyCard level={3} label="Standard" multiplier="1.10x" color="bg-gray-100 border-gray-300 text-gray-800" />
            <DifficultyCard level={4} label="Hard" multiplier="1.25x" color="bg-orange-100 border-orange-300 text-orange-800" />
            <DifficultyCard level={5} label="Very Hard" multiplier="1.45x" color="bg-red-100 border-red-300 text-red-800" />
          </div>

          <h4 className="font-bold text-brand-navy text-lg mb-4">Condition Toggles</h4>
          <div className="space-y-3">
            <ToggleInfo icon="🔒" label="Tight Access" multiplier="+10%" description="Difficult access, narrow spaces, equipment limitations" />
            <ToggleInfo icon="🔧" label="Heavy Prep" multiplier="+15%" description="Extensive surface preparation, repairs, priming required" />
            <ToggleInfo icon="🏠" label="Occupied" multiplier="+7%" description="Building occupied during work, requires scheduling coordination" />
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong className="text-brand-navy">Example:</strong> A line with difficulty <strong>4 (Hard)</strong> = 1.25x base,
              plus 🔒 Tight Access (+0.10) and 🔧 Heavy Prep (+0.15) = <strong>1.25 × 1.25 = 1.56x final multiplier</strong>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Maximum combined multiplier is capped at <strong>1.80x</strong> to prevent over-adjustment.
            </p>
          </div>
        </div>
      </Section>

      {/* File Format Guide */}
      <Section
        icon="📁"
        title="File 2 Format Guide"
        description="Expected Excel format for importing project counts"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            PaintBid expects a <strong>grouped counts format</strong> with sections like:
          </p>
          <div className="space-y-4">
            <FileFormatExample
              section="General"
              fields={["Total SF", "Units Count", "Building Type"]}
            />
            <FileFormatExample
              section="Corridors"
              fields={["Cor. Wall SF", "Cor. Ceiling SF", "Cor. Door Count"]}
            />
            <FileFormatExample
              section="Exterior"
              fields={["Ext. Door Count", "Parapet LF", "Stucco SF"]}
            />
            <FileFormatExample
              section="Units"
              fields={["Units", "Avg Unit SF"]}
            />
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong className="text-brand-navy">Note:</strong> The parser detects section headers automatically
              and maps field names to standard quantities. Minor variations in naming (e.g., &ldquo;Corridor Wall SF&rdquo; vs &ldquo;Cor. Wall SF&rdquo;)
              are handled automatically.
            </p>
          </div>
        </div>
      </Section>

      {/* Proposal Generation */}
      <Section
        icon="📄"
        title="Proposal Generation"
        description="How the proposal is auto-generated from your bid form"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <h4 className="font-bold text-brand-navy text-lg mb-4">Single Source of Truth</h4>
          <p className="text-gray-700 mb-4">
            The proposal is <strong>automatically generated</strong> from your bid form. Any changes to quantities,
            difficulty levels, or included items instantly update the proposal totals.
          </p>

          <div className="space-y-3">
            <ProposalSection
              title="Scope of Work"
              description="Auto-generated from all included (checked) line items, grouped by section"
            />
            <ProposalSection
              title="Pricing Breakdown"
              description="Shows total for each section (Units, Corridors, Exterior, etc.)"
            />
            <ProposalSection
              title="Add Alternates"
              description="Lists all items marked as alternates that are included"
            />
            <ProposalSection
              title="Exclusions"
              description="Editable list of what's NOT included (scaffolding, permits, etc.)"
            />
            <ProposalSection
              title="Terms & Conditions"
              description="Standard payment terms, validity period, industry standards"
            />
          </div>
        </div>
      </Section>

      {/* Tips & Best Practices */}
      <Section
        icon="💡"
        title="Tips & Best Practices"
        description="Get the most out of PaintBid"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipCard
            title="Start with Difficulty 3"
            description="Set all items to Standard (3) first, then adjust up or down based on site conditions"
          />
          <TipCard
            title="Use Alternates Wisely"
            description="Mark optional items as alternates (Alt) so clients can add them without re-bidding"
          />
          <TipCard
            title="Review Totals Live"
            description="Watch the Proposal Total card update in real-time as you adjust difficulty and toggles"
          />
          <TipCard
            title="Save Often"
            description="PaintBid auto-saves to your browser every 5 seconds. Watch the 'Last saved' indicator in the header"
          />
          <TipCard
            title="Check Included Items"
            description="Use the checkbox column to exclude items you don't want in the final proposal"
          />
          <TipCard
            title="Adjust Global Settings"
            description="Set Contingency, Overhead, and Profit percentages at the top of the Bid Form"
          />
        </div>
      </Section>

      {/* Troubleshooting */}
      <Section
        icon="🔧"
        title="Troubleshooting"
        description="Common issues and solutions"
      >
        <div className="space-y-3">
          <TroubleshootCard
            issue="Excel file won't upload"
            solution="Ensure the file is .xlsx or .xls format. Check that the sheet contains sections like 'General', 'Corridors', 'Exterior', etc."
          />
          <TroubleshootCard
            issue="Counts showing as zero"
            solution="The parser looks for specific field names. Check that your Excel uses standard naming (e.g., 'Units', 'Cor. Wall SF', 'Ext. Door Count')"
          />
          <TroubleshootCard
            issue="Proposal not updating"
            solution="Make sure items are checked (included) in the Bid Form. Only included items appear in the proposal."
          />
          <TroubleshootCard
            issue="Totals seem wrong"
            solution="Check the Global Settings (Contingency, Overhead, Profit %). Also verify difficulty levels and toggles are set correctly."
          />
          <TroubleshootCard
            issue="Lost my work"
            solution="PaintBid saves to browser localStorage every 5 seconds. Refresh the page - your data should reload automatically."
          />
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm border-t border-brand-line">
        <p>PaintBid POC - Local-only estimating tool for R.C. Wendt Painting</p>
        <p className="mt-1">No data leaves your browser. All work is saved locally.</p>
      </div>
    </div>
  );
}

// Helper Components
function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-brand-line rounded-lg p-6 mb-4">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {number}
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-navy">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function DifficultyCard({
  level,
  label,
  multiplier,
  color,
}: {
  level: number;
  label: string;
  multiplier: string;
  color: string;
}) {
  return (
    <div className={`border-2 rounded-lg p-3 text-center ${color}`}>
      <div className="text-2xl font-bold mb-1">{level}</div>
      <div className="text-xs font-semibold mb-1">{label}</div>
      <div className="text-sm font-bold">{multiplier}</div>
    </div>
  );
}

function ToggleInfo({
  icon,
  label,
  multiplier,
  description,
}: {
  icon: string;
  label: string;
  multiplier: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-brand-navy">{label}</span>
          <span className="text-sm font-semibold text-orange-600">{multiplier}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function FileFormatExample({
  section,
  fields,
}: {
  section: string;
  fields: string[];
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="font-bold text-brand-navy mb-2">{section}</div>
      <ul className="space-y-1">
        {fields.map((field, idx) => (
          <li key={idx} className="text-sm text-gray-700 font-mono">
            • {field}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProposalSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 border-l-4 border-brand-gold bg-gray-50">
      <div className="flex-1">
        <div className="font-bold text-brand-navy mb-1">{title}</div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white border-2 border-brand-gold/30 rounded-lg p-4">
      <h4 className="font-bold text-brand-navy mb-2">{title}</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}

function TroubleshootCard({
  issue,
  solution,
}: {
  issue: string;
  solution: string;
}) {
  return (
    <div className="bg-white border border-red-200 rounded-lg p-4">
      <div className="font-bold text-red-700 mb-2">❌ {issue}</div>
      <p className="text-sm text-gray-700">
        <strong className="text-green-700">✓ Solution:</strong> {solution}
      </p>
    </div>
  );
}
