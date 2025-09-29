// LocationSelectorModal.tsx
import React, { useCallback, useState } from "react";
import { Modal } from "antd";
import MapComponent from "@/pages/attendance/component/MapComponent";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";

// Define the shape of the data we'll pass back up on confirmation
interface SelectedLocation {
  latitude: number;
  longitude: number;
}

interface LocationSelectorModalProps {
  open: boolean;
  userLocation: Coordinates | null;
  onConfirm: (location: SelectedLocation) => void; // Callback for when OK is clicked
  onCancel: () => void; // Callback for when Cancel is clicked
}

export default function LocationSelectorModal({
  open,
  userLocation,
  onConfirm,
  onCancel,
}: LocationSelectorModalProps): React.ReactElement {
  // --- STATE IS NOW LOCAL TO THE MODAL ---
  const [choosenCoordinates, setChoosenCoordinates] =
    useState<SelectedLocation | null>(null);

  // 2. Define the callback using useCallback
  const handleLocationSelect = useCallback((coords: Coordinates) => {
    console.log(coords);
    setChoosenCoordinates({
      latitude: coords.lat,
      longitude: coords.lon,
    });
  }, []);
  const handleOk = () => {
    // Only call the confirm callback if a location has been chosen
    if (choosenCoordinates) {
      onConfirm(choosenCoordinates);
    }
  };

  return (
    <Modal
      title="Please Select Your Home Location"
      centered
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      // The disabled logic is now based on the local state
      okButtonProps={{ disabled: !choosenCoordinates }}
      // Keep your responsive width settings
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      destroyOnHidden // Good practice: unmounts children when modal is closed
    >
      <MapComponent
        userLocation={userLocation}
        designatedArea={null} // This map is purely for selection
        onLocationSelect={handleLocationSelect}
      />
    </Modal>
  );
}
