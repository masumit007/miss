export class DataValidator {
  static isFiniteNumber(value: unknown): value is number {
    return (
      typeof value === 'number' &&
      Number.isFinite(value)
    );
  }

  static positiveNumber(value: unknown): value is number {
    return (
      this.isFiniteNumber(value) &&
      value > 0
    );
  }

  static nonNegativeNumber(value: unknown): value is number {
    return (
      this.isFiniteNumber(value) &&
      value >= 0
    );
  }

  static percentage(value: unknown): value is number {
    return (
      this.isFiniteNumber(value) &&
      value >= -100 &&
      value <= 100
    );
  }

  static validOHLC(
    open: number | null,
    high: number | null,
    low: number | null,
    close: number | null
  ): boolean {
    if (
      open === null ||
      high === null ||
      low === null ||
      close === null
    ) {
      return false;
    }

    if (
      open <= 0 ||
      high <= 0 ||
      low <= 0 ||
      close <= 0
    ) {
      return false;
    }

    return (
      high >= open &&
      high >= close &&
      low <= open &&
      low <= close
    );
  }
}