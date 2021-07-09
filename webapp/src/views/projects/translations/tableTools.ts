import { useState, useEffect } from 'react';

export const useResize = (myRef) => {
  const [width, setWidth] = useState(undefined);

  useEffect(() => {
    const handleResize = () => {
      setWidth(myRef.current.offsetWidth);
    };

    if (width === undefined) {
      handleResize();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [myRef]);

  return { width: width || 0 };
};

export const resizeColumn = (
  allSizes: number[],
  index: number,
  newSize: number
) => {
  const oldColumnSize = allSizes[index];
  let newColumnSize = newSize;
  const totalSize = allSizes.reduce((a, b) => a + b, 0);
  const minSize = totalSize / allSizes.length / 2;
  const columnsAfter = allSizes.slice(index + 1);
  const marginsAfter = columnsAfter.map((w) => w - minSize);
  const maxIncrease = marginsAfter.reduce((a, b) => a + b, 0);
  if (newColumnSize < minSize) {
    newColumnSize = minSize;
  } else if (newColumnSize - oldColumnSize > maxIncrease) {
    newColumnSize = oldColumnSize + maxIncrease;
  }
  const columnsBefore = allSizes.slice(0, index);

  const newAfterSizes = marginsAfter.map((w) => {
    const portion = maxIncrease ? w / maxIncrease : 1 / marginsAfter.length;
    return minSize + (w - portion * (newColumnSize - oldColumnSize));
  });
  return [...columnsBefore, newColumnSize, ...newAfterSizes];
};