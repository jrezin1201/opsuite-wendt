# OpSuite Full Application Test Prompt

Use this prompt with Claude in the browser (with computer use/screenshot capabilities) to perform a comprehensive test of the OpSuite application.

---

## Test Prompt for Claude

I need you to perform a comprehensive test of the OpSuite application running at `localhost:3000`. This is a painting bid generation tool for R.C. Wendt Painting. Please test all features systematically and report any issues.

### Application Overview
OpSuite is a local-only estimating tool with 7 main tabs:
1. **Instructions** - Help documentation
2. **Import** - Upload File 2 Excel and generate import report
3. **QA / Reconcile** - Review and resolve unmapped items
4. **Bid Form** - Set difficulty levels and pricing
5. **Proposal** - Generate and finalize proposals
6. **Export** - Download snapshots and backups
7. **Legacy Workflow** - Original POC screens

### Test Plan

#### Phase 1: Initial Load & Navigation
1. Visit `localhost:3000`
2. Verify the app loads with:
   - Dark navy global header showing "Untitled Project"
   - Local tab header showing "Instructions" with 📖 icon
   - Sidebar navigation on the left with OpSuite branding
3. Test keyboard shortcuts:
   - Press `Cmd+1` through `Cmd+7` to navigate between tabs
   - Press `Cmd+/` to open shortcuts modal
   - Press `Esc` to close the modal
4. Verify each tab loads without errors

#### Phase 2: Import Workflow
1. Navigate to **Import** tab (Cmd+2)
2. Look for an Excel file in the project directory (should be a File 2 format)
   - If no file exists, ask me to provide one
3. Upload the Excel file
4. Verify the import process:
   - Should show "Parsing Excel..." step
   - Should show "Analyzing Data..." step
   - Should show "Complete!" with a confidence badge (High/Medium/Low)
5. Review the **Import Report**:
   - Check the confidence level and reasoning
   - Verify "Mapped Items" section shows parsed data
   - Verify "Unmapped Items" section (if any)
   - Check if sources show the filename
6. Click "💰 Go to Bid Form →" button
   - Should navigate directly to Bid Form tab

#### Phase 3: QA / Reconcile
1. Navigate to **QA / Reconcile** tab (Cmd+3)
2. Check the tab status badge in the header:
   - If unmapped items exist: Should show "⚠️ Review Required" (pulsing)
   - If no unmapped items: Should show "✅ No Issues"
3. If unmapped items exist:
   - Test each resolution action:
     - **Map to Existing**: Try mapping an unmapped item to a bid form line
     - **Ignore**: Try ignoring an item
     - **Create New Line**: Try creating a new line item
   - Click "✅ Acknowledge & Proceed" when done
   - Verify status badge changes to "✓ Acknowledged"
4. If no unmapped items:
   - Verify "All Clear!" message appears

#### Phase 4: Bid Form
1. Navigate to **Bid Form** tab (Cmd+4)
2. **Test refresh animation** (if you just imported new data):
   - Should see an animated banner: "🔄 Bid Form Updated!"
   - Banner should slide down and auto-dismiss after 1 second
3. Check the global header:
   - Should show project name (from Excel or "Untitled Project")
   - Should show Excel filename with 📄 icon
4. Check the local header:
   - Should show "X line items" count
5. **Test Global Settings**:
   - Try changing Contingency % (e.g., set to 10)
   - Try changing Overhead % (e.g., set to 15)
   - Try changing Profit % (e.g., set to 20)
   - Verify totals update in real-time
6. **Test Line Item Controls** (pick 2-3 items to test):
   - Toggle the ✓ checkbox to include/exclude items
   - Change the quantity value
   - Change the $/Unit (base unit price)
   - Test difficulty buttons (1-5):
     - Click each difficulty level
     - Verify the selected button is highlighted in gold
     - Check that multiplier updates
   - Test toggle buttons:
     - 🔒 Tight Access
     - 🔧 Heavy Prep
     - 🏠 Occupied
     - Verify they change color when active (orange)
   - Verify the "Total" column updates with each change
7. **Test Section Totals**:
   - Verify each section header shows a total price
   - Verify the totals match the sum of included items
8. **Test Summary Cards**:
   - Check "All Items" card (left):
     - Shows total item count
     - Shows Base Subtotal, Contingency, Overhead, Profit, Total
   - Check "Proposal Total" card (right, dark navy background):
     - Shows included item count
     - Shows the same breakdown
     - Verify only included items are counted

#### Phase 5: Proposal Generation
1. Navigate to **Proposal** tab (Cmd+5)
2. **Test Edit Mode** (default view):
   - Verify "✏️ Draft Proposal" is shown
   - Test editing project information:
     - Project Name
     - Location
     - Developer/Client
     - Contact
   - Verify changes appear immediately in the proposal preview below
   - Scroll through the proposal and verify sections:
     - Company header with logo
     - Project Information
     - Scope of Work (with gold left borders)
     - Pricing breakdown
     - Add Alternates (if any)
     - Exclusions
     - Terms & Conditions
     - Signature blocks
