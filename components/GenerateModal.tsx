// components/GenerateModal.tsx
'use client'

// Remove DialogClose and handle closing with the modal state
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GenerateModalProps {
  onConfirm: () => void;
  onClose: () => void; // Add a prop to close the modal
}

export const GenerateModal: React.FC<GenerateModalProps> = ({ onConfirm, onClose }) => {
  const [option, setOption] = useState("option1");

  return (
    <Dialog>
    
      <DialogContent>
        <h2 className="text-lg font-semibold">Generate Options</h2>
        <p className="mb-4">Select one of the options below:</p>
        
        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="generationOption"
              value="option1"
              checked={option === "option1"}
              onChange={() => setOption("option1")}
            />
            <span>Option 1: Basic Generation</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="generationOption"
              value="option2"
              checked={option === "option2"}
              onChange={() => setOption("option2")}
            />
            <span>Option 2: Advanced Generation</span>
          </label>
        </div>

        <Button onClick={onConfirm}>Start Generating</Button>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};
