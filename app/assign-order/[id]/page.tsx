import ProductionForm from '@/app/components/ProductionForm';
import React from 'react';
import { productionOrder } from '@/lib/repositories';
export default async function EditOrderForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pendingOrder = await productionOrder.findByIdOrThrow(parseInt(id));
  const employeeAssigneeID = pendingOrder.employeeAssigneeID;
  const previousOrderMeta = {
    ...pendingOrder,
    resourceName: pendingOrder.resource.resource_name,
    employeeAssigneeID,
  };

  return (
    <div>
      <ProductionForm pendingOrder={previousOrderMeta} />
    </div>
  );
}
