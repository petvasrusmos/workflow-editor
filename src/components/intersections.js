 export function findRectanglesIntersection(rectangles) {
    const len = rectangles.length;
  
    if (len < 2) {
      return false;
    }
  
    const intersections = [];
  
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        const rectA = rectangles[i];
        const rectB = rectangles[j];
  
        const aHalfWidth = rectA.rect.width / 2;
        const aHalfHeight = rectA.rect.height / 2;
        const aLeft = rectA.position.x - aHalfWidth;
        const aRight = rectA.position.x + aHalfWidth;
        const aTop = rectA.position.y - aHalfHeight;
        const aBottom = rectA.position.y + aHalfHeight;
  
        const bHalfWidth = rectB.rect.width / 2;
        const bHalfHeight = rectB.rect.height / 2;
        const bLeft = rectB.position.x - bHalfWidth;
        const bRight = rectB.position.x + bHalfWidth;
        const bTop = rectB.position.y - bHalfHeight;
        const bBottom = rectB.position.y + bHalfHeight;
  
        const xOverlap = Math.max(0, Math.min(aRight, bRight) - Math.max(aLeft, bLeft));
        const yOverlap = Math.max(0, Math.min(aBottom, bBottom) - Math.max(aTop, bTop));
  
        if (xOverlap && yOverlap) {
          intersections.push({
            rectA,
            rectB,
            intersection: {
              position: {
                x: Math.max(aLeft, bLeft) + xOverlap / 2,
                y: Math.max(aTop, bTop) + yOverlap / 2,
              },
              rect: {
                width: xOverlap,
                height: yOverlap,
              },
            },
          });
        }
      }
    }
  
    if (intersections.length === 0) {
      return false;
    }
  
    return intersections;
  }

  
  export default function distributeRectangles(rectangles, centerX, gap = 10 ) {
    console.log(rectangles, 'before')
    const rectangleCount = rectangles.length;
  const totalWidth = rectangles.reduce((total, rectangle) => total + rectangle.width, 0) + gap * (rectangleCount - 1);

  // Проверка, является ли количество прямоугольников четным
  const isEven = rectangleCount % 2 === 0;

  const centerIndex = isEven ? rectangleCount / 2 : Math.floor(rectangleCount / 2);

  // Установка начальной координаты x и левой границы
  let startX = centerX - (totalWidth / 2);
  let leftBoundary = centerX;

  for (let i = centerIndex - 1; i >= 0; i--) {
    const rectangle = rectangles[i];
    const prevRect = rectangles[i + 1];
    const left = leftBoundary - prevRect.width / 2 - gap - rectangle.width / 2;
    rectangle.x = left + rectangle.width / 2;
    // rectangle.y = rectangle.top + rectangle.height / 2;
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

  // Проверка, пересекаются ли прямоугольники
  const isIntersecting = rectangles.some((rectangle, index) => {
    if (index === 0) {
      return false;
    }
    const prevRect = rectangles[index - 1];
    return rectangle.left < prevRect.right + gap;
  });

  // Если прямоугольники пересекаются, сдвигаем их
  if (isIntersecting) {
    const overlap = Math.abs(leftBoundary - rightBoundary) + gap;
    const shift = overlap / 2;
    startX += shift;
    for (let i = 0; i < rectangleCount; i++) {
      const rectangle = rectangles[i];
      rectangle.x += shift;
    }
  }

  // Установка координат x и y для каждого прямоугольника
  let x = startX;
  for (let i = 0; i < rectangleCount; i++) {
    const rectangle = rectangles[i];
    rectangle.x = x + (rectangle.width / 2);
    // rectangle.y = rectangle.top + (rectangle.height / 2);
    x += rectangle.width + gap;
  }

    console.log(rectangles, 'after')
    
    return rectangles;
  }
