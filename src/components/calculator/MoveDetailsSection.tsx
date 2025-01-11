import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Info } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";
import { MoveDetails } from '@/types/calculator';
import { cn } from "@/lib/utils";

interface MoveSizeOption {
  value: string;
  label: string;
  description: string;
}

const moveSizeOptions: MoveSizeOption[] = [
  { value: 'studio', label: 'Studio', description: 'Perfect for a studio apartment' },
  { value: '1bed', label: '1 Bedroom', description: 'Suitable for a 1 bedroom apartment' },
  { value: '2bed', label: '2 Bedrooms', description: 'Ideal for a 2 bedroom home' },
  { value: '3bed', label: '3 Bedrooms', description: 'Great for a 3 bedroom house' },
  { value: '4bed', label: '4+ Bedrooms', description: 'Best for large homes' },
];

interface MoveDetailsSectionProps {
  moveDetails: MoveDetails;
  onMoveDetailsChange: (details: MoveDetails) => void;
  expanded: boolean;
}

export function MoveDetailsSection({
  moveDetails,
  onMoveDetailsChange,
  expanded
}: MoveDetailsSectionProps) {
  if (!expanded) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base">Move Size</Label>
          <Tooltip text="Select the size of your move based on number of rooms">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {moveSizeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={moveDetails.moveSize === option.value ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                "hover:bg-blue-50 hover:text-blue-600",
                moveDetails.moveSize === option.value && "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              )}
              onClick={() => onMoveDetailsChange({ ...moveDetails, moveSize: option.value })}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base">Move Date</Label>
          <Tooltip text="Select your preferred moving date (weekend and peak season rates may apply)">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <Calendar
          mode="single"
          selected={moveDetails.moveDate}
          onSelect={(date) => date && onMoveDetailsChange({ ...moveDetails, moveDate: date })}
          className="rounded-md border shadow-sm bg-white"
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </div>
    </div>
  );
}
