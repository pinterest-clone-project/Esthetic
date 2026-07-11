type StepIndicatorProps = {
    step: number;
    totalSteps: number;
};

export const StepIndicator = ({ step, totalSteps }: StepIndicatorProps) => {
    const progress = ((step - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="w-full h-1.5 rounded-full bg-[#A1A1A1] overflow-hidden mb-2">
            <div
                className="h-full rounded-full bg-[#22C55E] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};