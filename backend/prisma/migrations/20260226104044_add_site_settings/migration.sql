-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" SERIAL NOT NULL,
    "headerType" TEXT NOT NULL DEFAULT 'logo',
    "logo" TEXT NOT NULL DEFAULT '',
    "favicon" TEXT NOT NULL DEFAULT '',
    "playStoreLink" TEXT NOT NULL DEFAULT '',
    "appStoreLink" TEXT NOT NULL DEFAULT '',
    "primaryColor" TEXT NOT NULL DEFAULT '#10b981',
    "secondaryColor" TEXT NOT NULL DEFAULT '#059669',
    "marqueeEntries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
