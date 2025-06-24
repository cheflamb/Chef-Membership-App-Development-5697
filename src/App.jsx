import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { AuthProvider } from './context/AuthContext';
import { JournalProvider } from './context/JournalContext';
import NotificationProvider from './components/NotificationProvider';
import Navbar from './components/Navbar';
import FeedbackButton from './components/FeedbackButton';
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import ChefsTable from './pages/ChefsTable';
import LeadershipLevelUp from './pages/LeadershipLevelUp';
import CourseViewer from './pages/CourseViewer';
import LiveEvents from './pages/LiveEvents';
import ResourceToolbox from './pages/ResourceToolbox';
import MyChefcoat from './pages/MyChefcoat';
import Journal from './pages/Journal';
import About from './pages/About';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/AdminDashboard';
import BroadcastCenter from './pages/BroadcastCenter';
import ContentCalendar from './pages/ContentCalendar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import GetStarted from './pages/GetStarted';
import FeedbackDashboard from './pages/FeedbackDashboard';
import questConfig from './questConfig';
import './App.css';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <NotificationProvider>
          <JournalProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/chefs-table" element={<ChefsTable />} />
                  <Route path="/leadership-levelup" element={<LeadershipLevelUp />} />
                  <Route path="/course/:courseId" element={<CourseViewer />} />
                  <Route path="/live-events" element={<LiveEvents />} />
                  <Route path="/resource-toolbox" element={<ResourceToolbox />} />
                  <Route path="/my-chefcoat" element={<MyChefcoat />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/get-started" element={<GetStarted />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/broadcast" element={<BroadcastCenter />} />
                  <Route path="/content-calendar" element={<ContentCalendar />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/feedback" element={<FeedbackDashboard />} />
                </Routes>
                
                {/* Global Feedback Button - Available on all pages for logged-in users */}
                <FeedbackButton />
              </div>
            </Router>
          </JournalProvider>
        </NotificationProvider>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;