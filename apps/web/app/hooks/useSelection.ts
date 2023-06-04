import { useState } from 'react';

type SelectionHook = {
  selectedItems: string[];
  onSelect: (item: string) => void;
};

export const useSelection = (
  initialSelection: string[] = []
): SelectionHook => {
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelection);

  const onSelect = (item: string) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(item)
        ? prevItems.filter((prevItem) => prevItem !== item)
        : [...prevItems, item]
    );
  };

  return {
    selectedItems,
    onSelect,
  };
};
