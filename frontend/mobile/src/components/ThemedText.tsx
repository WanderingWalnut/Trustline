import { Text, TextProps } from 'react-native';

type Props = TextProps & {
  size?: 'sm' | 'md' | 'lg';
  weight?: 'regular' | 'semi' | 'bold';
  dim?: boolean;
};

const sizes = { sm: 14, md: 16, lg: 22 };
const weights = { regular: '400', semi: '600', bold: '700' } as const;

export default function ThemedText({ size='md', weight='regular', dim, style, ...rest }: Props) {
  return (
    <Text
      style={[{ fontSize: sizes[size], fontWeight: weights[weight], color: dim ? '#6b7280' : '#111827' }, style]}
      {...rest}
    />
  );
}
