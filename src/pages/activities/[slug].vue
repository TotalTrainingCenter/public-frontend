<script setup lang="ts">
import { activityGroups, findActivityGroup } from '@variables/activities'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

const route = useRoute('activities-slug')

const group = computed(() => findActivityGroup(String(route.params.slug)))

const requiredItems = computed(() => group.value?.items.filter(item => item.required) ?? [])
const optionalItems = computed(() => group.value?.items.filter(item => !item.required) ?? [])

/** 내부 링크용 다른 그룹. 내부 링크는 색인에 크게 기여한다. */
const relatedGroups = computed(() =>
  activityGroups.filter(item => item.slug !== group.value?.slug).slice(0, 3))

useSeo({
  title: group.value?.title ?? '활동 주제',
  description: group.value?.description ?? '종합 훈련 센터의 활동 주제입니다.',
  noindex: !group.value,
  jsonLd: group.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': group.value.title,
        'description': group.value.description,
        'inLanguage': 'ko-KR',
        'step': group.value.items.map((item, index) => ({
          '@type': 'HowToStep',
          'position': index + 1,
          'name': item.name,
          'text': `${item.description}. 인증 방법: ${item.proof}`,
        })),
      }
    : undefined,
})
</script>

<template>
  <template v-if="group">
    <PageHeader
      :eyebrow="group.category"
      :title="group.title"
      :lead="group.description"
    />

    <VContainer class="pb-16">
      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <p class="text-body-1 mb-8">
            {{ group.intro }}
          </p>

          <!-- 👉 기본 활동 -->
          <template v-if="requiredItems.length">
            <h2 class="text-h5 mb-2">
              기본 활동
            </h2>

            <p class="text-body-2 mb-4">
              이 주제를 선택하면 먼저 수행하게 되는 활동입니다.
            </p>

            <VCard
              v-for="item in requiredItems"
              :key="item.name"
              variant="outlined"
              class="mb-3"
            >
              <VCardText>
                <div class="d-flex align-center gap-x-2 mb-2">
                  <h3 class="text-h6 mb-0">
                    {{ item.name }}
                  </h3>

                  <VChip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >
                    기본
                  </VChip>
                </div>

                <p class="text-body-2 mb-2">
                  {{ item.description }}
                </p>

                <p class="text-body-2 text-disabled mb-0">
                  인증 · {{ item.proof }} ({{ item.proofType }})
                </p>
              </VCardText>
            </VCard>
          </template>

          <!-- 👉 선택 활동 -->
          <template v-if="optionalItems.length">
            <h2 class="text-h5 mt-10 mb-2">
              선택 활동
            </h2>

            <p class="text-body-2 mb-4">
              원하는 만큼 골라 추가할 수 있는 활동입니다.
            </p>

            <VCard
              v-for="item in optionalItems"
              :key="item.name"
              variant="outlined"
              class="mb-3"
            >
              <VCardText>
                <h3 class="text-h6 mb-2">
                  {{ item.name }}
                </h3>

                <p class="text-body-2 mb-2">
                  {{ item.description }}
                </p>

                <p class="text-body-2 text-disabled mb-0">
                  인증 · {{ item.proof }} ({{ item.proofType }})
                </p>
              </VCardText>
            </VCard>
          </template>
        </VCol>

        <!-- 👉 사이드 -->
        <VCol
          cols="12"
          md="4"
        >
          <VCard
            variant="tonal"
            color="primary"
            class="mb-6"
          >
            <VCardText>
              <h2 class="text-h6 mb-2">
                이 주제로 시작하기
              </h2>

              <p class="text-body-2 mb-4">
                추천 대상 · {{ group.targets.join(', ') }}
              </p>

              <VBtn
                :href="siteConfig.platformUrl"
                block
              >
                공식 플랫폼에서 참여하기
              </VBtn>
            </VCardText>
          </VCard>

          <VCard variant="outlined">
            <VCardText>
              <h2 class="text-h6 mb-3">
                다른 활동 주제
              </h2>

              <ul
                class="d-flex flex-column gap-y-2 ps-0"
                style="list-style: none;"
              >
                <li
                  v-for="related in relatedGroups"
                  :key="related.slug"
                >
                  <RouterLink :to="`/activities/${related.slug}`">
                    {{ related.title }}
                  </RouterLink>
                </li>
              </ul>

              <VDivider class="my-4" />

              <RouterLink to="/guide">
                인증은 어떻게 하나요?
              </RouterLink>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </template>

  <VContainer
    v-else
    class="py-16 text-center"
  >
    <h1 class="text-h5 mb-4">
      존재하지 않는 활동 주제입니다.
    </h1>

    <VBtn to="/activities">
      활동 주제 전체 보기
    </VBtn>
  </VContainer>
</template>
