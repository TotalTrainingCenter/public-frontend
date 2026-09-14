<script setup lang="ts">
import check from '@images/svg/Check.svg'
import diamond from '@images/svg/Diamond.svg'
import laptop from '@images/svg/laptop.svg'
import user from '@images/svg/user.svg'

import { activityGroups, totalActivityCount } from '@variables/activities'

// 수치는 운영 DB 에서 생성된 활동 목록을 그대로 센다. 손으로 적지 말 것.
const statData = computed(() => ([
  { title: '활동 주제', value: `${activityGroups.length}개`, icon: laptop, color: 'primary' },
  { title: '세부 활동', value: `${totalActivityCount}개`, icon: user, color: 'success' },
  { title: '인증 방식 (사진·영상·텍스트)', value: '3가지', icon: diamond, color: 'info' },
  { title: '하루 필요 시간', value: '5분', icon: check, color: 'warning' },
]))
</script>

<template>
  <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
    <VContainer>
      <div class="py-12">
        <VRow>
          <VCol
            v-for="(product, index) in statData"
            :key="index"
            cols="12"
            sm="6"
            lg="3"
          >
            <VCard
              flat
              :style="{ border: `1px solid rgba(var(--v-theme-${product.color}))` }"
            >
              <VCardText class="text-center">
                <VIcon
                  :color="product.color"
                  :icon="product.icon"
                  size="64"
                  class="mb-4"
                />
                <h3 class="text-h3">
                  {{ product.value }}
                </h3>
                <p class="text-body-1 font-weight-medium mb-0 text-wrap">
                  {{ product.title }}
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>
