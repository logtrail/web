<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  const themeStartName = 'theme__';
  const defaultThemeName = 'yellow';

  const theme = `${themeStartName}${process.env.THEME_COLOR || defaultThemeName}`;

  let bodyClasses = (document.body.classList.value).split(' ');

  bodyClasses = bodyClasses
    .filter((currentClass: string) => !currentClass.startsWith(themeStartName));

  bodyClasses.push(theme);
  document.body.classList.add(...bodyClasses);
});
</script>
