"use client";

/**
 * OpSuite Instructions & Help Documentation
 * Comprehensive guide for the complete bid-to-proposal workflow
 */
export function InstructionsScreen() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-navy2 rounded-xl p-8 text-white shadow-lg border-2 border-brand-gold">
        <h1 className="text-4xl font-bold mb-3">📖 OpSuite User Guide</h1>
        <p className="text-white/90 text-lg mb-4">
          Complete instructions for creating accurate painting bids with quality assurance and proposal finalization
        </p>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="text-sm text-white/80">
            <strong className="text-brand-gold">💡 Quick Tip:</strong> Use keyboard shortcuts Cmd+1 through Cmd+7 (or Ctrl on Windows) to quickly navigate between tabs
          </p>
        </div>
      </div>

      {/* Quick Start Workflow */}
      <Section
        icon="🚀"
        title="Quick Start Workflow"
        description="Follow these steps for a complete bid-to-proposal workflow"
      >
        <StepCard
          number={1}
          title="Import Excel File"
          description="Upload your takeoff Excel file with project counts"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Navigate to the <strong>Import</strong> tab (Cmd+2)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Upload Your Takeoff Excel File&rdquo; and select your counts file (.xlsx or .xls)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The system automatically parses your Excel and shows an <strong>Import Report</strong> with confidence level (High/Medium/Low)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Optional:</strong> Upload a screenshot for OCR validation to cross-check Excel vs takeoff software</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Review mapped and unmapped items in the summary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Generate Bid Form&rdquo; then &ldquo;💰 Go to Bid Form →&rdquo; to proceed</span>
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
              <span>Go to the <strong>QA / Reconcile</strong> tab (Cmd+3)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The tab shows status badge: &ldquo;✅ No Issues&rdquo;, &ldquo;⚠️ Review Required&rdquo; (pulsing), or &ldquo;✓ Acknowledged&rdquo;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The heading shows &ldquo;Unmapped Items (X of Y)&rdquo; where X is unresolved count</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>For each unmapped item, you have 3 options:</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-green-600 font-bold">→</span>
              <span><strong>Map to Existing:</strong> Link the item to an existing bid form line (shows fuzzy match suggestions)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-gray-600 font-bold">→</span>
              <span><strong>Ignore:</strong> Mark as &ldquo;not needed&rdquo; (useful for non-painting items like &ldquo;Plumbing Fixtures&rdquo;)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-blue-600 font-bold">→</span>
              <span><strong>Create New Line:</strong> Add a new line item to the bid form (coming soon)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The <strong>Import Summary (Live)</strong> box updates in real-time as you resolve items</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;Undo&rdquo; if you make a mistake</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Click &ldquo;✅ Acknowledge & Proceed&rdquo; to unlock Proposal and Export tabs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Note:</strong> If no unmapped items exist (perfect import), this step shows &ldquo;All Clear!&rdquo;</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={3}
          title="Adjust Bid Form"
          description="Set difficulty levels, toggles, and pricing for each line item"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>Bid Form</strong> tab (Cmd+4)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Refresh Animation:</strong> When you navigate here after importing new data, you&apos;ll see &ldquo;🔄 Bid Form Updated!&rdquo; banner</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The header shows &ldquo;X line items&rdquo; badge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Global Settings:</strong> Set Contingency %, Overhead %, and Profit % at the top</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>For each line item:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-green-600 font-bold">✓</span>
              <span>Check/uncheck the ✓ box to include/exclude from proposal</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-blue-600 font-bold">#</span>
              <span>Adjust <strong>Qty</strong> (quantity) if needed</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-purple-600 font-bold">$</span>
              <span>Adjust <strong>$/Unit</strong> (base unit price) if needed</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-orange-600 font-bold">1-5</span>
              <span><strong>Difficulty:</strong> Click 1-5 buttons (1=Very Easy, 5=Very Hard). Selected shows in gold.</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-red-600 font-bold">🔧</span>
              <span><strong>Toggles:</strong> 🔒 Tight Access (+10%), 🔧 Heavy Prep (+15%), 🏠 Occupied (+7%). Active shows in orange.</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-gray-600 font-bold">×</span>
              <span>Watch the <strong>Mult</strong> (multiplier) column update automatically (e.g., 1.59x with difficulty 5 + tight access)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-brand-gold font-bold">💰</span>
              <span>The <strong>Total</strong> column shows final line price</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Section Totals:</strong> Each section header shows the total for that section</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Summary Cards:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-gray-600">→</span>
              <span><strong>All Items</strong> (white card): Shows all items including excluded ones</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-brand-navy">→</span>
              <span><strong>Proposal Total</strong> (navy card with gold text): Shows only included items - this is what goes on the proposal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Both cards show: Base Subtotal, Contingency, Overhead, Profit, and Total</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Auto-save:</strong> All changes save automatically every 5 seconds to localStorage</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={4}
          title="Generate Proposal"
          description="Finalize your proposal and prepare for printing"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>Proposal</strong> tab (Cmd+5)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The tab shows &ldquo;X finalized versions&rdquo; badge if you have snapshots</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Two Modes:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-blue-600 font-bold">✏️</span>
              <span><strong>Edit Mode:</strong> Shows live draft with editable project info fields (Project Name, Location, Developer/Client, Contact)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span className="text-green-600 font-bold">📋</span>
              <span><strong>Preview Mode:</strong> Shows frozen snapshot (read-only)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>In Edit Mode:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Edit project information at the top</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Edit exclusions list at the bottom</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Click &ldquo;✅ Finalize for Print&rdquo; to create a frozen snapshot</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Or click &ldquo;🖨️ Print Draft&rdquo; to print without finalizing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>In Preview Mode:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>View the frozen snapshot (cannot edit)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Click &ldquo;🖨️ Print Finalized&rdquo; to print</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Click &ldquo;✏️ Edit New Version&rdquo; to return to edit mode and create a new version</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Multiple Versions:</strong> If you have multiple finalized versions, a dropdown appears to switch between them</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Proposal Contents:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Company header with logo (R.C. Wendt Painting, Inc)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Project Information (name, location, client, contact)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Scope of Work (organized by sections with gold left borders)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Pricing breakdown by section</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Total Contract Price (large, bold)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Add Alternates (if any alternate items exist)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Exclusions list</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Terms & Conditions</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Signature blocks (Contractor and Client)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Print Filename:</strong> Automatically named &ldquo;{'{ProjectName}'}-RCWendtPaintingInc.pdf&rdquo; (spaces replaced with underscores)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>QA Gating:</strong> If QA has unmapped items and hasn&apos;t been acknowledged, you&apos;ll see a red warning blocking finalization/printing</span>
            </li>
          </ul>
        </StepCard>

        <StepCard
          number={5}
          title="Export & Backup"
          description="Download snapshots, backups, and manage data"
        >
          <ul className="space-y-2 text-sm text-gray-700 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>Go to the <strong>Export</strong> tab (Cmd+6)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span>The tab shows &ldquo;X snapshots ready&rdquo; badge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Current Bid Summary:</strong> Shows project name, location, total items, and included items</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Finalized Proposals:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Lists all finalized proposal snapshots</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Each shows: version name, total price, creation timestamp</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Click &ldquo;📥 Download&rdquo; to save as JSON</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>→</span>
              <span>Click &ldquo;🗑️ Delete&rdquo; to remove (with confirmation)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Export Options:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>💾</span>
              <span><strong>Download Bid as JSON:</strong> Exports complete current bid data (recommended for weekly backups)</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>🖨️</span>
              <span><strong>Print Proposal:</strong> Instructions to go to Proposal tab</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>📊</span>
              <span><strong>Export to Excel/CSV:</strong> Coming soon</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Import Options:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>📁</span>
              <span><strong>Import Bid from JSON:</strong> Restore a previously saved bid (replaces current bid)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Data Management:</strong></span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>💡</span>
              <span><strong>Automatic Saving:</strong> App auto-saves every 5 seconds to browser localStorage</span>
            </li>
            <li className="flex items-start gap-2 ml-6">
              <span>🗑️</span>
              <span><strong>Clear All Data:</strong> Removes all bid data, settings, and cached info (requires double confirmation, then reloads page)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold font-bold">•</span>
              <span><strong>Tips Section:</strong> Best practices for backups, PDFs, sharing, and version control</span>
            </li>
          </ul>
        </StepCard>
      </Section>

      {/* UI Features */}
      <Section
        icon="🎨"
        title="User Interface Features"
        description="Navigate and interact with OpSuite efficiently"
      >
        <FeatureCard
          icon="🎯"
          title="Global Header"
          description="Sticky header at the top shows:"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• <strong>Project Name:</strong> Current project or &ldquo;Untitled Project&rdquo;</li>
            <li>• <strong>Excel File:</strong> Name of uploaded takeoff file with 📄 icon</li>
            <li>• <strong>Shortcuts Button:</strong> Click ⌨️ or press Cmd+/ to view all keyboard shortcuts</li>
            <li>• <strong>Saved Timestamp:</strong> Shows last auto-save time</li>
          </ul>
        </FeatureCard>

        <FeatureCard
          icon="📍"
          title="Local Tab Headers"
          description="Each tab has its own header showing:"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• <strong>Tab Icon & Name:</strong> Large icon + tab name</li>
            <li>• <strong>Description:</strong> Brief description of tab purpose</li>
            <li>• <strong>Dynamic Status Badges:</strong></li>
            <li className="ml-6">→ Import: High/Medium/Low confidence badge</li>
            <li className="ml-6">→ QA: No Issues / Review Required (pulsing) / Acknowledged + unresolved count</li>
            <li className="ml-6">→ Bid Form: &ldquo;X line items&rdquo;</li>
            <li className="ml-6">→ Proposal: &ldquo;X finalized versions&rdquo;</li>
            <li className="ml-6">→ Export: &ldquo;X snapshots ready&rdquo;</li>
          </ul>
        </FeatureCard>

        <FeatureCard
          icon="⌨️"
          title="Keyboard Shortcuts"
          description="Navigate faster with keyboard shortcuts (Mac/Windows):"
        >
          <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
            <div>
              <div className="font-bold text-brand-navy">Navigation</div>
              <ul className="space-y-1 text-gray-700 mt-1">
                <li>• Cmd+1 → Instructions</li>
                <li>• Cmd+2 → Import</li>
                <li>• Cmd+3 → QA / Reconcile</li>
                <li>• Cmd+4 → Bid Form</li>
                <li>• Cmd+5 → Proposal</li>
                <li>• Cmd+6 → Export</li>
                <li>• Cmd+7 → Legacy Workflow</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-brand-navy">Other</div>
              <ul className="space-y-1 text-gray-700 mt-1">
                <li>• Cmd+/ → Show/hide shortcuts</li>
                <li>• Cmd+P → Print (on Proposal tab)</li>
                <li>• Esc → Close modal/dialog</li>
              </ul>
              <div className="text-xs text-gray-500 mt-2 italic">
                * Use Ctrl instead of Cmd on Windows
              </div>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          icon="🔄"
          title="Refresh Animations"
          description="Visual feedback when data updates:"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• <strong>Bid Form:</strong> When navigating to Bid Form after importing new Excel data, you&apos;ll see an animated banner: &ldquo;🔄 Bid Form Updated! Data refreshed from Excel import&rdquo;</li>
            <li>• Banner slides down, shows for 1 second, then fades out</li>
            <li>• Spinning refresh icon provides clear visual feedback</li>
          </ul>
        </FeatureCard>

        <FeatureCard
          icon="💾"
          title="Auto-Save & Persistence"
          description="Your work is automatically saved:"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• <strong>Auto-save:</strong> Every 5 seconds to browser localStorage</li>
            <li>• <strong>Persistence:</strong> Data survives page refresh and browser restart</li>
            <li>• <strong>Local Only:</strong> All data stays on your device - no cloud, no servers</li>
            <li>• <strong>Last Saved:</strong> Timestamp shown in global header</li>
            <li>• <strong>Backup:</strong> Export JSON regularly to prevent data loss (Export tab)</li>
          </ul>
        </FeatureCard>
      </Section>

      {/* Advanced Features */}
      <Section
        icon="⚙️"
        title="Advanced Features"
        description="Power user features and customization options"
      >
        <FeatureCard
          icon="📸"
          title="OCR Screenshot Validator (Optional)"
          description="Cross-check Excel data against takeoff software screenshots"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• Available on Import tab after uploading Excel</li>
            <li>• Upload a screenshot from PlanSwift, Bluebeam, or similar software</li>
            <li>• Uses OCR (Optical Character Recognition) to extract text from image</li>
            <li>• Compares screenshot counts vs Excel counts</li>
            <li>• Shows discrepancies to catch data entry errors</li>
            <li>• Completely optional - skip if not needed</li>
          </ul>
        </FeatureCard>

        <FeatureCard
          icon="🧮"
          title="Difficulty & Pricing System"
          description="How the multiplier system works:"
        >
          <div className="space-y-2 text-sm text-gray-700 mt-2">
            <div>
              <strong>Base Formula:</strong>
              <code className="block bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                Total = Qty × $/Unit × Difficulty Multiplier × Condition Toggles
              </code>
            </div>
            <div>
              <strong>Difficulty Multipliers:</strong>
              <ul className="ml-4 mt-1">
                <li>• 1 (Very Easy): 0.80x</li>
                <li>• 2 (Easy): 0.90x</li>
                <li>• 3 (Standard): 1.00x (default)</li>
                <li>• 4 (Hard): 1.20x</li>
                <li>• 5 (Very Hard): 1.40x</li>
              </ul>
            </div>
            <div>
              <strong>Condition Toggles (additive):</strong>
              <ul className="ml-4 mt-1">
                <li>• 🔒 Tight Access: +10%</li>
                <li>• 🔧 Heavy Prep: +15%</li>
                <li>• 🏠 Occupied: +7%</li>
              </ul>
            </div>
            <div>
              <strong>Example:</strong>
              <ul className="ml-4 mt-1">
                <li>Difficulty 5 (1.40x) + Tight Access (+10%) + Heavy Prep (+15%) = 1.65x multiplier</li>
              </ul>
            </div>
            <div>
              <strong>Then Global Settings Applied:</strong>
              <ul className="ml-4 mt-1">
                <li>• Base Subtotal (sum of all included line totals)</li>
                <li>• + Contingency % (e.g., 10%)</li>
                <li>• + Overhead % (e.g., 15%)</li>
                <li>• + Profit % (e.g., 20%)</li>
                <li>• = Final Total</li>
              </ul>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          icon="🎯"
          title="QA Gating System"
          description="Prevents accidental proposals with unmapped data"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• If import has unmapped items, QA tab shows &ldquo;⚠️ Review Required&rdquo; (pulsing)</li>
            <li>• Proposal and Export tabs are blocked until you acknowledge QA</li>
            <li>• You don&apos;t have to resolve all items - just acknowledge you&apos;ve reviewed them</li>
            <li>• Click &ldquo;✅ Acknowledge & Proceed&rdquo; to unlock</li>
            <li>• If you have unresolved items after acknowledging, you&apos;ll see a yellow warning but can still proceed</li>
            <li>• Prevents sending proposals with missing data</li>
          </ul>
        </FeatureCard>

        <FeatureCard
          icon="📦"
          title="Proposal Snapshots (Version Control)"
          description="Create frozen versions of proposals"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• <strong>Why:</strong> Preserve exact state at time of finalization (audit trail)</li>
            <li>• <strong>How:</strong> Click &ldquo;✅ Finalize for Print&rdquo; on Proposal tab</li>
            <li>• <strong>What&apos;s Saved:</strong> Complete proposal data + totals + timestamp</li>
            <li>• <strong>Naming:</strong> Auto-named &ldquo;Final v1&rdquo;, &ldquo;Final v2&rdquo;, etc.</li>
            <li>• <strong>Switching:</strong> Dropdown appears when you have multiple versions</li>
            <li>• <strong>Exporting:</strong> Download individual snapshots as JSON from Export tab</li>
            <li>• <strong>Deleting:</strong> Remove unwanted versions from Export tab</li>
            <li>• <strong>Use Case:</strong> Create v1 for client, client requests changes, create v2 to compare</li>
          </ul>
        </FeatureCard>

        <FeatureCard
          icon="🔍"
          title="Import Confidence Scoring"
          description="How the system evaluates import quality"
        >
          <ul className="space-y-1 text-sm text-gray-700 mt-2">
            <li>• <strong>High Confidence (✅ Green):</strong> 90%+ of rows mapped successfully</li>
            <li>• <strong>Medium Confidence (⚠️ Yellow):</strong> 70-89% mapped</li>
            <li>• <strong>Low Confidence (❌ Red):</strong> Below 70% mapped</li>
            <li>• Calculation: (Mapped Rows + Ignored Rows) / Total Parsed Rows</li>
            <li>• Low confidence suggests Excel format issues or unexpected data</li>
            <li>• You can still proceed with low confidence, but review QA carefully</li>
          </ul>
        </FeatureCard>
      </Section>

      {/* Tips & Best Practices */}
      <Section
        icon="💡"
        title="Tips & Best Practices"
        description="Get the most out of OpSuite"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipCard
            icon="📊"
            title="Excel File Format"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Organize data by sections (Units, Corridors, Exterior, etc.)</li>
              <li>• Use consistent key names (e.g., &ldquo;Wall SF&rdquo; not &ldquo;Walls&rdquo;)</li>
              <li>• Put numeric values in adjacent cells to keys</li>
              <li>• Avoid merged cells and complex formatting</li>
              <li>• First sheet or sheet named &ldquo;1 Bldg&rdquo; auto-selected</li>
            </ul>
          </TipCard>

          <TipCard
            icon="🎯"
            title="Efficient Workflow"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Use keyboard shortcuts (Cmd+1-7) for fast navigation</li>
              <li>• Set difficulty 3 (Standard) as baseline, adjust from there</li>
              <li>• Only toggle conditions when truly needed (don&apos;t over-inflate)</li>
              <li>• Use the ✓ checkbox to exclude items rather than deleting them</li>
              <li>• Create multiple proposal versions before picking final</li>
            </ul>
          </TipCard>

          <TipCard
            icon="💾"
            title="Data Safety"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Export JSON backup weekly (or after major changes)</li>
              <li>• Before clicking &ldquo;Clear All Data&rdquo;, export first!</li>
              <li>• Name JSON exports with dates (e.g., Mexico_Villas-2026-01-20.json)</li>
              <li>• Keep project JSON files in a safe location (cloud storage, email, etc.)</li>
              <li>• Remember: Data only exists in your browser - no cloud backup</li>
            </ul>
          </TipCard>

          <TipCard
            icon="🖨️"
            title="Printing Proposals"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Always finalize before printing to clients (creates audit trail)</li>
              <li>• Print drafts for internal review only</li>
              <li>• Filename auto-includes project name (easy to organize PDFs)</li>
              <li>• Use &ldquo;Save as PDF&rdquo; in print dialog for digital delivery</li>
              <li>• Proposal includes signature blocks for contractor and client</li>
            </ul>
          </TipCard>

          <TipCard
            icon="🔄"
            title="Multiple Projects"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Only one project at a time in browser</li>
              <li>• To switch: Export current project, Clear All Data, Import new project</li>
              <li>• Or use different browsers for different projects (Chrome vs Safari)</li>
              <li>• Or use browser profiles (Chrome: Profile 1 for Project A, Profile 2 for Project B)</li>
              <li>• Consider opening second browser window in Incognito/Private mode</li>
            </ul>
          </TipCard>

          <TipCard
            icon="👥"
            title="Collaboration"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Share JSON files via email or cloud storage</li>
              <li>• Team member imports JSON to their browser</li>
              <li>• Each person works independently, then shares updated JSON</li>
              <li>• For simultaneous work: Assign sections (Person A does pricing, Person B does QA)</li>
              <li>• No conflicts - each browser is independent</li>
            </ul>
          </TipCard>
        </div>
      </Section>

      {/* Troubleshooting */}
      <Section
        icon="🔧"
        title="Troubleshooting"
        description="Common issues and solutions"
      >
        <div className="space-y-4">
          <TroubleshootCard
            problem="Import shows Low Confidence"
            solutions={[
              "Check Excel format - should have clear sections with key/value pairs",
              "Look at 'Unmapped Items' list to see what failed to parse",
              "Common issue: Unexpected sheet name (select correct sheet in dropdown)",
              "Common issue: Excel has comments, formulas, or merged cells",
              "Try simplifying Excel - remove extra formatting, use plain text",
            ]}
          />

          <TroubleshootCard
            problem="QA tab won't let me proceed"
            solutions={[
              "Click '✅ Acknowledge & Proceed' button (even if items unresolved)",
              "You don't have to resolve all items - just acknowledge review",
              "If button is disabled, check that import completed successfully",
              "Refresh page if button appears stuck",
            ]}
          />

          <TroubleshootCard
            problem="Totals seem incorrect"
            solutions={[
              "Check Global Settings (Contingency, Overhead, Profit %) are set correctly",
              "Verify difficulty levels are appropriate (3 is standard, not 1)",
              "Check which items are included (✓ checkbox) vs excluded",
              "Remember: 'All Items' card shows everything, 'Proposal Total' shows only included",
              "Toggles stack (difficulty 5 + tight access + heavy prep = very high multiplier)",
            ]}
          />

          <TroubleshootCard
            problem="Lost my data / Page is blank"
            solutions={[
              "Check if you accidentally cleared data (Export → Clear All Data)",
              "Try importing your most recent JSON backup",
              "Check browser localStorage quota (may be full - clear other sites' data)",
              "If using Private/Incognito mode, data is lost when window closes",
              "Ensure you're using the same browser (data doesn't sync across browsers)",
            ]}
          />

          <TroubleshootCard
            problem="Print filename is wrong"
            solutions={[
              "Filename comes from Project Name field (Proposal tab → Edit project info)",
              "Format is: {'{ProjectName}'}-RCWendtPaintingInc.pdf",
              "Spaces automatically convert to underscores",
              "If project name is empty, defaults to 'Proposal-RCWendtPaintingInc.pdf'",
              "You can rename PDF after downloading",
            ]}
          />

          <TroubleshootCard
            problem="Refresh animation won't stop"
            solutions={[
              "Animation auto-dismisses after 1 second - should be quick",
              "If stuck, refresh browser page (data is saved automatically)",
              "This is purely visual - doesn't affect functionality",
            ]}
          />

          <TroubleshootCard
            problem="Can't delete finalized proposal"
            solutions={[
              "Go to Export tab (not Proposal tab)",
              "Find the version in 'Finalized Proposals' list",
              "Click red '🗑️ Delete' button",
              "Confirm twice in the popup dialogs",
              "Deletion is permanent - export first if you want to keep a copy",
            ]}
          />

          <TroubleshootCard
            problem="Clear All Data button doesn't work"
            solutions={[
              "There are two confirmation dialogs - make sure to confirm both",
              "After confirming, page automatically reloads (this is expected)",
              "If page doesn't reload, manually refresh (Cmd+R or F5)",
              "Check browser console for errors (F12 → Console tab)",
            ]}
          />
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm border-t border-brand-line">
        <p>OpSuite - Local-only estimating tool for R.C. Wendt Painting, Inc</p>
        <p className="mt-1">No data leaves your browser. All work is saved locally.</p>
        <p className="mt-3 text-xs">Version 2.0 • Last Updated: January 2026</p>
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
    <div className="bg-white rounded-xl border-2 border-brand-line shadow-sm p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="text-5xl">{icon}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-brand-navy">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
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
    <div className="border-2 border-brand-gold rounded-lg p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-gold text-brand-navy font-bold text-xl flex items-center justify-center shadow-md">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-brand-navy">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FeatureCard({
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
    <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-brand-gold hover:shadow-md transition-all bg-white">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-brand-navy text-base">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function TipCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold text-blue-900">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function TroubleshootCard({
  problem,
  solutions,
}: {
  problem: string;
  solutions: string[];
}) {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h4 className="font-bold text-yellow-900 text-base mb-2">
            Problem: {problem}
          </h4>
          <div className="text-sm text-yellow-800">
            <strong>Solutions:</strong>
            <ul className="mt-2 space-y-1 ml-4">
              {solutions.map((solution, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-gold font-bold">→</span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
