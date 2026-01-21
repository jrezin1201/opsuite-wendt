"use client";

import React from "react";
import { ProfessionalProposal, ScopeItem, shouldHighlight, isExcluded } from "@/lib/paintbid/proposal/professionalTypes";

interface ProfessionalProposalProps {
  proposal: ProfessionalProposal;
  pageNumber?: number;
  onEdit?: (field: string, value: string | number | boolean) => void;
  isEditable?: boolean;
}

export function ProfessionalProposalView({
  proposal,
  pageNumber = 1
}: ProfessionalProposalProps) {
  return (
    <div className="bg-white w-full max-w-[8.5in] mx-auto shadow-xl print:shadow-none">
      {/* Page wrapper with proper sizing for print */}
      <div className="min-h-[11in] p-6 relative">
        {/* Content - No watermarks */}
        {pageNumber === 1 && <Page1 proposal={proposal} />}
        {pageNumber === 2 && <Page2 proposal={proposal} />}
        {pageNumber === 3 && <Page3 proposal={proposal} />}
        {pageNumber === 4 && <Page4 proposal={proposal} />}
      </div>
    </div>
  );
}

function Page1({ proposal }: { proposal: ProfessionalProposal }) {
  return (
    <div className="space-y-0">
      {/* Company Header */}
      <div className="text-center mb-4 pb-2 border-b-2 border-black">
        <h1 className="text-2xl font-bold">R.C. WENDT PAINTING, INC.</h1>
        <p className="text-sm">5080 Commercial Circle, Suite A, Concord, CA 94520</p>
        <p className="text-sm">Tel: (925) 356-5700 • Fax: (925) 356-5900</p>
        <p className="text-sm">License #640498 • Bonded & Insured</p>
      </div>

      {/* Header Table */}
      <table className="w-full border-2 border-black">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold">Developer:</td>
            <td className="border border-black p-2">{proposal.header.developer}</td>
            <td className="border border-black p-2 font-bold">Date:</td>
            <td className="border border-black p-2">{proposal.header.date}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Address:</td>
            <td className="border border-black p-2">{proposal.header.address}</td>
            <td className="border border-black p-2 font-bold">Contact:</td>
            <td className="border border-black p-2">{proposal.header.contact}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">City:</td>
            <td className="border border-black p-2">{proposal.header.city}</td>
            <td className="border border-black p-2 font-bold">Phone:</td>
            <td className="border border-black p-2">{proposal.header.phone}</td>
          </tr>
          <tr>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 font-bold">Email:</td>
            <td className="border border-black p-2 text-blue-600">{proposal.header.email}</td>
          </tr>
        </tbody>
      </table>

      {/* Plans Section */}
      <table className="w-full border-2 border-black border-t-0">
        <thead>
          <tr>
            <td className="border border-black p-2 font-bold">PROJECT</td>
            <td className="border border-black p-2">{proposal.header.project}</td>
            <td colSpan={2} className="border border-black p-2 text-center font-bold">PLANS</td>
            <td colSpan={2} className="border border-black p-2 text-center font-bold">DATED</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold">UNITS</td>
            <td className="border border-black p-2">{proposal.header.units} Residential Units + 1 ADU</td>
            <td className="border border-black p-2 font-bold">ARCHITECTURAL</td>
            <td className="border border-black p-2">{proposal.header.architectural}</td>
            <td colSpan={2} className="border border-black p-2"></td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">CITY</td>
            <td className="border border-black p-2">LOS ANGELES, CA 90038</td>
            <td className="border border-black p-2 font-bold">LANDSCAPE</td>
            <td className="border border-black p-2 text-red-600 font-bold">{proposal.header.landscape}</td>
            <td colSpan={2} className="border border-black p-2"></td>
          </tr>
          <tr>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 font-bold">INTERIOR DESIGN</td>
            <td className="border border-black p-2">NA</td>
            <td colSpan={2} className="border border-black p-2"></td>
          </tr>
          <tr>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 font-bold">OWNER SPECS</td>
            <td className="border border-black p-2">NA</td>
            <td colSpan={2} className="border border-black p-2"></td>
          </tr>
        </tbody>
      </table>

      {/* Unit Interior Section */}
      <ScopeSection title="UNIT INTERIOR" items={proposal.scopeOfWork.unitInterior} />

      {/* Stairwells Section */}
      <ScopeSection title="STAIRWELLS" items={proposal.scopeOfWork.stairwells} />

      {/* Corridors Section */}
      <ScopeSection title="CORRIDORS" items={proposal.scopeOfWork.corridors} />
    </div>
  );
}

