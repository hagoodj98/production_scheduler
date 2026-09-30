'use client';

import React, { useEffect, useReducer, useState, SubmitEvent } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';
import Notifier, { initialNotifierState, notifierReducer, Severity } from './ui/snackbar';
import { AllPossibleResource } from './types';
import { API_ENDPOINTS } from '../config/api';

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
          console.error('Failed to search resources');
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
    <div className="my-auto max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Add a Resource</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

        <Divider className="my-4" />
        <List dense>
          {allPossibleResources.length > 0 ? (
            allPossibleResources.map((r) => (
              <ListItem key={r.id} className="justify-between">
                <button
                  className="text-sm text-left w-full hover:underline"
                  type="button"
                  onClick={() => setResourceName(r.resource_name)}
                >
                  {r.resource_name}
                </button>
                <small className="text-xs text-gray-400">#{r.id}</small>
              </ListItem>
            ))
          ) : (
            <p className="text-sm text-gray-500">No matching resources</p>
          )}
        </List>

        <div className="flex gap-3">
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Adding…' : 'Add Resource'}
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => router.push('/')}>
            Back
          </Button>
        </div>
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
