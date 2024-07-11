"use client";
import { useTextReading } from "react-read-text";

export const ReadingController = () => {
  const { handleReading, handleStopReading, reading, available } =
    useTextReading();
  const handleClick = () => {
    if (reading) {
      handleStopReading();
    } else {
      handleReading("read-block");
    }
  };

  return (
    <>
      {available && (
        <button onClick={handleClick}>
          {reading ? "Stop reading" : "Start reading"}
        </button>
      )}
    </>
  );
};
