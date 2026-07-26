-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'SR');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "FarmStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('OWNED', 'LEASED', 'BORROWED');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BoundarySource" AS ENUM ('MANUAL', 'GPS', 'GEOSERBIA', 'DRONE');

-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('PLANNED', 'ACTIVE', 'HARVESTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('SOIL_PREPARATION', 'SOWING', 'FERTILIZATION', 'SPRAYING', 'IRRIGATION', 'HARVEST', 'OTHER');

-- CreateEnum
CREATE TYPE "OperationStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IrrigationMethod" AS ENUM ('DRIP', 'SPRINKLER', 'FLOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('KG', 'G', 'T', 'L', 'ML', 'PCS');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('FERTILIZER', 'CHEMICAL', 'SEED', 'BIOSTIMULANT', 'ADDITIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('SOLID', 'LIQUID', 'GAS', 'OTHER');

-- CreateEnum
CREATE TYPE "ChemicalType" AS ENUM ('HERBICIDE', 'INSECTICIDE', 'FUNGICIDE', 'ACARICIDE', 'GROWTH_REGULATOR', 'OTHER');

-- CreateEnum
CREATE TYPE "PhotoEntityType" AS ENUM ('FARM', 'FIELD', 'SEASON', 'OPERATION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "language" "Language" NOT NULL DEFAULT 'SR',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Belgrade',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_members" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "invitedById" TEXT,
    "invitedAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "taxNumber" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "status" "FarmStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parcelNumber" TEXT NOT NULL,
    "cadastralMunicipality" TEXT NOT NULL,
    "municipality" TEXT,
    "area" DECIMAL(10,4) NOT NULL,
    "cultivableArea" DECIMAL(10,4),
    "soilType" TEXT,
    "ownership" "OwnershipType" NOT NULL,
    "status" "FieldStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_boundaries" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "name" TEXT,
    "geometry" JSONB NOT NULL,
    "areaCalculated" DECIMAL(10,4),
    "source" "BoundarySource" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_boundaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latinName" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "crops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "varieties" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fao" TEXT,
    "maturityGroup" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "varieties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "varietyId" TEXT,
    "year" INTEGER NOT NULL,
    "plannedArea" DECIMAL(10,4),
    "actualArea" DECIMAL(10,4),
    "status" "SeasonStatus" NOT NULL DEFAULT 'PLANNED',
    "seasonNumber" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "completedById" TEXT,
    "type" "OperationType" NOT NULL,
    "status" "OperationStatus" NOT NULL DEFAULT 'PLANNED',
    "performedAt" TIMESTAMP(3),
    "plannedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "cost" DECIMAL(12,2),
    "order" INTEGER,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "weatherNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sowings" (
    "operationId" TEXT NOT NULL,
    "seedLot" TEXT,
    "seedRate" DECIMAL(10,2),
    "rowSpacing" DECIMAL(10,2),
    "sowingDepth" DECIMAL(10,2),

    CONSTRAINT "sowings_pkey" PRIMARY KEY ("operationId")
);

-- CreateTable
CREATE TABLE "soil_preparations" (
    "operationId" TEXT NOT NULL,
    "implementName" TEXT,
    "workingDepth" DECIMAL(10,2),
    "passes" INTEGER,

    CONSTRAINT "soil_preparations_pkey" PRIMARY KEY ("operationId")
);

-- CreateTable
CREATE TABLE "irrigations" (
    "operationId" TEXT NOT NULL,
    "method" "IrrigationMethod" NOT NULL,
    "waterAmount" DECIMAL(10,2),
    "durationMinutes" INTEGER,

    CONSTRAINT "irrigations_pkey" PRIMARY KEY ("operationId")
);

-- CreateTable
CREATE TABLE "harvests" (
    "operationId" TEXT NOT NULL,
    "yieldPerHa" DECIMAL(10,2),
    "totalYield" DECIMAL(10,2),
    "moisture" DECIMAL(5,2),
    "hectoliter" DECIMAL(5,2),
    "protein" DECIMAL(5,2),
    "impurities" DECIMAL(5,2),

    CONSTRAINT "harvests_pkey" PRIMARY KEY ("operationId")
);

-- CreateTable
CREATE TABLE "fertilizations" (
    "operationId" TEXT NOT NULL,

    CONSTRAINT "fertilizations_pkey" PRIMARY KEY ("operationId")
);

-- CreateTable
CREATE TABLE "fertilization_items" (
    "id" TEXT NOT NULL,
    "fertilizationId" TEXT NOT NULL,
    "fertilizerId" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" "Unit" NOT NULL,
    "unitPrice" DECIMAL(10,2),

    CONSTRAINT "fertilization_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprayings" (
    "operationId" TEXT NOT NULL,
    "waterAmount" DECIMAL(10,2),
    "temperature" DECIMAL(5,2),
    "humidity" DECIMAL(5,2),
    "windSpeed" DECIMAL(5,2),

    CONSTRAINT "sprayings_pkey" PRIMARY KEY ("operationId")
);

-- CreateTable
CREATE TABLE "spraying_items" (
    "id" TEXT NOT NULL,
    "sprayingId" TEXT NOT NULL,
    "chemicalId" TEXT NOT NULL,
    "dose" DECIMAL(10,2) NOT NULL,
    "unit" "Unit" NOT NULL,
    "unitPrice" DECIMAL(10,2),

    CONSTRAINT "spraying_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" "ProductType" NOT NULL,
    "category" "ProductCategory",
    "manufacturerId" TEXT,
    "registrationNumber" TEXT,
    "activeIngredient" TEXT,
    "description" TEXT,
    "unit" "Unit",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fertilizers" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "nitrogen" DECIMAL(5,2),
    "phosphorus" DECIMAL(5,2),
    "potassium" DECIMAL(5,2),

    CONSTRAINT "fertilizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chemicals" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "ChemicalType" NOT NULL,
    "activeSubstance" TEXT,
    "concentration" TEXT,

    CONSTRAINT "chemicals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "farmId" TEXT,
    "fieldId" TEXT,
    "seasonId" TEXT,
    "operationId" TEXT,
    "url" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "description" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_lastName_idx" ON "users"("lastName");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "farm_members_farmId_idx" ON "farm_members"("farmId");

-- CreateIndex
CREATE INDEX "farm_members_userId_idx" ON "farm_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "farm_members_farmId_userId_key" ON "farm_members"("farmId", "userId");

-- CreateIndex
CREATE INDEX "farms_createdById_idx" ON "farms"("createdById");

-- CreateIndex
CREATE INDEX "farms_name_idx" ON "farms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "fields_farmId_idx" ON "fields"("farmId");

-- CreateIndex
CREATE INDEX "fields_parcelNumber_idx" ON "fields"("parcelNumber");

-- CreateIndex
CREATE INDEX "fields_cadastralMunicipality_idx" ON "fields"("cadastralMunicipality");

-- CreateIndex
CREATE UNIQUE INDEX "fields_farmId_parcelNumber_key" ON "fields"("farmId", "parcelNumber");

-- CreateIndex
CREATE INDEX "field_boundaries_fieldId_idx" ON "field_boundaries"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "crops_name_key" ON "crops"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE INDEX "varieties_cropId_idx" ON "varieties"("cropId");

-- CreateIndex
CREATE UNIQUE INDEX "varieties_companyId_name_key" ON "varieties"("companyId", "name");

-- CreateIndex
CREATE INDEX "seasons_year_idx" ON "seasons"("year");

-- CreateIndex
CREATE INDEX "seasons_cropId_idx" ON "seasons"("cropId");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_fieldId_year_seasonNumber_key" ON "seasons"("fieldId", "year", "seasonNumber");

-- CreateIndex
CREATE INDEX "operations_seasonId_idx" ON "operations"("seasonId");

-- CreateIndex
CREATE INDEX "operations_plannedAt_idx" ON "operations"("plannedAt");

-- CreateIndex
CREATE INDEX "operations_performedAt_idx" ON "operations"("performedAt");

-- CreateIndex
CREATE INDEX "operations_type_idx" ON "operations"("type");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_type_idx" ON "products"("type");

-- CreateIndex
CREATE INDEX "products_manufacturerId_idx" ON "products"("manufacturerId");

-- CreateIndex
CREATE INDEX "photos_farmId_idx" ON "photos"("farmId");

-- CreateIndex
CREATE INDEX "photos_fieldId_idx" ON "photos"("fieldId");

-- CreateIndex
CREATE INDEX "photos_seasonId_idx" ON "photos"("seasonId");

-- CreateIndex
CREATE INDEX "photos_operationId_idx" ON "photos"("operationId");

-- AddForeignKey
ALTER TABLE "farm_members" ADD CONSTRAINT "farm_members_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_members" ADD CONSTRAINT "farm_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_members" ADD CONSTRAINT "farm_members_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_members" ADD CONSTRAINT "farm_members_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_boundaries" ADD CONSTRAINT "field_boundaries_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "varieties" ADD CONSTRAINT "varieties_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "varieties" ADD CONSTRAINT "varieties_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "varieties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sowings" ADD CONSTRAINT "sowings_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soil_preparations" ADD CONSTRAINT "soil_preparations_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "irrigations" ADD CONSTRAINT "irrigations_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fertilizations" ADD CONSTRAINT "fertilizations_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fertilization_items" ADD CONSTRAINT "fertilization_items_fertilizationId_fkey" FOREIGN KEY ("fertilizationId") REFERENCES "fertilizations"("operationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fertilization_items" ADD CONSTRAINT "fertilization_items_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "fertilizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprayings" ADD CONSTRAINT "sprayings_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spraying_items" ADD CONSTRAINT "spraying_items_sprayingId_fkey" FOREIGN KEY ("sprayingId") REFERENCES "sprayings"("operationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spraying_items" ADD CONSTRAINT "spraying_items_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "chemicals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fertilizers" ADD CONSTRAINT "fertilizers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chemicals" ADD CONSTRAINT "chemicals_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
