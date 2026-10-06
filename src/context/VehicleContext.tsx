"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface SelectedVehicle {
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  trimId?: string;
  trimName?: string;
  yearId?: string;
  year?: string;
}

interface VehicleContextType {
  selectedVehicle: SelectedVehicle | null;
  setSelectedVehicle: (vehicle: SelectedVehicle | null) => void;
  clearVehicle: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicle, setSelectedVehicleState] = useState<SelectedVehicle | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selected_user_vehicle");
    if (saved) {
      try {
        setSelectedVehicleState(JSON.parse(saved));
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const setSelectedVehicle = (v: SelectedVehicle | null) => {
    setSelectedVehicleState(v);
    if (v) {
      localStorage.setItem("selected_user_vehicle", JSON.stringify(v));
    } else {
      localStorage.removeItem("selected_user_vehicle");
    }
  };

  const clearVehicle = () => {
    setSelectedVehicle(null);
  };

  return (
    <VehicleContext.Provider value={{ selectedVehicle, setSelectedVehicle, clearVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
}
