import { Deal } from '../types';

// 1. Define our simple data types
type DataPoint = {
  features: number[];
  label: string; // Product Category
};

// 2. STATIC DATASET (Hardcoded Historical Deals)
// We pre-train the model using this static dataset instead of dynamic CRM data.
// Feature: [Deal Value] -> Label: Recommended Product Category
const staticDataset: DataPoint[] = [
  // Low Budgets -> Support
  { features: [25000], label: 'Support' },
  { features: [45000], label: 'Support' },
  { features: [50000], label: 'Support' },

  // Medium Budgets -> Consulting
  { features: [150000], label: 'Consulting' },
  { features: [300000], label: 'Consulting' },
  { features: [450000], label: 'Consulting' },

  // High Budgets -> Software
  { features: [1000000], label: 'Software' },
  { features: [5000000], label: 'Software' },
  { features: [10000000], label: 'Software' },
];

let trainingData: DataPoint[] = staticDataset;
const K_NEIGHBORS = 3;

// 3. Define the Euclidean distance function
// This calculates the straight-line distance between two feature arrays
function euclideanDistance(point1: number[], point2: number[]): number {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    sum += Math.pow(point1[i] - point2[i], 2);
  }
  return Math.sqrt(sum);
}

// 4. Implement the KNN algorithm
// We no longer train dynamically. The model ONLY uses the static dataset above.
function trainKNN(historicalDeals: Deal[]) {
  // Intentionally left blank. 
  // We ignore real-time CRM data and rely purely on the static dataset.
}

function predictKNN(newDeal: Deal): string | null {
  if (trainingData.length === 0) return null;

  // Step A: Extract features for the new deal (Just Deal Value)
  const newFeatures = [newDeal.deal_value];

  // Step B: Calculate distances to all points in static training data
  const distances = trainingData.map(point => {
    return {
      label: point.label,
      distance: euclideanDistance(point.features, newFeatures)
    };
  });

  // Step C: Sort by distance (closest first)
  distances.sort((a, b) => a.distance - b.distance);

  // Step D: Take the top K nearest neighbors
  const nearestNeighbors = distances.slice(0, K_NEIGHBORS);

  // Step E: Count the category votes
  const labelCounts: Record<string, number> = {};
  for (const neighbor of nearestNeighbors) {
    labelCounts[neighbor.label] = (labelCounts[neighbor.label] || 0) + 1;
  }

  // Step F: Find the category with the most votes
  let bestLabel = "";
  let maxVotes = 0;
  
  for (const [label, count] of Object.entries(labelCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      bestLabel = label;
    }
  }

  return bestLabel;
}

// 5. Export an object that matches the shape expected by the app
export const leadPredictor = {
  train: trainKNN,
  predict: predictKNN
};

// Exporting a wrapper class just in case it's used as a type elsewhere
export class LeadPredictorKNN {
  train(deals: Deal[]) { trainKNN(deals); }
  predict(deal: Deal) { return predictKNN(deal); }
}
