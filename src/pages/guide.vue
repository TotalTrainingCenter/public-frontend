<script setup lang="ts">
import { activityGroups, commonActivities } from '@variables/activities'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

/** 가입부터 첫 인증까지의 실제 조작 순서. */
const steps = [
  {
    title: '가입하기',
    body:
      '공식 플랫폼에서 계정을 만듭니다. LVL.0 등급은 무료이며 7일 동안 활동 주제 전체를 이용할 수 있습니다. '
      + '가입 직후 바로 활동을 고를 수 있으므로 결제 정보를 먼저 등록할 필요가 없습니다.',
  },
  {
    title: '공지와 이용 규칙 확인',
    body:
      '활동을 고르기 전에 공지사항과 이용 규칙을 먼저 읽어 주세요. 인증이 인정되는 기준, '
      + '기록 보관 방식, 커뮤니티 운영 원칙이 정리돼 있습니다. 이 단계를 건너뛰면 인증이 반려될 수 있습니다.',
  },
  {
    title: '활동 목록 살펴보기',
    body:
      `현재 ${activityGroups.length}개 주제가 준비돼 있습니다. 각 주제 안에는 기본 활동과 선택 활동이 있고, `
      + '활동마다 무엇을 인증해야 하는지 적혀 있습니다. 처음이라면 건강·생활 습관처럼 '
      + '문턱이 낮은 주제부터 보시길 권합니다.',
  },
  {
    title: '활동 주제 선택',
    body:
      '주제를 고르면 기본 활동이 먼저 배정됩니다. 여유가 되면 선택 활동을 더하면 되고, '
      + '처음부터 많이 고를 필요는 없습니다. 하나를 일주일 이어가는 편이 다섯 개를 사흘 하는 것보다 낫습니다.',
  },
  {
    title: '공통 활동 확인',
    body:
      `주제와 별개로, 회원 등록 시 모든 참여자에게 자동으로 주어지는 공통 활동이 있습니다. ${
       commonActivities.map(item => item.name).join(', ')
       }. 하루를 열고 닫는 기록이라 부담은 적지만, 이 세 가지가 하루의 틀을 잡아 줍니다.`,
  },
  {
    title: '수행하고 인증하기',
    body:
      '활동을 수행한 뒤 정해진 형태(사진·영상·텍스트)로 기록을 올립니다. 두 가지만 지키면 됩니다. '
      + '수행 직후에 올릴 것, 그리고 편집하거나 가공하지 않은 원본일 것. '
      + '이 두 가지가 지켜진 기록만 인증으로 인정됩니다.',
  },
  {
    title: '이어가기',
    body:
      '하루 빠뜨려도 처음부터 다시 시작하지 않습니다. 이미 남긴 기록은 그대로 유지되고, '
      + '다음 날 이어가면 됩니다. 못 한 날도 기록의 일부입니다.',
  },
]

useSeo({
  title: '이용 가이드',
  description:
    '가입부터 첫 활동 인증까지 6단계로 안내합니다. 인증이 인정되는 기준과 '
    + '처음 시작할 때 고르면 좋은 활동 주제까지 정리했습니다.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': '종합 훈련 센터 시작하기',
    'description': '가입부터 첫 활동 인증까지의 절차',
    'inLanguage': 'ko-KR',
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.title,
      'text': step.body,
    })),
  },
})
</script>

<template>
  <PageHeader
    eyebrow="Guide"
    title="이용 가이드"
    lead="가입부터 첫 인증까지, 여섯 단계면 끝납니다."
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <VTimeline
        side="end"
        align="start"
        truncate-line="both"
        density="compact"
      >
        <VTimelineItem
          v-for="(step, index) in steps"
          :key="step.title"
          dot-color="primary"
          size="x-small"
        >
          <h2 class="text-h6 mb-2">
            {{ index + 1 }}. {{ step.title }}
          </h2>

          <p class="text-body-2 mb-0">
            {{ step.body }}
          </p>
        </VTimelineItem>
      </VTimeline>

      <VAlert
        type="warning"
        variant="tonal"
        class="mt-10 mb-8"
      >
        <strong>인증이 반려되는 경우</strong><br>
        수행 시점과 기록 시점의 차이가 지나치게 크거나, 편집·가공된 파일이거나,
        활동에 정해진 인증 수단과 다른 형태로 올린 경우입니다.
      </VAlert>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          공식 플랫폼에서 시작하기
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
