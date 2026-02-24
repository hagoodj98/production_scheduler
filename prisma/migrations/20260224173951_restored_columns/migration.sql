-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "resource_name" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" SERIAL NOT NULL,
    "dayMonthYear" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "resourceStatus" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedResource" (
    "id" SERIAL NOT NULL,
    "resource_name" TEXT NOT NULL,

    CONSTRAINT "SelectedResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_resource_name_key" ON "Resource"("resource_name");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedResource_resource_name_key" ON "SelectedResource"("resource_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "SelectedResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
