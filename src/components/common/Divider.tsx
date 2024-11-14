import React, { CSSProperties } from "react";
import styles from "../../styles/divider.module.css";

interface DividerProps {
  lineWidth?: string;
  lineHeight?: string;
  notchWidth?: string;
  notchHeight?: string;
  collapseDelay?: number;
  collapsed?: boolean;
  className?: string;
  style?: CSSProperties;
}

const numToMs = (num: number) => `${num}ms`;

const cssProps = (
  props: Record<string, string | number>,
  style?: CSSProperties
): CSSProperties => {
  const customProperties = Object.entries(props).reduce((acc, [key, value]) => {
    acc[`--${key}`] = typeof value === "number" ? numToMs(value) : value;
    return acc;
  }, {} as Record<string, string>);
  return { ...style, ...customProperties };
};

const Divider: React.FC<DividerProps> = ({
  lineWidth = "100%",
  lineHeight = "2px",
  notchWidth = "90px",
  notchHeight = "10px",
  collapseDelay = 0,
  collapsed = false,
  className,
  style,
  ...rest
}) => (
  <div
    className={`${styles.divider} ${className}`}
    style={cssProps(
      {
        lineWidth,
        lineHeight,
        notchWidth,
        notchHeight,
        collapseDelay,
      },
      style
    )}
    {...rest}>
    <div className={styles.line} data-collapsed={collapsed} />
    <div
      className={styles.notch}
      data-collapsed={collapsed}
      style={cssProps({ collapseDelay: collapseDelay + 160 })}
    />
  </div>
);

export default Divider;
