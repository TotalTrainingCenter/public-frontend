<script setup lang="ts">
interface Props {
  page: number
  itemsPerPage: number
  totalItems: number
}

interface Emit {
  (e: 'update:page', value: number): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updatePage = (value: number) => {
  emit('update:page', value)
}

/** 지금 화면에 보이는 구간. 마지막 쪽은 전체 수를 넘지 않게 자른다. */
const paginationRange = computed(() => ({
  start: (props.page - 1) * props.itemsPerPage + 1,
  end: Math.min(props.page * props.itemsPerPage, props.totalItems),
}))
</script>

<template>
  <div>
    <VDivider />

    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 px-6 py-3">
      <!--
        ⚠️ 예전에는 유틸이 "Showing 1 to 10 of 50 entries" 를 **영어로 박아** 돌려줬다.
        다국어 앱인데 여기만 번역을 안 탔고, 숫자도 천 단위가 안 끊겼다.
        번역은 $t 를 쓸 수 있는 화면 쪽에서 한다 — 유틸에서 하려면 i18n 인스턴스를
        끌어와야 하고, core 가 plugins 에 기대는 모양이 된다.
      -->
      <p class="text-disabled mb-0">
        {{ totalItems === 0 ? $t('pagination.empty') : $t('pagination.showing', {
          start: formatNumber(paginationRange.start),
          end: formatNumber(paginationRange.end),
          total: formatNumber(totalItems),
        }) }}
      </p>

      <VPagination
        :model-value="page"
        active-color="primary"
        :length="Math.ceil(totalItems / itemsPerPage)"
        :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalItems / itemsPerPage), 5)"
        @update:model-value="updatePage"
      />
    </div>
  </div>
</template>
