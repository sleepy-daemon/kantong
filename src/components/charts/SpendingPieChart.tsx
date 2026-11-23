import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '@/theme';

interface Slice {
  key: string;
  value: number;
  color: string;
}

interface Props {
  slices: Slice[];
  size?: number;
  centerLabel: string;
  centerValue: string;
}

const STROKE = 26;
const GAP = 2; // px gap between segments

/** Donut chart built from stroked circle arcs — no charting library needed. */
export function SpendingPieChart({ slices, size = 220, centerLabel, centerValue }: Props) {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((s, x) => s + x.value, 0);
  const showGaps = slices.length > 1;

  let offset = 0;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.border} strokeWidth={STROKE} fill="none" />
          {total > 0 &&
            slices.map((slice) => {
              const length = (slice.value / total) * circumference;
              const visible = Math.max(length - (showGaps ? GAP : 0), 0);
              const el = (
                <Circle
                  key={slice.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${visible} ${circumference - visible}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += length;
              return el;
            })}
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.centerLabel}>{centerLabel}</Text>
        <Text style={styles.centerValue} numberOfLines={1} adjustsFontSizeToFit>
          {centerValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', paddingHorizontal: STROKE + 12 },
  centerLabel: { fontSize: 12, color: colors.textDim, marginBottom: 2 },
  centerValue: { fontSize: 18, fontWeight: '800', color: colors.text },
});
