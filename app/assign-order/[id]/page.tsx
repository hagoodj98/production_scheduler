import ProductionForm from '@/app/components/ProductionForm';
import React from 'react';
import { productionOrder, selectedResource } from '@/lib/repositories';
export default async function EditOrderForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pendingOrder = await productionOrder.findByIdOrThrow(parseInt(id));
  const getResourceName = await selectedResource.findByIdOrThrow(pendingOrder.resourceId);
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
