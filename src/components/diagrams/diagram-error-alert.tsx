import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface props {
  error: string;
  className?: string;
}

export function DiagramErrorAlert({ error, className }: props) {
  return (
    <Alert variant="default" className={`bg-red-500 text-white ${className}`}>
      <AlertCircle className="h-4 w-4" color="white" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </AlertDescription>
    </Alert>
  );
}
