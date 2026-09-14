<script setup lang="ts">
import { differentiators } from '@variables/features'
import { activityGroups, totalActivityCount } from '@variables/activities'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '서비스 소개',
  description:
    '종합 훈련 센터는 일상 속 행동과 습관을 활동 주제로 제시하고, 수행 후 기록하고 인증받는 '
    + '기록형 커뮤니티 플랫폼입니다. 일반 습관 앱과 무엇이 다른지 확인하세요.',
})
</script>

<template>
  <PageHeader
    eyebrow="About"
    title="서비스 소개"
    lead="일상을 루틴으로, 일상을 훈련으로."
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <h2 class="text-h5 mb-3">
        왜 만들었나
      </h2>

      <p class="text-body-1 mb-4">
        일상이 무료하다고 느끼는 사람이 있습니다. 사는 게 별로 재미없다고 말하는 사람도 있습니다.
        하고 싶은 건 있는데 매번 삼일을 못 넘기는 사람은 훨씬 많습니다.
        의지가 부족해서가 아닙니다. 무엇을 해야 할지 정하는 데 힘을 다 쓰고, 정작 하고 나서는
        아무것도 남지 않기 때문입니다.
      </p>

      <p class="text-body-1 mb-8">
        종합 훈련 센터는 그 두 가지를 대신 해결합니다.
        무엇을 할지는 이미 정리된 활동 목록에서 고르면 되고,
        한 일은 인증으로 남습니다. 남은 기록이 다음 날의 근거가 됩니다.
      </p>

      <h2 class="text-h5 mb-3">
        어떤 곳인가
      </h2>

      <p class="text-body-1 mb-8">
        종합 훈련 센터(Total Training Center)는 일상 속 다양한 행동과 습관을 활동 주제로 모아
        각 주제별 세부 활동으로 제시하고, 해당 활동을 수행한 뒤 기록하고 인증받는
        <strong>기록형 커뮤니티 플랫폼</strong>입니다.
        현재 {{ activityGroups.length }}개 주제 아래 {{ totalActivityCount }}개의 세부 활동이 준비돼 있으며,
        활동 주제는 계속 개발해 추가하고 있습니다.
      </p>

      <h2 class="text-h5 mb-3">
        습관 앱과 무엇이 다른가
      </h2>

      <VCard
        v-for="item in differentiators"
        :key="item.title"
        variant="outlined"
        class="mb-3"
      >
        <VCardText>
          <h3 class="text-h6 mb-2">
            {{ item.title }}
          </h3>

          <p class="text-body-2 mb-0">
            {{ item.body }}
          </p>
        </VCardText>
      </VCard>

      <h2 class="text-h5 mt-10 mb-3">
        어디까지 가려 하는가
      </h2>

      <p class="text-body-1 mb-4">
        각 활동은 자신의 행동이나 습관 개선뿐 아니라, 사회적 취약 계층에 도움을 줄 수 있는 주제까지
        포함해 개발하고 있습니다. 개인만이 아니라 기업, 학교, 공공기관 등 어디서든 협업 제안을 환영합니다.
      </p>

      <p class="text-body-1 mb-8">
        기술 하나에만 집중하기보다 여러 사업을 함께 진행하며 플랫폼과 연계해 하나의 생태계를 만들고,
        더 나아가 마을을 꾸리는 것을 목표로 하고 있습니다.
      </p>

      <VAlert
        type="info"
        variant="tonal"
        class="mb-8"
      >
        <RouterLink to="/features">
          주요 기능
        </RouterLink>
        에서 전체 흐름을,
        <RouterLink to="/activities">
          활동 주제
        </RouterLink>
        에서 실제 활동 목록을 확인하실 수 있습니다.
      </VAlert>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          공식 플랫폼 바로가기
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
