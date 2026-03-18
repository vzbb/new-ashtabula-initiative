import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // Auth State
      user: {
        isAdmin: false,
        name: 'Guest User'
      },
      hasSeenWelcome: false,
      setHasSeenWelcome: (hasSeenWelcome) => set({ hasSeenWelcome }),
      setAdmin: (isAdmin) => set({ user: { isAdmin, name: isAdmin ? 'Town Clerk' : 'Guest User' } }),

      // Summaries State
      summaries: [
        {
          id: '1',
          date: new Date('2026-02-16').toISOString(),
          township: 'Ashtabula Township',
          bullets: [
            'Awarded 2026 Road Resurfacing Project bid to Ohio Paving & Construction ($185,000).',
            'Approved $45,000 allocation for new playground equipment at Saybrook Park.',
            'Heard public concerns regarding speeding on Lake Road; Chief Thompson promised increased patrols.',
            'Renewed the annual waste management contract with a 3% rate adjustment.',
            'Approved the purchase of a new salt spreader for the Public Works department.'
          ],
          actionItems: [
            'Township Clerk to finalize contract with Ohio Paving by Feb 20th.',
            'Parks Committee to gather community feedback on playground designs by March 1st.',
            'Chief Thompson to report back on Lake Road patrol results at next meeting.'
          ],
          overview: "The February 16th meeting focused heavily on infrastructure and public safety. Key decisions included awarding the major road resurfacing contract and moving forward with park improvements. Public engagement was high, specifically regarding traffic safety on Lake Road, leading to immediate law enforcement action.",
          pressRelease: "FOR IMMEDIATE RELEASE\n\nASHTABULA TOWNSHIP ANNOUNCES 2026 ROAD RESURFACING PROJECT AND PARK IMPROVEMENTS\n\nASHTABULA TOWNSHIP, OH — The Ashtabula Township Board of Trustees held its regular meeting on February 16, 2026, marking a significant step forward in infrastructure and community well-being. The Board officially awarded the 2026 Road Resurfacing Project contract to Ohio Paving & Construction, a move that ensures the continued safety and quality of township thoroughfares.\n\nIn addition to infrastructure, the Trustees signaled a commitment to youth and recreation by allocating $45,000 for new playground equipment at Saybrook Park. \"Our parks are the heartbeat of this community,\" said Trustee Miller. \"This investment reflects our priority in providing safe, modern spaces for our families.\"\n\nThe meeting also addressed public safety concerns regarding Lake Road. In response to resident feedback, Chief Thompson has authorized increased patrols to mitigate speeding issues. \n\nFor more information, visit the Civic Insight Engine portal.",
          tags: ['Infrastructure', 'Parks', 'Public Safety', 'Finance'],
          status: 'published'
        },
        {
          id: '2',
          date: new Date('2026-02-02').toISOString(),
          township: 'Ashtabula City',
          bullets: [
            'Passed the final reading of the 2026 Municipal Budget.',
            'Appointed Sarah Jenkins to the Board of Zoning Appeals.',
            'Approved a $50,000 federal grant for Fire Department safety equipment.',
            'Authorized a public hearing for the Harbor District mixed-use rezoning proposal.',
            'Voted to increase the senior citizen property tax credit by 5%.'
          ],
          actionItems: [
            'Finance Director to file budget with the County Auditor.',
            'Zoning Board to publish notice for the Harbor District hearing (March 15th).',
            'Fire Chief to begin procurement process for new respirators.'
          ],
          overview: "A landmark meeting where the 2026 budget was officially adopted, ensuring continued funding for essential services. The board also signaled a move toward modernization with the Harbor District rezoning proposal and provided direct relief to seniors through tax credit increases.",
          pressRelease: "FOR IMMEDIATE RELEASE\n\nASHTABULA CITY COUNCIL ADOPTS 2026 BUDGET, FOCUSES ON HARBOR DEVELOPMENT\n\nASHTABULA, OH — Ashtabula City Council has officially adopted the 2026 Municipal Budget following its final reading on February 2, 2026. The budget secures funding for critical city services while emphasizing public safety and strategic growth.\n\nA key highlight of the session was the authorization of a public hearing for the Harbor District mixed-use rezoning proposal, a move that could transform the district into a vibrant hub of commercial and residential activity. Council also approved a $50,000 grant for Fire Department safety equipment, reinforcing their commitment to first responders.\n\n\"This budget is about balance,\" stated Council President John Smith. \"We are investing in our future while providing immediate support to our seniors through property tax credit increases.\"\n\nThe public is invited to the Harbor District hearing on March 15th.",
          tags: ['Budget', 'Zoning', 'Public Safety', 'Finance'],
          status: 'published'
        },
        {
          id: '3',
          date: new Date('2026-01-19').toISOString(),
          township: 'Ashtabula Township',
          bullets: [
            'Approved a new ordinance regulating short-term rentals in residential zones.',
            'Discussed the proposed solar farm on Plymouth Ridge; environmental study requested.',
            'Voted to replace the aging HVAC system at the Township Hall.',
            'Allocated $12,000 for the Summer Youth Employment Program.',
            'Set the date for the annual Spring Clean-up Day: May 12th.'
          ],
          actionItems: [
            'Legal counsel to draft final language for the rental ordinance.',
            'Administrator to solicit bids for the Hall HVAC replacement.',
            'Environmental consultant to be hired for the solar farm study.'
          ],
          overview: "This session addressed long-term regulatory and environmental concerns. The new short-term rental ordinance aims to balance tourism with neighborhood character, while the solar farm discussion highlights the township's cautious approach to renewable energy development.",
          pressRelease: "FOR IMMEDIATE RELEASE\n\nASHTABULA TOWNSHIP TACKLES SHORT-TERM RENTALS AND RENEWABLE ENERGY\n\nASHTABULA TOWNSHIP, OH — The Township Trustees moved forward with significant regulatory changes during their January 19th session. A new ordinance was approved to regulate short-term rentals, ensuring that the growth of local tourism does not come at the expense of neighborhood integrity.\n\nThe Trustees also initiated an environmental study for a proposed solar farm on Plymouth Ridge. \"We support renewable energy, but it must be done responsibly,\" the Board stated. Additionally, the aging HVAC system at Township Hall will be replaced to improve energy efficiency and staff comfort.\n\nCommunity members are encouraged to review the new rental guidelines on the township website.",
          tags: ['Zoning', 'Environment', 'Administration', 'Youth'],
          status: 'published'
        },
        {
          id: '4',
          date: new Date('2026-01-05').toISOString(),
          township: 'Ashtabula Township',
          bullets: [
            'Elected Trustee Robert Vance as Board Chairman for 2026.',
            'Authorized the application for a Clean Ohio Conservation Fund grant.',
            'Approved mutual aid agreement with neighboring Geneva Township.',
            'Voted to repair the Harbor Road bridge expansion joints.',
            'Appointed members to the 2026 Bicentennial Planning Committee.'
          ],
          actionItems: [
            'Chairman Vance to sign the Geneva mutual aid agreement.',
            'Engineer to finalize bridge repair specifications for bidding.',
            'Bicentennial Committee to hold its first meeting on Jan 20th.'
          ],
          overview: "The first meeting of the year established leadership and set a collaborative tone with the new mutual aid agreement. Significant attention was given to grant applications and infrastructure maintenance, specifically the Harbor Road bridge.",
          pressRelease: "FOR IMMEDIATE RELEASE\n\nASHTABULA TOWNSHIP SETS LEADERSHIP AND COLLABORATIVE GOALS FOR 2026\n\nASHTABULA TOWNSHIP, OH — The first Trustee meeting of 2026 saw the election of Robert Vance as Board Chairman. The session set a tone of regional cooperation with the approval of a mutual aid agreement with neighboring Geneva Township, enhancing public safety across borders.\n\nInfrastructure remains a top priority, with authorized repairs for the Harbor Road bridge expansion joints and applications for the Clean Ohio Conservation Fund grant. The meeting also marked the beginning of bicentennial celebrations, with the appointment of a planning committee.\n\n\"2026 is a milestone year for Ashtabula,\" said Chairman Vance. \"We are focused on safe bridges, strong partnerships, and honoring our history.\"",
          tags: ['Leadership', 'Infrastructure', 'Public Safety', 'History'],
          status: 'published'
        }
      ],
      
      // Issues State
      issues: [
        {
          id: '1',
          title: 'Large Pothole on 5th Ave',
          category: 'roads',
          description: 'A deep pothole has formed near the intersection of 5th Ave and Elm St. It is dangerous for small cars and needs immediate fill.',
          location: '5th Ave & Elm St',
          coordinates: [41.8651, -80.7899],
          status: 'in_progress',
          createdAt: new Date('2026-02-24T10:30:00').toISOString(),
          comments: [
            { id: 'c1', text: 'Work order #452 created for Public Works.', author: 'Admin', date: new Date('2026-02-24T14:00:00').toISOString() },
            { id: 'c2', text: 'Crew scheduled for repair on Wednesday morning.', author: 'Admin', date: new Date('2026-02-25T09:00:00').toISOString() }
          ]
        },
        {
          id: '2',
          title: 'Flickering Street Light',
          category: 'utilities',
          description: 'The street light in front of 422 Lake Rd is flickering and frequently goes dark, making the sidewalk unsafe at night.',
          location: '422 Lake Rd',
          coordinates: [41.8964, -80.7963],
          status: 'open',
          createdAt: new Date('2026-02-25T18:45:00').toISOString(),
          comments: []
        },
        {
          id: '3',
          title: 'Illegal Dumping in Ditch',
          category: 'safety',
          description: 'Several old tires and a broken sofa have been dumped in the ditch near the Harbor Road bridge.',
          location: 'Harbor Rd Bridge',
          coordinates: [41.9012, -80.7991],
          status: 'resolved',
          createdAt: new Date('2026-02-15T08:00:00').toISOString(),
          comments: [
            { id: 'c3', text: 'Sanitation department notified.', author: 'Admin', date: new Date('2026-02-15T11:00:00').toISOString() },
            { id: 'c4', text: 'Items removed and area inspected for further dumping.', author: 'Admin', date: new Date('2026-02-16T15:30:00').toISOString() }
          ]
        },
        {
          id: '4',
          title: 'Overgrown Abandoned Lot',
          category: 'zoning',
          description: 'The lot at 89 Main St has grass over 18 inches tall. It is attracting vermin and is a fire hazard.',
          location: '89 Main St',
          coordinates: [41.8682, -80.7915],
          status: 'open',
          createdAt: new Date('2026-02-20T13:20:00').toISOString(),
          comments: [
            { id: 'c5', text: 'Zoning inspector visited site. Violation notice sent to owner of record.', author: 'Admin', date: new Date('2026-02-22T10:00:00').toISOString() }
          ]
        },
        {
          id: '5',
          title: 'Blocked Storm Drain',
          category: 'utilities',
          description: 'Storm drain is completely blocked with leaves and debris at the corner of Walnut and 3rd. Causes flooding during rain.',
          location: 'Walnut St & 3rd St',
          coordinates: [41.8625, -80.7842],
          status: 'open',
          createdAt: new Date('2026-02-26T07:15:00').toISOString(),
          comments: []
        }
      ],

      // Methods
      addSummary: (summary) => set((state) => ({ 
        summaries: [
          { 
            ...summary, 
            id: Date.now().toString(), 
            date: new Date().toISOString(),
            status: 'published' 
          }, 
          ...state.summaries
        ] 
      })),
      
      deleteSummary: (id) => set((state) => ({
        summaries: state.summaries.filter(s => s.id !== id)
      })),

      updateSummary: (id, updatedSummary) => set((state) => ({
        summaries: state.summaries.map(s => s.id === id ? { ...s, ...updatedSummary } : s)
      })),

      addIssue: (issue) => set((state) => ({
        issues: [
          { 
            ...issue, 
            id: Date.now().toString(), 
            status: 'open', 
            createdAt: new Date().toISOString(),
            comments: [] 
          }, 
          ...state.issues
        ]
      })),

      updateIssueStatus: (id, status) => set((state) => ({
        issues: state.issues.map(issue => issue.id === id ? { ...issue, status } : issue)
      })),
      
      addIssueComment: (issueId, commentText) => set((state) => ({
        issues: state.issues.map(issue => 
          issue.id === issueId 
            ? { 
                ...issue, 
                comments: [
                  ...issue.comments, 
                  { id: Date.now().toString(), text: commentText, author: 'Admin', date: new Date().toISOString() }
                ] 
              } 
            : issue
        )
      })),

      clearData: () => set({ summaries: [], issues: [] })
    }),
    {
      name: 'civic-insight-storage-v2',
    }
  )
);
