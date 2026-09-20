<template>
  <p class="aside"><slot /></p>
</template>

<style scoped>
.aside {
  border-left: 2px solid var(--line2);
  padding: 0.2rem 0 0.2rem 1rem;
  margin: 1rem 0;
  color: var(--muted);
  font-size: 15px;
  max-width: 65ch;
}
</style>
