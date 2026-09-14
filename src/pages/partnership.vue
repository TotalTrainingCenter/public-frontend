<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

const cases = [
  {
    icon: 'tabler-building-skyscraper',
    title: '기업 · 사내 습관 챌린지',
    body:
      '구성원 건강 관리, 조직 문화 개선, 복지 프로그램 운영에 활용할 수 있습니다. '
      + '부서 단위 참여와 기간제 챌린지 운영이 가능하며, 참여 현황을 기록으로 확인할 수 있습니다.',
  },
  {
    icon: 'tabler-school',
    title: '학교 · 학급 단위 활동',
    body:
      '생활 습관 지도, 독서 활동, 봉사 활동 기록 등 학급 단위 운영에 적합합니다. '
      + '초·중·고 및 대학까지 연령대에 맞춰 활동 주제를 구성해 드립니다.',
  },
  {
    icon: 'tabler-building-community',
    title: '공공기관 · 지역 캠페인',
    body:
      '환경 실천, 지역 돌봄, 안전·위생 캠페인처럼 참여 기록이 필요한 사업에 활용할 수 있습니다. '
      + '사회적 취약 계층에 도움이 되는 활동 주제를 함께 개발합니다.',
  },
]

useSeo({
  title: '제휴 문의',
  description:
    '기업 사내 챌린지, 학교 학급 활동, 공공기관 캠페인. 단체 단위 루틴·인증 활동 운영을 위한 '
    + '제휴를 문의하세요. 운영 방식은 함께 설계해 드립니다.',
})
</script>

<template>
  <PageHeader
    eyebrow="Partnership"
    title="제휴 문의"
    lead="기업, 학교, 공공기관 어디서든 협업 제안을 환영합니다."
  />

  <VContainer class="pb-16">
    <VRow class="mb-8">
      <VCol
        v-for="item in cases"
        :key="item.title"
        cols="12"
        md="4"
      >
        <VCard
          variant="outlined"
          class="h-100"
        >
          <VCardText>
            <VAvatar
              rounded
              variant="tonal"
              color="primary"
              class="mb-4"
            >
              <VIcon :icon="item.icon" />
            </VAvatar>

            <h2 class="text-h6 mb-2">
              {{ item.title }}
            </h2>

            <p class="text-body-2 mb-0">
              {{ item.body }}
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <h2 class="text-h5 mb-3">
        문의하실 때 알려주시면 좋은 것
      </h2>

      <VList class="mb-8">
        <VListItem title="단체명과 담당자 연락처" />
        <VListItem title="예상 참여 인원과 운영 기간" />
        <VListItem title="원하시는 활동 주제 또는 달성하려는 목표" />
        <VListItem title="기존에 운영 중인 프로그램이 있다면 그 내용" />
      </VList>

      <VCard
        variant="tonal"
        color="primary"
      >
        <VCardText class="text-center py-8">
          <h2 class="text-h6 mb-2">
            제휴 문의 메일
          </h2>

          <p class="text-body-2 mb-6">
            확인 후 영업일 기준으로 회신드립니다.
          </p>

          <VBtn
            :href="`mailto:${siteConfig.contact.email}?subject=[제휴 문의] 종합 훈련 센터`"
            size="large"
          >
            {{ siteConfig.contact.email }}
          </VBtn>
        </VCardText>
      </VCard>

      <!--
        TODO: 백엔드 문의 API 또는 외부 폼이 준비되면 메일 링크를 폼으로 교체.
        폼 전환 시 개인정보 수집·이용 동의 체크박스가 반드시 필요하다.
      -->
    </div>
  </VContainer>
</template>
