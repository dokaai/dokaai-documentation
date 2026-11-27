'use client';

import { useId, useState } from 'react';
import { segmentedControlStyles } from './segmented-control.styles';
import type { SegmentedControlProps } from './segmented-control.types';

/** Native radio inputs provide form submission, focus, and arrow-key navigation. */
export function SegmentedControl({
  items, label, value, defaultValue, onValueChange, name, disabled,
  size = 'md', variant = 'primary', fullWidth = false, className,
}: SegmentedControlProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(() => defaultValue ?? items.find((item) => !item.disabled)?.value);
  const selected = value ?? internalValue;
  const styles = segmentedControlStyles({ size, variant, fullWidth, disabled, className });

  return (
    <fieldset
      disabled={disabled}
      className={styles.root}
    >
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.list}>
        {items.map((item) => (
          <label key={item.value} className={styles.item}>
            <input
              type="radio"
              className={styles.input}
              name={name ?? id}
              value={item.value}
              checked={selected === item.value}
              disabled={item.disabled}
              onChange={() => {
                if (value === undefined) setInternalValue(item.value);
                onValueChange?.(item.value);
              }}
            />
            <span className={styles.option}>
              {item.label}
              {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
