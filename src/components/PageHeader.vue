<script setup lang="ts">
interface Props {

  /** 페이지 대제목. 페이지당 h1 은 반드시 1개. */
  title: string

  /** 제목 위 작은 라벨(선택). */
  eyebrow?: string

  /** 제목 아래 설명 문단. */
  lead?: string
}

defineProps<Props>()
</script>

<template>
  <section class="page-header">
    <VContainer>
      <div class="text-center">
        <p
          v-if="eyebrow"
          class="text-primary font-weight-medium mb-2"
        >
          {{ eyebrow }}
        </p>

        <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
          {{ title }}
        </h1>

        <p
          v-if="lead"
          class="text-body-1 mx-auto"
          style="max-inline-size: 42rem;"
        >
          {{ lead }}
        </p>
      </div>
    </VContainer>
  </section>
</template>

<style lang="scss" scoped>
.page-header {
  padding-block: 6rem 3rem;
}
</style>
