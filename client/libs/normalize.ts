function normalizeData(dataArray : expenseType[]) {
  // 1. Use reduce to group and sum the amounts.
  const categorizedAmountsMap = dataArray.reduce((accumulator, currentItem) => {
    const { category, amount } = currentItem;

    // Check if the category already exists in the map
    if (accumulator.has(category)) {
      // If it exists, add the current amount to the existing total
      accumulator.set(category, accumulator.get(category) + amount);
    } else {
      // If it doesn't exist, set the initial amount for the category
      accumulator.set(category, amount);
    }

    return accumulator;
  }, new Map()); // Initialize accumulator as a Map for efficient lookups

  // 2. Convert the Map into the final array format.
  const normalizedArray = Array.from(categorizedAmountsMap, ([category, amount]) => ({
    amount,
    category,
  }));

  return normalizedArray;
}

export { normalizeData };