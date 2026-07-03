# BUILD_CHECKLIST.md — Boat Storage Waitlist

## Implementation Steps (Copy-Paste Ready)

### Phase A: Core Waitlist Completion

#### 1. LocalStorage Persistence
```jsx
// Add to App.jsx
const STORAGE_KEY = 'boatWaitlist_v1';

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) setEntries(JSON.parse(saved));
}, []);

// Save on change
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}, [entries]);
```

#### 2. Add Entry to Waitlist
```jsx
const [entries, setEntries] = useState([]);

const addToWaitlist = () => {
  const entry = {
    id: Date.now(),
    length,
    contact,
    timestamp: new Date().toISOString(),
    status: 'pending', // pending | confirmed | stored
    upsells: {
      springLaunch: false,
      winterization: false,
      valetStorage: false
    }
  };
  setEntries([...entries, entry]);
  // Trigger AI confirmation
  generateConfirmation(entry);
};
```

#### 3. Waitlist Queue Display
```jsx
<section className="queue">
  <h2>Waitlist ({entries.length})</h2>
  <table>
    <thead>
      <tr><th>Length</th><th>Contact</th><th>Date</th><th>Status</th></tr>
    </thead>
    <tbody>
      {entries.map(e => (
        <tr key={e.id}>
          <td>{e.length} ft</td>
          <td>{e.contact}</td>
          <td>{new Date(e.timestamp).toLocaleDateString()}</td>
          <td>{e.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
```

#### 4. CSV Export Function
```jsx
const exportCSV = () => {
  const headers = ['ID', 'Length (ft)', 'Contact', 'Date', 'Status', 'Spring Launch', 'Winterization'];
  const rows = entries.map(e => [
    e.id, e.length, e.contact, e.timestamp, e.status,
    e.upsells.springLaunch, e.upsells.winterization
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
```

#### 5. Upsell Toggles in Form
```jsx
<div className="upsells">
  <label>
    <input type="checkbox" checked={springLaunch} onChange={e => setSpringLaunch(e.target.checked)} />
    Spring launch service (+$150 est.)
  </label>
  <label>
    <input type="checkbox" checked={winterization} onChange={e => setWinterization(e.target.checked)} />
    Winterization service (+$300+ est.)
  </label>
  <label>
    <input type="checkbox" checked={valetStorage} onChange={e => setValetStorage(e.target.checked)} />
    Valet/priority storage
  </label>
</div>
```

#### 6. Enhanced Gemini Prompt
```javascript
const prompt = `Write a professional boat storage waitlist confirmation for a ${length} ft boat.

Details:
- Estimated storage timing: November-April
${springLaunch ? '- Spring launch service: INCLUDED' : ''}
${winterization ? '- Winterization service: REQUESTED' : ''}
${valetStorage ? '- Valet/priority storage: SELECTED' : ''}

Tone: Professional, friendly, local marina style
Include: Estimated callback timing, what to expect next, contact info for questions
Length: 80 words max.`;
```

### Phase B: Admin Dashboard

#### 7. Status Management
```jsx
const updateStatus = (id, newStatus) => {
  setEntries(entries.map(e => e.id === id ? {...e, status: newStatus} : e));
};

// Add to table row
<td>
  <select value={e.status} onChange={ev => updateStatus(e.id, ev.target.value)}>
    <option value="pending">Pending</option>
    <option value="contacted">Contacted</option>
    <option value="confirmed">Confirmed</option>
    <option value="stored">Stored</option>
    <option value="declined">Declined</option>
  </select>
</td>
```

#### 8. Search/Filter
```jsx
const [filter, setFilter] = useState('');
const filtered = entries.filter(e => 
  e.contact.toLowerCase().includes(filter.toLowerCase()) ||
  e.length.includes(filter)
);
```

### Phase C: Firebase Integration (Future)

#### 9. Firestore Setup
```javascript
// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';

const app = initializeApp({ /* config */ });
export const db = getFirestore(app);
export const waitlistRef = collection(db, 'waitlist');
```

#### 10. Real-time Sync
```javascript
// Replace localStorage with Firestore
useEffect(() => {
  const q = query(waitlistRef);
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
    setEntries(data);
  });
  return unsubscribe;
}, []);
```

---

## CSS Quick Additions
```css
.queue { margin-top: 2rem; }
.queue table { width: 100%; border-collapse: collapse; }
.queue th, .queue td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #333; }
.queue th { color: #888; font-size: 0.875rem; }
.upsells { display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0; }
.upsells label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
.actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
```

---

## Testing Checklist
- [ ] Form submits entry to waitlist
- [ ] Entry persists on page reload (LocalStorage)
- [ ] Gemini confirmation generates with upsell mentions
- [ ] CSV export includes all fields
- [ ] Status updates persist
- [ ] Mobile responsive layout
- [ ] Empty state handled gracefully

---

## Deployment
```bash
# Build and deploy to Firebase
npm run build
firebase deploy

# Or local preview
npm run preview
```

---

## Next Steps After MVP
1. **Outreach:** Contact Redbrook Boat Club, North Coast Marina, ARU Marina
2. **Demo:** Screen recording of waitlist flow
3. **Pilot:** 1 marina beta test
4. **Iterate:** Add features based on feedback
5. **Scale:** Multi-marina support, Stripe payments
