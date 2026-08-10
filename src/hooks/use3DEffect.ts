import React from 'react';

/**
 * Apply a 3D perspective tilt to a card element based on mouse position.
 * @param e - The mouse event
 * @param maxDeg - Maximum rotation in degrees (default 5)
 */
export function handleMouseMove(
  e: React.MouseEvent<HTMLElement>,
  maxDeg: number = 5
): void {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rotX = ((y - cy) / cy) * -maxDeg;
  const rotY = ((x - cx) / cx) * maxDeg;
  el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  el.style.transition = 'transform 0.05s ease-out';
}

/**
 * Reset a card element's 3D transform on mouse leave.
 */
export function handleMouseLeave(
  e: React.MouseEvent<HTMLElement>
): void {
  const el = e.currentTarget as HTMLElement;
  el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  el.style.transition = 'transform 0.4s ease';
}
