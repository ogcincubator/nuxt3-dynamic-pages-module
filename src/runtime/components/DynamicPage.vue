<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { useRoute } from '#imports';
import mermaid from "mermaid";
import TableOfContents from "./TableOfContents.vue";

const mainContent = ref<Element>();

const route = useRoute();
const dynamicPage = route.meta.dynamicPage;

if (import.meta.client) {
  watchEffect(() => {
    if (mainContent.value) {
      mermaid.run({
        nodes: mainContent.value!.querySelectorAll('pre.mermaid'),
      });
    }
  });
}
</script>
<template>
  <NuxtLayout contentonly>
    <template #default>
      <div v-if="dynamicPage?.toc" class="toc md:float-right my-2 md:m-5 md:max-w-[550px] text-sm rounded-md shadow-lg p-2">
        <p class="text-ogc-dark-blue font-bold">On this page</p>
        <TableOfContents :element="mainContent"></TableOfContents>
      </div>
      <div ref="mainContent" v-html="dynamicPage?.html">
      </div>
    </template>
  </NuxtLayout>
</template>
