-- Contractor Match - Supabase Database Schema
-- Phase 1 Implementation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('homeowner', 'contractor', 'admin');
CREATE TYPE project_status AS ENUM ('draft', 'posted', 'matched', 'quoted', 'contracted', 'in_progress', 'completed', 'closed', 'cancelled');
CREATE TYPE project_category AS ENUM (
  'roofing', 'plumbing', 'electrical', 'hvac', 'landscaping', 
  'remodeling', 'painting', 'flooring', 'decks_fences', 'general_handyman'
);
CREATE TYPE urgency_level AS ENUM ('emergency', 'soon', 'flexible', 'planning');
CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'verified', 'rejected', 'expired');
CREATE TYPE contractor_tier AS ENUM ('licensed_professional', 'verified_handyman');

-- ============================================
-- PROFILES TABLE (Extends Supabase Auth)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'homeowner',
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- HOMEOWNERS TABLE
-- ============================================

CREATE TABLE homeowners (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_contact_method VARCHAR(20) DEFAULT 'email',
  availability_notes TEXT,
  verified_homeowner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE homeowners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can view own record" 
  ON homeowners FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Homeowners can update own record" 
  ON homeowners FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Homeowners can insert own record" 
  ON homeowners FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CONTRACTORS TABLE
-- ============================================

CREATE TABLE contractors (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  
  -- Business Info
  website VARCHAR(255),
  description TEXT,
  years_in_business INTEGER,
  employee_count INTEGER,
  
  -- Tier & Verification
  tier contractor_tier DEFAULT 'verified_handyman',
  overall_verification_status verification_status DEFAULT 'pending',
  
  -- License Info (for licensed professionals)
  license_number VARCHAR(100),
  license_state VARCHAR(2) DEFAULT 'OH',
  license_verified verification_status DEFAULT 'pending',
  license_expires DATE,
  
  -- Insurance
  insurance_verified verification_status DEFAULT 'pending',
  insurance_expires DATE,
  liability_coverage_amount INTEGER, -- in dollars
  
  -- Background Check
  background_check_status verification_status DEFAULT 'pending',
  background_check_completed_at TIMESTAMPTZ,
  
  -- Service Area
  service_radius_miles INTEGER DEFAULT 25,
  base_address TEXT,
  base_location GEOGRAPHY(POINT, 4326),
  
  -- Specialties (array of categories)
  specialties project_category[] DEFAULT '{}',
  
  -- Reputation
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  completed_projects_count INTEGER DEFAULT 0,
  response_rate INTEGER DEFAULT 0, -- percentage
  avg_response_hours INTEGER,
  
  -- Availability
  is_accepting_leads BOOLEAN DEFAULT TRUE,
  emergency_available BOOLEAN DEFAULT FALSE,
  business_hours JSONB, -- { monday: { open: "08:00", close: "17:00" }, ... }
  
  -- Badges
  badges TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contractors table is viewable by everyone" 
  ON contractors FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Contractors can update own record" 
  ON contractors FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Contractors can insert own record" 
  ON contractors FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create index for geospatial queries
CREATE INDEX idx_contractors_location ON contractors USING GIST(base_location);
CREATE INDEX idx_contractors_specialties ON contractors USING GIN(specialties);
CREATE INDEX idx_contractors_verified ON contractors(overall_verification_status) WHERE overall_verification_status = 'verified';

-- ============================================
-- PROJECTS TABLE
-- ============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homeowner_id UUID NOT NULL REFERENCES homeowners(id) ON DELETE CASCADE,
  
  -- Project Classification
  category project_category NOT NULL,
  subcategory VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  
  -- AI Classification (optional)
  ai_classification_confidence DECIMAL(3,2),
  ai_suggested_questions JSONB,
  
  -- Scope
  square_footage INTEGER,
  property_type VARCHAR(50) DEFAULT 'single_family',
  property_address TEXT,
  property_location GEOGRAPHY(POINT, 4326),
  
  -- Media
  photos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  
  -- Timeline & Budget
  urgency urgency_level DEFAULT 'flexible',
  timeline_start DATE,
  timeline_flexibility TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  budget_flexible BOOLEAN DEFAULT FALSE,
  
  -- Status
  status project_status DEFAULT 'draft',
  
  -- Matching
  matched_contractor_ids UUID[] DEFAULT '{}',
  preferred_contractor_ids UUID[] DEFAULT '{}',
  
  -- Metadata
  view_count INTEGER DEFAULT 0,
  quote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  posted_at TIMESTAMPTZ
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can view own projects" 
  ON projects FOR SELECT 
  USING (auth.uid() = homeowner_id);

CREATE POLICY "Contractors can view posted projects" 
  ON projects FOR SELECT 
  USING (status = 'posted');

CREATE POLICY "Homeowners can insert own projects" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update own projects" 
  ON projects FOR UPDATE 
  USING (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can delete own draft projects" 
  ON projects FOR DELETE 
  USING (auth.uid() = homeowner_id AND status = 'draft');

-- Indexes
CREATE INDEX idx_projects_homeowner ON projects(homeowner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_location ON projects USING GIST(property_location);
CREATE INDEX idx_projects_created ON projects(created_at DESC);

-- ============================================
-- PROJECT DETAILS (Additional scope info)
-- ============================================

CREATE TABLE project_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Dynamic fields based on category
  scope_questions JSONB DEFAULT '{}',
  materials_preference TEXT,
  access_instructions TEXT,
  parking_notes TEXT,
  pet_notes TEXT,
  
  -- Existing conditions
  has_existing_damage BOOLEAN,
  damage_description TEXT,
  previous_work_done BOOLEAN,
  previous_work_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project details follow project permissions" 
  ON project_details FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_details.project_id 
      AND (projects.homeowner_id = auth.uid() OR projects.status = 'posted')
    )
  );

-- ============================================
-- MATCHES TABLE
-- ============================================

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  
  -- Scoring
  match_score INTEGER NOT NULL, -- 0-100
  match_rationale TEXT, -- AI explanation
  
  -- Factors
  specialty_match_score INTEGER,
  availability_match_score INTEGER,
  location_match_score INTEGER,
  reputation_score INTEGER,
  price_alignment_score INTEGER,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined, quoted, hired
  contractor_viewed_at TIMESTAMPTZ,
  contractor_responded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, contractor_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contractors can view own matches" 
  ON matches FOR SELECT 
  USING (auth.uid() = contractor_id);

CREATE POLICY "Homeowners can view project matches" 
  ON matches FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = matches.project_id 
      AND projects.homeowner_id = auth.uid()
    )
  );

