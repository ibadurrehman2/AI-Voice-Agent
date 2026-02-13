import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant } from '../types';
import { MOCK_TENANTS } from '../constants';

interface TenantContextType {
  currentTenant: Tenant;
  availableTenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  createTenant: (name: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with MOCK_TENANTS but keep it in state to allow additions
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(MOCK_TENANTS[0]);

  // Persist tenant selection
  useEffect(() => {
    const savedTenantId = localStorage.getItem('nexus_tenant_id');
    if (savedTenantId) {
      const found = tenants.find((t) => t.id === savedTenantId);
      if (found) setCurrentTenant(found);
    }
  }, [tenants]);

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      localStorage.setItem('nexus_tenant_id', tenantId);
    }
  };

  const createTenant = (name: string) => {
    const newTenant: Tenant = {
      id: `tenant_${Date.now()}`,
      name: name,
      plan: 'Free',
    };
    setTenants((prev) => [...prev, newTenant]);
    setCurrentTenant(newTenant);
    localStorage.setItem('nexus_tenant_id', newTenant.id);
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        availableTenants: tenants,
        switchTenant,
        createTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};