<template>
  <figure class="plot">
    <slot />
    <figcaption v-if="$slots.caption"><slot name="caption" /></figcaption>
  </figure>
</template>

<style scoped>
figure.plot {
  margin: 1.2rem 0;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 1rem 1rem 0.6rem;
  background: var(--card);
  overflow-x: auto;
}
figure.plot :deep(svg) {
  min-width: 520px;
}
figcaption {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--muted);
  margin-top: 0.5rem;
  line-height: 1.5;
}
</style>
