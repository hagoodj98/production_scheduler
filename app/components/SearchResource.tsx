'use client';

import React, { useEffect, useReducer, useState, SubmitEvent } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Notifier, { initialNotifierState, notifierReducer, Severity } from './ui/snackbar';
import { AllPossibleResource } from './types';
import { API_ENDPOINTS } from '../config/api';
import FormHeader from './ui/FormHeader';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const SearchResource: React.FC = () => {
  const router = useRouter();
  const [resourceName, setResourceName] = useState('');
  const [allPossibleResources, setAllPossibleResources] = useState<AllPossibleResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifierState, dispatchNotifier] = useReducer(notifierReducer, initialNotifierState);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resourceName || resourceName.trim().length < 2) {
      dispatchNotifier({ type: 'setNotifierMessage', value: 'Please enter a valid resource name' });
      dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.error });
      dispatchNotifier({ type: 'setOpenNotifier', value: true });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ADD_RESOURCE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_name: resourceName.trim() }),
      });
      if (!response.ok) {
        dispatchNotifier({ type: 'setNotifierMessage', value: 'Failed to add resource' });
        dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.error });
        dispatchNotifier({ type: 'setOpenNotifier', value: true });
        setLoading(false);
        return;
      }

      dispatchNotifier({ type: 'setNotifierMessage', value: 'Resource added. Redirecting...' });
      dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.success });
      dispatchNotifier({ type: 'setOpenNotifier', value: true });
      setTimeout(() => {
        router.push('/');
      }, 3000);
      setResourceName('');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      dispatchNotifier({ type: 'setNotifierMessage', value: 'Could not add resource' });
      dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.error });
      dispatchNotifier({ type: 'setOpenNotifier', value: true });
    }
  };
  useEffect(() => {
    if (!resourceName || resourceName.trim().length === 0) {
      return;
    }
    try {
      const searchResources = async () => {
        const response = await fetch(
          `${API_ENDPOINTS.SEARCH_RESOURCES}?name=${encodeURIComponent(resourceName)}`,
        );
        if (!response.ok) {
          dispatchNotifier({ type: 'setNotifierMessage', value: 'Could not search resources' });
          dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.error });
          dispatchNotifier({ type: 'setOpenNotifier', value: true });
          return;
        }
        const data = await response.json();
        setAllPossibleResources(data.resources);
      };
      searchResources();
    } catch (error) {
      console.error(error);
    }
  }, [resourceName]);

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <FormHeader
        icon={<Inventory2OutlinedIcon />}
        eyebrow="Resource management"
        title="Add a Resource"
        description="Add a resource for production scheduling."
        titleAs="h1"
        className="border-b border-slate-200 border-l-4 border-l-emerald-600 bg-slate-50 px-6 py-5"
      />
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <TextField
            label="Resource name"
            value={resourceName}
            onChange={(e) => {
              const value = e.target.value;
              setResourceName(value);
              if (!value || value.trim().length === 0) {
                setAllPossibleResources([]);
              }
            }}
            fullWidth
            size="small"
          />
          <p className="mt-2 text-sm text-slate-500">
            Use a distinct name so production orders can be assigned clearly.
          </p>
        </div>

        {resourceName.trim().length > 0 && (
          <section aria-label="Matching resources" className="border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">Matching resources</h2>
              {allPossibleResources.length > 0 && (
                <span className="text-xs text-slate-500">
                  {allPossibleResources.length}{' '}
                  {allPossibleResources.length === 1 ? 'match' : 'matches'}
                </span>
              )}
            </div>
            {allPossibleResources.length > 0 ? (
              <ul className="divide-y divide-slate-200 rounded border border-slate-200">
                {allPossibleResources.map((resource) => (
                  <li key={resource.id}>
                    <button
                      className="flex w-full items-center justify-between gap-4 px-3 py-2.5 text-left text-sm text-slate-800 hover:bg-slate-50"
                      type="button"
                      onClick={() => setResourceName(resource.resource_name)}
                    >
                      <span>{resource.resource_name}</span>
                      <span className="shrink-0 text-xs text-slate-500">#{resource.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No existing resources match this name.</p>
            )}
          </section>
        )}

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outlined" color="inherit" onClick={() => router.push('/')}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Adding…' : 'Add Resource'}
          </Button>
        </footer>
      </form>

      <Notifier
        open={notifierState.openNotifier}
        message={notifierState.notifierMessage}
        severity={notifierState.notifierSeverity}
        onClose={() => dispatchNotifier({ type: 'setOpenNotifier', value: false })}
      />
    </div>
  );
};

export default SearchResource;
