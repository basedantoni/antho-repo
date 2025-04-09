import { ReactElement, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

// Define theme type
type Theme = {
  colors: {
    primary: string;
    secondary: string;
    destructive: string;
    onPrimary: string;
    onSecondary: string;
    onDestructive: string;
    onSurfaceDisabled: string;
  };
};

export interface ButtonProps {
  label: string;
  mode: 'primary' | 'secondary' | 'destructive' | 'text';
  state?: 'default' | 'hovered' | 'pressed' | 'focused' | 'disabled';
  disabled?: boolean;
  showIcon?: boolean;
  icon?: ReactElement;
  onPress?: (e: GestureResponderEvent) => void;
}

export default function Button({
  label,
  mode,
  state,
  disabled,
  showIcon,
  icon,
  onPress,
}: ButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  const _modePrimary = mode === 'primary';
  const _modeSecondary = mode === 'secondary';
  const _modeDestructive = mode === 'destructive';
  const _modeText = mode === 'text';

  const _stateDisabled = state === 'disabled' || disabled;
  const _stateHovered = state === 'hovered';
  const _statePressed = state === 'pressed';
  const _stateFocused = state === 'focused';

  const $styles = useMemo(() => {
    const rootStyle: ViewStyle = {
      ...styles.root,
      ...(_modePrimary && styles.primary),
      ...(_modeSecondary && styles.secondary),
      ...(_modeDestructive && styles.destructive),
      ...(_modeText && styles.text),
      ...(_stateDisabled && styles.disabled),
      ...(_stateHovered && styles.hovered),
      ...(_statePressed && styles.pressed),
      ...(_stateFocused && styles.focused),
    };

    const getLabelStyle = (state: PressableStateCallbackType): TextStyle => {
      return {
        ...styles.label,
        ...(_modePrimary && styles.primaryLabel),
        ...(_modeSecondary && styles.secondaryLabel),
        ...(_modeDestructive && styles.destructiveLabel),
        ...(_modeText && styles.textLabel),
        ...(_stateDisabled && styles.disabledLabel),
        ...(_stateHovered && styles.hoveredLabel),
        ...(_statePressed && styles.pressedLabel),
        ...(_stateFocused && styles.focusedLabel),
      };
    };

    return {
      root: rootStyle,
      label: getLabelStyle,
    };
  }, [
    styles,
    mode,
    state,
    _modePrimary,
    _modeSecondary,
    _modeDestructive,
    _modeText,
    _stateDisabled,
    _stateHovered,
    _statePressed,
    _stateFocused,
  ]);

  return (
    <Pressable style={$styles.root} onPress={onPress} disabled={_stateDisabled}>
      {(e: PressableStateCallbackType) => (
        <>
          {showIcon && icon}
          <Text style={$styles.label(e)}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme: Theme) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  destructive: {
    backgroundColor: theme.colors.destructive,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  hovered: {
    opacity: 0.9,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  focused: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryLabel: {
    color: theme.colors.secondary,
  },
  secondaryLabel: {
    color: theme.colors.primary,
  },
  destructiveLabel: {
    color: theme.colors.secondary,
  },
  textLabel: {
    color: theme.colors.primary,
  },
  disabledLabel: {
    color: theme.colors.onSurfaceDisabled,
  },
  hoveredLabel: {},
  pressedLabel: {},
  focusedLabel: {},
}));
