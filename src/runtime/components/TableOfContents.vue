<script setup lang="ts">
import {watchEffect} from 'vue';
import type {TocItem} from '../../lib/toc';
import TableOfContentsList from "./TableOfContentsList.vue";

const props = defineProps({
  element: Object,
});

const tocItems: Array<TocItem> = [];

watchEffect(() => {
  tocItems.length = 0;
  if (!props.element) {
    return;
  }
  let currentItemList = tocItems,
    parentItemList: Array<TocItem> | null = null,
    lastItem: TocItem | null = null;

  const headings: Array<HTMLElement> = props.element!.querySelectorAll('h1, h2, h3');
  for (const heading of headings) {
    if (!heading.textContent || 'skipToc' in heading.dataset) {
      continue;
    }
    const newItem: TocItem = {
      label: heading.textContent,
      id: heading.id,
      element: heading,
    };
    const cmp = !lastItem ? 0 : heading.tagName.localeCompare(lastItem.element.tagName);
    if (cmp > 0) {
      lastItem!.children = [];
      parentItemList = currentItemList;
      currentItemList = lastItem!.children;
    } else if (cmp < 0 && parentItemList) {
      currentItemList = parentItemList!;
    }
    currentItemList.push(newItem);
    lastItem = newItem;
  }
});
</script>
<template>
  <TableOfContentsList v-if="tocItems?.length" :list="tocItems"></TableOfContentsList>
</template>
