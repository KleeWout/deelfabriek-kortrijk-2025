// Background gradients
export const BACKGROUND_GRADIENTS = [
  "bg-gradient-green",
  "bg-gradient-purple", 
  "bg-gradient-yellow", 
  "bg-gradient-teal", 
  "bg-gradient-red", 
  "bg-gradient-salmon"
];

// /**
//  * Helper function to get the appropriate gradient class for an item based on its ID
//  * @param id - The item ID
//  * @returns The CSS class name for the gradient
//  */
export const getGradientClassForBackground = (id: number): string => {
  return BACKGROUND_GRADIENTS[(id - 1) % BACKGROUND_GRADIENTS.length];
};