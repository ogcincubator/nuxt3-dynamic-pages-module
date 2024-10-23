<script setup lang="ts">
import type {TocItem} from "~/lib/ogc/toc";

const props = defineProps({
  list: Array<TocItem>,
});

const scrollTo = (element: Element) => {
  element.scrollIntoView();
};
</script>
<template>
  <ul class="toc-list">
    <li v-for="item of list">
      <a :href="`#${item.id}`" @click.prevent="scrollTo(item.element)">{{ item.label }}</a>
      <TableOfContentsList v-if="item?.children?.length" :list="item.children"></TableOfContentsList>
    </li>
  </ul>
</template>
<style scoped>
.toc-list {
  margin: 0;
}
</style>