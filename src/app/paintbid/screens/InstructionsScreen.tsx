"use client";

/**
 * OpSuite Instructions & Help Documentation
 */
export function InstructionsScreen() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-navy2 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">OpSuite User Guide</h1>
        <p className="text-white/80 text-lg">
          Complete instructions for creating accurate painting bids with quality assurance and proposal finalization
        </p>
      </div>

      {/* Quick Start */}
      <Section
        icon="🚀"
        title="Quick Start Workflow"
        description="Follow these 5 steps for a complete bid-to-proposal workflow"
      >
        <StepCard
          number={1}
          title="Import Excel File"
          description="Upload your takeoff Excel file with project counts"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Navigate to the <strong>Import</strong> tab (⌘2)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Upload Your Takeoff Excel File&rdquo; and select your counts file (.xlsx or .xls)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Review the <strong>Import Report</strong> showing confidence (High/Medium/Low)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Optional:</strong> Upload a screenshot for OCR validation (cross-check Excel vs takeoff software)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Generate Bid Form&rdquo; to proceed</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={2}
          title="QA / Reconcile"
          description="Review and resolve unmapped items (if any)"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>QA / Reconcile</strong> tab (⌘3)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Review any <strong>unmapped items</strong> that could not be automatically matched</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>For each unmapped item, choose: <strong>Map</strong> (link to field), <strong>Ignore</strong> (skip), or <strong>Create Line</strong> (add to bid)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Acknowledge QA Review&rdquo; to unlock Proposal and Export tabs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Note:</strong> If no unmapped items exist, this step is skipped automatically</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={3}
          title="Adjust Bid Form"
          description="Set difficulty levels and pricing for each line item"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>Bid Form</strong> tab (⌘4)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Set <strong>Difficulty 1-5</strong> for every line (1=Very Easy, 5=Very Hard)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Toggle conditions: 🔒 Tight Access (+10%), 🔧 Heavy Prep (+15%), 🏠 Occupied (+7%)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Adjust quantities, unit prices, and included items (checkboxes)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Set global Contingency, Overhead, and Profit percentages</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={4}
          title="Finalize Proposal"
          description="Review, edit project info, and finalize for printing"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Navigate to the <strong>Proposal</strong> tab (⌘5)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Edit Mode:</strong> Update project details (Name, Location, Client, Contact)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Review scope sections, pricing breakdown, and exclusions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Finalize for Print&rdquo; to create a <strong>frozen snapshot</strong> (Final v1, v2, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Preview Mode:</strong> View finalized version and print or edit new version</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={5}
          title="Export & Backup"
          description="Download finalized proposals and full project data"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>Export</strong> tab (⌘6)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>View all finalized proposals with totals and creation dates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Download individual finalized proposals as JSON</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Export complete project data (bid form + all snapshots) for backup</span>
            </li>
          </ul>
        </StepCard>
      </Section>

      {/* Import Report & Confidence */}
      <Section
        icon="📊"
        title="Import Report & Confidence Scoring"
        description="Understanding the quality assessment of your Excel import"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <h4 className="font-bold text-brand-navy text-lg mb-4">Confidence Levels</h4>
          <div className="space-y-3 mb-6">
            <ConfidenceCard
              level="High"
              color="bg-green-50 border-green-300"
              icon="✅"
              criteria="All rows mapped, all required keys present"
              description="Perfect import - ready to proceed immediately"
            />
            <ConfidenceCard
              level="Medium"
              color="bg-yellow-50 border-yellow-300"
              icon="⚠️"
              criteria="≤5 unmapped rows OR missing 1 required key"
              description="Minor issues - review recommended but not critical"
            />
            <ConfidenceCard
              level="Low"
              color="bg-red-50 border-red-300"
              icon="❌"
              criteria=">5 unmapped rows OR missing 2+ required keys"
              description="Significant issues - QA review strongly recommended"
            />
          </div>

          <h4 className="font-bold text-brand-navy text-lg mb-3">Required Keys</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="font-semibold text-sm text-brand-navy mb-1">Core</div>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Units Count</li>
                <li>• Corridors Wall SF</li>
                <li>• Corridors Ceiling SF</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="font-semibold text-sm text-brand-navy mb-1">Exterior (1 required)</div>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Exterior Door Count</li>
                <li>• OR Parapet LF</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="font-semibold text-sm text-brand-navy mb-1">Stairs (1 required)</div>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Stairs 1 Levels</li>
                <li>• OR Stairs 2 Levels</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* QA Resolution Actions */}
      <Section
        icon="🔍"
        title="QA Resolution Actions"
        description="How to handle unmapped items in the QA tab"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <div className="space-y-3">
            <QAActionCard
              icon="📌"
              action="Map"
              description="Link this unmapped item to a suggested field (e.g., map 'Corridor Walls' to 'corridorsWallSF')"
              when="Use when you recognize the item and know where it belongs"
            />
            <QAActionCard
              icon="🚫"
              action="Ignore"
              description="Skip this item entirely - it will not create a bid line or affect totals"
              when="Use for notes, headers, or irrelevant data (e.g., 'Building Name', 'Notes:')"
            />
            <QAActionCard
              icon="➕"
              action="Create Line"
              description="Flag this item to manually add as a custom bid line later"
              when="Use for specialty items not in the standard template (e.g., 'Fire Escape', 'Balconies')"
            />
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong className="text-brand-navy">QA Gating:</strong> The Proposal and Export tabs are blocked until you acknowledge the QA review.
              This prevents accidentally printing a proposal with unreviewed data. Click &ldquo;Acknowledge QA Review&rdquo; to proceed.
            </p>
          </div>
        </div>
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

      {/* Proposal Finalization */}
      <Section
        icon="📄"
        title="Proposal Finalization Workflow"
        description="Understanding Edit Mode vs Preview Mode"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <h4 className="font-bold text-brand-navy text-lg mb-4">Two Modes</h4>
          <div className="space-y-4 mb-6">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <div className="font-bold text-brand-navy mb-2">📝 Edit Mode (Live Proposal)</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Proposal updates in real-time as you change bid form</li>
                <li>• Edit project details, exclusions, and settings</li>
                <li>• &ldquo;Print Draft&rdquo; available (requires QA acknowledged)</li>
                <li>• &ldquo;Finalize for Print&rdquo; creates a frozen snapshot</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <div className="font-bold text-brand-navy mb-2">👁️ Preview Mode (Frozen Snapshot)</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Viewing a finalized version (Final v1, v2, etc.)</li>
                <li>• Proposal is <strong>read-only</strong> - will not change if bid form changes</li>
                <li>• &ldquo;Print Finalized&rdquo; available (ready for client)</li>
                <li>• &ldquo;Edit New Version&rdquo; returns to Edit Mode to create v2, v3, etc.</li>
              </ul>
            </div>
          </div>

          <h4 className="font-bold text-brand-navy text-lg mb-3">Why Finalize?</h4>
          <p className="text-sm text-gray-700 mb-3">
            Finalization creates a <strong>frozen snapshot</strong> of your proposal with locked totals.
            This ensures the proposal you print matches exactly what you quoted, even if you later adjust the bid form.
          </p>
          <p className="text-sm text-gray-700">
            You can create multiple versions (v1, v2, v3) for different scenarios or clients without losing previous quotes.
          </p>
        </div>
      </Section>

      {/* OCR Validator */}
      <Section
        icon="📸"
        title="Optional: Screenshot OCR Validator"
        description="Cross-check Excel data against takeoff software screenshots"
      >
        <div className="bg-white border-2 border-brand-line rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Upload a screenshot of your takeoff software (e.g., PlanSwift, Bluebeam) to automatically cross-check values against your Excel import.
          </p>

          <h4 className="font-bold text-brand-navy text-lg mb-3">How It Works</h4>
          <ol className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-gold">1.</span>
              <span>After uploading Excel in Import tab, upload a screenshot (PNG, JPG)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-gold">2.</span>
              <span>Click &ldquo;Run OCR Validation&rdquo; (takes 10-30 seconds)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-gold">3.</span>
              <span>OCR extracts key/value pairs from the screenshot (e.g., &ldquo;Units: 120&rdquo;)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-gold">4.</span>
              <span>System compares screenshot values to Excel values and reports diffs</span>
            </li>
          </ol>

          <h4 className="font-bold text-brand-navy text-lg mb-3">Diff Types</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <span className="font-bold text-blue-700">📸 Screenshot Only</span>
              <span className="text-sm text-gray-700">Value found in screenshot but not in Excel</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <span className="font-bold text-yellow-700">📊 Excel Only</span>
              <span className="text-sm text-gray-700">Value found in Excel but not in screenshot</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded">
              <span className="font-bold text-red-700">⚠️ Mismatch</span>
              <span className="text-sm text-gray-700">Value differs between screenshot and Excel (shows % delta)</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong className="text-brand-navy">Note:</strong> This is an <strong>optional</strong> validation step.
              OCR is not 100% accurate, so review diffs carefully. Use this as an additional sanity check, not the single source of truth.
            </p>
          </div>
        </div>
      </Section>

      {/* Tips & Best Practices */}
      <Section
        icon="💡"
        title="Tips & Best Practices"
        description="Get the most out of OpSuite"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipCard
            title="Always Review QA Tab"
            description="Even with high confidence imports, check the QA tab to ensure no critical data was missed"
          />
          <TipCard
            title="Finalize Before Sending"
            description="Always finalize proposals before sending to clients - this locks totals and prevents accidental changes"
          />
          <TipCard
            title="Use OCR for Double-Checking"
            description="Upload a screenshot from your takeoff software to catch transcription errors between systems"
          />
          <TipCard
            title="Start with Difficulty 3"
            description="Set all items to Standard (3) first, then adjust up or down based on site conditions"
          />
          <TipCard
            title="Create Multiple Versions"
            description="Use finalized snapshots to quote different scenarios (e.g., with/without alternates)"
          />
          <TipCard
            title="Auto-Save Every 5 Seconds"
            description="OpSuite auto-saves to browser localStorage. Watch the 'Last saved' indicator in the header"
          />
          <TipCard
            title="Export for Backup"
            description="Regularly export your full project data (Export tab) to save outside the browser"
          />
          <TipCard
            title="Keyboard Shortcuts"
            description="Press ⌘/ (or Ctrl/) to see all keyboard shortcuts - much faster navigation!"
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
            issue="Import shows Low confidence"
            solution="Check the unmapped items list in the Import tab. Go to QA tab to resolve them. Ensure your Excel has sections like 'General', 'Corridors', 'Exterior', etc."
          />
          <TroubleshootCard
            issue="Proposal/Export tabs are blocked"
            solution="You must acknowledge the QA review first. Go to QA tab and click 'Acknowledge QA Review' (even if no unmapped items exist)."
          />
          <TroubleshootCard
            issue="OCR validation shows many diffs"
            solution="OCR is not perfect - review each diff carefully. Some may be OCR misreads (e.g., '5' read as 'S'). Use diffs as a sanity check, not gospel."
          />
          <TroubleshootCard
            issue="Finalize button disabled"
            solution="Ensure QA has been acknowledged. If unmapped items exist, you must resolve or acknowledge them first."
          />
          <TroubleshootCard
            issue="Proposal totals not updating"
            solution="If in Preview Mode (viewing a finalized snapshot), totals are frozen. Click 'Edit New Version' to return to Edit Mode with live updates."
          />
          <TroubleshootCard
            issue="Lost my work"
            solution="OpSuite saves to browser localStorage every 5 seconds. Refresh the page - data should reload automatically. Export regularly as backup!"
          />
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm border-t border-brand-line">
        <p>OpSuite - Local-only estimating tool for R.C. Wendt Painting, Inc</p>
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

function ConfidenceCard({
  level,
  color,
  icon,
  criteria,
  description,
}: {
  level: string;
  color: string;
  icon: string;
  criteria: string;
  description: string;
}) {
  return (
    <div className={`border-2 rounded-lg p-4 ${color}`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <div className="font-bold text-lg mb-1">{level} Confidence</div>
          <div className="text-sm font-semibold mb-1">{criteria}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}

function QAActionCard({
  icon,
  action,
  description,
  when,
}: {
  icon: string;
  action: string;
  description: string;
  when: string;
}) {
  return (
    <div className="border-l-4 border-brand-gold bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="font-bold text-brand-navy mb-1">{action}</div>
          <p className="text-sm text-gray-700 mb-2">{description}</p>
          <p className="text-xs text-gray-600">
            <strong>When to use:</strong> {when}
          </p>
        </div>
      </div>
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
