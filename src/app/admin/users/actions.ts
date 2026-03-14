"use server";

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    }
  } catch (e) {}
  return []
}

function saveUsers(users: any[]) {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

function getSubscriptions() {
  try {
    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'))
    }
  } catch (e) {}
  return []
}

function saveSubscriptions(subs: any[]) {
  const dir = path.dirname(SUBSCRIPTIONS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2))
}

export async function getAllUsers() {
  const users = getUsers();
  return users.map(u => ({
    id: u.id,
    username: u.username,
    display_name: u.displayName,
    email: null,
    role: u.role,
    created_at: u.createdAt,
  }));
}

export async function updateUserRole(userId: string, role: string) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.role = role;
    saveUsers(users);
    return { ok: true, error: null };
  }
  return { ok: false, error: 'User not found' };
}

export async function createSubscriptionForUser(userId: string, planCode: string) {
  const subscriptions = getSubscriptions();
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const subscription = {
    id: 'sub_' + Date.now(),
    user_id: userId,
    plan_code: planCode,
    plan_name: planCode === 'personal' ? '个人版' : planCode === 'team' ? '团队版' : '私有部署版',
    status: 'active',
    starts_at: now,
    expires_at: expires,
    created_at: now,
  };
  
  subscriptions.push(subscription);
  saveSubscriptions(subscriptions);
  
  return { ok: true, error: null };
}
