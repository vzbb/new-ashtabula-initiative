import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';
import AdminPanel from './pages/AdminPanel';
import PropertyLookup from './pages/PropertyLookup';
import SummaryDetail from './pages/SummaryDetail';
import IssueDetail from './pages/IssueDetail';
import Budget from './pages/Budget';

function App() {
  return (
    <BrowserRouter basename="/civic-insight">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="issues" element={<Issues />} />
          <Route path="summary/:id" element={<SummaryDetail />} />
          <Route path="issue/:id" element={<IssueDetail />} />
          <Route path="property" element={<PropertyLookup />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="budget" element={<Budget />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
