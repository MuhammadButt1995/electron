/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable import/prefer-default-export */
import { useState } from 'react';

type SelectionHook = {
  selectedItems: string[];
  onSelect: (item: string) => void;
};

export const useMutuallyExclusiveSelection = (
  initialSelection: string[] = [],
  mutuallyExclusiveItems: [string, string]
): SelectionHook => {
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelection);

  const onSelect = (item: string) => {
    setSelectedItems((prevItems) => {
      const [item1, item2] = mutuallyExclusiveItems;

      if (item === item1 || item === item2) {
        if (prevItems.includes(item)) {
          return prevItems.filter((prevItem) => prevItem !== item);
        }
        return prevItems
          .filter((prevItem) => prevItem !== item1 && prevItem !== item2)
          .concat(item);
      }
      return prevItems.includes(item)
        ? prevItems.filter((prevItem) => prevItem !== item)
        : [...prevItems, item];
    });
  };

  return {
    selectedItems,
    onSelect,
  };
};
