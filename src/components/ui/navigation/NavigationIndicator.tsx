import { Suspense } from "react";
import NavigationProgress from "@/components/ui/navigation/NavigationProgress";

export default function NavigationIndicator() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress />
    </Suspense>
  );
}
