import { useReducedMotion, useSpring } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import styles from "@/styles/DecoderText.module.css";

const glyphs: string[] =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

interface CharItem {
  type: "glyph" | "value";
  value: string;
}

const CharType = {
  Glyph: "glyph" as const,
  Value: "value" as const,
};

function shuffle(
  content: string[],
  output: CharItem[],
  position: number
): CharItem[] {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length);
      return { type: CharType.Glyph, value: glyphs[rand] };
    }

    return { type: CharType.Glyph, value: output[index].value };
  });
}

interface DecoderTextProps {
  text: string;
  start?: boolean;
  delay?: number;
  className?: string;
  [key: string]: any;
}

export const DecoderText: React.FC<DecoderTextProps> = memo(
  ({ text, start = true, delay = 0, className, ...rest }) => {
    const output = useRef<CharItem[]>([{ type: CharType.Glyph, value: "" }]);
    const container = useRef<HTMLSpanElement>(null);
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      const content = text.split("");

      const renderOutput = () => {
        const characterMap = output.current.map(
          (item) => `<span class="${styles[item.type]}">${item.value}</span>`
        );

        if (containerInstance) {
          containerInstance.innerHTML = characterMap.join("");
        }
      };

      const unsubscribeSpring = decoderSpring.onChange((value) => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = () => {
        setTimeout(() => {
          decoderSpring.set(content.length);
        }, delay);
      };

      if (start && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map((value) => ({
          type: CharType.Value,
          value,
        }));
        renderOutput();
      }

      return () => {
        unsubscribeSpring?.();
      };
    }, [decoderSpring, reduceMotion, start, delay, text]);

    return (
      <span className={styles.text} {...rest}>
        <span aria-hidden className={styles.content} ref={container} />
      </span>
    );
  }
);

DecoderText.displayName = "DecoderText";
