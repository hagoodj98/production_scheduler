import ProductionForm from "@/app/components/ProductionForm";
import React from "react";
import prisma from "@/prisma/client";
export default async function EditOrderForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pendingOrder = await prisma.productionOrder.findUniqueOrThrow({
    where: { id: parseInt(id) },
  });
  const getResourceName = await prisma.selectedResource.findFirstOrThrow({
    where: { id: pendingOrder.resourceId },
  });
  const previousOrder = {
    ...pendingOrder,
    resourceName: getResourceName.resource_name,
  };

  return (
    <div>
      <ProductionForm pendingOrder={previousOrder} />
    </div>
  );
}
