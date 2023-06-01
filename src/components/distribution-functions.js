
function distributeRectanglesTowardRight(rectangles, gap = 10) {
  console.log(rectangles, 'rect')
  rectangles.forEach((rectangle, index) => {
    if (index !== 0) {
      rectangle.x = rectangles[index - 1].x + rectangles[index - 1].width + gap
      rectangle.y = rectangles[index - 1].y

    }
  });
  return rectangles
}
function distributeRectangles(rectangles, centerX, gap = 10 ) {
  const rectangleCount = rectangles.length;
  const totalWidth = rectangles.reduce((total, rectangle) => total + rectangle.width, 0) + gap * (rectangleCount - 1);
  const isEven = rectangleCount % 2 === 0;
  const centerIndex = isEven ? rectangleCount / 2 : Math.floor(rectangleCount / 2);
  let startX = centerX - (totalWidth / 2);
  let leftBoundary = centerX;
  for (let i = centerIndex - 1; i >= 0; i--) {
    const rectangle = rectangles[i];
    const prevRect = rectangles[i + 1];
    const left = leftBoundary - prevRect.width / 2 - gap - rectangle.width / 2;
    rectangle.x = left + rectangle.width / 2;
    leftBoundary = left;
  }
  let rightBoundary = centerX;
  for (let i = centerIndex; i < rectangleCount; i++) {
    const rectangle = rectangles[i];
    const prevRect = rectangles[i - 1];
    const left = rightBoundary + gap + prevRect.width / 2;
    rectangle.x = left + rectangle.width / 2;
    rightBoundary = left + rectangle.width / 2;
  }
  let x = startX;
  for (let i = 0; i < rectangleCount; i++) {
    const rectangle = rectangles[i];
    rectangle.x = x + (rectangle.width / 2);
    x += rectangle.width + gap;
  }
  const isIntersecting = rectangles.some((rectangle, index) => {
    if (index + 1 === rectangles.length) return false;
    const nextRect = rectangles[index + 1];
    const rectangleRight = rectangle.x + rectangle.width + gap;
    const isInetersect = rectangleRight > nextRect.x;
    if (isInetersect) {
      const overlap = rectangleRight - nextRect.x;
      rectangle.x -= overlap;
    }  
    return isInetersect;
  });
  console.log(isIntersecting)
  return rectangles;
}

export { distributeRectangles, distributeRectanglesTowardRight }