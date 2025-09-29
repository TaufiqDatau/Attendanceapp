import React from "react";
import { Modal } from "antd";

interface AttendanceConfirmationModalProps {
  /** Controls the visibility of the modal */
  open: boolean;
  /** The base64 data URL of the final image with timestamp and coordinates */
  finalImage: string | null;
  /** Callback function executed when the user clicks the "OK" or confirm button */
  onConfirm: () => void;
  /** Callback function executed when the user clicks the "Cancel" button or closes the modal */
  onCancel: () => void;
}

/**
 * A modal component to display the final captured attendance photo
 * for user confirmation before submission.
 */
export default function AttendanceConfirmationModal({
  open,
  finalImage,
  onConfirm,
  onCancel,
}: AttendanceConfirmationModalProps): React.ReactElement {
  // The handleOk function simply calls the onConfirm prop.
  // No internal state is needed for this confirmation step.
  const handleOk = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Confirm Your Attendance"
      centered
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      // The OK button is disabled until the final image is ready and passed in.
      okButtonProps={{ disabled: !finalImage }}
      okText="Submit" // More descriptive text for the confirmation button
      // Responsive width settings are kept for consistency.
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      destroyOnHidden // Unmounts children when modal is closed to free up resources.
    >
      {/* The main content of the modal.
        It displays the final image if it exists, otherwise it shows nothing.
      */}
      {finalImage ? (
        <div style={{ textAlign: "center" }}>
          <img
            src={finalImage}
            alt="Attendance confirmation"
            style={{
              maxWidth: "100%",
              maxHeight: "60vh", // Prevents the image from being too tall on large screens
              height: "auto",
              borderRadius: "8px", // A little styling to match modern UI
              objectFit: "contain",
            }}
          />
          <p style={{ marginTop: "16px", color: "#555" }}>
            Please review your photo and details before submitting.
          </p>
        </div>
      ) : (
        // You could put a loading spinner here if the image generation takes time
        <div>Loading image...</div>
      )}
    </Modal>
  );
}
