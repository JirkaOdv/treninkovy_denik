-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "customData" JSONB,
ADD COLUMN     "rpe" INTEGER,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
