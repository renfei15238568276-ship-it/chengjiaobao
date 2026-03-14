import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const ORGANIZATIONS_FILE = path.join(DATA_DIR, 'organizations.json');
const MEMBERSHIPS_FILE = path.join(DATA_DIR, 'memberships.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
};

export type Membership = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
};

function getOrganizations(): Organization[] {
  ensureDataDir();
  if (fs.existsSync(ORGANIZATIONS_FILE)) {
    return JSON.parse(fs.readFileSync(ORGANIZATIONS_FILE, 'utf-8'));
  }
  return [];
}

function saveOrganizations(orgs: Organization[]) {
  ensureDataDir();
  fs.writeFileSync(ORGANIZATIONS_FILE, JSON.stringify(orgs, null, 2));
}

function getMemberships(): Membership[] {
  ensureDataDir();
  if (fs.existsSync(MEMBERSHIPS_FILE)) {
    return JSON.parse(fs.readFileSync(MEMBERSHIPS_FILE, 'utf-8'));
  }
  return [];
}

function saveMemberships(memberships: Membership[]) {
  ensureDataDir();
  fs.writeFileSync(MEMBERSHIPS_FILE, JSON.stringify(memberships, null, 2));
}

export function createOrganization(name: string, userId: string): { organization: Organization; membership: Membership } {
  const organizations = getOrganizations();
  
  const slug = name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  
  const organization: Organization = {
    id: 'org_' + Date.now(),
    name,
    slug,
    plan: 'free',
    createdAt: new Date().toISOString(),
  };
  
  organizations.push(organization);
  saveOrganizations(organizations);
  
  const membership: Membership = {
    id: 'member_' + Date.now(),
    organizationId: organization.id,
    userId,
    role: 'owner',
    createdAt: new Date().toISOString(),
  };
  
  const memberships = getMemberships();
  memberships.push(membership);
  saveMemberships(memberships);
  
  return { organization, membership };
}

export function getUserOrganization(userId: string): Organization | null {
  const memberships = getMemberships();
  const membership = memberships.find(m => m.userId === userId);
  
  if (!membership) return null;
  
  const organizations = getOrganizations();
  return organizations.find(o => o.id === membership.organizationId) || null;
}

export function getOrganizationMembers(organizationId: string): Membership[] {
  const memberships = getMemberships();
  return memberships.filter(m => m.organizationId === organizationId);
}

export function addOrganizationMember(organizationId: string, userId: string, role: string = 'member'): Membership {
  const memberships = getMemberships();
  
  const existing = memberships.find(m => m.organizationId === organizationId && m.userId === userId);
  if (existing) {
    return existing;
  }
  
  const membership: Membership = {
    id: 'member_' + Date.now(),
    organizationId,
    userId,
    role,
    createdAt: new Date().toISOString(),
  };
  
  memberships.push(membership);
  saveMemberships(memberships);
  
  return membership;
}

export function removeOrganizationMember(memberId: string) {
  const memberships = getMemberships();
  const filtered = memberships.filter(m => m.id !== memberId);
  saveMemberships(filtered);
}

export function updateMemberRole(memberId: string, role: string) {
  const memberships = getMemberships();
  const membership = memberships.find(m => m.id === memberId);
  if (membership) {
    membership.role = role;
    saveMemberships(memberships);
  }
}
