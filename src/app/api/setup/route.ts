import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    
    // Create tables
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Organization" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT UNIQUE NOT NULL,
        "plan" TEXT DEFAULT 'FREE',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "username" TEXT UNIQUE NOT NULL,
        "displayName" TEXT,
        "passwordHash" TEXT NOT NULL,
        "role" TEXT DEFAULT 'user',
        "organizationId" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "OrganizationMember" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        "role" TEXT DEFAULT 'member',
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Customer" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "wechat" TEXT,
        "company" TEXT,
        "position" TEXT,
        "description" TEXT,
        "organizationId" TEXT NOT NULL,
        "ownerId" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CustomerFollowUp" (
        "id" TEXT PRIMARY KEY,
        "customerId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "followUpType" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIChat" (
        "id" TEXT PRIMARY KEY,
        "organizationId" TEXT NOT NULL,
        "customerId" TEXT,
        "title" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIMessage" (
        "id" TEXT PRIMARY KEY,
        "chatId" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    return NextResponse.json({ success: true, message: 'Tables created!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
