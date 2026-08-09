/**
 * Plated — Dish Cutout Image Normalisation & Bounding Box Validator
 * Governed by: DESIGN_SYSTEM.md §7 (Photography & Image Normalisation Contract)
 */

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export interface ImageValidationOptions {
  /** Target frame width in pixels (Default: 720) */
  targetWidth?: number;
  /** Target frame height in pixels (Default: 720) */
  targetHeight?: number;
  /** Target contact line percentage of frame height (Default: 86%) */
  targetContactLinePercent?: number;
  /** Contact line tolerance in percentage points (Default: 0.5%) */
  contactLineTolerancePercent?: number;
  /** Maximum allowable file size in bytes (Default: 120 KB = 122880 bytes) */
  maxFileSizeBytes?: number;
  /** Minimum dish cutout height ratio (Default: 45% of frame) */
  minDishHeightRatio?: number;
  /** Maximum dish cutout height ratio (Default: 78% of frame) */
  maxDishHeightRatio?: number;
  /** Horizontal centering tolerance percentage points (Default: 1.5%) */
  horizontalCenterTolerancePercent?: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  imageReady: boolean;
  frameWidth: number;
  frameHeight: number;
  fileSizeBytes: number;
  fileSizeKB: number;
  boundingBox: BoundingBox | null;
  contactLinePercent: number | null;
  horizontalCenterPercent: number | null;
  dishHeightPercent: number | null;
  errors: string[];
}

const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
  targetWidth: 720,
  targetHeight: 720,
  targetContactLinePercent: 86,
  contactLineTolerancePercent: 0.5,
  maxFileSizeBytes: 120 * 1024, // 120 KB
  minDishHeightRatio: 0.45,
  maxDishHeightRatio: 0.78,
  horizontalCenterTolerancePercent: 1.5,
};

/**
 * Computes non-transparent pixel bounding box from raw RGBA pixel data.
 */
export function computeRGBABoundingBox(
  pixels: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 10
): BoundingBox | null {
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alphaIndex = (y * width + x) * 4 + 3;
      const alpha = pixels[alphaIndex];

      if (alpha > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === -1 || maxY === -1) {
    return null; // Entirely transparent image
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Validates a dish cutout asset against Plated's DESIGN_SYSTEM.md §7 contract.
 */
export function validateDishCutout(
  boundingBox: BoundingBox | null,
  frameWidth: number,
  frameHeight: number,
  fileSizeBytes: number,
  userOptions?: ImageValidationOptions
): ImageValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...userOptions };
  const errors: string[] = [];

  // 1. File size check
  const fileSizeKB = Math.round((fileSizeBytes / 1024) * 10) / 10;
  if (fileSizeBytes > opts.maxFileSizeBytes) {
    errors.push(
      `File size (${fileSizeKB}KB) exceeds strict budget floor (${opts.maxFileSizeBytes / 1024}KB).`
    );
  }

  // 2. Frame dimensions check
  if (frameWidth !== opts.targetWidth || frameHeight !== opts.targetHeight) {
    errors.push(
      `Frame dimensions (${frameWidth}x${frameHeight}) must be exact 1:1 square target (${opts.targetWidth}x${opts.targetHeight}).`
    );
  }

  if (!boundingBox) {
    errors.push('No non-transparent dish pixels found (completely transparent image).');
    return {
      isValid: false,
      imageReady: false,
      frameWidth,
      frameHeight,
      fileSizeBytes,
      fileSizeKB,
      boundingBox: null,
      contactLinePercent: null,
      horizontalCenterPercent: null,
      dishHeightPercent: null,
      errors,
    };
  }

  // 3. Contact line anchor at 86% of frame height
  const contactLineY = boundingBox.maxY + 1; // 1-indexed pixel line
  const contactLinePercent = (contactLineY / frameHeight) * 100;
  const contactMin = opts.targetContactLinePercent - opts.contactLineTolerancePercent;
  const contactMax = opts.targetContactLinePercent + opts.contactLineTolerancePercent;

  if (contactLinePercent < contactMin || contactLinePercent > contactMax) {
    errors.push(
      `Contact line anchor (${contactLinePercent.toFixed(2)}%) drifts outside 86.0% ± 0.5% specification (${contactMin.toFixed(1)}% - ${contactMax.toFixed(1)}%).`
    );
  }

  // 4. Horizontal centering (50% ± 1.5%)
  const centerX = (boundingBox.minX + boundingBox.maxX) / 2;
  const horizontalCenterPercent = (centerX / frameWidth) * 100;
  const centerMin = 50 - opts.horizontalCenterTolerancePercent;
  const centerMax = 50 + opts.horizontalCenterTolerancePercent;

  if (horizontalCenterPercent < centerMin || horizontalCenterPercent > centerMax) {
    errors.push(
      `Dish horizontal center (${horizontalCenterPercent.toFixed(2)}%) drifts outside 50.0% ± 1.5% target (${centerMin.toFixed(1)}% - ${centerMax.toFixed(1)}%).`
    );
  }

  // 5. Dish cutout scale/height bounds (45% - 78%)
  const dishHeightPercent = (boundingBox.height / frameHeight) * 100;
  const minHeightPercent = opts.minDishHeightRatio * 100;
  const maxHeightPercent = opts.maxDishHeightRatio * 100;

  if (dishHeightPercent < minHeightPercent) {
    errors.push(
      `Dish cutout height (${dishHeightPercent.toFixed(1)}%) is too small (minimum ${minHeightPercent}% required).`
    );
  } else if (dishHeightPercent > maxHeightPercent) {
    errors.push(
      `Dish cutout height (${dishHeightPercent.toFixed(1)}%) is too large (maximum ${maxHeightPercent}% allowed).`
    );
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    imageReady: isValid,
    frameWidth,
    frameHeight,
    fileSizeBytes,
    fileSizeKB,
    boundingBox,
    contactLinePercent: Math.round(contactLinePercent * 100) / 100,
    horizontalCenterPercent: Math.round(horizontalCenterPercent * 100) / 100,
    dishHeightPercent: Math.round(dishHeightPercent * 100) / 100,
    errors,
  };
}
