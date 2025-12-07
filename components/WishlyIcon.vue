<template>
  <div class="felx-row flex items-center gap-2">
    <Icon :name="props.name" :color="props.color" :size="props.size" class="inline-block" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

/**
 * IconProps interface defines the properties for the Icon component.
 * It includes the icon name, dimensions, viewBox, and color.
 * @interface WishlyIconProps
 * @property {string} name - The name of the icon to be displayed.
 * @property {number|string} [size=24] - The size of the icon, default is 24.
 * @property {string} [color='currentColor'] - The color of the icon, default is 'currentColor'.
 */
type WishlyIconProps = {
  name: string
  size?: number | string
  color?: string
}

/**
 * Props definition with strict typing.
 * @constant {WishlyIconProps}
 */
const props: WishlyIconProps = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  color: {
    type: String as PropType<string>,
    default: 'currentColor',
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 24,
  },
})
</script>
