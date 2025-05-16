import { Suspense } from "react";

import PlantUploader from "./components/plant-uploader";
import { PlantIdentificationSkeleton } from "./components/plant-identification";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-green-800 dark:text-green-300 mb-8">
          Plant Health Assistant
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Upload a photo or video of your plant to identify its species and get
          personalized care recommendations.
        </p>

        <div className="max-w-4xl mx-auto">
          <PlantUploader />

          <Suspense fallback={<PlantIdentificationSkeleton />}>
            {/* Plant identification results will appear here */}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