3. **Test Edit Exclusions** (at bottom):
   - Modify the exclusions list
   - Add a new exclusion (e.g., "Testing exclusion")
   - Verify it appears in the proposal above
4. **Test Finalize Flow**:
   - Click "✅ Finalize for Print"
   - Should create a snapshot and switch to Preview Mode
   - Verify header changes to "📋 Finalized Proposal"
   - Verify "Edit Mode" / "Preview Mode" toggle buttons appear
5. **Test Preview Mode**:
   - Verify the proposal is read-only (no input fields)
   - Verify the version info shows creation timestamp
   - Click "Edit Mode" button
   - Verify it switches back to edit mode with input fields
   - Click "Preview Mode" button
   - Verify it shows the finalized version again
6. **Test Print Functionality**:
   - Click "🖨️ Print Finalized"
   - **DO NOT actually print**, but verify:
     - Print dialog opens
     - Document title/filename is based on project name (e.g., "Mexico_Villas-RCWendtPainting")
     - **NOT** "PaintBid - R.C. Wendt Painting" with spaces
     - Preview shows NO "Document Summary" header at top
     - Preview starts with company logo and header
   - Cancel the print dialog
7. **Test Multiple Versions**:
   - Click "✏️ Edit New Version"
   - Make a small change (e.g., change a price)
   - Click "✅ Finalize for Print" again
   - Verify a dropdown appears to select between versions
   - Test switching between finalized versions
   - Verify each version shows its own data correctly

#### Phase 6: Export
1. Navigate to **Export** tab (Cmd+6)
2. Check the local header:
   - Should show "X snapshot(s) ready"
3. **Test JSON Export**:
   - Click "📥 Download Full State (JSON)"
   - Verify a JSON file downloads
   - Filename should be like: `opsuite-backup-YYYY-MM-DD-HHmmss.json`
4. **Test Excel Export** (if implemented):
   - Click any Excel export buttons
   - Verify files download correctly
5. **Test Proposal Snapshots**:
   - Verify all finalized proposals are listed
   - Check that each shows:
     - Version name
     - Total contract price
     - Creation timestamp
   - Try downloading individual proposal snapshots

#### Phase 7: Cross-Feature Integration Tests
1. **Test State Persistence**:
   - Make changes across multiple tabs
   - Refresh the browser (F5)
   - Verify all changes persisted (localStorage)
2. **Test Last Saved Indicator**:
   - Make a change in Bid Form
   - Check the global header
   - Verify "Saved: [timestamp]" updates
3. **Test Tab Status Badges**:
   - Navigate through all tabs
   - Verify each shows appropriate status:
     - Import: Confidence badge (High/Medium/Low)
     - QA: Review Required / Acknowledged / No Issues
     - Bid Form: Line items count
     - Proposal: Finalized versions count
     - Export: Snapshots ready count

#### Phase 8: Edge Cases & Error Handling
1. **Test with no data**:
   - Clear browser localStorage (DevTools → Application → Local Storage → Clear)
   - Refresh the page
   - Verify each tab shows appropriate "no data" states
2. **Test QA without unmapped items**:
   - Import a perfect Excel file (if available)
   - Verify QA tab shows "All Clear!"
3. **Test printing without finalization**:
   - In edit mode, click "🖨️ Print Draft"
   - Verify print dialog opens
   - Verify it prints the current draft state

### Expected Results Summary

**All tests should pass with:**
- ✅ No console errors
- ✅ Smooth animations and transitions
- ✅ All keyboard shortcuts working
- ✅ Data persisting across refreshes
- ✅ Proper status badges in all tabs
- ✅ Global and local headers showing correct info
- ✅ Print filename based on project name (no spaces)
- ✅ No "Document Summary" in print output
- ✅ All user inputs updating state immediately
- ✅ Proper validation and gating (QA must be acknowledged)

### Reporting Format

For each phase, report:
1. **Phase Name**
2. **Status**: ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
3. **Details**: What worked, what didn't
4. **Issues Found**: List any bugs, UI issues, or unexpected behavior
5. **Screenshots**: Capture key screens (Import Report, Bid Form, Proposal, etc.)

### Final Summary

Provide:
1. Overall assessment (Ready for production / Needs fixes)
2. Critical issues (must fix before use)
3. Minor issues (nice to have fixes)
4. Positive highlights (what works really well)
5. Recommendations for improvements

---

**Note**: If you encounter any errors or can't find test data, please ask me for:
- Sample Excel files
- Expected behavior clarification
- Specific test scenarios