CREATE INDEX idx_matches_contractor ON matches(contractor_id);
CREATE INDEX idx_matches_project ON matches(project_id);
CREATE INDEX idx_matches_score ON matches(match_score DESC);

-- ============================================
-- QUOTES TABLE
-- ============================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id),
  
  -- Line Items
  line_items JSONB NOT NULL DEFAULT '[]', -- [{ description, quantity, unit_price, total }, ...]
  
  -- Totals
  subtotal INTEGER NOT NULL, -- in cents
  tax_amount INTEGER DEFAULT 0,
  total_cost INTEGER NOT NULL,
  
  -- Timeline
  estimated_days INTEGER,
  estimated_start_date DATE,
  estimated_completion_date DATE,
  
  -- Terms
  payment_schedule JSONB, -- [{ milestone, amount, due_date }, ...]
  warranty_description TEXT,
  notes TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  expires_at TIMESTAMPTZ,
  
  -- Metadata
  viewed_by_homeowner_at TIMESTAMPTZ,
  homeowner_response_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contractors can manage own quotes" 
  ON quotes FOR ALL 
  USING (auth.uid() = contractor_id);

CREATE POLICY "Homeowners can view project quotes" 
  ON quotes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = quotes.project_id 
      AND projects.homeowner_id = auth.uid()
    )
  );

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES homeowners(id),
  reviewee_id UUID NOT NULL REFERENCES contractors(id),
  project_id UUID REFERENCES projects(id),
  
  -- Ratings
  rating_overall INTEGER NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_quality INTEGER CHECK (rating_quality BETWEEN 1 AND 5),
  rating_communication INTEGER CHECK (rating_communication BETWEEN 1 AND 5),
  rating_timeliness INTEGER CHECK (rating_timeliness BETWEEN 1 AND 5),
  rating_value INTEGER CHECK (rating_value BETWEEN 1 AND 5),
  rating_cleanliness INTEGER CHECK (rating_cleanliness BETWEEN 1 AND 5),
  
  -- Content
  review_text TEXT,
  photos TEXT[] DEFAULT '{}',
  
  -- Verification
  verified_completion BOOLEAN DEFAULT FALSE,
  
  -- Contractor Response
  contractor_response TEXT,
  contractor_responded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(reviewer_id, project_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Homeowners can create own reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Contractors can respond to own reviews" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = reviewee_id)
  WITH CHECK (
    auth.uid() = reviewee_id 
    AND OLD.contractor_response IS NULL
  );

CREATE INDEX idx_reviews_contractor ON reviews(reviewee_id);
CREATE INDEX idx_reviews_project ON reviews(project_id);

-- ============================================
-- VERIFICATION DOCUMENTS
-- ============================================

CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  
  document_type VARCHAR(50) NOT NULL, -- license, insurance, background_check, certification
  document_name VARCHAR(255),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  -- Verification
  status verification_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Expiration
  expires_at DATE,
  reminder_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contractors can manage own documents" 
  ON verification_documents FOR ALL 
  USING (auth.uid() = contractor_id);

CREATE POLICY "Verified documents are viewable" 
  ON verification_documents FOR SELECT 
  USING (status = 'verified');

-- ============================================
-- PORTFOLIO ITEMS
-- ============================================

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  
  project_type project_category,
  title VARCHAR(255),
  description TEXT,
  
  -- Media
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  video_url TEXT,
  
  -- Project Details
  completion_date DATE,
  project_value INTEGER,
  location_city VARCHAR(100),
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio items are viewable by everyone" 
  ON portfolio_items FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Contractors can manage own portfolio" 
  ON portfolio_items FOR ALL 
  USING (auth.uid() = contractor_id);

-- ============================================
-- SAVED CONTRACTORS (Homeowner favorites)
-- ============================================

CREATE TABLE saved_contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homeowner_id UUID NOT NULL REFERENCES homeowners(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(homeowner_id, contractor_id)
);

ALTER TABLE saved_contractors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can manage own saved contractors" 
  ON saved_contractors FOR ALL 
  USING (auth.uid() = homeowner_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homeowners_updated_at BEFORE UPDATE ON homeowners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_details_updated_at BEFORE UPDATE ON project_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_docs_updated_at BEFORE UPDATE ON verification_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update contractor rating when a new review is added
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contractors
  SET 
    rating_avg = (
      SELECT ROUND(AVG(rating_overall)::numeric, 1) 
      FROM reviews 
      WHERE reviewee_id = NEW.reviewee_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contractor_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_contractor_rating();

-- Set posted_at when project status changes to posted
CREATE OR REPLACE FUNCTION set_project_posted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'posted' AND OLD.status != 'posted' THEN
    NEW.posted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_posted_at_on_status_change
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_posted_at();

-- ============================================
-- ROW LEVEL SECURITY HELPER FUNCTIONS
-- ============================================

-- Function to check if user is a contractor
CREATE OR REPLACE FUNCTION is_contractor(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'contractor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a homeowner
CREATE OR REPLACE FUNCTION is_homeowner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'homeowner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert project categories reference data
CREATE TABLE IF NOT EXISTS project_category_details (
  category project_category PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  typical_budget_min INTEGER,
  typical_budget_max INTEGER,
  requires_license BOOLEAN DEFAULT FALSE
);

INSERT INTO project_category_details (category, display_name, description, icon_name, typical_budget_min, typical_budget_max, requires_license) VALUES
  ('roofing', 'Roofing', 'Roof repair, replacement, and installation', 'home', 2000, 25000, FALSE),
  ('plumbing', 'Plumbing', 'Plumbing repair, installation, and maintenance', 'droplets', 150, 8000, TRUE),
  ('electrical', 'Electrical', 'Electrical work, wiring, and panel upgrades', 'zap', 200, 10000, TRUE),
  ('hvac', 'HVAC', 'Heating, ventilation, and air conditioning', 'wind', 200, 12000, TRUE),
  ('landscaping', 'Landscaping', 'Lawn care, hardscaping, and outdoor design', 'trees', 500, 15000, FALSE),
  ('remodeling', 'Remodeling', 'Kitchen, bathroom, and whole home remodeling', 'hammer', 5000, 100000, FALSE),
  ('painting', 'Painting', 'Interior and exterior painting services', 'paintbrush', 500, 8000, FALSE),
  ('flooring', 'Flooring', 'Floor installation and refinishing', 'grid', 1000, 15000, FALSE),
  ('decks_fences', 'Decks & Fences', 'Deck building, repair, and fence installation', 'fence', 1500, 20000, FALSE),
  ('general_handyman', 'General Handyman', 'General repairs and maintenance under $1,000', 'wrench', 50, 1000, FALSE);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Note: Execute these in Supabase Dashboard or via storage API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-photos', 'project-photos', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('contractor-portfolios', 'contractor-portfolios', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verification-documents', 'verification-documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-avatars', 'profile-avatars', true);

-- Storage policies would be added via Supabase dashboard or API