function Page2({ proposal }: { proposal: ProfessionalProposal }) {
  return (
    <div className="space-y-0">
      {/* Company Header - Simplified for continuation pages */}
      <div className="text-center mb-4 pb-2 border-b border-gray-400">
        <p className="text-lg font-bold">R.C. WENDT PAINTING, INC. - Page 2</p>
      </div>

      {/* Corridors Continued */}
      {proposal.scopeOfWork.corridorsContinued && proposal.scopeOfWork.corridorsContinued.length > 0 && (
        <ScopeSection title="CORRIDORS CONTINUED" items={proposal.scopeOfWork.corridorsContinued} />
      )}

      {/* Amenity Area */}
      <ScopeSection title="AMENITY AREA" items={proposal.scopeOfWork.amenityArea} />

      {/* Exterior */}
      <ScopeSection title="EXTERIOR" items={proposal.scopeOfWork.exterior} />
    </div>
  );
}

function Page3({ proposal }: { proposal: ProfessionalProposal }) {
  return (
    <div className="space-y-0">
      {/* Company Header - Simplified for continuation pages */}
      <div className="text-center mb-4 pb-2 border-b border-gray-400">
        <p className="text-lg font-bold">R.C. WENDT PAINTING, INC. - Page 3</p>
      </div>

      {/* Garage */}
      <ScopeSection title="Garage" items={proposal.scopeOfWork.garage} />

      {/* Landscape */}
      <ScopeSection title="LANDSCAPE" items={proposal.scopeOfWork.landscape} />

      {/* Pricing Section */}
      <div className="mt-8">
        <h2 className="text-center font-bold text-xl mb-4">PRICING</h2>
        <table className="w-full border-2 border-black">
          <tbody>
            <tr>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-center font-bold">Amount</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Units</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.units.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Corridors</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.corridors.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Stairs</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.stairs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Amenity</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.amenity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Exterior</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.exterior.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Garage</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.garage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Landscape</td>
              <td className="border border-black p-2 text-right">$ {proposal.pricing.landscape.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-black p-2 font-bold">Total</td>
              <td className="border border-black p-2 text-right font-bold">$ {proposal.pricing.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
        {proposal.pricing.wrapLiability && (
          <p className="text-center text-red-600 font-bold italic mt-2">{proposal.pricing.wrapLiability}</p>
        )}
      </div>

      {/* Exclusions */}
      <div className="mt-8">
        <h2 className="text-center font-bold text-xl mb-4">EXCLUSIONS</h2>
        <table className="w-full border-2 border-black">
          <tbody>
            <tr>
              <td className="border border-black p-2">9900 Specifications</td>
              <td className="border border-black p-2">Masked Hinges</td>
            </tr>
            <tr>
              <td className="border border-black p-2">0 VOC Paints & Systems</td>
              <td className="border border-black p-2">ALL Stand Pipes</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Scaffolding & Lifts</td>
              <td className="border border-black p-2">Wall Coverings</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Saturday & Weekend Work</td>
              <td className="border border-black p-2">Paid Parking, Parking To Be Provided By Contractor</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Water Proofing Membranes</td>
              <td className="border border-black p-2">Caulking Windows By Drywall Contractor</td>
            </tr>
            <tr>
              <td className="border border-black p-2">ALL Exterior Caulking: Done By Other</td>
              <td className="border border-black p-2">Not Responsible For Rusting If Metal Is Not Metalized</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Power & Pressure Washing</td>
              <td className="border border-black p-2">Payment & Performance Bonds</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Signing Unmodified Scaffold Agreements</td>
              <td className="border border-black p-2">Excess & Umbrella Coverages</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Alternates */}
      <div className="mt-8">
        <h2 className="text-center font-bold text-xl mb-4">ADD ALTERNATES</h2>
        <table className="w-full border-2 border-black">
          <tbody>
            {proposal.addAlternates.slice(0, 6).map((alt, idx) => (
              <tr key={idx}>
                <td className="border border-black p-2">{alt.description}</td>
                <td className="border border-black p-2">$</td>
                <td className="border border-black p-2 text-right">{alt.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Page4({ proposal }: { proposal: ProfessionalProposal }) {
  return (
    <div className="space-y-0">
      {/* Company Header - Simplified for continuation pages */}
      <div className="text-center mb-4 pb-2 border-b border-gray-400">
        <p className="text-lg font-bold">R.C. WENDT PAINTING, INC. - Page 4</p>
      </div>

      {/* Add Alternates Continued */}
      {proposal.addAlternates.length > 6 && (
        <div>
          <h2 className="text-center font-bold text-xl mb-4">ADD ALTERNATES</h2>
          <table className="w-full border-2 border-black">
            <tbody>
              {proposal.addAlternates.slice(6).map((alt, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2">{alt.description}</td>
                  <td className="border border-black p-2">$</td>
                  <td className="border border-black p-2 text-right">{alt.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-black p-2 font-bold">ADDITIONAL WORK CHARGED AT:</td>
                <td colSpan={2} className="border border-black p-2 text-right">$73.00/HR</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">1/2 Time OT Work</td>
                <td colSpan={2} className="border border-black p-2 text-right">$37.00/HR</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Materials Included */}
      <div className="mt-8">
        <h2 className="text-center font-bold text-xl mb-4">MATERIALS INCLUDED IN BID: VISTA PAINTS</h2>
        <table className="w-full border-2 border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Units</th>
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">Flat</td>
              <td className="border border-black p-2">Breezewall</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Enamel</td>
              <td className="border border-black p-2">V-Pro</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Common Area</th>
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2"></th>
            </tr>
            <tr>
              <td className="border border-black p-2">Flat</td>
              <td className="border border-black p-2">Breezewall</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Enamel</td>
              <td className="border border-black p-2">V-Pro</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Exterior</th>
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2"></th>
            </tr>
            <tr>
              <td className="border border-black p-2">Stucco Body</td>
              <td className="border border-black p-2">NA</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Canopies</td>
              <td className="border border-black p-2">NA</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Balcony Rails</td>
              <td className="border border-black p-2">Protec</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Doors</td>
              <td className="border border-black p-2">Protec</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Wood</td>
              <td className="border border-black p-2">Coverall</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Concrete Walls</td>
              <td className="border border-black p-2">NONE</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScopeSection({ title, items }: { title: string; items: ScopeItem[] }) {
  const hasHighlightedItems = items.some(item => shouldHighlight(item));

  return (
    <table className="w-full border-2 border-black border-t-0">
      <thead>
        <tr>
          <th colSpan={6} className="border border-black p-2 text-left font-bold bg-gray-50">
            {title}
          </th>
          {hasHighlightedItems && (
            <th className="border border-black p-2 bg-yellow-300 text-center font-bold">
              Flat One Tone
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className={shouldHighlight(item) ? 'bg-yellow-50' : ''}>
            <td colSpan={hasHighlightedItems ? 6 : 7} className={`border border-black p-2 ${isExcluded(item) ? 'text-red-600 italic' : ''}`}>
              {item.description}
              {item.details && item.details.length > 0 && (
                <span className="text-gray-600 text-sm ml-2">({item.details.join(", ")})</span>
              )}
            </td>
            {hasHighlightedItems && (
              <td className={`border border-black p-2 ${shouldHighlight(item) ? 'bg-yellow-300' : ''}`}>
                {shouldHighlight(item) && '✓'}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}