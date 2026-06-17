-- CreateTable
CREATE TABLE "institute_profile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "instituteName" TEXT NOT NULL DEFAULT '',
    "ownerName" TEXT NOT NULL DEFAULT '',
    "designation" TEXT NOT NULL DEFAULT 'DIRECTOR',
    "email" TEXT NOT NULL DEFAULT '',
    "dob" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL DEFAULT '',
    "alternateMobile" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT 'Tamil Nadu',
    "city" TEXT NOT NULL DEFAULT '',
    "pincode" TEXT NOT NULL DEFAULT '',
    "controllerName" TEXT NOT NULL DEFAULT '',
    "showController" BOOLEAN NOT NULL DEFAULT false,
    "showDirector" BOOLEAN NOT NULL DEFAULT false,
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "signatureUrl" TEXT NOT NULL DEFAULT '',
    "controllerSignatureUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_profile_pkey" PRIMARY KEY ("id")
);
