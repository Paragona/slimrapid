import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MoveDetails, MoveSize } from '@/types/calculator';
import { cn } from "@/lib/utils";

interface MoveSizeOption {
  value: MoveSize;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const moveSizeOptions: readonly MoveSizeOption[] = [
  { value: 'studio', label: 'Studio', description: 'Perfect for a studio apartment', icon: '🏠' },
  { value: '1bed', label: '1 Bedroom', description: 'Suitable for a 1 bedroom apartment', icon: '🛏️' },
  { value: '2bed', label: '2 Bedrooms', description: 'Ideal for a 2 bedroom home', icon: '🏡' },
  { value: '3bed', label: '3 Bedrooms', description: 'Great for a 3 bedroom house', icon: '🏘️' },
  { value: '4bed', label: '4+ Bedrooms', description: 'Best for large homes', icon: '🏰' },
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
          <Label className="text-lg font-semibold text-gray-800">Move Size</Label>
          <TooltipProvider>
            <Tooltip text="Select the size of your move based on number of rooms">
              <TooltipTrigger>
                <Info className="w-4 h-4 text-blue-400 cursor-help hover:text-blue-500 transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                Select the size of your move based on number of rooms
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {moveSizeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={moveDetails.moveSize === option.value ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left font-normal p-4 transition-all duration-200",
                moveDetails.moveSize === option.value 
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white shadow-md translate-y-[-1px]"
                  : "hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-100 hover:border-blue-100 hover:shadow-sm"
              )}
              onClick={() => onMoveDetailsChange({ ...moveDetails, moveSize: option.value as MoveSize })}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl transition-transform duration-200 group-hover:scale-110">{option.icon}</span>
                <div className="flex flex-col items-start">
                <span className="font-medium">{option.label}</span>
                <span className={cn(
                  "text-sm",
                  moveDetails.moveSize === option.value 
                    ? "text-blue-100"
                    : "text-gray-500"
                )}>
                  {option.description}
                </span>
              </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-start gap-2 border-b pb-2">
          <Label className="text-lg font-semibold text-gray-800">Move Date</Label>
          <TooltipProvider>
            <Tooltip text="Select your preferred moving date (weekend and peak season rates may apply)">
              <TooltipTrigger>
                <Info className="w-4 h-4 text-blue-400 cursor-help hover:text-blue-500 transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                Select your preferred moving date (weekend and peak season rates may apply)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Calendar
          value={moveDetails.moveDate instanceof Date ? moveDetails.moveDate : new Date()}
          onChange={(value) => {
            if (value instanceof Date) {
              onMoveDetailsChange({ ...moveDetails, moveDate: value });
            }
          }}
          className="rounded-lg border shadow-sm bg-white p-4"
          minDate={new Date()}
          tileDisabled={({ date }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
      </div>
    </div>
  );
}
