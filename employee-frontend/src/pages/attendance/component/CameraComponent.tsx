import AttendanceConfirmationModal from "@/pages/attendance/component/AttendanceConfirmation";
import type { DesignatedArea } from "@/pages/attendance/interface/area";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";
import { ApiError, apiFetch } from "@/utils/FetchHelper";
import { isUserInArea } from "@/utils/haversine";
import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

// --- Constants ---

// --- Type Definitions ---

const CameraComponent: React.FC<{
  locationError?: string | null;
  coords: Coordinates | null;
  area: DesignatedArea | null;
  handleRetry: () => void;
}> = ({
  locationError = null,
  coords,
  handleRetry,
  area,
}): React.ReactElement => {
  const navigate = useNavigate();
  // --- Refs with explicit types ---
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- State with explicit types ---
  const [finalImage, setFinalImage] = useState<string | null>(null);

  // State to allow manually re-triggering the location fetch
  /**
   * Converts a Data URL string into a File object.
   * @param {string} dataurl - The Data URL string to convert.
   * @param {string} filename - The desired name for the output file.
   * @returns {File} A File object.
   */
  function dataURLtoFile(dataurl: string, filename: string): File {
    // Split the Data URL to get the data and MIME type
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch) {
      throw new Error("Invalid Data URL: MIME type not found.");
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]); // Decode the base64 string
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // Convert the binary string to a typed array
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Create and return the File object
    return new File([u8arr], filename, { type: mime });
  }

  // Get user's location when the component mounts or when retried

  // The main function to capture image and add overlay
  const captureAndOverlay = useCallback(() => {
    // --- Null Safety Checks ---
    if (!webcamRef.current || !canvasRef.current || !coords) {
      // Using console.error instead of alert for better debugging
      console.error("Camera, canvas, or location not available for capture.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("Could not capture an image from the webcam.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas 2D context.");
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the captured image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Prepare text and styling
      const timestamp = new Date().toLocaleString();
      const coordinatesText = `Lat: ${coords.lat.toFixed(
        5
      )}, Lon: ${coords.lon.toFixed(5)}`;

      ctx.font = "24px Arial";
      ctx.textAlign = "left";

      // Add a semi-transparent background for better readability
      const textPadding = 10;
      const textHeight = 80;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, canvas.height - textHeight, canvas.width, textHeight);

      // Draw the text on the canvas
      ctx.fillStyle = "white";
      ctx.fillText(timestamp, textPadding, canvas.height - 45);
      ctx.fillText(coordinatesText, textPadding, canvas.height - 15);

      // Convert canvas to a new image and set state
      setFinalImage(canvas.toDataURL("image/jpeg"));
    };

    img.src = imageSrc;
    // Coords is the only state dependency for this callback.
  }, [coords]);

  const handleRetake = () => {
    setFinalImage(null);
  };

  async function submitAttendance(finalImages: string, coords: Coordinates) {
    const attendanceImages = dataURLtoFile(finalImages, "image.jpeg");
    // 1. Create a new FormData object.
    // This is the standard way to prepare data for a multipart/form-data request.
    const formData = new FormData();

    // 2. Append the required fields to the FormData object.
    // The keys ('latitude', 'longitude', 'file') must match what your API expects.
    formData.append("latitude", String(coords.lat));
    formData.append("longitude", String(coords.lon));
    formData.append("file", attendanceImages);

    try {
      console.log("Submitting attendance...");
      // 3. Call apiFetch with the FormData object as the payload.
      // The helper will handle setting the correct headers.
      const response = await apiFetch("/checkin", {
        method: "POST",
        auth: true,
        payload: formData, // Pass the formData here
      });

      console.log("Attendance submitted successfully! ✅", response);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error (${error.status}):`, error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      // Optionally re-throw or return an error state
      throw error;
    }
  }

  async function handleConfirm() {
    if (!finalImage || !coords) {
      return;
    }
    const response = await submitAttendance(finalImage, coords);
    if (response) {
      setFinalImage(null);
      navigate("/");
    }
  }
  return (
    <div className="min-h-[80vh] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg flex flex-col items-center justify-between p-6">
      {finalImage ? (
        // --- VIEW 2: SHOW FINAL IMAGE ---
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <img
            src={finalImage}
            alt="Captured with geotag"
            className="rounded-lg shadow-2xl shadow-purple-500/50 max-w-full md:max-w-2xl border-4 border-gray-700"
          />
          <button
            onClick={handleRetake}
            className="mt-4 inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <path d="M22 4V2L20 4" />
              <path d="M7 11v-1a4 4 0 0 1 4-4h2" />
            </svg>
            Take Another Picture
          </button>
        </div>
      ) : (
        // --- VIEW 1: SHOW WEBCAM AND CAPTURE BUTTON ---
        <div className="w-full min-h-full max-w-2xl flex flex-col items-center gap-6">
          <div className="relative min-h-4/5 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-gray-700">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center backdrop-blur-sm">
              {locationError ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <p className="text-red-400 font-semibold">
                    <span className="font-bold">Error:</span> {locationError}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : coords ? (
                <p className="text-green-400 font-semibold animate-pulse">
                  📍 Location Locked: {coords.lat.toFixed(2)},{" "}
                  {coords.lon.toFixed(2)}
                </p>
              ) : (
                <p className="text-gray-300 animate-pulse">
                  🛰️ Acquiring location...
                </p>
              )}
            </div>
          </div>
          <button
            onClick={captureAndOverlay}
            disabled={!(coords && area && isUserInArea(coords, area))}
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/50 transform hover:scale-105"
          >
            <svg
              className="w-8 h-8 group-hover:animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="white"
              strokeWidth="2"
            >
              <path
                d="M15.5 12.5C15.5 14.433 13.933 16 12 16C10.067 16 8.5 14.433 8.5 12.5C8.5 10.567 10.067 9 12 9C13.933 9 15.5 10.567 15.5 12.5Z"
                strokeMiterlimit="10"
              />
              <path
                d="M5 21H19C20.1046 21 21 20.1046 21 19V8C21 6.89543 20.1046 6 19 6H16L14.5 3H9.5L8 6H5C3.89543 6 3 6.89543 3 8V19C3 20.1046 3.89543 21 5 21Z"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
            </svg>
            {coords ? "Capture Photo" : "Waiting for Location..."}
          </button>
        </div>
      )}

      {/* Hidden canvas used for processing the image */}
      <canvas ref={canvasRef} className="hidden" />

      {finalImage && coords && (
        <AttendanceConfirmationModal
          open={finalImage !== null}
          finalImage={finalImage}
          onConfirm={handleConfirm}
          onCancel={handleRetake}
        />
      )}
    </div>
  );
};

export default CameraComponent;
